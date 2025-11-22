import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Eye, Truck, CheckCircle2, X, Loader2, Trash2, ChevronsUpDown, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';
import { cn } from '@/lib/utils';

export default function Deliveries() {
  const { toast } = useToast();
  // State for Real Data
  const [deliveries, setDeliveries] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [newDelivery, setNewDelivery] = useState({
    customer: '',
    warehouse: '',
    scheduledDate: '',
    items: [{ product: '', quantity: '' }]
  });

  // --- 1. FETCH DATA FROM BACKEND ---
  const fetchData = async () => {
    try {
      const [delRes, whRes, prodRes] = await Promise.all([
        api.get('/deliveries'),
        api.get('/warehouse'),
        api.get('/products')
      ]);
      setDeliveries(delRes.data);
      setWarehouses(whRes.data);
      setProducts(prodRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. CALCULATE SUGGESTIONS (Past Customers) ---
  const pastCustomers = useMemo(() => {
    const unique = new Set(deliveries.map(d => d.customer).filter(Boolean));
    return Array.from(unique);
  }, [deliveries]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success">Completed</Badge>;
      case 'picking':
        return <Badge className="bg-warning/10 text-warning">Picking</Badge>;
      case 'ready':
        return <Badge className="bg-info/10 text-info">Ready</Badge>;
      default:
        return null;
    }
  };

  // --- 3. API ACTIONS ---

  const handleCreateDelivery = async () => {
    try {
      // Format items for backend
      const formattedItems = newDelivery.items.map(item => ({
        product: item.product,
        quantity: parseInt(item.quantity) || 0,
        picked: false
      }));

      const payload = { ...newDelivery, items: formattedItems, status: 'picking' };
      const res = await api.post('/deliveries', payload);
      
      setDeliveries([res.data, ...deliveries]);
      setIsNewDeliveryOpen(false);
      setNewDelivery({ customer: '', warehouse: '', scheduledDate: '', items: [{ product: '', quantity: '' }] });
      
      toast({ title: "Delivery Created", description: "Created successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create delivery." });
    }
  };

  const handleMarkPicked = async (deliveryId: string) => {
    try {
      const delivery = deliveries.find(d => (d._id || d.id) === deliveryId);
      if (!delivery) return;

      const updatedItems = delivery.items.map((item: any) => ({ ...item, picked: true }));
      const updatedDelivery = { ...delivery, status: 'ready', items: updatedItems };

      // Backend Update
      await api.put(`/deliveries/${deliveryId}`, updatedDelivery);

      setDeliveries(deliveries.map(del => 
        (del._id || del.id) === deliveryId ? updatedDelivery : del
      ));
      // Refresh products locally (picking may affect stock later when completed)
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data);
        localStorage.setItem('productsUpdated', String(Date.now()));
      } catch (e) { console.warn('Failed to refresh products after marking picked'); }
      
      toast({ title: "Items Marked as Picked" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Update failed." });
    }
  };

  // Added for CRUD Completeness
  const handleDelete = async (id: string) => {
    if(!confirm("Delete this delivery?")) return;
    try {
      await api.delete(`/deliveries/${id}`);
      setDeliveries(prev => prev.filter(d => (d._id || d.id) !== id));
      toast({ title: "Delivery Deleted" });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting delivery" });
    }
  };

  const handleViewDetails = (delivery: any) => {
    setSelectedDelivery(delivery);
    setIsDetailOpen(true);
  };

  const addItemRow = () => {
    setNewDelivery({
      ...newDelivery,
      items: [...newDelivery.items, { product: '', quantity: '' }]
    });
  };

  const removeItemRow = (index: number) => {
    setNewDelivery({
      ...newDelivery,
      items: newDelivery.items.filter((_, i) => i !== index)
    });
  };

  const updateItem = (index: number, field: string, value: string) => {
    const updatedItems = [...newDelivery.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewDelivery({ ...newDelivery, items: updatedItems });
  };

  // Helper to show Warehouse Name instead of ID
  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w._id === id || w.id === id);
    return wh ? wh.name : id;
  };

  // --- 4. SMART INPUT COMPONENT (Dropdown + Type New) ---
  const SuggestionInput = ({ value, onChange, options, placeholder }: any) => {
    const [open, setOpen] = useState(false);
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal text-left">
            {value || <span className="text-muted-foreground">{placeholder}</span>}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput placeholder={`Search ${placeholder}...`} />
            <CommandList>
              <CommandEmpty>
                <div className="p-2 text-sm text-muted-foreground">No results found.</div>
              </CommandEmpty>
              <CommandGroup heading="Suggestions">
                {options.map((opt: string) => (
                  <CommandItem key={opt} value={opt} onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}>
                    <Check className={cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0")} />
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
          {/* Input for manual entry if not in list */}
          <div className="border-t p-2">
            <Input 
              placeholder={`Type new ${placeholder}...`}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="h-8 text-sm"
            />
          </div>
        </PopoverContent>
      </Popover>
    );
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Deliveries</h1>
            <p className="text-muted-foreground">Manage outgoing shipments and orders</p>
          </div>
          <Button 
            onClick={() => setIsNewDeliveryOpen(true)}
            className="gradient-primary text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            New Delivery
          </Button>
        </div>

        {/* Deliveries List - Backend Data */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
          ) : deliveries.length === 0 ? (
             <div className="text-center py-8 text-muted-foreground">No deliveries found.</div>
          ) : (
            deliveries.map((delivery) => (
              <Card key={delivery._id || delivery.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                        <Truck className="w-6 h-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            #{String(delivery._id || delivery.id).slice(-6).toUpperCase()}
                          </h3>
                          {getStatusBadge(delivery.status)}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Customer</p>
                            <p className="font-medium">{delivery.customer}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Warehouse</p>
                            <p className="font-medium">{getWarehouseName(delivery.warehouse)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="font-medium">{delivery.createdBy || 'System'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Scheduled Date</p>
                            <p className="font-medium">{delivery.scheduledDate}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="space-y-2">
                            {delivery.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex items-center gap-2">
                                <Badge variant={item.picked ? 'default' : 'outline'}>
                                  {item.product} (Qty: {item.quantity})
                                </Badge>
                                {item.picked && <CheckCircle2 className="w-4 h-4 text-success" />}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(delivery)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      {delivery.status === 'picking' && (
                        <Button 
                          size="sm" 
                          className="bg-warning text-warning-foreground hover:bg-warning/90"
                          onClick={() => handleMarkPicked(delivery._id || delivery.id)}
                        >
                          Mark Picked
                        </Button>
                      )}
                      {/* Added Delete Button without breaking UI */}
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(delivery._id || delivery.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* New Delivery Dialog */}
      <Dialog open={isNewDeliveryOpen} onOpenChange={setIsNewDeliveryOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Delivery</DialogTitle>
            <DialogDescription>Add a new outgoing shipment order</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customer">Customer</Label>
                {/* UPDATED: Smart Input for Customer */}
                <SuggestionInput 
                  value={newDelivery.customer} 
                  onChange={(val: string) => setNewDelivery({...newDelivery, customer: val})}
                  options={pastCustomers}
                  placeholder="Customer Name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                {/* UPDATED: Dynamic Warehouse Select */}
                <Select value={newDelivery.warehouse} onValueChange={(val) => setNewDelivery({ ...newDelivery, warehouse: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map(w => (
                      <SelectItem key={w._id || w.id} value={w._id || w.id}>{w.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="scheduledDate">Scheduled Date</Label>
              <Input
                id="scheduledDate"
                type="date"
                value={newDelivery.scheduledDate}
                onChange={(e) => setNewDelivery({ ...newDelivery, scheduledDate: e.target.value })}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Products</Label>
                <Button type="button" variant="outline" size="sm" onClick={addItemRow}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add Item
                </Button>
              </div>
              
              {newDelivery.items.map((item, index) => (
                <div key={index} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-2">
                    {/* UPDATED: Smart Input for Products */}
                    <SuggestionInput 
                      value={item.product}
                      onChange={(val: string) => updateItem(index, 'product', val)}
                      options={products.map(p => p.name)}
                      placeholder="Product name"
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                    />
                  </div>
                  {newDelivery.items.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeItemRow(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setIsNewDeliveryOpen(false)}>
              Cancel
            </Button>
            <Button 
              className="gradient-primary text-primary-foreground"
              onClick={handleCreateDelivery}
              disabled={!newDelivery.customer || !newDelivery.warehouse || !newDelivery.scheduledDate}
            >
              Create Delivery
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delivery Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selectedDelivery && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-success" />
                  {selectedDelivery.id}
                </SheetTitle>
                <SheetDescription>Delivery details and status</SheetDescription>
              </SheetHeader>

              <div className="space-y-6 py-6">
                <div>
                  {getStatusBadge(selectedDelivery.status)}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Customer</p>
                    <p className="font-medium">{selectedDelivery.customer}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Warehouse</p>
                    <p className="font-medium">{getWarehouseName(selectedDelivery.warehouse)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Created By</p>
                    <p className="font-medium">{selectedDelivery.createdBy}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Scheduled Date</p>
                    <p className="font-medium">{selectedDelivery.scheduledDate}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Items</h4>
                  <div className="space-y-2">
                    {selectedDelivery.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                        <div className="flex items-center gap-3">
                          {item.picked && <CheckCircle2 className="w-5 h-5 text-success" />}
                          <div>
                            <p className="font-medium">{item.product}</p>
                            <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <Badge variant={item.picked ? 'default' : 'outline'}>
                          {item.picked ? 'Picked' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
}