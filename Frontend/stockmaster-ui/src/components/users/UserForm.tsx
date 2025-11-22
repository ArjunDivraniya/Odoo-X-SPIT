import React, { useState, useEffect } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { mockWarehouses } from '@/lib/mockData';

const roles = ['Admin', 'Inventory Manager', 'Warehouse Staff', 'Picker'];

export default function UserForm({ open, onClose, onSave, initial }: any) {
  const [form, setForm] = useState<any>({
    name: '',
    email: '',
    password: '',
    role: 'Warehouse Staff',
    warehouses: [] as string[],
    phone: '',
    status: 'active',
  });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial]);

  function handleSave() {
    onSave(form);
  }

  return (
    <Drawer open={open} onOpenChange={(val) => { if (!val) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit User' : 'Add New User'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update user details and permissions' : 'Create a new user account'}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <Label>Email</Label>
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          {!initial && (
            <div>
              <Label>Password</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
          )}
          <div>
            <Label>Role</Label>
            <Select onValueChange={(v) => setForm({ ...form, role: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
            {form.role === 'Admin' && <Badge className="mt-2" variant="destructive">Full System Access</Badge>}
            {form.role === 'Picker' && <Badge className="mt-2" variant="outline">Limited to Picking Tasks</Badge>}
          </div>

          <div>
            <Label>Assign Warehouse(s)</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {mockWarehouses.map((w: any) => (
                <button
                  key={w.id}
                  onClick={() => {
                    const list = new Set(form.warehouses || []);
                    if (list.has(w.id)) list.delete(w.id); else list.add(w.id);
                    setForm({ ...form, warehouses: Array.from(list) });
                  }}
                  className={`px-2 py-1 rounded-full border ${form.warehouses?.includes(w.id) ? 'bg-primary text-white' : 'bg-transparent'}`}
                >
                  {w.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Phone (optional)</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>

          <div>
            <Label>Status</Label>
            <Select onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger>
                <SelectValue placeholder="Active / Inactive" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex w-full justify-between">
            <Button variant="ghost" onClick={() => onClose()}>Cancel</Button>
            <div className="flex gap-2">
              <Button onClick={handleSave}>{initial ? 'Save Changes' : 'Save User'}</Button>
            </div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
