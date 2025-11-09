import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedRoute } from "@/components/ProtectedRoute";

// Lazy load heavy components
const DashboardStats = lazy(() => import("@/components/dashboard/DashboardStats"));
const QuickActions = lazy(() => import("@/components/dashboard/QuickActions"));
const OrderStatusBoard = lazy(() => import("@/components/dashboard/OrderStatusBoard"));
const ActivityFeed = lazy(() => import("@/components/dashboard/ActivityFeed"));
const OrdersOverTimeChart = lazy(() => import("@/components/dashboard/OrdersOverTimeChart"));
const ServiceDistributionChart = lazy(() => import("@/components/dashboard/ServiceDistributionChart"));
const RecentOrdersTable = lazy(() => import("@/components/dashboard/RecentOrdersTable"));

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4 }
};

const DashboardContent = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="space-y-8"
        >
          {/* Header */}
          <motion.div variants={fadeInUp}>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Dashboard
            </h1>
            <p className="text-muted-foreground">
              Willkommen zurück! Hier ist ein Überblick über Ihre Aktivitäten.
            </p>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={fadeInUp}>
            <Suspense fallback={<Skeleton className="h-32 w-full" />}>
              <DashboardStats />
            </Suspense>
          </motion.div>

          {/* Quick Actions */}
          <motion.div variants={fadeInUp}>
            <Suspense fallback={<Skeleton className="h-24 w-full" />}>
              <QuickActions />
            </Suspense>
          </motion.div>

          {/* Order Status Board */}
          <motion.div variants={fadeInUp}>
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <OrderStatusBoard />
            </Suspense>
          </motion.div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div variants={fadeInUp}>
              <Suspense fallback={<Skeleton className="h-80 w-full" />}>
                <OrdersOverTimeChart />
              </Suspense>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Suspense fallback={<Skeleton className="h-80 w-full" />}>
                <ServiceDistributionChart />
              </Suspense>
            </motion.div>
          </div>

          {/* Recent Activity & Orders */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div variants={fadeInUp} className="lg:col-span-2">
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <RecentOrdersTable />
              </Suspense>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                <ActivityFeed />
              </Suspense>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  return (
    <ProtectedRoute requireOnboarding>
      <DashboardContent />
    </ProtectedRoute>
  );
}
