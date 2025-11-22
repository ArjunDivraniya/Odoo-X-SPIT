import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, FileText } from 'lucide-react';
import { mockMovements } from '@/lib/mockData';
import { useState } from 'react';

export default function Movements() {
  const [searchQuery, setSearchQuery] = useState('');

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Receipt':
        return <Badge className="bg-info/10 text-info">Receipt</Badge>;
      case 'Delivery':
        return <Badge className="bg-success/10 text-success">Delivery</Badge>;
      case 'Transfer Out':
        return <Badge className="bg-warning/10 text-warning">Transfer</Badge>;
      case 'Adjustment':
        return <Badge variant="outline">Adjustment</Badge>;
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
            <h1 className="text-3xl font-bold mb-2">Movement Ledger</h1>
            <p className="text-muted-foreground">Complete history of all stock movements</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export to Excel
          </Button>
        </div>

        {/* Filters */}
        <Card className="shadow-neumorphic">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by product, reference, warehouse..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Advanced Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Movements Table */}
        <Card className="shadow-neumorphic">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date & Time</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Warehouse</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {mockMovements.map((movement) => (
                    <tr key={movement.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{movement.date}</td>
                      <td className="px-6 py-4 text-sm font-medium">{movement.warehouse}</td>
                      <td className="px-6 py-4">{getTypeBadge(movement.type)}</td>
                      <td className="px-6 py-4 text-sm">
                        <Button variant="link" className="p-0 h-auto text-primary">
                          {movement.reference}
                        </Button>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">{movement.product}</td>
                      <td className="px-6 py-4">
                        <span className={`font-semibold ${movement.quantity.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                          {movement.quantity}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">{movement.performedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
