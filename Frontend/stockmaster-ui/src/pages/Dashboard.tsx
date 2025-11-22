import { useEffect, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, 
  AlertTriangle, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  Settings,
  TrendingUp,
  TrendingDown,
  Loader2
} from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import dashboardIllustration from '@/assets/dashboard-illustration.jpg';
import api from '@/lib/api';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const [movements, setMovements] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, movementsRes] = await Promise.all([
          api.get('/analytics'),
          api.get('/movements')
        ]);
        setData(analyticsRes.data);
        setMovements(movementsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex h-[80vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </MainLayout>
    );
  }

  // Default Fallback if API returns null
  const kpis = data?.kpis || [
    { label: 'Total Products', value: 0, icon: 'Package', trend: 'neutral', change: '0%' },
    { label: 'Low Stock Items', value: 0, icon: 'AlertTriangle', trend: 'neutral', change: '0%' },
    { label: 'Pending Receipts', value: 0, icon: 'ArrowDownToLine', trend: 'neutral', change: '0%' },
    { label: 'Pending Deliveries', value: 0, icon: 'ArrowUpFromLine', trend: 'neutral', change: '0%' },
    { label: 'Scheduled Transfers', value: 0, icon: 'ArrowLeftRight', trend: 'neutral', change: '0%' },
    { label: 'Total Adjustments', value: 0, icon: 'Settings', trend: 'neutral', change: '0%' },
  ];
  
  const stockByCategory = data?.categoryData || [];
  const stockTrend = data?.stockTrend || [];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Main Warehouse - Overview</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {kpis.map((kpi: any, index: number) => {
            // Icon Mapping
            const iconMap: any = {
              'Package': Package,
              'AlertTriangle': AlertTriangle,
              'ArrowDownToLine': ArrowDownToLine,
              'ArrowUpFromLine': ArrowUpFromLine,
              'ArrowLeftRight': ArrowLeftRight,
              'Settings': Settings
            };
            const Icon = iconMap[kpi.icon] || Package;
            
            return (
              <Card key={index} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    {kpi.trend === 'up' && <TrendingUp className="w-4 h-4 text-success" />}
                    {kpi.trend === 'down' && <TrendingDown className="w-4 h-4 text-destructive" />}
                  </div>
                  <p className="text-2xl font-bold mb-1">{kpi.value}</p>
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  {/* Restored UI Element */}
                  <p className="text-xs text-muted-foreground mt-1">{kpi.change} from last week</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Stock by Category */}
          <Card className="shadow-neumorphic">
            <CardHeader>
              <CardTitle>Stock Quantity by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Stock Trend */}
          <Card className="shadow-neumorphic">
            <CardHeader>
              <CardTitle>Stock Movement Trend (Last 30 Days)</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={stockTrend}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="date" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="incoming" stroke="hsl(var(--success))" strokeWidth={2} />
                  <Line type="monotone" dataKey="outgoing" stroke="hsl(var(--destructive))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Recent Movements & Analytics */}
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Recent Movements */}
          <Card className="lg:col-span-2 shadow-neumorphic">
            <CardHeader>
              <CardTitle>Recent Stock Movements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {movements.length > 0 ? movements.slice(0, 5).map((movement: any) => (
                  <div key={movement.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4 flex-1">
                      <div>
                        <p className="font-medium">{movement.product}</p>
                        <p className="text-sm text-muted-foreground">{movement.warehouse}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={movement.type === 'Receipt' ? 'default' : movement.type === 'Delivery' ? 'secondary' : 'outline'}>
                        {movement.type}
                      </Badge>
                      <span className={`font-semibold ${String(movement.quantity).startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {movement.quantity}
                      </span>
                      <span className="text-sm text-muted-foreground">{new Date(movement.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-4 text-muted-foreground">No recent movements found.</div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Image */}
          <Card className="shadow-neumorphic overflow-hidden">
            <CardContent className="p-0">
              <img 
                src={dashboardIllustration} 
                alt="Analytics" 
                className="w-full h-full object-cover"
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}