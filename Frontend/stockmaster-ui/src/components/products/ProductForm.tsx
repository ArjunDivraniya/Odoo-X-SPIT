import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { mockWarehouses } from '@/lib/mockData';

export default function ProductForm({ open, onClose, onSave, initial }: any) {
  const [form, setForm] = useState<any>({ name: '', sku: '', category: '', unit: '', image: '', minLevel: 0, maxLevel: 0, stock: {} });

  useEffect(() => {
    if (initial) setForm({ ...form, ...initial });
    else setForm({ name: '', sku: '', category: '', unit: '', image: '', minLevel: 0, maxLevel: 0, stock: {} });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial, open]);

  function save() {
    onSave({ ...form });
  }

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if (!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Product' : 'Add Product'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update product details' : 'Create a new product'}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-3 max-w-md">
          <div>
            <label className="text-sm">Name</label>
            <Input value={form.name} onChange={(e:any)=>setForm({...form, name: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">SKU</label>
            <Input value={form.sku} onChange={(e:any)=>setForm({...form, sku: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Category</label>
            <Input value={form.category} onChange={(e:any)=>setForm({...form, category: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Unit</label>
            <Input value={form.unit} onChange={(e:any)=>setForm({...form, unit: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Image URL</label>
            <Input value={form.image} onChange={(e:any)=>setForm({...form, image: e.target.value})} />
          </div>
          <div>
            <label className="text-sm">Min Level</label>
            <Input type="number" value={String(form.minLevel)} onChange={(e:any)=>setForm({...form, minLevel: Number(e.target.value)})} />
          </div>
          <div>
            <label className="text-sm">Max Level</label>
            <Input type="number" value={String(form.maxLevel)} onChange={(e:any)=>setForm({...form, maxLevel: Number(e.target.value)})} />
          </div>

          <div>
            <label className="text-sm">Initial Stock per Warehouse</label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {mockWarehouses.map((w:any)=> (
                <div key={w.id} className="flex gap-2">
                  <div className="w-36 p-2 rounded bg-muted/30">{w.name}</div>
                  <Input type="number" value={String(form.stock?.[w.id] ?? 0)} onChange={(e:any)=> setForm({ ...form, stock: { ...(form.stock||{}), [w.id]: Number(e.target.value) } })} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <DrawerFooter>
          <div className="flex justify-between w-full">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={save}>{initial ? 'Save Changes' : 'Add Product'}</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
