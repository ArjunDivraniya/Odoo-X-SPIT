import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { mockUsers, mockWarehouses } from '@/lib/mockData';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MainLayout } from '@/components/layout/MainLayout';

export default function UserDetails(){
  const { id } = useParams();
  const navigate = useNavigate();
  const user = mockUsers.find(u => u.id === id);
  if (!user) return (
    <MainLayout>
      <div className="p-6">User not found</div>
    </MainLayout>
  );

  return (
    <MainLayout>
      <div className="p-6">
        <div className="flex items-center gap-4">
          <Avatar className="w-20 h-20">
            {user.avatar ? <AvatarImage src={user.avatar} /> : <AvatarFallback>{user.name.slice(0,2)}</AvatarFallback>}
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{user.name} <span className="ml-2"><Badge>{user.role}</Badge></span></h2>
            <p className="text-muted-foreground">{user.email} • {user.phone || '—'}</p>
            <p className={`mt-2 ${user.status==='active'?'text-green-600':'text-red-600'}`}>{user.status === 'active' ? 'Active' : 'Inactive'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium">Assigned Warehouses</h3>
          <div className="flex gap-2 mt-2">
            {user.warehouses.length ? user.warehouses.map((w:string)=>{
              const wh = mockWarehouses.find(m=>m.id===w);
              return <span key={w} className="inline-block bg-muted px-3 py-1 rounded-full">{wh ? wh.name : w}</span>;
            }) : <p className="text-muted-foreground">No warehouses assigned</p>}
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-medium">Recent Activities</h3>
          <ul className="mt-2 space-y-2">
            {user.activities && user.activities.length ? user.activities.map((a:any)=> (
              <li key={a.id} className="p-3 border rounded">{a.label} <div className="text-xs text-muted-foreground">{a.date}</div></li>
            )) : <p className="text-muted-foreground">No recent activity</p>}
          </ul>
        </div>

        <div className="mt-6 flex gap-2">
          <Button onClick={()=>navigate(`/users`)}>Back</Button>
          <Button variant="outline">Edit User</Button>
          <Button variant="destructive">Disable User</Button>
        </div>
      </div>
    </MainLayout>
  );
}
