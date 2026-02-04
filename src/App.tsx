import React, { Suspense, lazy } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { SiteSettingsProvider } from "./contexts/SiteSettingsContext";
import { DynamicSeoHead } from "./components/seo/DynamicSeoHead";
import { PageSkeleton } from "./components/ui/PageSkeleton";
import { ProtectedRoute } from "./components/ProtectedRoute";

// Critical path - loaded synchronously for fastest initial render
import Home from "./pages/Home";
import Auth from "./pages/Auth";

// Lazy-loaded routes - split by user journey
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Order = lazy(() => import("./pages/Order"));
const OrderConfirmation = lazy(() => import("./pages/OrderConfirmation"));
const MyOrders = lazy(() => import("./pages/MyOrders"));
const ClientOrderDetail = lazy(() => import("./pages/client/OrderDetail"));
const Settings = lazy(() => import("./pages/Settings"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Onboarding = lazy(() => import("./pages/Onboarding"));

// Admin routes - grouped for code splitting
const Admin = lazy(() => import("./pages/Admin"));
const AdminOrderDetail = lazy(() => import("./pages/admin/OrderDetail"));
const PhotographerManagement = lazy(() => import("./pages/admin/PhotographerManagement"));
const PhotographerLocations = lazy(() => import("./pages/admin/PhotographerLocations"));
const PhotographerReliability = lazy(() => import("./pages/admin/PhotographerReliability"));
const UserRoleManagement = lazy(() => import("./pages/admin/UserRoleManagement"));
const SecurityMonitor = lazy(() => import("./pages/admin/SecurityMonitor"));
const PageOverview = lazy(() => import("./pages/admin/PageOverview"));
const WebsiteSettings = lazy(() => import("./pages/admin/WebsiteSettings"));

// Freelancer routes
const FreelancerDashboard = lazy(() => import("./pages/FreelancerDashboard"));

// Legal pages - low priority, rarely accessed
const Impressum = lazy(() => import("./pages/Impressum"));
const Datenschutz = lazy(() => import("./pages/Datenschutz"));
const AGB = lazy(() => import("./pages/AGB"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds default
      gcTime: 5 * 60 * 1000, // 5 minutes default
      retry: 3,
      refetchOnWindowFocus: true,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <SiteSettingsProvider>
          <TooltipProvider>
            <DynamicSeoHead />
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes - synchronous */}
              <Route path="/" element={<Home />} />
              <Route path="/auth" element={<Auth />} />

              {/* Public routes - lazy loaded */}
              <Route path="/reset-password" element={
                <Suspense fallback={<PageSkeleton variant="form" />}>
                  <ResetPassword />
                </Suspense>
              } />
              <Route path="/onboarding" element={
                <Suspense fallback={<PageSkeleton variant="form" />}>
                  <Onboarding />
                </Suspense>
              } />

              {/* Client routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireOnboarding requireClient>
                  <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                    <Dashboard />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/order" element={
                <ProtectedRoute requireOnboarding requireClient>
                  <Suspense fallback={<PageSkeleton />}>
                    <Order />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/order/confirmation/:orderId" element={
                <ProtectedRoute requireOnboarding requireClient>
                  <Suspense fallback={<PageSkeleton />}>
                    <OrderConfirmation />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/my-orders" element={
                <ProtectedRoute requireOnboarding requireClient>
                  <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                    <MyOrders />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/orders/:orderId" element={
                <ProtectedRoute requireOnboarding requireClient>
                  <Suspense fallback={<PageSkeleton />}>
                    <ClientOrderDetail />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* Shared authenticated routes */}
              <Route path="/settings" element={
                <ProtectedRoute requireOnboarding>
                  <Suspense fallback={<PageSkeleton variant="form" />}>
                    <Settings />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* Admin routes */}
              <Route path="/admin-backend" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <Admin />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/orders/:orderId" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <AdminOrderDetail />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/photographers" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <PhotographerManagement />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/reliability" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <PhotographerReliability />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/locations" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <PhotographerLocations />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/users" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <UserRoleManagement />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/security" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <SecurityMonitor />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/uebersicht" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <PageOverview />
                  </Suspense>
                </ProtectedRoute>
              } />
              <Route path="/admin-backend/website-settings" element={
                <ProtectedRoute requireOnboarding requireAdmin>
                  <Suspense fallback={<PageSkeleton variant="admin" />}>
                    <WebsiteSettings />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* Freelancer routes */}
              <Route path="/freelancer-dashboard" element={
                <ProtectedRoute requireOnboarding requirePhotographer>
                  <Suspense fallback={<PageSkeleton variant="dashboard" />}>
                    <FreelancerDashboard />
                  </Suspense>
                </ProtectedRoute>
              } />

              {/* Legal pages */}
              <Route path="/impressum" element={
                <Suspense fallback={<PageSkeleton />}>
                  <Impressum />
                </Suspense>
              } />
              <Route path="/datenschutz" element={
                <Suspense fallback={<PageSkeleton />}>
                  <Datenschutz />
                </Suspense>
              } />
              <Route path="/agb" element={
                <Suspense fallback={<PageSkeleton />}>
                  <AGB />
                </Suspense>
              } />

              {/* 404 */}
              <Route path="*" element={
                <Suspense fallback={<PageSkeleton />}>
                  <NotFound />
                </Suspense>
              } />
            </Routes>
          </TooltipProvider>
        </SiteSettingsProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
