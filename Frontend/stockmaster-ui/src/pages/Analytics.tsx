import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Analytics() {
  const categoryData = [
    { name: 'Steel', value: 950 },
    { name: 'Aluminum', value: 520 },
    { name: 'Copper', value: 250 },
    { name: 'Plastic', value: 1110 },
    { name: 'Fasteners', value: 1393 },
  ];

  const turnoverData = [
    { month: 'Jan', turnover: 2.3 },
    { month: 'Feb', turnover: 2.5 },
    { month: 'Mar', turnover: 2.8 },
    { month: 'Apr', turnover: 2.4 },
    { month: 'May', turnover: 3.1 },
    { month: 'Jun', turnover: 2.9 },
  ];

  const warehousePerformance = [
    { warehouse: 'Main', efficiency: 92, accuracy: 95, speed: 88 },
    { warehouse: 'Factory', efficiency: 88, accuracy: 91, speed: 85 },
    { warehouse: 'Branch', efficiency: 85, accuracy: 89, speed: 82 },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">Insights and performance metrics</p>
        </div>

        {/* Top Row */}
        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="shadow-neumorphic">
            <CardHeader>
              <CardTitle>Stock Distribution by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="shadow-neumorphic">
            <CardHeader>
              <CardTitle>Inventory Turnover Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={turnoverData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="turnover" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Warehouse Performance */}
        <Card className="shadow-neumorphic">
          <CardHeader>
            <CardTitle>Warehouse Performance Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={warehousePerformance}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis dataKey="warehouse" fontSize={12} />
                <YAxis fontSize={12} />
                <Tooltip />
                <Legend />
                <Bar dataKey="efficiency" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="accuracy" fill="hsl(var(--success))" radius={[8, 8, 0, 0]} />
                <Bar dataKey="speed" fill="hsl(var(--info))" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
