import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import { MainLayout } from '@/components/layout/MainLayout';

const items = [
  { title: 'Account Settings', desc: 'Manage profile, password and 2FA', to: '/settings/account' },
  { title: 'Warehouse Settings', desc: 'Configure warehouses, managers and staff', to: '/settings/warehouses' },
  { title: 'Role & Permission Display', desc: 'View role access across modules', to: '/settings/roles' },
  { title: 'System Preferences', desc: 'Default time zone, currency, language', to: '/settings/system' },
  { title: 'Notification Settings', desc: 'Configure alert delivery channels', to: '/settings/notifications' },
  { title: 'Security & Password Policy', desc: 'Password and login policies', to: '/settings/security' },
  { title: 'About / Version', desc: 'Product info, support and legal', to: '/settings/about' },
];

export default function SettingsHome(){
  return (
    <MainLayout>
      <div className="p-6">
      <div className="mb-4">
        <nav className="text-sm text-muted-foreground">Settings › Home</nav>
        <h1 className="text-2xl font-semibold mt-2">Settings</h1>
        <p className="text-sm text-muted-foreground">Configure StockMaster system-level and warehouse-level settings</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(it => (
          <Card key={it.to} className="p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium">{it.title}</h3>
              <p className="text-sm text-muted-foreground">{it.desc}</p>
            </div>
            <Link to={it.to} className="text-primary hover:underline flex items-center gap-2">
              Open <ArrowRight />
            </Link>
          </Card>
        ))}
      </div>
    </div>
    
    </MainLayout>
  )
}


 