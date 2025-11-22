import React, { useEffect, useMemo, useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Plus, Download, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import UserTable from '@/components/users/UserTable';
import UserForm from '@/components/users/UserForm';
import { useToast } from '@/hooks/use-toast';
import api from '@/lib/api';

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  // Add state for warehouses
  const [warehouses, setWarehouses] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [warehouseFilter, setWarehouseFilter] = useState('');
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const { toast } = useToast();

  // Fetch Users AND Warehouses
  const fetchData = async () => {
    setLoading(true);
    try {
      // Run both requests in parallel
      const [usersRes, warehousesRes] = await Promise.all([
        api.get('/staff'),
        api.get('/warehouse') // Use the existing warehouse route
      ]);

      setUsers(usersRes.data);
      setWarehouses(warehousesRes.data); // Store the real warehouses
    } catch (error) {
      console.error("Failed to fetch data", error);
      toast({ variant: "destructive", title: "Error", description: "Failed to load data." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => users.filter(u => {
    const matchesQuery = (u.name + u.email).toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    const matchesWH = warehouseFilter ? (Array.isArray(u.warehouses) ? u.warehouses.includes(warehouseFilter) : false) : true;
    return matchesQuery && matchesRole && matchesWH;
  }), [users, query, roleFilter, warehouseFilter]);

  async function handleSave(userData: any) {
    setSaving(true);
    try {
      if (editing) {
        toast({ title: "Update Not Implemented", description: "Backend update endpoint is pending." });
        // Optimistic update
        setUsers(prev => prev.map(u => u.id === editing.id ? { ...u, ...userData } : u));
      } else {
        const res = await api.post('/staff/create', userData);
        setUsers(prev => [res.data.user, ...prev]);
        toast({ title: 'User created', description: 'Credentials sent via email.' });
      }
      setOpenForm(false); 
      setEditing(null);
    } catch (error: any) {
      console.error("Save error:", error);
      toast({ variant: "destructive", title: "Operation Failed", description: error.response?.data?.message || "Could not save user." });
    } finally {
      setSaving(false);
    }
  }

  // ... (handleDelete, handleToggle, handleExport functions remain the same) ...

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <div className="flex gap-2">
            <Button onClick={() => { setOpenForm(true); setEditing(null); }}>
              <Plus className="mr-2" /> Add New User
            </Button>
            {/* ... Export button ... */}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
          {/* ... Filters ... */}
          <select className="input h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={warehouseFilter} onChange={(e)=>setWarehouseFilter(e.target.value)}>
            <option value="">All warehouses</option>
            {/* Update filter dropdown to use real warehouses too */}
            {warehouses.map(w => <option key={w._id} value={w.name}>{w.name}</option>)}
          </select>
        </div>

        {loading ? (
          <div className="p-12 flex justify-center items-center text-muted-foreground">
             <Loader2 className="mr-2 h-6 w-6 animate-spin" /> Loading...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-lg">No users found</p>
          </div>
        ) : (
          <UserTable 
            users={filtered} 
            // ... props ... 
            onView={(u:any)=>window.location.href=`/users/${u.id}`} 
            onEdit={(u:any)=>{setEditing(u); setOpenForm(true);}} 
            onDelete={() => {}} // Pass handleDelete here
            onToggle={() => {}} // Pass handleToggle here
          />
        )}

        {/* PASS THE REAL WAREHOUSES HERE */}
        <UserForm 
          open={openForm} 
          onClose={() => { setOpenForm(false); setEditing(null); }} 
          onSave={handleSave} 
          initial={editing} 
          availableWarehouses={warehouses} // <--- THIS WAS MISSING
          saving={saving}
        />
      </div>
    </MainLayout>
  );
}