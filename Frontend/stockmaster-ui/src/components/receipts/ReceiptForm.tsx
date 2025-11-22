import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { mockWarehouses } from '@/lib/mockData';

export default function ReceiptForm({ open, onClose, onSave, initial }: any){
  const [form, setForm] = useState({ supplier: '', warehouse: mockWarehouses[0]?.id || '', scheduledDate: '', itemsText: '' });

  useEffect(()=>{ if (initial) setForm({ supplier: initial.supplier, warehouse: initial.warehouse, scheduledDate: initial.scheduledDate, itemsText: (initial.items || []).map((i:any)=>`${i.product}|${i.ordered}`).join(',') }); else setForm({ supplier: '', warehouse: mockWarehouses[0]?.id || '', scheduledDate: '', itemsText: '' }); }, [initial, open]);

  function save(){
    const items = form.itemsText.split(',').map((s:string)=>{
      const [product, ordered] = s.split('|'); return { product: product?.trim() || '', ordered: Number(ordered||0), received: 0 };
    });
    onSave({ supplier: form.supplier, warehouse: form.warehouse, scheduledDate: form.scheduledDate, items, status: 'draft' });
  }

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if(!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Receipt' : 'New Receipt'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update receipt' : 'Create a new receipt'}</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3 max-w-md">
          <div><label className="text-sm">Supplier</label><Input value={form.supplier} onChange={(e:any)=>setForm({...form, supplier: e.target.value})} /></div>
          <div><label className="text-sm">Warehouse</label>
            <select className="input" value={form.warehouse} onChange={(e:any)=>setForm({...form, warehouse: e.target.value})}>
              {mockWarehouses.map((w:any)=>(<option key={w.id} value={w.id}>{w.name}</option>))}
            </select>
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
