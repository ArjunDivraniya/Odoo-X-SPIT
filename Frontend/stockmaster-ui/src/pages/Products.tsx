import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, Download, Plus, Eye, Edit, Loader2
} from 'lucide-react';
import ProductForm from '@/components/products/ProductForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/api';

export default function Products() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, whRes] = await Promise.all([
        api.get('/products'),
        api.get('/warehouse')
      ]);
      setProducts(prodRes.data);
      setWarehouses(whRes.data);
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({ variant: "destructive", title: "Error loading data" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

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

  const handleSave = async (data: any) => {
    try {
      if (editing) {
        // Update
        const res = await api.put(`/products/${editing.id}`, data);
        setProducts(prev => prev.map(p => p.id === editing.id ? res.data : p));
        toast({ title: 'Product updated successfully' });
      } else {
        // Create
        const res = await api.post('/products', data);
        setProducts(prev => [res.data, ...prev]);
        toast({ title: 'Product added successfully' });
      }
      setOpenForm(false);
      setEditing(null);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Operation failed" });
    }
  };

  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w._id === id || w.id === id);
    return wh ? wh.name : 'Unknown WH';
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
          <Button className="gradient-primary text-primary-foreground gap-2" onClick={()=>{ setEditing(null); setOpenForm(true); }}>
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
              <Button variant="outline" className="gap-2" onClick={() => {
                const csv = [
                  ['SKU','Name','Category','Status','Total Stock'],
                  ...products.map(p => {
                    const totalStock = p.stock ? Object.values(p.stock).reduce((a:any,b:any)=>a+b,0) : 0;
                    return [p.sku, p.name, p.category, p.status, totalStock];
                  })
                ].map(r => r.map(c => `"${c}"`).join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a'); a.href=url; a.download='products.csv'; a.click();
              }}>
                <Download className="w-4 h-4" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        {loading ? (
          <div className="flex justify-center py-12"><Loader2 className="animate-spin w-8 h-8 text-primary" /></div>
        ) : products.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No products found. Add your first product!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.filter(p => (p.name + p.sku).toLowerCase().includes(searchQuery.toLowerCase())).map((product) => (
              <Card key={product.id} className="shadow-neumorphic hover:shadow-lg transition-all group animate-fade-in">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <img 
                      src={product.image || "https://placehold.co/400x400?text=No+Image"} 
                      alt={product.name}
                      className="w-20 h-20 rounded-lg object-cover bg-muted"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold truncate" title={product.name}>{product.name}</h3>
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
                      {product.stock && Object.entries(product.stock).slice(0,3).map(([warehouseId, qty]) => (
                        <div key={warehouseId} className="text-center">
                          <p className="text-xs text-muted-foreground truncate" title={getWarehouseName(warehouseId)}>
                            {getWarehouseName(warehouseId)}
                          </p>
                          <p className="font-semibold">{String(qty)}</p>
                        </div>
                      ))}
                      {product.stock && Object.keys(product.stock).length > 3 && (
                         <div className="text-center flex items-center justify-center text-xs text-muted-foreground">
                           +{Object.keys(product.stock).length - 3} more
                         </div>
                      )}
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
                      <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditing(product); setOpenForm(true); }}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <ProductForm 
          open={openForm} 
          onClose={()=>{ setOpenForm(false); setEditing(null); }} 
          onSave={handleSave} 
          initial={editing}
          warehouses={warehouses}
          // Pass all products to the form for "Auto-fill" logic
          existingProducts={products} 
        />
      </div>
    </MainLayout>
  );
}