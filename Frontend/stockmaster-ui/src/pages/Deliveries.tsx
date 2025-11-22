import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Eye, Truck, CheckCircle2, X } from 'lucide-react';
import { mockDeliveries } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Deliveries() {
  const { toast } = useToast();
  const [deliveries, setDeliveries] = useState(mockDeliveries);
  const [isNewDeliveryOpen, setIsNewDeliveryOpen] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [newDelivery, setNewDelivery] = useState({
    customer: '',
    warehouse: '',
    scheduledDate: '',
    items: [{ product: '', quantity: '' }]
  });

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

  const handleCreateDelivery = () => {
    const deliveryId = `DEL-${new Date().getFullYear()}-${String(deliveries.length + 1).padStart(3, '0')}`;
    const today = new Date().toISOString().split('T')[0];
    const newDel = {
      id: deliveryId,
      customer: newDelivery.customer,
      warehouse: newDelivery.warehouse,
      status: 'picking',
      scheduledDate: newDelivery.scheduledDate,
      createdBy: 'Current User',
      createdOn: today,
      items: newDelivery.items.map(item => ({
        product: item.product,
        quantity: parseInt(item.quantity) || 0,
        picked: false
      }))
    };
    
    setDeliveries([newDel, ...deliveries]);
    setIsNewDeliveryOpen(false);
    setNewDelivery({ customer: '', warehouse: '', scheduledDate: '', items: [{ product: '', quantity: '' }] });
    
    toast({
      title: "Delivery Created",
      description: `${deliveryId} has been created successfully.`,
    });
  };

  const handleMarkPicked = (deliveryId: string) => {
    setDeliveries(deliveries.map(del => 
      del.id === deliveryId 
        ? { ...del, status: 'ready', items: del.items.map((item: any) => ({ ...item, picked: true })) }
        : del
    ));
    
    toast({
      title: "Items Marked as Picked",
      description: `All items for ${deliveryId} have been marked as picked.`,
    });
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

        {/* Deliveries List */}
        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <Card key={delivery.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                      <Truck className="w-6 h-6 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{delivery.id}</h3>
                        {getStatusBadge(delivery.status)}
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Customer</p>
                          <p className="font-medium">{delivery.customer}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Warehouse</p>
                          <p className="font-medium">{delivery.warehouse}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created By</p>
                          <p className="font-medium">{delivery.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Scheduled Date</p>
                          <p className="font-medium">{delivery.scheduledDate}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Items:</p>
                        <div className="space-y-2">
                          {delivery.items.map((item, idx) => (
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
                        onClick={() => handleMarkPicked(delivery.id)}
                      >
                        Mark Picked
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={newDelivery.customer}
                  onChange={(e) => setNewDelivery({ ...newDelivery, customer: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="warehouse">Warehouse</Label>
                <Select value={newDelivery.warehouse} onValueChange={(val) => setNewDelivery({ ...newDelivery, warehouse: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select warehouse" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Main Warehouse">Main Warehouse</SelectItem>
                    <SelectItem value="Factory Warehouse">Factory Warehouse</SelectItem>
                    <SelectItem value="Branch Warehouse">Branch Warehouse</SelectItem>
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
                    <Input
                      placeholder="Product name"
                      value={item.product}
                      onChange={(e) => updateItem(index, 'product', e.target.value)}
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
                    <p className="font-medium">{selectedDelivery.warehouse}</p>
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
