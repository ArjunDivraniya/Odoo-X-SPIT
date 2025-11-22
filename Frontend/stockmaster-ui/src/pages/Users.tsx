import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, warehousesRes] = await Promise.all([
        api.get('/staff'),
        api.get('/warehouse')
      ]);
      setUsers(usersRes.data);
      setWarehouses(warehousesRes.data);
    } catch (error) {
      console.error("Error loading data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchesQuery = (u.name + u.email).toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    // Check if user is assigned to the selected warehouse ID
    const matchesWH = warehouseFilter ? (Array.isArray(u.warehouses) ? u.warehouses.includes(warehouseFilter) : false) : true;
    return matchesQuery && matchesRole && matchesWH;
  }), [users, query, roleFilter, warehouseFilter]);

  // --- 1. HANDLE SAVE (Create & Edit) ---
  async function handleSave(userData: any) {
    setSaving(true);
    try {
      if (editing) {
        // Edit Mode: PUT request
        const res = await api.put(`/staff/${editing.id}`, userData);
        // Update local state with response from backend
        setUsers(prev => prev.map(u => u.id === editing.id ? res.data.user : u));
        toast({ title: 'User updated successfully' });
      } else {
        // Create Mode: POST request
        const res = await api.post('/staff/create', userData);
        setUsers(prev => [res.data.user, ...prev]);
        toast({ title: 'User created successfully' });
      }
      setOpenForm(false);
      setEditing(null);
    } catch (error: any) {
      console.error(error);
      toast({ variant: "destructive", title: "Error", description: error.response?.data?.message || "Operation failed" });
    } finally {
      setSaving(false);
    }
  }

  // --- 2. HANDLE DELETE ---
  async function handleDelete(user: any) {
    if (!confirm(`Delete user ${user.name}?`)) return;
    try {
      await api.delete(`/staff/${user.id}`);
      setUsers(prev => prev.filter(u => u.id !== user.id));
      toast({ title: 'User deleted' });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting user" });
    }
  }

  // --- 3. HANDLE TOGGLE STATUS ---
  async function handleToggle(user: any) {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    try {
      await api.put(`/staff/${user.id}`, { status: newStatus });
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, status: newStatus } : u));
      toast({ title: `User ${newStatus}` });
    } catch (error) {
      toast({ variant: "destructive", title: "Error updating status" });
    }
  }

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <Button onClick={() => { setOpenForm(true); setEditing(null); }}>
            <Plus className="mr-2" /> Add New User
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          <input className="input h-10 w-full rounded-md border bg-background px-3" placeholder="Search users..." value={query} onChange={e => setQuery(e.target.value)} />
          
          <select className="input h-10 w-full rounded-md border bg-background px-3" value={roleFilter} onChange={(e)=>setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Inventory Manager">Inventory Manager</option>
            <option value="Warehouse Staff">Warehouse Staff</option>
          </select>

          <select className="input h-10 w-full rounded-md border bg-background px-3" value={warehouseFilter} onChange={(e)=>setWarehouseFilter(e.target.value)}>
            <option value="">All Warehouses</option>
            {warehouses.map(w => <option key={w._id} value={w._id}>{w.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center"><Loader2 className="animate-spin" /></div>
        ) : (
          <UserTable 
            users={filtered} 
            // Pass warehouses map to show names instead of IDs
            warehouses={warehouses}
            onView={(u:any)=> console.log(u)} 
            onEdit={(u:any)=>{ setEditing(u); setOpenForm(true); }} 
            onDelete={handleDelete}
            onToggle={handleToggle}
          />
        )}

        <UserForm 
          open={openForm} 
          onClose={() => { setOpenForm(false); setEditing(null); }} 
          onSave={handleSave} 
          initial={editing} 
          availableWarehouses={warehouses}
          saving={saving}
        />
      </div>
    </MainLayout>
  );
}