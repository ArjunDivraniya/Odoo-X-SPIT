import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';

export default function AboutSettings(){
  return (
    <MainLayout>
      <div className="p-6">
        <nav className="text-sm text-muted-foreground">Settings › About</nav>
        <h2 className="text-2xl font-semibold mt-2">About StockMaster</h2>

        <div className="mt-4 max-w-2xl space-y-3">
          <div className="p-4 border rounded">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">StockMaster</h3>
                <p className="text-sm text-muted-foreground">Multi-Warehouse Inventory Management System</p>
              </div>
              <div className="text-right">
                <div className="font-medium">v1.0.0</div>
                <div className="text-sm text-muted-foreground">Last updated: 2025-11-22</div>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Support</h4>
            <p className="text-sm text-muted-foreground">Contact: support@example.com</p>
          </div>

          <div className="p-4 border rounded">
            <h4 className="font-medium">Legal</h4>
            <div className="flex gap-3 mt-2">
              <a className="text-primary">Terms</a>
              <a className="text-primary">Privacy</a>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
