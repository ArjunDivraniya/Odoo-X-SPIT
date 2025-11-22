import { useNavigate, useParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Package, TrendingUp } from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = mockProducts.find(p => p.id === id);

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </MainLayout>
    );
  }

  const stockData = Object.entries(product.stock).map(([warehouse, quantity]) => ({
    warehouse,
    quantity,
  }));

  const movementHistory = [
    { date: '2025-11-22', type: 'Receipt', warehouse: 'WH001', quantity: '+50', reference: 'RCP-2025-001' },
    { date: '2025-11-21', type: 'Delivery', warehouse: 'WH001', quantity: '-30', reference: 'DEL-2025-002' },
    { date: '2025-11-20', type: 'Transfer', warehouse: 'WH002', quantity: '+20', reference: 'TRF-2025-001' },
    { date: '2025-11-19', type: 'Adjustment', warehouse: 'WH001', quantity: '-5', reference: 'ADJ-2025-001' },
  ];

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate('/products')}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <p className="text-muted-foreground">SKU: {product.sku}</p>
            </div>
          </div>
          <Button className="gap-2">
            <Edit className="w-4 h-4" />
            Edit Product
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Product Details */}
          <Card className="lg:col-span-1 shadow-neumorphic">
            <CardHeader>
              <CardTitle>Product Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <Badge variant="outline">{product.category}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Unit of Measure</p>
                  <p className="font-medium">{product.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  {product.status === 'in_stock' && (
                    <Badge className="bg-success/10 text-success">In Stock</Badge>
                  )}
                  {product.status === 'low_stock' && (
                    <Badge className="bg-warning/10 text-warning">Low Stock</Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Reorder Level</p>
                  <p className="font-medium">Min: {product.minLevel} | Max: {product.maxLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stock Levels & Movement */}
          <Card className="lg:col-span-2 shadow-neumorphic">
            <CardHeader>
              <CardTitle>Stock Levels by Warehouse</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={stockData}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                  <XAxis dataKey="warehouse" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="quantity" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>

              <div className="mt-6">
                <h3 className="font-semibold mb-4">Movement History</h3>
                <div className="space-y-3">
                  {movementHistory.map((movement, index) => (
                    <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                      <div className="flex items-center gap-4">
                        <div>
                          <p className="font-medium">{movement.type}</p>
                          <p className="text-sm text-muted-foreground">{movement.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="outline">{movement.warehouse}</Badge>
                        <span className={`font-semibold ${movement.quantity.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                          {movement.quantity}
                        </span>
                        <span className="text-sm text-muted-foreground">{movement.reference}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
