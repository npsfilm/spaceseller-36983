import { Helmet } from 'react-helmet-async';
import { Layout } from '@/components/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { AdminStatsCards } from '@/components/admin/AdminStatsCards';
import { OrderFilters } from '@/components/admin/OrderFilters';
import { AdminOrdersTable } from '@/components/admin/AdminOrdersTable';
import { useAdminOrders } from '@/lib/hooks/useAdminOrders';

export default function Admin() {
  const {
    filteredOrders,
    stats,
    loading,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
  } = useAdminOrders();

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="googlebot" content="noindex, nofollow" />
        <title>Admin Dashboard - spaceseller</title>
      </Helmet>

      <div>
        <AdminStatsCards stats={stats} />

        <OrderFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />

        <AdminOrdersTable orders={filteredOrders} />
      </div>
    </AdminLayout>
  );
}
