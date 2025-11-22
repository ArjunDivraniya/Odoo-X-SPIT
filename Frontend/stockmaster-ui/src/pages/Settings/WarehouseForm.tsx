import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

export default function WarehouseForm({ open, onClose, onSave, initial, managers = [] }: any){
  const [form, setForm] = useState({ name: '', location: '', manager: '', status: 'active' });

  useEffect(()=>{ if (initial) setForm({ name: initial.name, location: initial.location, manager: initial.manager || '', status: initial.status || 'active' }); else setForm({ name: '', location: '', manager: '', status: 'active' }); }, [initial]);

  return (
    <Drawer open={open} onOpenChange={(v)=>{ if (!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Warehouse' : 'Add Warehouse'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update warehouse settings' : 'Create a new warehouse'}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm">Warehouse Name</label>
            <Input value={form.name} onChange={(e:any)=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Location</label>
            <Input value={form.location} onChange={(e:any)=>setForm({...form, location: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Select Manager</label>
            <Select onValueChange={(v:any)=>setForm({...form, manager: v})}>
              <SelectTrigger><SelectValue placeholder="Select manager" /></SelectTrigger>
              <SelectContent>
                {managers.map((m:any)=> <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm">Status</label>
            <Select onValueChange={(v:any)=>setForm({...form, status: v})}>
              <SelectTrigger><SelectValue placeholder="Active / Inactive" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <div className="flex gap-2"><Button onClick={()=>onSave(form)}>{initial ? 'Save Changes' : 'Add Warehouse'}</Button></div>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
