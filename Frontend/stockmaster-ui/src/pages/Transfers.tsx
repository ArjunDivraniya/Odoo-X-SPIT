import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeftRight, CheckCircle2, Truck, Clock, Loader2, Trash2 } from 'lucide-react';
import TransferForm from '@/components/transfers/TransferForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Transfers() {
  const { toast } = useToast();
  
  // Real Data State
  const [transfers, setTransfers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    try {
      const [resT, resW, resP] = await Promise.all([
        api.get('/transfers'),
        api.get('/warehouse'),
        api.get('/products')
      ]);
      setTransfers(resT.data);
      setWarehouses(resW.data);
      setProducts(resP.data);
    } catch (error) {
      console.error("Fetch error", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed': return <Badge className="bg-success/10 text-success">Completed</Badge>;
      case 'in_transit': return <Badge className="bg-info/10 text-info">In Transit</Badge>;
      case 'requested': return <Badge variant="outline">Requested</Badge>;
      default: return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in_transit': return <Truck className="w-5 h-5 text-info" />;
      default: return <Clock className="w-5 h-5 text-muted-foreground" />;
    }
  };

  // --- 2. HELPER TO SHOW NAMES INSTEAD OF IDs ---
  const getWhName = (id: string) => {
    const wh = warehouses.find(w => w._id === id || w.id === id);
    return wh ? wh.name : id;
  };

  // --- 3. ACTIONS ---
  const handleSave = async (data: any) => {
    try {
      // Ensure quantities are numbers
      const formattedItems = data.items.map((i: any) => ({ ...i, quantity: Number(i.quantity) }));
      const payload = { ...data, items: formattedItems };

      if (editing) {
        // Update
        const res = await api.put(`/transfers/${editing._id || editing.id}`, payload);
        setTransfers(prev => prev.map(t => (t._id === editing._id || t.id === editing.id) ? res.data : t));
        toast({ title: 'Transfer updated' });
      } else {
        // Create
        const res = await api.post('/transfers', payload);
        setTransfers(prev => [res.data, ...prev]);
        toast({ title: 'Transfer created' });
      }
      setOpen(false); setEditing(null);
    } catch (e) {
      toast({ title: 'Error saving transfer', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this transfer?")) return;
    try {
      await api.delete(`/transfers/${id}`);
      setTransfers(prev => prev.filter(t => (t._id || t.id) !== id));
      toast({ title: 'Transfer deleted' });
    } catch(e) { 
      toast({ title: 'Error', variant: 'destructive' }); 
    }
  };

  // Simple status toggle for demonstration (Requested -> In Transit -> Completed)
  const handleAdvanceStatus = async (transfer: any) => {
    const nextStatus = transfer.status === 'requested' ? 'in_transit' : 'completed';
    const payload = { status: nextStatus, completedOn: nextStatus === 'completed' ? new Date().toISOString().split('T')[0] : undefined };
    
    try {
      const id = transfer._id || transfer.id;
      await api.put(`/transfers/${id}`, payload);
      setTransfers(prev => prev.map(t => (t._id === id || t.id === id) ? { ...t, ...payload } : t));
      toast({ title: `Transfer marked as ${nextStatus}` });
    } catch(e) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Internal Transfers</h1>
            <p className="text-muted-foreground">Move inventory between warehouses</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={()=>{ setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4" />
            New Transfer
          </Button>
        </div>

        {/* Transfers List */}
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : transfers.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No transfers found.</div>
        ) : (
          <div className="space-y-4">
            {transfers.map((transfer) => (
              <Card key={transfer._id || transfer.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                        <ArrowLeftRight className="w-6 h-6 text-info" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <h3 className="font-semibold text-lg">#{String(transfer._id || transfer.id).slice(-6).toUpperCase()}</h3>
                          {getStatusBadge(transfer.status)}
                        </div>
                        
                        {/* Transfer Route */}
                        <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/30 w-fit">
                          <Badge variant="outline" className="text-sm">
                            {getWhName(transfer.fromWarehouse)}
                          </Badge>
                          <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                          <Badge variant="outline" className="text-sm">
                            {getWhName(transfer.toWarehouse)}
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="font-medium">{transfer.createdBy || 'System'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Scheduled</p>
                            <p className="font-medium">{transfer.scheduledDate}</p>
                          </div>
                          {transfer.completedOn && (
                            <div>
                              <p className="text-muted-foreground">Completed On</p>
                              <p className="font-medium">{transfer.completedOn}</p>
                            </div>
                          )}
                        </div>
                        
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {transfer.items.map((item:any, idx:number) => (
                              <Badge key={idx} variant="secondary">
                                {item.product} (Qty: {item.quantity})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      {getStatusIcon(transfer.status)}
                      <div className="flex gap-2">
                        {transfer.status !== 'completed' && (
                          <Button variant="outline" size="sm" onClick={() => handleAdvanceStatus(transfer)}>
                            Advance
                          </Button>
                        )}
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(transfer._id || transfer.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <TransferForm 
          open={open} 
          onClose={()=>{ setOpen(false); setEditing(null); }} 
          onSave={handleSave} 
          initial={editing} 
          warehouses={warehouses}
          products={products}
        />
      </div>
    </MainLayout>
  );
}