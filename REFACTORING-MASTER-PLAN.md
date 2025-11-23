# Site-Wide Refactoring Plan

## Executive Summary

This document outlines a comprehensive plan for refactoring the spaceseller platform codebase. The goal is to enhance code structure, readability, and maintainability while ensuring zero changes to UI/UX and functionality. All refactoring will be incremental, thoroughly tested, and low-risk.

## Completed Phases (Reference)

- ✅ **Phase 1**: PhotographyConfigStep - Data types and business logic extraction
- ✅ **Phase 2**: LocationCheckStep - Service layer and hooks extraction
- ✅ **Phase 3**: PhotographerManagement - Component breakdown and service layer
- ✅ **Phase 4**: Admin.tsx - Statistics, filters, and orders table extraction
- ✅ **Phase 5**: OrderDetailModal - Photographer assignment and file upload sections

## Priority Matrix

### 🔴 High Priority (Complexity + Usage Frequency)
Files that are complex, frequently used, and would benefit most from refactoring.

### 🟡 Medium Priority (Moderate Complexity)
Files with moderate complexity or usage that could be improved.

### 🟢 Low Priority (Minor Improvements)
Files needing minor cleanup or optimization.

---

## Phase 6: Order Wizard and Flow Management 🔴

**File**: `src/pages/Order/OrderWizard.tsx` (318 lines)

### Current Issues
- Large component managing entire order flow state
- Complex state management with 20+ fields in OrderState
- Mixed concerns: routing, state, validation, submission
- Step navigation logic embedded in component
- Order submission logic could be extracted

### Proposed Refactoring

#### 6.1 Extract Order State Management
**File**: `src/lib/hooks/useOrderState.ts`
- Create custom hook managing all order state
- Include state initialization, updates, and validation
- Extract step navigation logic
- **Risk**: Low - Pure state management extraction
- **Testing**: Unit tests for state transitions

#### 6.2 Extract Order Submission Logic
**File**: `src/lib/services/OrderSubmissionService.ts`
- Handle order creation in database
- Manage order items, addresses, uploads
- Generate order numbers
- Trigger notifications/webhooks
- **Risk**: Medium - Critical business logic
- **Testing**: Comprehensive unit tests with mocked Supabase

#### 6.3 Create Order Validation Service
**File**: `src/lib/services/OrderValidationService.ts`
- Centralize validation rules for each step
- Validate order completeness before submission
- Check required fields per category
- **Risk**: Low - Pure validation logic
- **Testing**: Unit tests with various order scenarios

#### 6.4 Simplify OrderWizard Component
- Reduce to orchestration and rendering only
- Use extracted hooks and services
- Target: <150 lines
- **Risk**: Low - Component simplification
- **Testing**: Integration tests for entire order flow

### Expected Benefits
- Better testability of order flow logic
- Easier to add new categories/steps
- Clearer separation of concerns
- Reduced component complexity

### Estimated Impact
- **Lines Reduced**: 318 → ~120 (62% reduction)
- **New Files**: 3 services + 1 hook
- **Test Coverage**: 85% for order submission logic

---

## Phase 7: Category-Specific Configuration Steps 🟡

**Files**: 
- `src/pages/Order/steps/PhotoEditingConfigStep.tsx` (potential)
- `src/pages/Order/steps/VirtualStagingConfigStep.tsx` (potential)
- `src/pages/Order/steps/EnergyCertificateConfigStep.tsx` (potential)

### Current Issues
- Some category steps may lack consistent structure
- Potential duplication in validation/pricing logic
- Could benefit from shared components/patterns

### Proposed Refactoring

#### 7.1 Create Shared Configuration Components
**Directory**: `src/pages/Order/components/shared/`
- `ConfigurationCard.tsx` - Standardized card layout
- `PricingSummaryPanel.tsx` - Reusable pricing display
- `ConfigurationHeader.tsx` - Consistent headers
- `ConfigurationActions.tsx` - Navigation buttons
- **Risk**: Low - Reusable UI components
- **Testing**: Storybook + visual regression

#### 7.2 Extract Category Pricing Logic
**File**: `src/lib/services/CategoryPricingService.ts`
- Unified pricing calculation interface
- Category-specific pricing strategies
- Add-on and upgrade calculations
- **Risk**: Medium - Business logic
- **Testing**: Comprehensive unit tests

#### 7.3 Standardize Configuration Step Pattern
- Create base configuration interface
- Ensure consistent props/state structure
- Standardize validation approach
- **Risk**: Low - Pattern consistency
- **Testing**: Type checking + integration tests

### Expected Benefits
- Consistent UX across all categories
- Reduced code duplication
- Easier to add new categories
- Centralized pricing logic

### Estimated Impact
- **Code Reuse**: 40% reduction in duplicate code
- **New Components**: 4 shared components
- **Test Coverage**: 80% for pricing logic

---

## Phase 8: Dashboard Components 🟡

**Files**:
- `src/pages/Dashboard.tsx` (potential complexity)
- `src/pages/MyOrders.tsx` (potential complexity)
- `src/pages/FreelancerDashboard.tsx` (potential complexity)

### Current Issues
- May have mixed data fetching and UI rendering
- Could benefit from service layer extraction
- Potential for shared dashboard components

### Proposed Refactoring

#### 8.1 Extract Dashboard Data Services
**Files**:
- `src/lib/services/ClientDashboardService.ts`
- `src/lib/services/FreelancerDashboardService.ts`
- Centralize data fetching and aggregation
- Calculate statistics and metrics
- **Risk**: Low - Data layer extraction
- **Testing**: Unit tests with mocked data

#### 8.2 Create Dashboard Component Library
**Directory**: `src/components/dashboard/`
- `DashboardStats.tsx` - Statistics cards
- `RecentOrdersTable.tsx` - Order list
- `QuickActions.tsx` - Action buttons
- `OrderStatusBoard.tsx` - Status overview
- `EmptyState.tsx` - No data states
- **Risk**: Low - UI component extraction
- **Testing**: Visual testing + unit tests

#### 8.3 Extract Assignment Logic (Freelancer)
**File**: `src/lib/services/AssignmentService.ts`
- Handle assignment acceptance/decline
- Manage photographer responses
- Calculate statistics
- **Risk**: Medium - Business logic
- **Testing**: Comprehensive unit tests

### Expected Benefits
- Reusable dashboard components
- Better data fetching patterns
- Improved loading states
- Consistent dashboard UX

### Estimated Impact
- **Component Reuse**: 60% across dashboards
- **New Components**: 6 dashboard components
- **Test Coverage**: 75% for dashboard logic

---

## Phase 9: Form Components and Validation 🟢

**Files**:
- `src/pages/Onboarding.tsx`
- `src/pages/Settings.tsx`
- `src/pages/PhotographerSettings.tsx`

### Current Issues
- Form logic may be embedded in components
- Potential duplication in validation
- Could benefit from form abstractions

### Proposed Refactoring

#### 9.1 Create Form Utilities
**File**: `src/lib/forms/formHelpers.ts`
- Common form validation patterns
- Error handling utilities
- Form state management helpers
- **Risk**: Low - Utility functions
- **Testing**: Unit tests for each helper

#### 9.2 Extract Profile Management Service
**File**: `src/lib/services/ProfileService.ts`
- Handle profile updates
- Manage address geocoding
- Update photographer settings
- **Risk**: Low - CRUD operations
- **Testing**: Unit tests with mocked Supabase

#### 9.3 Create Reusable Form Components
**Directory**: `src/components/forms/`
- `AddressForm.tsx` - Standardized address input
- `CompanyInfoForm.tsx` - Company details
- `ContactInfoForm.tsx` - Contact information
- **Risk**: Low - UI components
- **Testing**: Unit tests + visual testing

### Expected Benefits
- Consistent form behavior
- Reduced validation duplication
- Better error handling
- Reusable form sections

### Estimated Impact
- **Code Reduction**: 30% in form-heavy pages
- **New Components**: 3 form components
- **Test Coverage**: 70% for form logic

---

## Phase 10: Authentication and Auth Context 🟡

**Files**:
- `src/contexts/AuthContext.tsx`
- `src/pages/Auth.tsx`
- `src/pages/ResetPassword.tsx`

### Current Issues
- Auth context may include business logic
- Password reset flow could be abstracted
- Role checking logic embedded in context

### Proposed Refactoring

#### 10.1 Extract Authentication Service
**File**: `src/lib/services/AuthService.ts`
- Handle login, signup, logout
- Password reset flow
- Email validation and typo detection
- **Risk**: High - Critical authentication flow
- **Testing**: Comprehensive integration tests

#### 10.2 Extract Role Management
**File**: `src/lib/services/RoleService.ts`
- Centralize role checking (isAdmin, isPhotographer)
- Handle role assignments
- Manage permissions
- **Risk**: Medium - Security-related
- **Testing**: Security-focused unit tests

#### 10.3 Simplify AuthContext
- Reduce to state management only
- Use extracted services for logic
- Improve error handling
- **Risk**: Medium - Core functionality
- **Testing**: Integration tests for auth flow

### Expected Benefits
- Better testability of auth logic
- Clearer security boundaries
- Easier to add new auth methods
- Improved error handling

### Estimated Impact
- **Lines Reduced**: AuthContext 40% smaller
- **New Services**: 2 services
- **Test Coverage**: 90% for auth logic

---

## Phase 11: Edge Functions Review 🟡

**Files**:
- `supabase/functions/find-available-photographers/index.ts`
- `supabase/functions/geocode-address/index.ts`
- `supabase/functions/trigger-zapier-webhook/index.ts`
- `supabase/functions/create-photographer/index.ts`
- `supabase/functions/request-password-reset/index.ts`
- `supabase/functions/reset-password/index.ts`

### Current Issues
- Potential duplication in error handling
- Could benefit from shared utilities
- Validation logic may be inconsistent

### Proposed Refactoring

#### 11.1 Create Edge Function Utilities
**File**: `supabase/functions/_shared/utils.ts`
- Common error handling patterns
- Response formatting utilities
- Validation helpers
- Rate limiting utilities
- **Risk**: Low - Shared utilities
- **Testing**: Unit tests for utilities

#### 11.2 Create Edge Function Types
**File**: `supabase/functions/_shared/types.ts`
- Shared type definitions
- Request/response interfaces
- Error types
- **Risk**: Low - Type definitions
- **Testing**: Type checking

#### 11.3 Standardize Error Responses
- Consistent error format across functions
- Proper HTTP status codes
- Detailed error messages for debugging
- **Risk**: Low - Response formatting
- **Testing**: Integration tests

### Expected Benefits
- Code reuse across edge functions
- Consistent error handling
- Better debugging experience
- Type safety improvements

### Estimated Impact
- **Code Reuse**: 25% reduction in edge functions
- **New Files**: 2 shared utility files
- **Test Coverage**: 70% for edge functions

---

## Phase 12: UI Components Library Consolidation 🟢

**Files**:
- Various components in `src/components/`
- Order-specific components in `src/pages/Order/components/`

### Current Issues
- Some components may be overly specific
- Potential for more reusable abstractions
- Could benefit from consistent patterns

### Proposed Refactoring

#### 12.1 Audit Component Library
- Identify reusable patterns
- Find duplication opportunities
- Document component usage
- **Risk**: None - Audit only
- **Testing**: N/A

#### 12.2 Create Base Component Abstractions
**Directory**: `src/components/base/`
- `BaseCard.tsx` - Standardized card component
- `BaseModal.tsx` - Modal wrapper
- `BaseTable.tsx` - Table structure
- `BaseForm.tsx` - Form wrapper
- **Risk**: Low - Base abstractions
- **Testing**: Storybook + visual testing

#### 12.3 Extract Common Patterns
- Loading states
- Error boundaries
- Empty states
- Success states
- **Risk**: Low - Pattern extraction
- **Testing**: Visual regression tests

### Expected Benefits
- More consistent UI/UX
- Faster component development
- Reduced CSS duplication
- Better design system adherence

### Estimated Impact
- **Component Reuse**: 50% increase
- **New Base Components**: 4-5 components
- **Design System Compliance**: 95%

---

## Phase 13: Testing Infrastructure Enhancement 🟡

**Current State**: Basic testing setup with Vitest

### Proposed Improvements

#### 13.1 Increase Test Coverage
**Target Areas**:
- Services: 85%+ coverage
- Hooks: 80%+ coverage
- Components: 70%+ coverage
- Edge Functions: 70%+ coverage
- **Risk**: None - Testing only
- **Testing**: N/A

#### 13.2 Add Integration Tests
**File**: `src/test/integration/`
- Order flow end-to-end tests
- Authentication flow tests
- Admin operations tests
- **Risk**: Low - Additional tests
- **Testing**: CI/CD integration

#### 13.3 Add Visual Regression Testing
**Tool**: Chromatic or Percy
- Test UI components
- Catch unintended visual changes
- Document component states
- **Risk**: Low - Visual testing
- **Testing**: CI/CD integration

#### 13.4 Performance Testing
**File**: `src/test/performance/`
- Test large data sets
- Memory leak detection
- Render performance
- **Risk**: Low - Performance monitoring
- **Testing**: Benchmark tracking

### Expected Benefits
- Higher confidence in changes
- Catch regressions early
- Better documentation
- Performance baseline

### Estimated Impact
- **Test Coverage**: 60% → 80%
- **Test Files**: +30 files
- **CI/CD Time**: +3 minutes

---

## Phase 14: Type Safety and TypeScript Improvements 🟢

**Current State**: TypeScript enabled with some `any` types

### Proposed Improvements

#### 14.1 Eliminate `any` Types
- Audit codebase for `any` usage
- Create proper type definitions
- Use generics where appropriate
- **Risk**: Low - Type improvements
- **Testing**: Type checking

#### 14.2 Create Domain Type Library
**Directory**: `src/types/`
- `order.ts` - Order-related types
- `user.ts` - User and profile types
- `photographer.ts` - Photographer types
- `service.ts` - Service catalog types
- **Risk**: Low - Type organization
- **Testing**: Type checking

#### 14.3 Add Runtime Validation
**Library**: Zod or Yup
- Validate API responses
- Validate user inputs
- Type-safe validation schemas
- **Risk**: Low - Added validation
- **Testing**: Unit tests for validators

### Expected Benefits
- Fewer runtime errors
- Better IDE support
- Self-documenting code
- Catch bugs at compile time

### Estimated Impact
- **Type Safety**: 75% → 95%
- **Runtime Errors**: -40%
- **Developer Experience**: Significantly improved

---

## Phase 15: Performance Optimization 🟢

**Current State**: Good performance, room for optimization

### Proposed Improvements

#### 15.1 Code Splitting
- Lazy load routes
- Split vendor bundles
- Dynamic imports for heavy components
- **Risk**: Low - Build optimization
- **Testing**: Bundle size monitoring

#### 15.2 Image Optimization
- Implement lazy loading
- Use responsive images
- Compress images
- Add loading skeletons
- **Risk**: Low - Asset optimization
- **Testing**: Performance metrics

#### 15.3 Query Optimization
- Add query caching strategies
- Implement optimistic updates
- Use React Query features effectively
- **Risk**: Low - Query improvements
- **Testing**: Performance monitoring

#### 15.4 Memoization
- Use React.memo for expensive components
- useMemo for expensive calculations
- useCallback for stable references
- **Risk**: Low - React optimizations
- **Testing**: Performance profiling

### Expected Benefits
- Faster initial load
- Better perceived performance
- Reduced bandwidth usage
- Improved mobile experience

### Estimated Impact
- **Bundle Size**: -30%
- **Initial Load**: -40%
- **Time to Interactive**: -25%

---

## Implementation Strategy

### Principles
1. **Incremental Changes**: One phase at a time
2. **Test-Driven**: Write tests before refactoring
3. **Review Process**: Peer review for all changes
4. **Documentation**: Update docs with each phase
5. **Rollback Plan**: Maintain ability to revert

### Phase Execution Checklist
- [ ] Review existing code and documentation
- [ ] Create detailed implementation plan
- [ ] Write tests for current functionality
- [ ] Implement refactoring
- [ ] Run all tests (unit, integration, visual)
- [ ] Perform manual testing
- [ ] Update documentation
- [ ] Peer review
- [ ] Merge and deploy
- [ ] Monitor for issues

### Risk Mitigation
- **High Risk**: 2 reviewers + extended testing period
- **Medium Risk**: 1 reviewer + standard testing
- **Low Risk**: Standard review process

### Testing Requirements
- All existing tests must pass
- New tests must achieve coverage targets
- Manual testing for user-facing changes
- Performance benchmarks must not regress

---

## Rollout Timeline

### Immediate (Weeks 1-2)
- Phase 6: Order Wizard refactoring

### Short-term (Weeks 3-4)
- Phase 7: Category configuration steps
- Phase 8: Dashboard components

### Medium-term (Weeks 5-8)
- Phase 9: Form components
- Phase 10: Authentication refactoring
- Phase 11: Edge functions review

### Long-term (Weeks 9-12)
- Phase 12: UI components consolidation
- Phase 13: Testing infrastructure
- Phase 14: Type safety improvements
- Phase 15: Performance optimization

---

## Success Metrics

### Code Quality
- ✅ Test coverage: 60% → 80%
- ✅ Average file size: <200 lines for components
- ✅ Cyclomatic complexity: <10 per function
- ✅ Type safety: 95%+ strong typing

### Maintainability
- ✅ Component reuse: 50%+ increase
- ✅ Code duplication: <5%
- ✅ Documentation coverage: 100% for services/hooks

### Performance
- ✅ Bundle size: -30%
- ✅ Initial load: -40%
- ✅ Test execution time: <30 seconds

### Developer Experience
- ✅ Build time: No regression
- ✅ Hot reload: <1 second
- ✅ Type checking: <5 seconds

---

## Feedback and Approval

### Review Process
1. **Technical Review**: Development team reviews plan
2. **Stakeholder Review**: Product/business review priorities
3. **Approval**: Get sign-off before implementation
4. **Iteration**: Incorporate feedback and adjust plan

### Questions for Reviewers
1. Are the priorities aligned with business goals?
2. Is the risk assessment accurate?
3. Are there missing areas that need refactoring?
4. Is the timeline realistic?
5. Are the success metrics appropriate?

### Feedback Deadline
Please provide feedback within 1 week to maintain momentum.

---

## Appendix A: File Priority Matrix

| Priority | File | Lines | Complexity | Usage | Phase |
|----------|------|-------|------------|-------|-------|
| 🔴 High | OrderWizard.tsx | 318 | High | Critical | 6 |
| 🟡 Medium | Dashboard.tsx | TBD | Medium | High | 8 |
| 🟡 Medium | AuthContext.tsx | TBD | Medium | Critical | 10 |
| 🟡 Medium | Edge Functions | Varies | Medium | High | 11 |
| 🟡 Medium | MyOrders.tsx | TBD | Medium | High | 8 |
| 🟢 Low | Onboarding.tsx | TBD | Low | Medium | 9 |
| 🟢 Low | Settings.tsx | TBD | Low | Medium | 9 |
| 🟢 Low | Component Library | Varies | Low | High | 12 |

---

## Appendix B: Dependencies and Risks

### External Dependencies
- React Query - Data fetching
- Supabase - Backend/Database
- Mapbox - Geocoding/Maps
- Zod - Validation
- Framer Motion - Animations

### Potential Risks
1. **Breaking Changes**: Mitigate with comprehensive tests
2. **Merge Conflicts**: Use small, focused PRs
3. **Performance Regression**: Monitor metrics continuously
4. **Type Errors**: Strict TypeScript checking
5. **User Experience**: No UI/UX changes allowed

---

## Conclusion

This refactoring plan provides a structured approach to improving the spaceseller platform codebase over a 12-week period. By following incremental, well-tested phases, we can significantly enhance code quality, maintainability, and developer experience without risking functionality or user experience.

The plan prioritizes high-impact areas (Order Wizard, Dashboards, Authentication) while also addressing foundational improvements (Testing, Types, Performance). Each phase includes clear goals, risk assessments, and success metrics.

**Next Steps**:
1. Review and provide feedback on this plan
2. Approve or adjust priorities based on business needs
3. Begin Phase 6: Order Wizard refactoring
4. Execute phases according to approved timeline

---

**Document Version**: 1.0  
**Last Updated**: 2025-01-23  
**Status**: Awaiting Feedback  
**Owner**: Development Team
