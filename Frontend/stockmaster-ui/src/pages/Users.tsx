import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import { mockWarehouses } from '@/lib/mockData';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false); // Loading state for saving
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  // 1. Fetch Real Users from Backend
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/staff');
      setUsers(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load users." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchesQuery = (u.name + u.email).toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    // Handle warehouse filter (ensure u.warehouses is an array)
    const matchesWH = warehouseFilter ? (Array.isArray(u.warehouses) ? u.warehouses.includes(warehouseFilter) : false) : true;
    return matchesQuery && matchesRole && matchesWH;
  }), [users, query, roleFilter, warehouseFilter]);

  // 2. Handle Create / Update via API
  async function handleSave(userData: any) {
    setSaving(true);
    try {
      if (editing) {
        // NOTE: You need to implement /update endpoint in backend for this to work
        // For now, we mock the update in UI or show a message
        toast({ title: "Update Not Implemented", description: "Backend update endpoint is pending." });
        
        // Optimistic update for demo
        setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...userData } : u));
      } else {
        // CREATE USER - Call the new backend endpoint
        const res = await api.post('/staff/create', userData);
        
        // Add the new user returned from backend to the list
        setUsers(prev => [res.data.user, ...prev]);
        
        toast({ 
          title: 'User created', 
          description: 'Credentials have been sent to the user via email.' 
        });
      }
      setOpenForm(false); 
      setEditing(null);
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ 
        variant: "destructive", 
        title: "Operation Failed", 
        description: error.response?.data?.message || "Could not save user." 
      });
    } finally {
      setSaving(false);
    }
  }

  // 3. Handle Delete (Optional - needs backend endpoint)
  async function handleDelete(u: any) {
    if (!confirm('Are you sure? This will delete the user.')) return;
    
    // Optimistic delete for now
    setUsers(prev => prev.filter(p => p.id !== u.id));
    toast({ title: 'User deleted (Local Only)' });
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
        <select className="input h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
          <option value="">All roles</option>
          <option>Admin</option>
          <option>Inventory Manager</option>
          <option>Warehouse Staff</option>
          <option>Picker</option>
        </select>
        <select className="input h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={warehouseFilter} onChange={(e)=>setWarehouseFilter(e.target.value)}>
          <option value="">All warehouses</option>
          {mockWarehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="p-12 flex justify-center items-center text-muted-foreground">
           <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading users...
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-lg">No users found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters or add a new user.</p>
        </div>
      ) : (
        <UserTable users={filtered} onView={(u:any)=>window.location.href=`/users/${u.id}`} onEdit={(u:any)=>{setEditing(u); setOpenForm(true);}} onDelete={handleDelete} onToggle={handleToggle} />
      )}

      {/* Pass loading state if you update UserForm to support it, otherwise user just waits */}
      <UserForm 
        open={openForm} 
        onClose={() => { setOpenForm(false); setEditing(null); }} 
        onSave={handleSave} 
        initial={editing} 
      />
      </div>
    </MainLayout>
  );
}