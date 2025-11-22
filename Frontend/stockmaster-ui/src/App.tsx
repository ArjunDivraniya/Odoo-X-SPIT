import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Warehouses from "./pages/Warehouses";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetails from "./pages/ProductDetails";
import Receipts from "./pages/Receipts";
import Deliveries from "./pages/Deliveries";
import Transfers from "./pages/Transfers";
import Adjustments from "./pages/Adjustments";
import Movements from "./pages/Movements";
import Analytics from "./pages/Analytics";
import Users from "./pages/Users";
import UserDetails from "./pages/UserDetails";
import SettingsHome from './pages/Settings/Home';
import AccountSettings from './pages/Settings/Account';
import WarehouseSettings from './pages/Settings/Warehouses';
import RolePermissions from './pages/Settings/Roles';
import SystemPreferences from './pages/Settings/System';
import NotificationSettings from './pages/Settings/Notifications';
import SecuritySettings from './pages/Settings/Security';
import AboutSettings from './pages/Settings/About';
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/warehouses" element={<Warehouses />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/receipts" element={<Receipts />} />
          <Route path="/deliveries" element={<Deliveries />} />
          <Route path="/transfers" element={<Transfers />} />
          <Route path="/adjustments" element={<Adjustments />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<UserDetails />} />
            <Route path="/settings" element={<SettingsHome />} />
            <Route path="/settings/account" element={<AccountSettings />} />
            <Route path="/settings/warehouses" element={<WarehouseSettings />} />
            <Route path="/settings/roles" element={<RolePermissions />} />
            <Route path="/settings/system" element={<SystemPreferences />} />
            <Route path="/settings/notifications" element={<NotificationSettings />} />
            <Route path="/settings/security" element={<SecuritySettings />} />
            <Route path="/settings/about" element={<AboutSettings />} />
          <Route path="/movements" element={<Movements />} />
          <Route path="/analytics" element={<Analytics />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
