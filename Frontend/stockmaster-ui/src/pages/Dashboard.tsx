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
} from 'lucide-react';
import { mockDashboardData, mockMovements } from '@/lib/mockData';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Badge } from '@/components/ui/badge';
import dashboardIllustration from '@/assets/dashboard-illustration.jpg';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Main Warehouse - New York, NY</p>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {mockDashboardData.kpis.map((kpi, index) => {
            const icons = [Package, AlertTriangle, ArrowDownToLine, ArrowUpFromLine, ArrowLeftRight, Settings];
            const Icon = icons[index];
            
            return (
              <Card key={kpi.label} className="shadow-neumorphic hover:shadow-lg transition-all animate-fade-in">
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
                <BarChart data={mockDashboardData.stockByCategory}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="category" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
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
                <LineChart data={mockDashboardData.stockTrend}>
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
                {mockMovements.map((movement) => (
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
                      <span className={`font-semibold ${movement.quantity.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                        {movement.quantity}
                      </span>
                      <span className="text-sm text-muted-foreground">{movement.date}</span>
                    </div>
                  </div>
                ))}
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
