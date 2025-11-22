import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword"; // Import new page
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
import ProtectedRoute from './components/ProtectedRoute';

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
          <Route path="/forgot-password" element={<ForgotPassword />} /> {/* New Route */}
          <Route path="/warehouses" element={<ProtectedRoute><Warehouses /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
          <Route path="/products/:id" element={<ProtectedRoute><ProductDetails /></ProtectedRoute>} />
          <Route path="/receipts" element={<ProtectedRoute><Receipts /></ProtectedRoute>} />
          <Route path="/deliveries" element={<ProtectedRoute><Deliveries /></ProtectedRoute>} />
          <Route path="/transfers" element={<ProtectedRoute><Transfers /></ProtectedRoute>} />
          <Route path="/adjustments" element={<ProtectedRoute allowedRoles={["admin", "inventory manager", "warehouse staff"]}><Adjustments /></ProtectedRoute>} />
          <Route path="/users" element={<ProtectedRoute allowedRoles={["admin"]}><Users /></ProtectedRoute>} />
          <Route path="/users/:id" element={<ProtectedRoute allowedRoles={["admin"]}><UserDetails /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute allowedRoles={["admin"]}><SettingsHome /></ProtectedRoute>} />
          <Route path="/settings/account" element={<ProtectedRoute allowedRoles={["admin"]}><AccountSettings /></ProtectedRoute>} />
          <Route path="/settings/warehouses" element={<ProtectedRoute allowedRoles={["admin"]}><WarehouseSettings /></ProtectedRoute>} />
          <Route path="/settings/roles" element={<ProtectedRoute allowedRoles={["admin"]}><RolePermissions /></ProtectedRoute>} />
          <Route path="/settings/system" element={<ProtectedRoute allowedRoles={["admin"]}><SystemPreferences /></ProtectedRoute>} />
          <Route path="/settings/notifications" element={<ProtectedRoute allowedRoles={["admin"]}><NotificationSettings /></ProtectedRoute>} />
          <Route path="/settings/security" element={<ProtectedRoute allowedRoles={["admin"]}><SecuritySettings /></ProtectedRoute>} />
          <Route path="/settings/about" element={<ProtectedRoute allowedRoles={["admin"]}><AboutSettings /></ProtectedRoute>} />
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