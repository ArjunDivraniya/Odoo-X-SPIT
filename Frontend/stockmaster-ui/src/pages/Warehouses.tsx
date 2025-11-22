import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Warehouse, Plus, Package, Users } from 'lucide-react';
import api from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
// Import MainLayout
import { MainLayout } from '@/components/layout/MainLayout'; 

interface WarehouseData {
  _id: string;
  name: string;
  location: string;
  stats: {
    totalItems: number;
    lowStock: number;
    receipts: number;
    deliveries: number;
    staffCount: number;
  };
}

export default function Warehouses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [warehouses, setWarehouses] = useState<WarehouseData[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newWarehouse, setNewWarehouse] = useState({ name: '', location: '', description: '' });

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const res = await api.get('/warehouse');
      setWarehouses(res.data);
    } catch (error) {
      console.error("Failed to fetch warehouses");
    }
  };

  const handleCreate = async () => {
    try {
      await api.post('/warehouse', newWarehouse);
      toast({ title: "Warehouse Created" });
      setIsCreateOpen(false);
      setNewWarehouse({ name: '', location: '', description: '' }); // Reset form
      fetchWarehouses();
    } catch (error: any) { 
      console.error("Create Warehouse Error:", error.response?.data || error);
      toast({ 
          variant: "destructive", 
          title: "Error", 
          description: error.response?.data?.message || "Failed to create warehouse" 
      });
    }
  };

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Warehouses</h1>
            <p className="text-muted-foreground">Manage and view all your warehouse locations</p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground">
                <Plus className="w-4 h-4" /> Add Warehouse
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Warehouse</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newWarehouse.name} onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})} placeholder="e.g. Central Hub" />
                </div>
                <div className="space-y-2">
                  <Label>Location (City, State)</Label>
                  <Input value={newWarehouse.location} onChange={e => setNewWarehouse({...newWarehouse, location: e.target.value})} placeholder="e.g. New York, NY" />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={newWarehouse.description} onChange={e => setNewWarehouse({...newWarehouse, description: e.target.value})} placeholder="Optional details..." />
                </div>
                <Button onClick={handleCreate} className="w-full gradient-primary">Create Warehouse</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {warehouses.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No warehouses found. Create your first one!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {warehouses.map((warehouse) => (
              <Card key={warehouse._id} className="hover:shadow-lg transition-all shadow-neumorphic">
                <CardContent className="p-6">
                  <div className="flex justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Warehouse className="w-6 h-6 text-primary" />
                    </div>
                    <Badge variant="secondary">Active</Badge>
                  </div>
                  <h3 className="text-xl font-bold mb-1">{warehouse.name}</h3>
                  <p className="text-sm text-muted-foreground mb-6">{warehouse.location}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="font-semibold">{warehouse.stats?.totalItems || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Staff</p>
                        <p className="font-semibold">{warehouse.stats?.staffCount || 0}</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full" onClick={() => navigate('/dashboard')}>
                    View Dashboard
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}