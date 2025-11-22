import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function NotificationSettings(){
  const [lowStockApp, setLowStockApp] = useState(true);
  const [lowStockEmail, setLowStockEmail] = useState(false);
  const [receiptApp, setReceiptApp] = useState(true);
  const [receiptEmail, setReceiptEmail] = useState(true);
  const { toast } = useToast();

  function save(){
    toast({ title: 'Saved successfully' });
  }

  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › Notification Settings</nav>
        <h2 className="text-2xl font-semibold mt-2">Notification Settings</h2>

        <div className="mt-4 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Low stock alerts</div>
            <div className="text-sm text-muted-foreground">Notify when product falls below threshold</div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2"><Switch checked={lowStockApp} onCheckedChange={(v:any)=>setLowStockApp(Boolean(v))} /> <span className="text-sm">In-app</span></div>
            <div className="flex items-center gap-2"><Switch checked={lowStockEmail} onCheckedChange={(v:any)=>setLowStockEmail(Boolean(v))} /> <span className="text-sm">Email</span></div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Receipt validation alerts</div>
            <div className="text-sm text-muted-foreground">Notify when a receipt is ready or validated</div>
          </div>
          <div className="flex gap-3 items-center">
            <div className="flex items-center gap-2"><Switch checked={receiptApp} onCheckedChange={(v:any)=>setReceiptApp(Boolean(v))} /> <span className="text-sm">In-app</span></div>
            <div className="flex items-center gap-2"><Switch checked={receiptEmail} onCheckedChange={(v:any)=>setReceiptEmail(Boolean(v))} /> <span className="text-sm">Email</span></div>
          </div>
        </div>

          <div className="flex gap-2">
            <Button onClick={save}>Save</Button>
            <Button variant="ghost">Cancel</Button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
