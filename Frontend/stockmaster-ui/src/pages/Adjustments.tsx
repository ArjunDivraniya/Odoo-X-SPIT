import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import AdjustmentForm from '@/components/adjustments/AdjustmentForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adjRes, whRes, prodRes] = await Promise.all([
          api.get('/adjustments'),
          api.get('/warehouse'),
          api.get('/products')
        ]);
        setAdjustments(adjRes.data);
        setWarehouses(whRes.data);
        setProducts(prodRes.data);
      } catch (error) {
        console.error("Fetch error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSave = async (data: any) => {
    try {
      const res = await api.post('/adjustments', data);
      setAdjustments(prev => [res.data, ...prev]);
      toast({ title: 'Adjustment recorded' });
      setOpen(false);
    } catch (e) {
      toast({ title: 'Error', variant: 'destructive' });
    }
  };

  const getWhName = (id: string) => warehouses.find(w => w._id === id || w.id === id)?.name || id;

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Adjustments</h1>
            <p className="text-muted-foreground">Record and track inventory adjustments</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={()=>setOpen(true)}>
            <Plus className="w-4 h-4" /> New Adjustment
          </Button>
        </div>

        {loading ? <Loader2 className="animate-spin mx-auto" /> : (
          <div className="space-y-4">
            {adjustments.map((adjustment) => (
              <Card key={adjustment._id || adjustment.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                      <AlertCircle className="w-6 h-6 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">#{String(adjustment._id || adjustment.id).slice(-6).toUpperCase()}</h3>
                        <span className="text-sm text-muted-foreground">{adjustment.date}</span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div><p className="text-sm text-muted-foreground">Product</p><p className="font-medium">{adjustment.product}</p></div>
                        <div><p className="text-sm text-muted-foreground">Warehouse</p><p className="font-medium">{getWhName(adjustment.warehouse)}</p></div>
                        <div><p className="text-sm text-muted-foreground">Reason</p><p className="font-medium">{adjustment.reason}</p></div>
                        <div><p className="text-sm text-muted-foreground">Performed By</p><p className="font-medium">{adjustment.performedBy}</p></div>
                      </div>
                      <div className="flex items-center gap-6 p-3 rounded-lg bg-muted/30">
                        <div><p className="text-sm text-muted-foreground">System Qty</p><p className="font-semibold">{adjustment.systemQty}</p></div>
                        <div className="text-muted-foreground">→</div>
                        <div><p className="text-sm text-muted-foreground">Physical Qty</p><p className="font-semibold">{adjustment.physicalQty}</p></div>
                        <div className="text-muted-foreground">=</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Difference</p>
                          <p className={`font-semibold ${adjustment.difference < 0 ? 'text-destructive' : 'text-success'}`}>{adjustment.difference > 0 ? '+' : ''}{adjustment.difference}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        <AdjustmentForm 
          open={open} 
          onClose={()=>setOpen(false)} 
          onSave={handleSave} 
          warehouses={warehouses}
          products={products}
        />
      </div>
    </MainLayout>
  );
}