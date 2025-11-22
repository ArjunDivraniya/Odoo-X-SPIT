import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, Download } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import { mockUsers, mockWarehouses } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // simulate loading
    setLoading(true);
    setTimeout(() => { setUsers(mockUsers); setLoading(false); }, 600);
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchesQuery = (u.name + u.email).toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesWH = warehouseFilter ? (u.warehouses || []).includes(warehouseFilter) : true;
    return matchesQuery && matchesRole && matchesWH;
  }), [users, query, roleFilter, warehouseFilter]);

  function handleSave(newUser: any) {
    if (editing) {
      setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...newUser } : u));
      toast({ title: 'User updated', description: 'User details saved successfully.' });
    } else {
      const created = { ...newUser, id: `U${Math.floor(Math.random()*10000)}`, createdOn: new Date().toISOString(), avatar: 'https://i.pravatar.cc/150?img=50' };
      setUsers(prev => [created, ...prev]);
      toast({ title: 'User added', description: 'New user created successfully.' });
    }
    setOpenForm(false); setEditing(null);
  }

  function handleDelete(u: any) {
    if (!confirm('Are you sure? This will delete the user.')) return;
    setUsers(prev => prev.filter(p => p.id !== u.id));
    toast({ title: 'User deleted' });
  }

  function handleToggle(u: any) {
    setUsers(prev => prev.map(p => p.id === u.id ? { ...p, status: p.status === 'active' ? 'inactive' : 'active' } : p));
    toast({ title: 'Status updated' });
  }

  function handleExport() {
    const csv = [
      ['ID','Name','Email','Role','Warehouses','Status','CreatedOn'],
      ...users.map(u => [u.id, u.name, u.email, u.role, (u.warehouses||[]).join('|'), u.status, u.createdOn])
    ].map(r => r.map(c => `"${String(c||'').replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'users.csv';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <MainLayout>
      <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">User Management</h2>
        <div className="flex gap-2">
          <Button onClick={() => { setOpenForm(true); setEditing(null); }}>
            <Plus className="mr-2" /> Add New User
          </Button>
          <Button variant="outline" onClick={handleExport}><Download className="mr-2" />Export CSV</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <Input placeholder="Search by name or email" value={query} onChange={(e:any)=>setQuery(e.target.value)} />
        <select className="input" value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option>Admin</option>
          <option>Inventory Manager</option>
          <option>Warehouse Staff</option>
          <option>Picker</option>
        </select>
        <select className="input" value={warehouseFilter} onChange={(e)=>setWarehouseFilter(e.target.value)}>
          <option value="">All warehouses</option>
          {mockWarehouses.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="p-6 text-center text-muted-foreground">Loading users...</div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-lg">No users found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new user.</p>
        </div>
      ) : (
        <UserTable users={filtered} onView={(u:any)=>window.location.href=`/users/${u.id}`} onEdit={(u:any)=>{setEditing(u); setOpenForm(true);}} onDelete={handleDelete} onToggle={handleToggle} />
      )}

      <UserForm open={openForm} onClose={() => { setOpenForm(false); setEditing(null); }} onSave={handleSave} initial={editing} />
      </div>
    </MainLayout>
  );
}
