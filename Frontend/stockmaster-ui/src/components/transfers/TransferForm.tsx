import React, { useEffect, useState } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Plus, Trash2, Check, ChevronsUpDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';

// --- COMPONENT MOVED OUTSIDE TO PREVENT RE-RENDER FOCUS LOSS ---
const SuggestionInput = ({ value, onChange, options, placeholder }: any) => {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between font-normal text-left px-3">
          {value || <span className="text-muted-foreground">{placeholder}</span>}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0" align="start">
        <Command>
          <CommandInput placeholder={`Search ${placeholder ? placeholder.toLowerCase() : ''}...`} />
          <CommandList>
            <CommandEmpty className="p-2 text-sm text-muted-foreground">No results.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              {options.map((opt: string) => (
                <CommandItem key={opt} value={opt} onSelect={() => { onChange(opt); setOpen(false); }}>
                  <Check className={cn("mr-2 h-4 w-4", value === opt ? "opacity-100" : "opacity-0")} />
                  {opt}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
        <div className="p-2 border-t">
          <Input 
            placeholder={`Type new ${placeholder}...`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default function TransferForm({ open, onClose, onSave, initial, warehouses = [], products = [] }: any) {
  const [form, setForm] = useState<any>({ fromWarehouse: '', toWarehouse: '', scheduledDate: '', items: [] });

  useEffect(() => {
    if (initial) setForm(initial);
    else setForm({ 
      fromWarehouse: warehouses[0]?._id || warehouses[0]?.id || '', 
      toWarehouse: warehouses[1]?._id || warehouses[1]?.id || '', 
      scheduledDate: '', 
      items: [{ product: '', quantity: 0 }] 
    });
  }, [initial, open, warehouses]);

  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...form.items];
    newItems[idx] = { ...newItems[idx], [field]: val };
    setForm({ ...form, items: newItems });
  };

  const addItem = () => setForm({ ...form, items: [...form.items, { product: '', quantity: 0 }] });
  const removeItem = (idx: number) => setForm({ ...form, items: form.items.filter((_:any, i:number) => i !== idx) });

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if(!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Transfer' : 'New Transfer'}</DrawerTitle>
          <DrawerDescription>Move items between warehouses</DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-4 max-w-2xl mx-auto w-full overflow-y-auto max-h-[75vh]">
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">From Warehouse</label>
              <Select value={form.fromWarehouse} onValueChange={(v)=>setForm({...form, fromWarehouse: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{warehouses.map((w:any)=><SelectItem key={w._id || w.id} value={w._id || w.id}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">To Warehouse</label>
              <Select value={form.toWarehouse} onValueChange={(v)=>setForm({...form, toWarehouse: v})}>
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>{warehouses.map((w:any)=><SelectItem key={w._id || w.id} value={w._id || w.id}>{w.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Scheduled Date</label>
            <Input type="date" value={form.scheduledDate} onChange={(e)=>setForm({...form, scheduledDate: e.target.value})} />
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Items to Transfer</span>
              <Button size="sm" variant="ghost" onClick={addItem}><Plus className="w-4 h-4 mr-1"/> Add Item</Button>
            </div>
            
            {form.items.map((item:any, idx:number) => (
              <div key={idx} className="flex gap-2 items-end bg-muted/30 p-2 rounded-lg">
                <div className="flex-1 space-y-1">
                  <label className="text-xs text-muted-foreground">Product</label>
                  <SuggestionInput 
                    value={item.product} 
                    onChange={(v: string) => updateItem(idx, 'product', v)} 
                    options={products.map((p: any) => p.name)} 
                    placeholder="Product Name" 
                  />
                </div>
                <div className="w-24 space-y-1">
                  <label className="text-xs text-muted-foreground">Qty</label>
                  <Input type="number" value={item.quantity} onChange={(e)=>updateItem(idx, 'quantity', e.target.value)} />
                </div>
                <Button size="icon" variant="ghost" className="text-muted-foreground hover:text-destructive" onClick={()=>removeItem(idx)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>

        <DrawerFooter className="max-w-2xl mx-auto w-full">
          <div className="flex gap-2 w-full">
            <Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button>
            <Button className="flex-1" onClick={()=>onSave(form)}>Confirm Transfer</Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}