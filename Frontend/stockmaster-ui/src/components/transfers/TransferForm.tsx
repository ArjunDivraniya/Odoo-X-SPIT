import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockWarehouses } from '@/lib/mockData';

export default function TransferForm({ open, onClose, onSave, initial }: any){
  const [form, setForm] = useState({ from: mockWarehouses[0]?.id || '', to: mockWarehouses[1]?.id || '', scheduledDate: '', itemsText: '' });

  useEffect(()=>{ if (initial) setForm({ from: initial.fromWarehouse, to: initial.toWarehouse, scheduledDate: initial.createdOn, itemsText: (initial.items||[]).map((i:any)=>`${i.product}|${i.quantity}`).join(',') }); else setForm({ from: mockWarehouses[0]?.id || '', to: mockWarehouses[1]?.id || '', scheduledDate: '', itemsText: '' }); }, [initial, open]);

  function save(){
    const items = form.itemsText.split(',').map((s:string)=>{ const [product, quantity] = s.split('|'); return { product: product?.trim() || '', quantity: Number(quantity||0) }; });
    onSave({ fromWarehouse: form.from, toWarehouse: form.to, createdOn: form.scheduledDate, items, status: 'requested' });
  }

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if(!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Transfer' : 'New Transfer'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update transfer' : 'Create a new transfer'}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3 max-w-md">
          <div><label className="text-sm">From Warehouse</label>
            <select className="input" value={form.from} onChange={(e:any)=>setForm({...form, from: e.target.value})}>{mockWarehouses.map((w:any)=>(<option key={w.id} value={w.id}>{w.name}</option>))}</select>
          </div>
          <div><label className="text-sm">To Warehouse</label>
            <select className="input" value={form.to} onChange={(e:any)=>setForm({...form, to: e.target.value})}>{mockWarehouses.map((w:any)=>(<option key={w.id} value={w.id}>{w.name}</option>))}</select>
          </div>
          <div><label className="text-sm">Scheduled Date</label><Input type="date" value={form.scheduledDate} onChange={(e:any)=>setForm({...form, scheduledDate: e.target.value})} /></div>
          <div><label className="text-sm">Items (comma-separated: Name|qty)</label><Input value={form.itemsText} onChange={(e:any)=>setForm({...form, itemsText: e.target.value})} /></div>
        </div>
        <DrawerFooter>
          <div className="flex justify-between w-full"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? 'Save' : 'Create'}</Button></div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
