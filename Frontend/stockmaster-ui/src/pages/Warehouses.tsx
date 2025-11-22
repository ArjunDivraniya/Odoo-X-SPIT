import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Warehouse, 
  Package, 
  AlertTriangle, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Users 
} from 'lucide-react';
import { mockWarehouses } from '@/lib/mockData';
import warehouseHero from '@/assets/warehouse-hero.jpg';

export default function Warehouses() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-64 bg-gradient-hero overflow-hidden">
        <img 
          src={warehouseHero} 
          alt="Warehouse" 
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative h-full flex flex-col items-center justify-center text-white z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Select Warehouse</h1>
          <p className="text-lg text-white/90 max-w-2xl text-center">
            Choose a warehouse to manage inventory, track movements, and oversee operations
          </p>
        </div>
      </div>

      {/* Warehouse Cards */}
      <div className="max-w-7xl mx-auto px-4 -mt-16 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockWarehouses.map((warehouse) => (
            <Card
              key={warehouse.id}
              className="shadow-neumorphic hover:shadow-lg transition-all duration-300 cursor-pointer group animate-fade-in"
              onClick={() => navigate('/dashboard')}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Warehouse className="w-6 h-6 text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <Badge variant="secondary" className="bg-success/10 text-success">
                    Active
                  </Badge>
                </div>

                <h3 className="text-xl font-bold mb-1">{warehouse.name}</h3>
                <p className="text-sm text-muted-foreground mb-6">{warehouse.location}</p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Items</p>
                      <p className="font-semibold">{warehouse.totalItems}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">Low Stock</p>
                      <p className="font-semibold">{warehouse.lowStockCount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="w-4 h-4 text-info" />
                    <div>
                      <p className="text-xs text-muted-foreground">Receipts</p>
                      <p className="font-semibold">{warehouse.pendingReceipts}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowUpFromLine className="w-4 h-4 text-success" />
                    <div>
                      <p className="text-xs text-muted-foreground">Deliveries</p>
                      <p className="font-semibold">{warehouse.pendingDeliveries}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{warehouse.staffCount} staff</span>
                  </div>
                  <span className="text-sm font-medium text-primary">Select →</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
