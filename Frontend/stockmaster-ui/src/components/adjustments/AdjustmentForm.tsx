import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function AdjustmentForm({ open, onClose, onSave, initial, warehouses = [], products = [] }: any){
  const [form, setForm] = useState({ product: '', warehouse: '', physicalQty: 0, reason: '' });

  useEffect(()=>{ 
    if (initial) setForm(initial); 
    else setForm({ product: '', warehouse: warehouses[0]?._id || '', physicalQty: 0, reason: '' }); 
  }, [initial, open, warehouses]);

  function save(){
    const systemQty = 100; // Mock system quantity - normally fetched from backend for specific product/warehouse
    const diff = Number(form.physicalQty) - systemQty;
    
    onSave({ 
      date: new Date().toISOString().slice(0,10), 
      product: form.product, 
      warehouse: form.warehouse, 
      physicalQty: Number(form.physicalQty), 
      reason: form.reason, 
      systemQty: systemQty, 
      difference: diff 
    });
  }

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if(!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Adjustment' : 'New Adjustment'}</DrawerTitle>
          <DrawerDescription>Record a physical count adjustment</DrawerDescription>
        </DrawerHeader>
        <div className="p-4 space-y-3 max-w-md mx-auto w-full">
          <div><label className="text-sm">Product</label>
            <Select value={form.product} onValueChange={(v)=>setForm({...form, product: v})}>
              <SelectTrigger><SelectValue placeholder="Select Product"/></SelectTrigger>
              <SelectContent>
                {products.map((p:any)=><SelectItem key={p._id} value={p.name}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-sm">Warehouse</label>
            <Select value={form.warehouse} onValueChange={(v)=>setForm({...form, warehouse: v})}>
              <SelectTrigger><SelectValue placeholder="Select Warehouse"/></SelectTrigger>
              <SelectContent>
                {warehouses.map((w:any)=><SelectItem key={w._id} value={w._id}>{w.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><label className="text-sm">Physical Qty</label><Input type="number" value={String(form.physicalQty)} onChange={(e:any)=>setForm({...form, physicalQty: Number(e.target.value)})} /></div>
          <div><label className="text-sm">Reason</label><Input value={form.reason} onChange={(e:any)=>setForm({...form, reason: e.target.value})} /></div>
        </div>
        <DrawerFooter>
          <div className="flex justify-between w-full max-w-md mx-auto"><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={save}>{initial ? 'Save' : 'Create'}</Button></div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}