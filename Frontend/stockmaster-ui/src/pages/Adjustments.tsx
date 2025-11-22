import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle, Loader2 } from 'lucide-react';
import AdjustmentForm from '@/components/adjustments/AdjustmentForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Adjustments() {
  const [adjustments, setAdjustments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  // Fetch Real Data
  const fetchAdjustments = async () => {
    try {
      const res = await api.get('/adjustments');
      setAdjustments(res.data);
    } catch (error) {
      console.error("Failed to fetch adjustments", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdjustments();
  }, []);

  const handleSave = async (data: any) => {
    try {
      // Create new adjustment via API
      const res = await api.post('/adjustments', data);
      setAdjustments(prev => [res.data, ...prev]);
      toast({ title: 'Adjustment recorded' });
      setOpen(false);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to save adjustment." });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Adjustments</h1>
            <p className="text-muted-foreground">Record and track inventory adjustments</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={() => setOpen(true)}>
            <Plus className="w-4 h-4" />
            New Adjustment
          </Button>
        </div>

        {/* Adjustments List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : adjustments.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No adjustments found.
          </div>
        ) : (
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
                        <h3 className="font-semibold text-lg">
                          #{String(adjustment._id || adjustment.id).slice(-6).toUpperCase()}
                        </h3>
                        <span className="text-sm text-muted-foreground">{adjustment.date}</span>
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Product</p>
                          <p className="font-medium">{adjustment.product}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Warehouse</p>
                          <p className="font-medium">{adjustment.warehouse}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Reason</p>
                          <p className="font-medium">{adjustment.reason}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Performed By</p>
                          <p className="font-medium">{adjustment.performedBy}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6 p-3 rounded-lg bg-muted/30">
                        <div>
                          <p className="text-sm text-muted-foreground">System Qty</p>
                          <p className="font-semibold">{adjustment.systemQty}</p>
                        </div>
                        <div className="text-muted-foreground">→</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Physical Qty</p>
                          <p className="font-semibold">{adjustment.physicalQty}</p>
                        </div>
                        <div className="text-muted-foreground">=</div>
                        <div>
                          <p className="text-sm text-muted-foreground">Difference</p>
                          <p className={`font-semibold ${adjustment.difference < 0 ? 'text-destructive' : 'text-success'}`}>
                            {adjustment.difference > 0 ? '+' : ''}{adjustment.difference}
                          </p>
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
          onClose={() => setOpen(false)} 
          onSave={handleSave} 
        />
      </div>
    </MainLayout>
  );
}