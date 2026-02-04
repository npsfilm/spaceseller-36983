/**
 * Centralized React Query configuration
 * Provides consistent query keys and cache timing across the application
 */

// ============================================================================
// QUERY KEYS
// ============================================================================

export const QUERY_KEYS = {
  // Dashboard
  dashboardStats: (userId: string) => ['dashboard-stats', userId] as const,
  orderCount: (userId: string) => ['order-count', userId] as const,
  userStatus: (userId: string) => ['user-status', userId] as const,

  // Orders
  userOrders: (userId: string) => ['user-orders', userId] as const,
  orderDetail: (orderId: string) => ['order-detail', orderId] as const,
  recentOrders: (userId: string) => ['recent-orders', userId] as const,
  activeOrders: (userId: string) => ['active-orders', userId] as const,

  // Admin
  adminOrders: () => ['admin-orders'] as const,
  adminStats: () => ['admin-stats'] as const,
  photographers: () => ['photographers'] as const,

  // Photographer/Freelancer
  photographerAssignments: (userId: string) => ['photographer-assignments', userId] as const,
  photographerProfile: (userId: string) => ['photographer-profile', userId] as const,
  photographerPerformance: (userId: string) => ['photographer-performance', userId] as const,

  // Profile
  profile: (userId: string) => ['profile', userId] as const,

  // Services (for Order Wizard)
  services: () => ['services'] as const,
  upgrades: () => ['upgrades'] as const,

  // Notifications
  notifications: (userId: string) => ['notifications', userId] as const,

  // Site Settings
  siteSettings: () => ['site-settings'] as const,
  seoSettings: () => ['seo-settings'] as const,
} as const;

// ============================================================================
// STALE TIMES (how long data is considered fresh)
// ============================================================================

export const STALE_TIMES = {
  // Rarely changing data - cache for longer
  profile: 5 * 60 * 1000, // 5 minutes
  services: 10 * 60 * 1000, // 10 minutes
  siteSettings: 10 * 60 * 1000, // 10 minutes

  // Moderate frequency
  dashboardStats: 60 * 1000, // 1 minute
  photographerProfile: 2 * 60 * 1000, // 2 minutes

  // Frequently changing - shorter cache
  orders: 30 * 1000, // 30 seconds
  assignments: 30 * 1000, // 30 seconds
  notifications: 30 * 1000, // 30 seconds

  // Real-time needs - very short cache
  activeOrders: 15 * 1000, // 15 seconds
} as const;

// ============================================================================
// GARBAGE COLLECTION TIMES (how long to keep unused data in cache)
// ============================================================================

export const GC_TIMES = {
  short: 2 * 60 * 1000, // 2 minutes
  default: 5 * 60 * 1000, // 5 minutes
  long: 15 * 60 * 1000, // 15 minutes
  veryLong: 30 * 60 * 1000, // 30 minutes
} as const;

// ============================================================================
// RETRY CONFIGURATION
// ============================================================================

export const RETRY_CONFIG = {
  // Standard retry for most queries
  standard: {
    retry: 3,
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },

  // No retry for mutations that shouldn't be repeated
  noRetry: {
    retry: false,
  },

  // Single retry for time-sensitive operations
  minimal: {
    retry: 1,
    retryDelay: 1000,
  },
} as const;

// ============================================================================
// REFETCH CONFIGURATION
// ============================================================================

export const REFETCH_CONFIG = {
  // For data that should stay fresh when user returns to tab
  onWindowFocus: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  },

  // For data that doesn't need to refetch automatically
  manual: {
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  },

  // For real-time data that should always be fresh
  aggressive: {
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    refetchInterval: 30000, // 30 seconds
  },
} as const;
