import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, AlertCircle } from 'lucide-react';

export default function Adjustments() {
  const adjustments = [
    {
      id: 'ADJ-2025-001',
      date: '2025-11-21',
      product: 'M10 Hex Nuts',
      warehouse: 'Main Warehouse',
      systemQty: 105,
      physicalQty: 93,
      difference: -12,
      reason: 'Audit Mismatch',
      performedBy: 'System Audit',
    },
    {
      id: 'ADJ-2025-002',
      date: '2025-11-19',
      product: 'Steel Rods 10mm',
      warehouse: 'Factory Warehouse',
      systemQty: 340,
      physicalQty: 335,
      difference: -5,
      reason: 'Damage',
      performedBy: 'James Wilson',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Adjustments</h1>
            <p className="text-muted-foreground">Record and track inventory adjustments</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            New Adjustment
          </Button>
        </div>

        {/* Adjustments List */}
        <div className="space-y-4">
          {adjustments.map((adjustment) => (
            <Card key={adjustment.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-warning/10 flex items-center justify-center">
                    <AlertCircle className="w-6 h-6 text-warning" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{adjustment.id}</h3>
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
                        <p className="font-semibold text-destructive">{adjustment.difference}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
