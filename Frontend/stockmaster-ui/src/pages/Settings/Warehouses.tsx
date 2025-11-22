import React, { useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { mockWarehouses, mockUsers } from '@/lib/mockData';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import WarehouseForm from '@/pages/Settings/WarehouseForm';
import { useToast } from '@/hooks/use-toast';

export default function WarehouseSettings(){
  const [warehouses, setWarehouses] = useState(mockWarehouses);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  function handleSave(data:any){
    if (editing) {
      setWarehouses(prev => prev.map(w => w.id === editing.id ? { ...w, ...data } : w));
      toast({ title: 'Warehouse updated' });
    } else {
      const id = `WH${Math.floor(Math.random()*900)+100}`;
      setWarehouses(prev => [{ id, ...data }, ...prev]);
      toast({ title: 'Warehouse added' });
    }
    setOpen(false); setEditing(null);
  }

  function handleDelete(w:any){
    if (!confirm('Are you sure? This will delete the warehouse.')) return;
    setWarehouses(prev => prev.filter(p => p.id !== w.id));
    toast({ title: 'Warehouse deleted' });
  }

  const managers = useMemo(()=> mockUsers.filter(u=>u.role==='Inventory Manager' || u.role==='Admin'), []);

  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › Warehouse Settings</nav>
        <div className="flex items-center justify-between mt-2 mb-4">
          <h2 className="text-2xl font-semibold">Warehouse Settings</h2>
          <Button onClick={()=>setOpen(true)}>+ Add Warehouse</Button>
        </div>

        <Table>
        <TableHeader>
          <tr>
            <TableHead>Name</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Manager</TableHead>
            <TableHead>Total Staff</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </tr>
        </TableHeader>
        <TableBody>
          {warehouses.map(w=> (
            <TableRow key={w.id}>
              <TableCell>{w.name}</TableCell>
              <TableCell>{w.location}</TableCell>
              <TableCell>{w.manager || '—'}</TableCell>
              <TableCell>{w.staffCount ?? 0}</TableCell>
              <TableCell>{w.status === 'active' ? 'Active' : 'Inactive'}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={()=>{ setEditing(w); setOpen(true); }}>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={()=>handleDelete(w)}>Delete</Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        </Table>

        <WarehouseForm open={open} initial={editing} onClose={()=>{ setOpen(false); setEditing(null); }} onSave={handleSave} managers={managers} />
      </div>
    </MainLayout>
  );
}
