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
      fetchWarehouses();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "Failed to create warehouse" });
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Select Warehouse</h1>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="w-4 h-4" /> Add New Warehouse</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Create Warehouse</DialogTitle></DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input value={newWarehouse.name} onChange={e => setNewWarehouse({...newWarehouse, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Location (City, State)</Label>
                  <Input value={newWarehouse.location} onChange={e => setNewWarehouse({...newWarehouse, location: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input value={newWarehouse.description} onChange={e => setNewWarehouse({...newWarehouse, description: e.target.value})} />
                </div>
                <Button onClick={handleCreate} className="w-full">Create</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {warehouses.map((warehouse) => (
            <Card key={warehouse._id} className="hover:shadow-lg transition-all cursor-pointer" onClick={() => navigate('/dashboard')}>
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
                      <p className="font-semibold">{warehouse.stats.totalItems}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Staff</p>
                      <p className="font-semibold">{warehouse.stats.staffCount}</p>
                    </div>
                  </div>
                </div>
                <Button variant="ghost" className="w-full text-primary">Select →</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}