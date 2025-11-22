import React, { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

export default function AccountSettings(){
  const [profile, setProfile] = useState({ name: 'Alice Johnson', email: 'alice.johnson@example.com', phone: '+1 212-555-0134', role: 'Admin' });
  const [password, setPassword] = useState({ current: '', new: '', confirm: '' });
  const { toast } = useToast();

  function saveProfile(){
    toast({ title: 'Saved successfully', description: 'Profile saved.' });
  }
  function changePassword(){
    if (!password.new || password.new !== password.confirm) { toast({ title: 'Error', description: 'Passwords do not match.' }); return; }
    toast({ title: 'Password changed' });
    setPassword({ current: '', new: '', confirm: '' });
  }

  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › Account</nav>
        <h2 className="text-2xl font-semibold mt-2">Account Settings</h2>

        <Tabs defaultValue="profile" className="mt-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="2fa">Two-Factor Authentication</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-4">
          <div className="flex gap-6">
            <div>
              <Avatar className="w-24 h-24"><AvatarImage src="https://i.pravatar.cc/150?img=32" /><AvatarFallback>AJ</AvatarFallback></Avatar>
            </div>
            <div className="flex-1 space-y-3">
              <div>
                <label className="text-sm">Full name</label>
                <Input value={profile.name} onChange={(e:any)=>setProfile({...profile, name: e.target.value})} />
              </div>
              <div>
                <label className="text-sm">Email</label>
                <Input value={profile.email} disabled />
              </div>
              <div>
                <label className="text-sm">Phone</label>
                <Input value={profile.phone} onChange={(e:any)=>setProfile({...profile, phone: e.target.value})} />
              </div>
              <div className="flex gap-2">
                <Button onClick={saveProfile}>Save changes</Button>
                <Button variant="ghost">Cancel</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="password" className="mt-4">
          <div className="max-w-md space-y-3">
            <div>
              <label className="text-sm">Current password</label>
              <Input type="password" value={password.current} onChange={(e:any)=>setPassword({...password, current: e.target.value})} />
            </div>
            <div>
              <label className="text-sm">New password</label>
              <Input type="password" value={password.new} onChange={(e:any)=>setPassword({...password, new: e.target.value})} />
            </div>
            <div>
              <label className="text-sm">Confirm new password</label>
              <Input type="password" value={password.confirm} onChange={(e:any)=>setPassword({...password, confirm: e.target.value})} />
            </div>
            <Button onClick={changePassword}>Change password</Button>
          </div>
        </TabsContent>

        <TabsContent value="2fa" className="mt-4">
          <p className="text-sm text-muted-foreground">Two-Factor Authentication is currently mocked. You can enable it in a real deployment.</p>
        </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
