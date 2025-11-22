import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SystemPreferences(){
  const [tz, setTz] = useState('UTC');
  const [currency, setCurrency] = useState('USD');
  const [threshold, setThreshold] = useState(10);
  const [autoLogout, setAutoLogout] = useState(30);
  const [language, setLanguage] = useState('English');
  const { toast } = useToast();

  function save(){
    toast({ title: 'Saved successfully' });
  }

  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › System Preferences</nav>
        <h2 className="text-2xl font-semibold mt-2">System Preferences</h2>

        <div className="mt-4 max-w-2xl space-y-4">
        <div>
          <label className="text-sm">Default time zone</label>
          <Select onValueChange={(v:any)=>setTz(v)}>
            <SelectTrigger><SelectValue placeholder={tz} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">America/New_York</SelectItem>
              <SelectItem value="Asia/Kolkata">Asia/Kolkata</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm">Default currency / unit system</label>
          <Select onValueChange={(v:any)=>setCurrency(v)}>
            <SelectTrigger><SelectValue placeholder={currency} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="EUR">EUR</SelectItem>
              <SelectItem value="INR">INR</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm">Auto-stock alert threshold</label>
          <Input type="number" value={String(threshold)} onChange={(e:any)=>setThreshold(Number(e.target.value))} />
        </div>

        <div>
          <label className="text-sm">Auto-logout duration (minutes)</label>
          <Input type="number" value={String(autoLogout)} onChange={(e:any)=>setAutoLogout(Number(e.target.value))} />
        </div>

        <div>
          <label className="text-sm">Language</label>
          <Select onValueChange={(v:any)=>setLanguage(v)}>
            <SelectTrigger><SelectValue placeholder={language} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
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
