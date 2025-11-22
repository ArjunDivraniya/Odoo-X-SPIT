import React, { useEffect, useState, useMemo } from 'react';
import { Drawer, DrawerContent, DrawerHeader, DrawerFooter, DrawerTitle, DrawerDescription } from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductForm({ open, onClose, onSave, initial, warehouses = [], existingProducts = [] }: any) {
  const [form, setForm] = useState<any>({ 
    name: '', sku: '', category: '', unit: '', image: '', 
    minLevel: 0, maxLevel: 0, stock: {} 
  });
  const [openCategory, setOpenCategory] = useState(false);

  // 1. Extract unique categories for the dropdown
  const uniqueCategories = useMemo(() => {
    const cats = new Set(existingProducts.map((p: any) => p.category));
    return Array.from(cats).sort();
  }, [existingProducts]);

  useEffect(() => {
    if (initial) {
      setForm({ ...initial, stock: initial.stock || {} });
    } else {
      // Reset form on new open
      setForm({ 
        name: '', sku: '', category: '', unit: '', image: '', 
        minLevel: 0, maxLevel: 0, stock: {} 
      });
    }
  }, [initial, open]);

  function save() {
    onSave({ ...form });
  }

  const handleStockChange = (warehouseId: string, qty: string) => {
    const newStock = { ...form.stock, [warehouseId]: Number(qty) };
    setForm({ ...form, stock: newStock });
  };

  // 2. Auto-fill Logic
  const handleCategorySelect = (category: string) => {
    setOpenCategory(false);
    
    // If we are editing, don't overwrite data just because category changed
    if (initial) {
      setForm({ ...form, category });
      return;
    }

    // Find the most recent product in this category to copy details from
    const similarProducts = existingProducts.filter((p: any) => p.category === category);
    
    if (similarProducts.length > 0) {
      // Get the last created product (assuming the list is sorted new -> old or we just take the first found)
      // Ideally, existingProducts should be sorted by createdOn desc.
      const lastProduct = similarProducts[0]; 

      // A. Auto-generate SKU (Simple Logic: Try to find a number at the end and increment it)
      // Ex: SKU-001 -> SKU-002
      let newSku = '';
      const skuMatch = lastProduct.sku.match(/^(.*?)(\d+)$/);
      if (skuMatch) {
        const prefix = skuMatch[1];
        const number = parseInt(skuMatch[2]);
        const nextNumber = String(number + 1).padStart(skuMatch[2].length, '0');
        newSku = `${prefix}${nextNumber}`;
      } else {
        // Fallback if no number found: just append '-new' or keep empty to let user decide
        newSku = `${lastProduct.sku}-NEW`; 
      }

      setForm((prev: any) => ({
        ...prev,
        category,
        unit: lastProduct.unit,       // Copy Unit
        minLevel: lastProduct.minLevel, // Copy Min Level
        maxLevel: lastProduct.maxLevel, // Copy Max Level
        sku: newSku || prev.sku,      // Auto-filled SKU
        // We don't copy Name or Stock as those are unique per product
      }));
    } else {
      // New category typed by user
      setForm((prev: any) => ({ ...prev, category }));
    }
  };

  return (
    <Drawer open={open} onOpenChange={(v:any)=>{ if (!v) onClose(); }}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{initial ? 'Edit Product' : 'Add Product'}</DrawerTitle>
          <DrawerDescription>{initial ? 'Update details' : 'Details auto-fill based on category'}</DrawerDescription>
        </DrawerHeader>

        <div className="p-4 space-y-4 max-w-md overflow-y-auto max-h-[70vh]">
          
          {/* Category Dropdown with "Add New" capability */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <Popover open={openCategory} onOpenChange={setOpenCategory}>
              <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={openCategory} className="justify-between w-full">
                  {form.category || "Select or type category..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <CommandInput placeholder="Search category..." />
                  <CommandList>
                    <CommandEmpty>
                        <button 
                            className="w-full text-left px-2 py-1 text-sm text-primary hover:underline"
                            onClick={() => {
                                // Allow adding a custom category that doesn't exist
                                // Note: CommandInput value isn't directly accessible easily in standard Shadcn implementation 
                                // without controlled state on search. 
                                // For simplicity in this snippet, users must type exactly or select.
                                // To strictly follow "add new", users usually type in the combobox.
                                // Here we rely on the user typing in the search and we can capture it if we controlled the search value.
                                // Simplified: We will add an Input field below if they want a totally new one, OR
                                // Better: Just use a standard Input with Datalist for simplicity if Combobox is too complex for "Creating".
                            }}
                        >
                            Type to add new category
                        </button>
                    </CommandEmpty>
                    <CommandGroup heading="Existing Categories">
                      {uniqueCategories.map((cat: any) => (
                        <CommandItem
                          key={cat}
                          value={cat}
                          onSelect={() => handleCategorySelect(cat)}
                        >
                          <Check className={cn("mr-2 h-4 w-4", form.category === cat ? "opacity-100" : "opacity-0")} />
                          {cat}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {/* Fallback Input to allow typing a new category if not in list (since Shadcn Command is strict select) */}
            <Input 
                placeholder="Or type new category here..." 
                value={form.category} 
                onChange={(e) => setForm({...form, category: e.target.value})} 
                className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Product Name</label>
            <Input value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} placeholder="e.g. Steel Rod 20mm" />
          </div>

          <div className="flex gap-2">
            <div className="w-1/2">
                <label className="text-sm font-medium">SKU (Auto-suggested)</label>
                <Input value={form.sku} onChange={(e)=>setForm({...form, sku: e.target.value})} />
            </div>
            <div className="w-1/2">
                <label className="text-sm font-medium">Unit</label>
                <Input value={form.unit} onChange={(e)=>setForm({...form, unit: e.target.value})} placeholder="e.g. Pcs" />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Image URL</label>
            <Input value={form.image} onChange={(e)=>setForm({...form, image: e.target.value})} placeholder="https://..." />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-sm font-medium">Min Level</label>
              <Input type="number" value={String(form.minLevel)} onChange={(e)=>setForm({...form, minLevel: Number(e.target.value)})} />
            </div>
            <div>
              <label className="text-sm font-medium">Max Level</label>
              <Input type="number" value={String(form.maxLevel)} onChange={(e)=>setForm({...form, maxLevel: Number(e.target.value)})} />
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <label className="text-sm font-semibold">Initial Stock</label>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {warehouses.length === 0 ? (
                <p className="text-xs text-muted-foreground">No warehouses available.</p>
              ) : (
                warehouses.map((w:any)=> (
                  <div key={w._id || w.id} className="flex items-center gap-2">
                    <div className="w-1/2 text-sm truncate" title={w.name}>{w.name}</div>
                    <Input 
                      type="number" 
                      className="w-1/2"
                      placeholder="0"
                      value={String(form.stock?.[w._id || w.id] ?? 0)} 
                      onChange={(e)=> handleStockChange(w._id || w.id, e.target.value)} 
                    />
                  </div>
                ))
              )}
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