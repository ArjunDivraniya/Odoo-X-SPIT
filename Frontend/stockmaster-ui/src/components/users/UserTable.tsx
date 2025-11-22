import React from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';

type User = any;

export default function UserTable({ users = [], onView, onEdit, onDelete, onToggle }: { users: User[]; onView: any; onEdit: any; onDelete: any; onToggle: any; }) {
  return (
    <Table>
      <TableHeader>
        <tr>
          <TableHead>Avatar</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Warehouses</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created On</TableHead>
          <TableHead>Actions</TableHead>
        </tr>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell>
              <div className="flex items-center gap-2">
                <Avatar>
                  {u.avatar ? <AvatarImage src={u.avatar} /> : <AvatarFallback>{(u.name || '?').slice(0,2)}</AvatarFallback>}
                </Avatar>
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="font-medium">{u.name}</span>
                <small className="text-muted-foreground">{u.id}</small>
              </div>
            </TableCell>
            <TableCell>{u.email}</TableCell>
            <TableCell>
              <Badge variant={u.role === 'Admin' ? 'destructive' : u.role === 'Inventory Manager' ? 'default' : u.role === 'Warehouse Staff' ? 'secondary' : 'outline'}>
                {u.role}
              </Badge>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {u.warehouses && u.warehouses.length ? u.warehouses.map((w: string) => (
                  <span key={w} className="inline-block bg-muted px-2 py-0.5 rounded-full text-xs">{w}</span>
                )) : <small className="text-muted-foreground">—</small>}
              </div>
            </TableCell>
            <TableCell>
              {u.status === 'active' ? (
                <span className="inline-flex items-center gap-2 text-green-600 font-semibold">● Active</span>
              ) : (
                <span className="inline-flex items-center gap-2 text-red-600 font-semibold">● Inactive</span>
              )}
            </TableCell>
            <TableCell>{format(new Date(u.createdOn), 'yyyy-MM-dd')}</TableCell>
            <TableCell>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => onView(u)}>View</Button>
                <Button size="sm" variant="outline" onClick={() => onEdit(u)}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => onDelete(u)}>Delete</Button>
                <Button size="sm" onClick={() => onToggle(u)}>{u.status === 'active' ? 'Disable' : 'Enable'}</Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
