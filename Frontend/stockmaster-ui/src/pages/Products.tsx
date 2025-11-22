import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Download, 
  Plus,
  Eye,
  Edit,
  Package,
} from 'lucide-react';
import { mockProducts } from '@/lib/mockData';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const getStockStatus = (status: string) => {
    switch (status) {
      case 'in_stock':
        return <Badge className="bg-success/10 text-success">In Stock</Badge>;
      case 'low_stock':
        return <Badge className="bg-warning/10 text-warning">Low Stock</Badge>;
      case 'out_of_stock':
        return <Badge variant="destructive">Out of Stock</Badge>;
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
            <h1 className="text-3xl font-bold mb-2">Products</h1>
            <p className="text-muted-foreground">Manage your product inventory</p>
          </div>
          <Button className="gradient-primary text-primary-foreground gap-2">
            <Plus className="w-4 h-4" />
            Add Product
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
                    placeholder="Search by product name, SKU..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </Button>
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((product) => (
            <Card key={product.id} className="shadow-neumorphic hover:shadow-lg transition-all group animate-fade-in">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="font-semibold truncate">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.sku}</p>
                      </div>
                      {getStockStatus(product.status)}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Object.entries(product.stock).map(([warehouse, qty]) => (
                      <div key={warehouse} className="text-center">
                        <p className="text-xs text-muted-foreground">{warehouse}</p>
                        <p className="font-semibold">{qty}</p>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => navigate(`/products/${product.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
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
