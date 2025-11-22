import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, CheckCircle2, FileText, Loader2, Trash2 } from 'lucide-react';
import ReceiptForm from '@/components/receipts/ReceiptForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Receipts() {
  const { toast } = useToast();
  // Real Data State
  const [receipts, setReceipts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI State
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    try {
      const [resR, resW, resP] = await Promise.all([
        api.get('/receipts'),
        api.get('/warehouse'),
        api.get('/products')
      ]);
      setReceipts(resR.data);
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

  // --- 2. CALCULATE SUGGESTIONS (Past Suppliers) ---
  const pastSuppliers = useMemo(() => {
    const unique = new Set(receipts.map(r => r.supplier).filter(Boolean));
    return Array.from(unique);
  }, [receipts]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done': return <Badge className="bg-success/10 text-success">Done</Badge>;
      case 'ready': return <Badge className="bg-info/10 text-info">Ready</Badge>;
      case 'draft': return <Badge variant="outline">Draft</Badge>;
      default: return null;
    }
  };

  // --- 3. ACTIONS ---

  const handleSave = async (data: any) => {
    try {
      // Ensure numeric values
      const formattedItems = data.items.map((i: any) => ({
        ...i, ordered: Number(i.ordered), received: Number(i.received || 0)
      }));
      const payload = { ...data, items: formattedItems };

      if (editing) {
        // Update
        const res = await api.put(`/receipts/${editing._id || editing.id}`, payload);
        setReceipts(prev => prev.map(r => (r._id === editing._id || r.id === editing.id) ? res.data : r));
        toast({ title: 'Receipt updated' });
      } else {
        // Create
        const res = await api.post('/receipts', payload);
        setReceipts(prev => [res.data, ...prev]);
        toast({ title: 'Receipt created' });
      }
      setOpen(false); setEditing(null);
    } catch (e) {
      toast({ title: 'Error saving receipt', variant: 'destructive' });
    }
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Delete this receipt?")) return;
    try {
      await api.delete(`/receipts/${id}`);
      setReceipts(prev => prev.filter(r => (r._id || r.id) !== id));
      toast({ title: 'Receipt deleted' });
    } catch(e) { 
      toast({ title: 'Error', variant: 'destructive' }); 
    }
  };

  const handleValidate = async (receipt: any) => {
    try {
      const id = receipt._id || receipt.id;
      // Optimistic update to 'done'
      await api.put(`/receipts/${id}`, { status: 'done' });
      
      setReceipts(prev => prev.map(r => 
        (r._id === id || r.id === id) ? { ...r, status: 'done' } : r
      ));
      // Refresh products locally
      try {
        const prodRes = await api.get('/products');
        setProducts(prodRes.data);
        localStorage.setItem('productsUpdated', String(Date.now()));
      } catch (e) { console.warn('Failed to refresh products after receipt validate'); }
      toast({ title: 'Receipt validated', description: 'Marked as done' });
    } catch (e) {
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w._id === id || w.id === id);
    return wh ? wh.name : id;
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Receipts</h1>
            <p className="text-muted-foreground">Manage incoming goods and deliveries</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={()=>{ setEditing(null); setOpen(true); }}>
            <Plus className="w-4 h-4" />
            New Receipt
          </Button>
        </div>

        {/* Receipts List */}
        {loading ? (
          <div className="flex justify-center py-8"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : receipts.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No receipts found.</div>
        ) : (
          <div className="space-y-4">
            {receipts.map((receipt) => (
              <Card key={receipt._id || receipt.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            #{String(receipt._id || receipt.id).slice(-6).toUpperCase()}
                          </h3>
                          {getStatusBadge(receipt.status)}
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Supplier</p>
                            <p className="font-medium">{receipt.supplier}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Warehouse</p>
                            <p className="font-medium">{getWarehouseName(receipt.warehouse)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Created By</p>
                            <p className="font-medium">{receipt.createdBy || 'System'}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Scheduled Date</p>
                            <p className="font-medium">{receipt.scheduledDate}</p>
                          </div>
                        </div>
                        <div className="mt-3">
                          <p className="text-sm font-medium mb-2">Items:</p>
                          <div className="flex flex-wrap gap-2">
                            {receipt.items.map((item: any, idx: number) => (
                              <Badge key={idx} variant="secondary">
                                {item.product} ({item.ordered} ordered)
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => { setEditing(receipt); setOpen(true); }}>
                        <Eye className="w-4 h-4 mr-2" /> View
                      </Button>
                      {receipt.status === 'ready' && (
                        <Button 
                          size="sm" 
                          className="bg-success text-success-foreground hover:bg-success/90"
                          onClick={() => handleValidate(receipt)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Validate
                        </Button>
                      )}
                      <Button variant="ghost" size="sm" className="text-destructive" onClick={() => handleDelete(receipt._id || receipt.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ReceiptForm 
          open={open} 
          onClose={()=>{ setOpen(false); setEditing(null); }} 
          onSave={handleSave} 
          initial={editing} 
          warehouses={warehouses}
          products={products}
          pastSuppliers={pastSuppliers} // Pass history for suggestions
        />
      </div>
    </MainLayout>
  );
}