import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';

const roles = ['Admin', 'Inventory Manager', 'Warehouse Staff', 'Picker'];

export default function UserForm({ open, onClose, onSave, initial, availableWarehouses = [], saving = false }: any) {
  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    role: 'Warehouse Staff',
    warehouses: [] as string[],
    phone: '',
    status: 'active',
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
    else setForm({ name: '', email: '', role: 'Warehouse Staff', warehouses: [], phone: '', status: 'active' });
  }, [initial, open]);

  function handleSave() {
    onSave(form);
  }

  // Helper to handle MongoDB _id
  const toggleWarehouse = (warehouseId: string) => {
    const list = new Set(form.warehouses || []);
    if (list.has(warehouseId)) list.delete(warehouseId); 
    else list.add(warehouseId);
    setForm({ ...form, warehouses: Array.from(list) });
  };

  return (
    <Drawer open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit User' : 'Add New User'}</DrawerTitle>
          <DrawerDescription>Create a new user and assign them to warehouses.</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 max-w-xl mx-auto w-full">
          <div>
            <Label>Full Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          
          <div>
            <Label>Role</Label>
            <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic Warehouse List */}
          <div>
            <Label>Assign Warehouse(s)</Label>
            <div className="flex flex-wrap gap-2 mt-2 p-4 border rounded-lg bg-muted/20">
              {availableWarehouses.length > 0 ? (
                availableWarehouses.map((w: any) => (
                  <button
                    key={w._id} // Ensure we use the MongoDB _id
                    type="button"
                    onClick={() => toggleWarehouse(w._id)}
                    className={`px-3 py-1.5 text-sm rounded-md border transition-all duration-200 ${
                      form.warehouses?.includes(w._id) 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm' 
                        : 'bg-white text-gray-700 hover:bg-gray-100 border-gray-200'
                    }`}
                  >
                    {w.name}
                  </button>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  No warehouses found in database.
                </p>
              )}
            </div>
          </div>

          <div>
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div>
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter className="max-w-xl mx-auto w-full">
          <div className="flex w-full justify-between gap-4">
            <Button variant="ghost" className="flex-1" onClick={() => onClose()}>Cancel</Button>
            <Button className="flex-1" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save User
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}