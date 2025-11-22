import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, Download, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { format } from 'date-fns';

export default function Movements() {
  const [movements, setMovements] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetch = async () => {
      try {
        const [movRes, whRes] = await Promise.all([api.get('/movements'), api.get('/warehouse')]);
        setMovements(movRes.data);
        setWarehouses(whRes.data);
      } catch (e) { console.error(e); } finally { setLoading(false); }
    };
    fetch();
  }, []);

  const getWhName = (id: string) => warehouses.find(w => w._id === id || w.id === id)?.name || id;

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Receipt': return <Badge className="bg-info/10 text-info">Receipt</Badge>;
      case 'Delivery': return <Badge className="bg-success/10 text-success">Delivery</Badge>;
      case 'Transfer Out': return <Badge className="bg-warning/10 text-warning">Transfer</Badge>;
      case 'Adjustment': return <Badge variant="outline">Adjustment</Badge>;
      default: return null;
    }
  };

  const filtered = movements.filter(m => 
    (m.product + m.reference + getWhName(m.warehouse)).toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-3xl font-bold mb-2">Movement Ledger</h1><p className="text-muted-foreground">Complete history of all stock movements</p></div>
          <Button variant="outline" className="gap-2"><Download className="w-4 h-4" /> Export to Excel</Button>
        </div>

        <Card className="shadow-neumorphic">
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search by product, reference, warehouse..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
              </div>
              <Button variant="outline" className="gap-2"><Filter className="w-4 h-4" /> Filters</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-neumorphic">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Warehouse</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Type</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Reference</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Product</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Quantity</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold">Performed By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? <tr><td colSpan={7} className="p-8 text-center"><Loader2 className="animate-spin mx-auto"/></td></tr> : 
                   filtered.map((m) => (
                    <tr key={m.id + m.product + m.type} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-sm">{format(new Date(m.date), 'yyyy-MM-dd')}</td>
                      <td className="px-6 py-4 text-sm font-medium">{getWhName(m.warehouse)}</td>
                      <td className="px-6 py-4">{getTypeBadge(m.type)}</td>
                      <td className="px-6 py-4 text-sm text-primary">{m.reference}</td>
                      <td className="px-6 py-4 text-sm font-medium">{m.product}</td>
                      <td className="px-6 py-4"><span className={`font-semibold ${String(m.quantity).startsWith('+') ? 'text-success' : 'text-destructive'}`}>{m.quantity}</span></td>
                      <td className="px-6 py-4 text-sm">{m.performedBy}</td>
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