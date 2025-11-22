import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

const roles = [
  { role: 'Admin', access: ['All modules'], restricted: [] },
  { role: 'Inventory Manager', access: ['Products','Receipts','Transfers','Analytics'], restricted: ['Settings'] },
  { role: 'Warehouse Staff', access: ['Receipts','Deliveries','Adjustments'], restricted: ['Settings','Users'] },
  { role: 'Picker', access: ['Deliveries'], restricted: ['Products','Settings','Users'] },
];

export default function RolePermissions(){
  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › Role & Permission</nav>
        <h2 className="text-2xl font-semibold mt-2">Role & Permission Display</h2>

        <div className="grid gap-4 mt-4">
          {roles.map(r=> (
            <Card key={r.role} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{r.role} <span className="ml-2"><Badge>{r.role}</Badge></span></h3>
                  <p className="text-sm text-muted-foreground mt-1">Accessible Modules:</p>
                  <div className="mt-2 flex gap-2 flex-wrap">{r.access.map((a:any)=><span key={a} className="inline-block bg-muted px-2 py-0.5 rounded">{a}</span>)}</div>
                  <p className="text-sm text-muted-foreground mt-2">Restricted Modules:</p>
                  <div className="mt-2 flex gap-2 flex-wrap">{r.restricted.length ? r.restricted.map((a:any)=><span key={a} className="inline-block bg-red-50 text-red-600 px-2 py-0.5 rounded">{a}</span>) : <span className="text-muted-foreground">None</span>}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
