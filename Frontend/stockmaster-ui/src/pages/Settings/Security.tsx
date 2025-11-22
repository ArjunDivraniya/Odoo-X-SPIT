import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SecuritySettings(){
  const [enforceStrong, setEnforceStrong] = useState(true);
  const [expiry, setExpiry] = useState(90);
  const [concurrent, setConcurrent] = useState(false);
  const [lockout, setLockout] = useState(5);
  const { toast } = useToast();

  function save(){
    toast({ title: 'Security settings saved' });
  }

  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › Security</nav>
        <h2 className="text-2xl font-semibold mt-2">Security & Password Policy</h2>

        <div className="mt-4 max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Enforce strong password</div>
            <div className="text-sm text-muted-foreground">Require complexity rules</div>
          </div>
          <Switch checked={enforceStrong} onCheckedChange={(v:any)=>setEnforceStrong(Boolean(v))} />
        </div>

        <div>
          <label className="text-sm">Password expiry (days)</label>
          <Input type="number" value={String(expiry)} onChange={(e:any)=>setExpiry(Number(e.target.value))} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Allow concurrent logins</div>
            <div className="text-sm text-muted-foreground">Enable multiple sessions per user</div>
          </div>
          <Switch checked={concurrent} onCheckedChange={(v:any)=>setConcurrent(Boolean(v))} />
        </div>

        <div>
          <label className="text-sm">Login attempt lockout threshold</label>
          <Select onValueChange={(v:any)=>setLockout(Number(v))}>
            <SelectTrigger><SelectValue placeholder={String(lockout)} /></SelectTrigger>
            <SelectContent>
              <SelectItem value={3}>3</SelectItem>
              <SelectItem value={5}>5</SelectItem>
              <SelectItem value={10}>10</SelectItem>
            </SelectContent>
          </Select>
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
