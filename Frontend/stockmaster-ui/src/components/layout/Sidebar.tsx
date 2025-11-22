import { useState, useEffect } from 'react';
import { NavLink } from '@/components/NavLink';
import { 
  LayoutDashboard, 
  Package, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  ArrowLeftRight, 
  Settings, 
  FileText, 
  BarChart3,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load user data
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user data in Sidebar");
      }
    }
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'JD';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const menuItems = [
    { title: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { title: 'Products', icon: Package, path: '/products' },
    { title: 'Receipts', icon: ArrowDownToLine, path: '/receipts' },
    { title: 'Deliveries', icon: ArrowUpFromLine, path: '/deliveries' },
    { title: 'Transfers', icon: ArrowLeftRight, path: '/transfers' },
    { title: 'Adjustments', icon: Settings, path: '/adjustments' },
    { title: 'Movement Ledger', icon: FileText, path: '/movements' },
    { title: 'Analytics', icon: BarChart3, path: '/analytics' },
  ];

  // Normalize role and control menu visibility
  const role = user?.role ? String(user.role).toLowerCase() : null;

  // Admin: full access (Users + Settings)
  if (role === 'admin') {
    if (!menuItems.find(i => i.title === 'Users')) {
      menuItems.splice(2, 0, { title: 'Users', icon: User, path: '/users' });
    }
    if (!menuItems.find(i => i.title === 'Settings')) {
      menuItems.splice(8, 0, { title: 'Settings', icon: Settings, path: '/settings' });
    }
  }

  // Inventory Manager: remove Users & Settings but keep Analytics
  if (role === 'inventory manager') {
    // do nothing here; default menu already contains analytics and inventory items
  }

  // Warehouse Staff & Picker: hide Analytics
  if (role === 'warehouse staff' || role === 'picker') {
    // remove Analytics from menu
    const idx = menuItems.findIndex(i => i.title === 'Analytics');
    if (idx >= 0) menuItems.splice(idx, 1);
  }

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border transition-all duration-300 z-40",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-sidebar-border">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Warehouse className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">StockMaster</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-sidebar-foreground hover:bg-sidebar-accent"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="p-2 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent transition-colors",
              collapsed && "justify-center"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span>{item.title}</span>}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      {!collapsed && user && (
        <div className="absolute bottom-4 left-2 right-2 p-3 rounded-lg bg-sidebar-accent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
              {getInitials(user.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">{user.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate capitalize">{user.role}</p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}