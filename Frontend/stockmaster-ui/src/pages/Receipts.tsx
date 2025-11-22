import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Eye, CheckCircle2, Clock, FileText } from 'lucide-react';
import { mockReceipts } from '@/lib/mockData';

export default function Receipts() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'done':
        return <Badge className="bg-success/10 text-success">Done</Badge>;
      case 'ready':
        return <Badge className="bg-info/10 text-info">Ready</Badge>;
      case 'draft':
        return <Badge variant="outline">Draft</Badge>;
      default:
        return null;
    }
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
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            New Receipt
          </Button>
        </div>

        {/* Receipts List */}
        <div className="space-y-4">
          {mockReceipts.map((receipt) => (
            <Card key={receipt.id} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FileText className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{receipt.id}</h3>
                        {getStatusBadge(receipt.status)}
                      </div>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Supplier</p>
                          <p className="font-medium">{receipt.supplier}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Warehouse</p>
                          <p className="font-medium">{receipt.warehouse}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Created By</p>
                          <p className="font-medium">{receipt.createdBy}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Scheduled Date</p>
                          <p className="font-medium">{receipt.scheduledDate}</p>
                        </div>
                      </div>
                      <div className="mt-3">
                        <p className="text-sm font-medium mb-2">Items:</p>
                        <div className="flex flex-wrap gap-2">
                          {receipt.items.map((item, idx) => (
                            <Badge key={idx} variant="secondary">
                              {item.product} ({item.ordered} ordered)
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    {receipt.status === 'ready' && (
                      <Button size="sm" className="bg-success text-success-foreground hover:bg-success/90">
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        Validate
                      </Button>
                    )}
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
