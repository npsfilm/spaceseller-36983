import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Impressum from "./pages/Impressum";
import Datenschutz from "./pages/Datenschutz";
import AGB from "./pages/AGB";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Order from "./pages/Order";
import OrderConfirmation from "./pages/OrderConfirmation";
import MyOrders from "./pages/MyOrders";
import ClientOrderDetail from "./pages/client/OrderDetail";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";
import OrderDetail from "./pages/admin/OrderDetail";
import PhotographerManagement from "./pages/admin/PhotographerManagement";
import PhotographerLocations from "./pages/admin/PhotographerLocations";
import PhotographerReliability from "./pages/admin/PhotographerReliability";
import UserRoleManagement from "./pages/admin/UserRoleManagement";
import SecurityMonitor from "./pages/admin/SecurityMonitor";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import Dashboard from "./pages/Dashboard";
import ResetPassword from "./pages/ResetPassword";
import PhotographerSettings from "./pages/PhotographerSettings";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/onboarding" element={<Onboarding />} />
            <Route path="/dashboard" element={<ProtectedRoute requireOnboarding requireClient><Dashboard /></ProtectedRoute>} />
            <Route path="/order" element={<ProtectedRoute requireOnboarding requireClient><Order /></ProtectedRoute>} />
            <Route path="/order/confirmation/:orderId" element={<ProtectedRoute requireOnboarding requireClient><OrderConfirmation /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute requireOnboarding requireClient><MyOrders /></ProtectedRoute>} />
            <Route path="/orders/:orderId" element={<ProtectedRoute requireOnboarding requireClient><ClientOrderDetail /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute requireOnboarding><Settings /></ProtectedRoute>} />
            <Route path="/admin-backend" element={<ProtectedRoute requireOnboarding requireAdmin><Admin /></ProtectedRoute>} />
            <Route path="/admin-backend/orders/:orderId" element={<ProtectedRoute requireOnboarding requireAdmin><OrderDetail /></ProtectedRoute>} />
            <Route path="/admin-backend/photographers" element={<ProtectedRoute requireOnboarding requireAdmin><PhotographerManagement /></ProtectedRoute>} />
            <Route path="/admin-backend/reliability" element={<ProtectedRoute requireOnboarding requireAdmin><PhotographerReliability /></ProtectedRoute>} />
            <Route path="/admin-backend/locations" element={<ProtectedRoute requireOnboarding requireAdmin><PhotographerLocations /></ProtectedRoute>} />
            <Route path="/admin-backend/users" element={<ProtectedRoute requireOnboarding requireAdmin><UserRoleManagement /></ProtectedRoute>} />
            <Route path="/admin-backend/security" element={<ProtectedRoute requireOnboarding requireAdmin><SecurityMonitor /></ProtectedRoute>} />
            <Route path="/freelancer-dashboard" element={<ProtectedRoute requireOnboarding requirePhotographer><FreelancerDashboard /></ProtectedRoute>} />
            <Route path="/photographer-settings" element={<ProtectedRoute requireOnboarding requirePhotographer><PhotographerSettings /></ProtectedRoute>} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/agb" element={<AGB />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
