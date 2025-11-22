import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type User = any;

export default function UserTable({ users = [], warehouses = [], onView, onEdit, onDelete, onToggle }: { users: User[]; warehouses?: any[]; onView: any; onEdit: any; onDelete: any; onToggle: any; }) {
  
  // Helper to find warehouse name
  const getWarehouseName = (id: string) => {
    const wh = warehouses.find(w => w._id === id || w.id === id);
    return wh ? wh.name : id; // Fallback to ID if name not found
  };

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Warehouses</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created On</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
             <TableRow>
               <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">No users found.</TableCell>
             </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Avatar>
                    {u.avatar ? <AvatarImage src={u.avatar} /> : <AvatarFallback>{(u.name || '?').slice(0,2).toUpperCase()}</AvatarFallback>}
                  </Avatar>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">{u.name}</span>
                  </div>
                </TableCell>
                <TableCell>{u.email}</TableCell>
                <TableCell>
                  <Badge variant={u.role === 'Admin' ? 'destructive' : u.role === 'Inventory Manager' ? 'default' : 'secondary'}>
                    {u.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-[200px]">
                    {u.warehouses && u.warehouses.length ? u.warehouses.map((wId: string) => (
                      <span key={wId} className="inline-block bg-muted px-2 py-0.5 rounded-full text-[10px] whitespace-nowrap border">
                        {getWarehouseName(wId)}
                      </span>
                    )) : <small className="text-muted-foreground">—</small>}
                  </div>
                </TableCell>
                <TableCell>
                  {u.status === 'active' ? (
                    <Badge className="bg-green-100 text-green-700 hover:bg-green-200 border-green-200 shadow-none">Active</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-muted-foreground">Inactive</Badge>
                  )}
                </TableCell>
                <TableCell>{u.createdOn ? format(new Date(u.createdOn), 'MMM dd, yyyy') : '-'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit(u)}>Edit</Button>
                    <Button size="sm" variant="secondary" onClick={() => onToggle(u)}>
                        {u.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(u)}>Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}