import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, ArrowLeftRight, CheckCircle2, Truck, Clock } from 'lucide-react';
import { mockTransfers } from '@/lib/mockData';

export default function Transfers() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success">Completed</Badge>;
      case 'in_transit':
        return <Badge className="bg-info/10 text-info">In Transit</Badge>;
      case 'requested':
        return <Badge variant="outline">Requested</Badge>;
      default:
        return null;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case 'in_transit':
        return <Truck className="w-5 h-5 text-info" />;
      default:
        return <Clock className="w-5 h-5 text-muted-foreground" />;
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
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            New Transfer
          </Button>
        </div>

        {/* Transfers List */}
        <div className="space-y-4">
          {mockTransfers.map((transfer) => (
            <Card key={transfer.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-info/10 flex items-center justify-center">
                      <ArrowLeftRight className="w-6 h-6 text-info" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="font-semibold text-lg">{transfer.id}</h3>
                        {getStatusBadge(transfer.status)}
                      </div>
                      
                      {/* Transfer Route */}
                      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/30">
                        <Badge variant="outline" className="text-sm">
                          {transfer.fromWarehouse}
                        </Badge>
                        <ArrowLeftRight className="w-4 h-4 text-muted-foreground" />
                        <Badge variant="outline" className="text-sm">
                          {transfer.toWarehouse}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Created By</p>
                          <p className="font-medium">{transfer.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created On</p>
                          <p className="font-medium">{transfer.createdOn}</p>
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
                          {transfer.items.map((item, idx) => (
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
                    <Button variant="outline" size="sm">
                      Track
                    </Button>
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
