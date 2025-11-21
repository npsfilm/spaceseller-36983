import { motion } from "framer-motion";
import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

// Lazy load components
const DashboardStats = lazy(() => import("@/components/dashboard/DashboardStats"));
const QuickActions = lazy(() => import("@/components/dashboard/QuickActions"));
const ActiveOrdersSection = lazy(() => import("@/components/dashboard/ActiveOrdersSection"));
const RecentOrdersTable = lazy(() => import("@/components/dashboard/RecentOrdersTable"));
const OnboardingChecklist = lazy(() => import("@/components/dashboard/OnboardingChecklist"));
const EmptyState = lazy(() => import("@/components/dashboard/EmptyState"));

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
  const { user } = useAuth();

  const { data: orderCount, isLoading } = useQuery({
    queryKey: ['order-count', user?.id],
    queryFn: async () => {
      if (!user) return 0;

      const { count, error } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .neq('status', 'draft');

      if (error) throw error;
      return count || 0;
    },
    enabled: !!user
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  const hasNoOrders = orderCount === 0;
  const isNewUser = orderCount !== undefined && orderCount < 3;

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
              {hasNoOrders 
                ? "Willkommen! Beginnen Sie mit Ihrer ersten Bestellung."
                : "Willkommen zurück! Hier ist ein Überblick über Ihre Aktivitäten."
              }
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

          {/* Conditional Content Based on Order Count */}
          {hasNoOrders ? (
            <>
              {/* Onboarding Checklist */}
              <motion.div variants={fadeInUp}>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <OnboardingChecklist />
                </Suspense>
              </motion.div>

              {/* Empty State */}
              <motion.div variants={fadeInUp}>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <EmptyState />
                </Suspense>
              </motion.div>
            </>
          ) : (
            <>
              {/* Active Orders Section */}
              <motion.div variants={fadeInUp}>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <ActiveOrdersSection />
                </Suspense>
              </motion.div>

              {/* Recent Orders Table */}
              <motion.div variants={fadeInUp}>
                <Suspense fallback={<Skeleton className="h-96 w-full" />}>
                  <RecentOrdersTable />
                </Suspense>
              </motion.div>

              {/* Show Onboarding for New Users */}
              {isNewUser && (
                <motion.div variants={fadeInUp}>
                  <Suspense fallback={<Skeleton className="h-64 w-full" />}>
                    <OnboardingChecklist />
                  </Suspense>
                </motion.div>
              )}
            </>
          )}
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
