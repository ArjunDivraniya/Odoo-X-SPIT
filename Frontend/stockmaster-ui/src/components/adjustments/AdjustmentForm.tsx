import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockProducts, mockWarehouses } from '@/lib/mockData';

export default function AdjustmentForm({ open, onClose, onSave, initial }: any){
  const [form, setForm] = useState({ product: mockProducts[0]?.name || '', warehouse: mockWarehouses[0]?.name || '', physicalQty: 0, reason: '' });

  useEffect(()=>{ if (initial) setForm({ product: initial.product, warehouse: initial.warehouse, physicalQty: initial.physicalQty, reason: initial.reason }); else setForm({ product: mockProducts[0]?.name || '', warehouse: mockWarehouses[0]?.name || '', physicalQty: 0, reason: '' }); }, [initial, open]);

  function save(){
    onSave({ date: new Date().toISOString().slice(0,10), product: form.product, warehouse: form.warehouse, physicalQty: form.physicalQty, reason: form.reason, performedBy: 'You', systemQty: 0, difference: form.physicalQty - 0 });
  }

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if(!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Adjustment' : 'New Adjustment'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update adjustment' : 'Record a physical count adjustment'}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3 max-w-md">
          <div><label className="text-sm">Product</label>
            <select className="input" value={form.product} onChange={(e:any)=>setForm({...form, product: e.target.value})}>{mockProducts.map((p:any)=>(<option key={p.id} value={p.name}>{p.name}</option>))}</select>
          </div>
          <div><label className="text-sm">Warehouse</label>
            <select className="input" value={form.warehouse} onChange={(e:any)=>setForm({...form, warehouse: e.target.value})}>{mockWarehouses.map((w:any)=>(<option key={w.id} value={w.name}>{w.name}</option>))}</select>
          </div>
          <div><label className="text-sm">Physical Qty</label><Input type="number" value={String(form.physicalQty)} onChange={(e:any)=>setForm({...form, physicalQty: Number(e.target.value)})} /></div>
          <div><label className="text-sm">Reason</label><Input value={form.reason} onChange={(e:any)=>setForm({...form, reason: e.target.value})} /></div>
        </div>
        <DrawerFooter>
          <div className="flex justify-between w-full"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? 'Save' : 'Create'}</Button></div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
