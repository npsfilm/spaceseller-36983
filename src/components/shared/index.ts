// Stats Components
export { UnifiedStatCard } from './stats/StatCard';
export { StatsGrid } from './stats/StatsGrid';
export type { StatCardProps, StatsGridProps } from './stats/types';

// Greeting Components
export { WelcomeSection } from './greeting/WelcomeSection';
export { getTimeOfDayGreeting } from './greeting/TimeBasedGreeting';
export type { WelcomeSectionProps } from './greeting/WelcomeSection';
export type { TimeGreeting } from './greeting/TimeBasedGreeting';

// Onboarding Components
export { OnboardingCard } from './onboarding/OnboardingCard';
export { ChecklistItem } from './onboarding/ChecklistItem';
export { ProgressBar } from './onboarding/ProgressBar';
export { EmptyStateCard } from './onboarding/EmptyStateCard';
export type { OnboardingCardProps } from './onboarding/OnboardingCard';
export type { ChecklistItemData, ChecklistItemProps } from './onboarding/ChecklistItem';
export type { ProgressBarProps } from './onboarding/ProgressBar';
export type { EmptyStateCardProps, Feature } from './onboarding/EmptyStateCard';

// Layout Components
export { DashboardShell } from './layout/DashboardShell';
export { PageHeader } from './layout/PageHeader';
export { ContentSection } from './layout/ContentSection';
export type { DashboardShellProps } from './layout/DashboardShell';
export type { PageHeaderProps } from './layout/PageHeader';
export type { ContentSectionProps } from './layout/ContentSection';

// Filter Components
export { SearchFilter } from './filters/SearchFilter';
export { StatusFilter } from './filters/StatusFilter';
export { CombinedFilters } from './filters/CombinedFilters';
export type { SearchFilterProps } from './filters/SearchFilter';
export type { StatusFilterProps, StatusOption } from './filters/StatusFilter';
export type { CombinedFiltersProps } from './filters/CombinedFilters';
