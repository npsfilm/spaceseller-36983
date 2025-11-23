# Architecture Diagrams - Spaceseller Platform

## Table of Contents
1. [System Architecture Overview](#system-architecture-overview)
2. [Service Layer Architecture](#service-layer-architecture)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Component Hierarchy](#component-hierarchy)
5. [Testing Architecture](#testing-architecture)
6. [Order Flow Sequence](#order-flow-sequence)
7. [Authentication Flow](#authentication-flow)
8. [Database Schema](#database-schema)

---

## System Architecture Overview

```mermaid
graph TB
    subgraph "Frontend Layer"
        UI[React Components]
        Pages[Pages/Routes]
        Hooks[Custom Hooks]
    end
    
    subgraph "Business Logic Layer"
        Services[Service Classes]
        Validation[Validation Services]
        Pricing[Pricing Services]
    end
    
    subgraph "Data Layer"
        RQ[React Query Cache]
        State[Component State]
    end
    
    subgraph "Backend - Lovable Cloud"
        DB[(Supabase Database)]
        Auth[Authentication]
        Edge[Edge Functions]
        Storage[File Storage]
    end
    
    subgraph "External Services"
        Mapbox[Mapbox API]
        Resend[Resend Email]
        Zapier[Zapier Webhooks]
    end
    
    UI --> Hooks
    Pages --> UI
    Hooks --> Services
    Services --> Validation
    Services --> Pricing
    Hooks --> RQ
    RQ --> DB
    Services --> Edge
    Edge --> DB
    Edge --> Mapbox
    Edge --> Resend
    Edge --> Zapier
    Auth --> DB
    Storage --> DB
    
    style UI fill:#e3f2fd
    style Services fill:#fff3e0
    style DB fill:#f3e5f5
    style Edge fill:#e8f5e9
```

---

## Service Layer Architecture

```mermaid
graph LR
    subgraph "Data Services"
        ODS[OrderDataService]
        ADS[AssignmentDataService]
        DDS[DashboardDataService]
        PMS[PhotographerService]
    end
    
    subgraph "Business Logic Services"
        LS[LocationService]
        TCC[TravelCostCalculator]
        PMatch[PhotographerMatchingService]
        OVS[OrderValidationService]
        OSS[OrderSubmissionService]
    end
    
    subgraph "Pricing Services"
        CPS[CategoryPricingService]
        PPS[PhotographyPricingService]
        PEPS[PhotoEditingPricingService]
        VSPS[VirtualStagingPricingService]
        ECPS[EnergyCertificatePricingService]
    end
    
    subgraph "Admin Services"
        AOS[AdminOrderService]
        ODS2[OrderDetailService]
    end
    
    subgraph "Database"
        DB[(Supabase)]
    end
    
    ODS --> DB
    ADS --> DB
    DDS --> DB
    PMS --> DB
    AOS --> DB
    ODS2 --> DB
    
    LS --> DB
    TCC -.uses.-> LS
    PMatch -.uses.-> LS
    OVS -.validates.-> ODS
    OSS -.uses.-> OVS
    OSS --> DB
    
    CPS -.extends.-> PPS
    CPS -.extends.-> PEPS
    CPS -.extends.-> VSPS
    CPS -.extends.-> ECPS
    
    style ODS fill:#bbdefb
    style ADS fill:#bbdefb
    style DDS fill:#bbdefb
    style PMS fill:#bbdefb
    style LS fill:#fff9c4
    style TCC fill:#fff9c4
    style CPS fill:#c8e6c9
    style AOS fill:#ffccbc
```

---

## Data Flow Architecture

```mermaid
sequenceDiagram
    participant User
    participant Component
    participant Hook
    participant Service
    participant RQ as React Query
    participant DB as Supabase
    
    User->>Component: Interaction
    Component->>Hook: Call hook function
    Hook->>Service: Call service method
    Service->>DB: Query/Mutation
    DB-->>Service: Data/Result
    Service-->>RQ: Update cache
    RQ-->>Hook: Return data
    Hook-->>Component: Update state
    Component-->>User: Re-render UI
    
    Note over RQ: Handles caching,<br/>refetching,<br/>optimistic updates
```

---

## Component Hierarchy

```mermaid
graph TD
    subgraph "Application Root"
        App[App.tsx]
        Router[React Router]
    end
    
    subgraph "Layout Components"
        Layout[Layout]
        Header[Header]
        Footer[Footer]
        AdminLayout[AdminLayout]
    end
    
    subgraph "Page Components"
        Home[Home]
        Dashboard[Dashboard]
        Order[OrderWizard]
        MyOrders[MyOrders]
        Admin[Admin]
        Freelancer[FreelancerDashboard]
    end
    
    subgraph "Order Flow Components"
        LocationStep[LocationCheckStep]
        CategoryStep[CategorySelectionStep]
        ConfigStep[ProductConfigurationStep]
        PhotoConfig[PhotographyConfigStep]
    end
    
    subgraph "Dashboard Components"
        Stats[DashboardStats]
        QuickActions[QuickActions]
        RecentOrders[RecentOrdersTable]
        StatCard[StatCard]
        QuickActionCard[QuickActionCard]
    end
    
    subgraph "Admin Components"
        AdminStats[AdminStatsCards]
        OrdersTable[AdminOrdersTable]
        OrderDetail[OrderDetailModal]
        PhotoMgmt[PhotographerManagement]
    end
    
    subgraph "Shared UI Components"
        Button[Button]
        Card[Card]
        Badge[Badge]
        Input[Input]
        Select[Select]
    end
    
    App --> Router
    Router --> Layout
    Layout --> Header
    Layout --> Footer
    Layout --> Home
    Layout --> Dashboard
    Layout --> Order
    Layout --> MyOrders
    
    Router --> AdminLayout
    AdminLayout --> Admin
    
    Dashboard --> Stats
    Dashboard --> QuickActions
    Dashboard --> RecentOrders
    Stats --> StatCard
    QuickActions --> QuickActionCard
    
    Order --> LocationStep
    Order --> CategoryStep
    Order --> ConfigStep
    ConfigStep --> PhotoConfig
    
    Admin --> AdminStats
    Admin --> OrdersTable
    Admin --> OrderDetail
    Admin --> PhotoMgmt
    
    style App fill:#e1f5fe
    style Layout fill:#fff9c4
    style Order fill:#f3e5f5
    style Dashboard fill:#e8f5e9
    style Admin fill:#ffebee
```

---

## Testing Architecture

```mermaid
graph TB
    subgraph "Test Types"
        Unit[Unit Tests<br/>120+ tests]
        Component[Component Tests<br/>105+ tests]
        Integration[Integration Tests<br/>41 tests]
        E2E[E2E Tests<br/>Proposed]
    end
    
    subgraph "Unit Test Coverage"
        ServiceTests[Service Layer Tests]
        HookTests[Hook Tests]
        UtilTests[Utility Tests]
        PricingTests[Pricing Logic Tests]
    end
    
    subgraph "Component Test Coverage"
        UITests[UI Component Tests]
        A11yTests[Accessibility Tests]
        SnapshotTests[Snapshot Tests]
    end
    
    subgraph "Integration Test Coverage"
        FlowTests[Order Flow Tests]
        StateTests[State Management Tests]
        ValidationTests[Validation Tests]
    end
    
    subgraph "Testing Tools"
        Vitest[Vitest Test Runner]
        RTL[React Testing Library]
        JestAxe[jest-axe a11y]
        UserEvent[@testing-library/user-event]
    end
    
    Unit --> ServiceTests
    Unit --> HookTests
    Unit --> UtilTests
    Unit --> PricingTests
    
    Component --> UITests
    Component --> A11yTests
    Component --> SnapshotTests
    
    Integration --> FlowTests
    Integration --> StateTests
    Integration --> ValidationTests
    
    ServiceTests -.uses.-> Vitest
    HookTests -.uses.-> Vitest
    HookTests -.uses.-> RTL
    UITests -.uses.-> RTL
    UITests -.uses.-> UserEvent
    A11yTests -.uses.-> JestAxe
    FlowTests -.uses.-> RTL
    FlowTests -.uses.-> UserEvent
    
    style Unit fill:#bbdefb
    style Component fill:#c8e6c9
    style Integration fill:#fff9c4
    style E2E fill:#ffccbc
    style Vitest fill:#e1bee7
```

---

## Order Flow Sequence

```mermaid
sequenceDiagram
    participant User
    participant LocationStep
    participant LocationService
    participant CategoryStep
    participant ConfigStep
    participant ValidationService
    participant SubmissionService
    participant Database
    
    User->>LocationStep: Enter address
    LocationStep->>LocationService: Validate location
    LocationService->>Database: Check photographer availability
    Database-->>LocationService: Available photographers
    LocationService-->>LocationStep: Validation result
    LocationStep-->>User: Show availability
    
    User->>LocationStep: Click Next
    LocationStep->>CategoryStep: Navigate (Step 2)
    
    User->>CategoryStep: Select category
    CategoryStep-->>User: Show selected state
    User->>CategoryStep: Click Next
    CategoryStep->>ConfigStep: Navigate (Step 3)
    
    User->>ConfigStep: Configure products/packages
    ConfigStep-->>User: Update live pricing
    
    User->>ConfigStep: Submit order
    ConfigStep->>ValidationService: Validate complete order
    ValidationService-->>ConfigStep: Validation result
    
    alt Valid Order
        ConfigStep->>SubmissionService: Submit order
        SubmissionService->>Database: Update order status
        SubmissionService->>Database: Create address record
        SubmissionService->>Database: Create notifications
        Database-->>SubmissionService: Success
        SubmissionService-->>ConfigStep: Order ID
        ConfigStep-->>User: Navigate to confirmation
    else Invalid Order
        ConfigStep-->>User: Show validation errors
    end
```

---

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant AuthPage
    participant Supabase
    participant ProtectedRoute
    participant Onboarding
    participant Dashboard
    
    User->>AuthPage: Enter credentials
    AuthPage->>Supabase: signIn/signUp
    
    alt Authentication Success
        Supabase-->>AuthPage: Session + User
        AuthPage->>ProtectedRoute: Navigate
        ProtectedRoute->>Supabase: Check onboarding status
        
        alt Onboarding Incomplete
            Supabase-->>ProtectedRoute: onboarding_completed = false
            ProtectedRoute->>Onboarding: Redirect
            User->>Onboarding: Complete profile
            Onboarding->>Supabase: Update profile
            Supabase-->>Onboarding: Success
            Onboarding->>Dashboard: Redirect
        else Onboarding Complete
            Supabase-->>ProtectedRoute: onboarding_completed = true
            ProtectedRoute->>Dashboard: Allow access
        end
    else Authentication Failed
        Supabase-->>AuthPage: Error
        AuthPage-->>User: Show error message
    end
```

---

## Database Schema

```mermaid
erDiagram
    profiles ||--o{ orders : places
    profiles ||--o{ user_roles : has
    profiles ||--o{ order_assignments : "assigned to"
    profiles ||--o{ photographer_availability : manages
    
    orders ||--|{ order_items : contains
    orders ||--|{ order_upgrades : includes
    orders ||--o{ order_uploads : has
    orders ||--o{ order_deliverables : receives
    orders ||--o| addresses : "delivered to"
    orders ||--o{ order_assignments : "assigned for"
    
    services ||--o{ order_items : "ordered as"
    upgrades ||--o{ order_upgrades : "ordered as"
    
    profiles {
        uuid id PK
        text email
        text vorname
        text nachname
        text firma
        text telefon
        text strasse
        text plz
        text stadt
        numeric location_lat
        numeric location_lng
        int service_radius_km
        boolean onboarding_completed
    }
    
    orders {
        uuid id PK
        uuid user_id FK
        text order_number
        order_status status
        numeric total_amount
        timestamp created_at
        timestamp delivery_deadline
    }
    
    order_items {
        uuid id PK
        uuid order_id FK
        uuid service_id FK
        int quantity
        numeric unit_price
        numeric total_price
    }
    
    order_assignments {
        uuid id PK
        uuid order_id FK
        uuid photographer_id FK
        uuid assigned_by FK
        text status
        date scheduled_date
        time scheduled_time
    }
    
    services {
        uuid id PK
        text name
        text category
        numeric base_price
        boolean is_active
    }
    
    user_roles {
        uuid id PK
        uuid user_id FK
        app_role role
    }
```

---

## Custom Hook Architecture

```mermaid
graph TD
    subgraph "Data Fetching Hooks"
        useOrders[useOrders]
        useAssignments[useAssignments]
        useDashboard[useDashboardData]
        usePhotographers[usePhotographerManagement]
        useAdminOrders[useAdminOrders]
    end
    
    subgraph "State Management Hooks"
        useOrderState[useOrderState]
    end
    
    subgraph "Validation Hooks"
        useLocationValidation[useLocationValidation]
    end
    
    subgraph "Services"
        OrderDS[OrderDataService]
        AssignmentDS[AssignmentDataService]
        DashboardDS[DashboardDataService]
        PhotographerS[PhotographerService]
        AdminOrderS[AdminOrderService]
        LocationS[LocationService]
    end
    
    subgraph "React Query"
        RQ[React Query Client]
    end
    
    useOrders --> OrderDS
    useAssignments --> AssignmentDS
    useDashboard --> DashboardDS
    usePhotographers --> PhotographerS
    useAdminOrders --> AdminOrderS
    useLocationValidation --> LocationS
    
    useOrders --> RQ
    useAssignments --> RQ
    useDashboard --> RQ
    usePhotographers --> RQ
    useAdminOrders --> RQ
    
    OrderDS --> RQ
    AssignmentDS --> RQ
    DashboardDS --> RQ
    PhotographerS --> RQ
    AdminOrderS --> RQ
    
    style useOrders fill:#e3f2fd
    style useAssignments fill:#e3f2fd
    style useDashboard fill:#e3f2fd
    style useOrderState fill:#fff3e0
    style useLocationValidation fill:#fff3e0
    style RQ fill:#f3e5f5
```

---

## Pricing System Architecture

```mermaid
graph TB
    subgraph "Pricing Strategy Pattern"
        CPS[CategoryPricingService<br/>Base Class]
        
        PPS[PhotographyPricingService]
        PEPS[PhotoEditingPricingService]
        VSPS[VirtualStagingPricingService]
        ECPS[EnergyCertificatePricingService]
    end
    
    subgraph "Pricing Components"
        BasePrice[Base Package Price]
        AddOns[Add-ons Calculation]
        Travel[Travel Cost]
        Tiered[Tiered Discounts]
    end
    
    subgraph "Configuration Steps"
        PhotoConfig[PhotographyConfigStep]
        EditConfig[PhotoEditingConfigStep]
        StagingConfig[VirtualStagingConfigStep]
        CertConfig[EnergyCertificateConfigStep]
    end
    
    CPS --> PPS
    CPS --> PEPS
    CPS --> VSPS
    CPS --> ECPS
    
    PPS --> BasePrice
    PPS --> AddOns
    PPS --> Travel
    
    VSPS --> BasePrice
    VSPS --> Tiered
    
    PhotoConfig -.uses.-> PPS
    EditConfig -.uses.-> PEPS
    StagingConfig -.uses.-> VSPS
    CertConfig -.uses.-> ECPS
    
    style CPS fill:#fff9c4
    style PPS fill:#c8e6c9
    style PEPS fill:#c8e6c9
    style VSPS fill:#c8e6c9
    style ECPS fill:#c8e6c9
```

---

## Admin Dashboard Architecture

```mermaid
graph TB
    subgraph "Admin Dashboard"
        AdminPage[Admin.tsx]
        
        Stats[AdminStatsCards]
        Filters[OrderFilters]
        Table[AdminOrdersTable]
        Detail[OrderDetailModal]
    end
    
    subgraph "Detail Modal Sections"
        CustomerInfo[CustomerInfoSection]
        OrderInfo[OrderInfoSection]
        OrderItems[OrderItemsSection]
        Address[OrderAddressSection]
        Assignment[PhotographerAssignmentSection]
        Uploads[OrderUploadsSection]
        Status[OrderStatusUpdate]
        Deliverables[DeliverableUploadSection]
    end
    
    subgraph "Data Management"
        AdminOrderService[AdminOrderService]
        OrderDetailService[OrderDetailService]
    end
    
    subgraph "Hooks"
        useAdminOrders[useAdminOrders]
        useOrderDetails[useOrderDetails]
    end
    
    AdminPage --> Stats
    AdminPage --> Filters
    AdminPage --> Table
    Table -.opens.-> Detail
    
    Detail --> CustomerInfo
    Detail --> OrderInfo
    Detail --> OrderItems
    Detail --> Address
    Detail --> Assignment
    Detail --> Uploads
    Detail --> Status
    Detail --> Deliverables
    
    AdminPage --> useAdminOrders
    Detail --> useOrderDetails
    
    useAdminOrders --> AdminOrderService
    useOrderDetails --> OrderDetailService
    
    style AdminPage fill:#ffebee
    style Detail fill:#fff3e0
    style AdminOrderService fill:#e1bee7
```

---

## Photographer Management Flow

```mermaid
sequenceDiagram
    participant Admin
    participant PhotoMgmt as PhotographerManagement
    participant CreateForm as CreatePhotographerForm
    participant AssignForm as AssignPhotographerForm
    participant MapView as PhotographerMapView
    participant EdgeFn as create-photographer<br/>Edge Function
    participant Database
    
    Admin->>PhotoMgmt: Open management page
    PhotoMgmt->>Database: Fetch all photographers
    Database-->>PhotoMgmt: Photographer list
    PhotoMgmt->>MapView: Display on map
    
    alt Create New Photographer
        Admin->>CreateForm: Fill photographer details
        CreateForm->>EdgeFn: Create photographer account
        EdgeFn->>Database: Create auth user
        EdgeFn->>Database: Create profile
        EdgeFn->>Database: Assign photographer role
        Database-->>EdgeFn: Success
        EdgeFn-->>CreateForm: Photographer created
        CreateForm-->>Admin: Success notification
    else Assign Existing User
        Admin->>AssignForm: Select existing user
        AssignForm->>Database: Add photographer role
        Database-->>AssignForm: Role assigned
        AssignForm-->>Admin: Success notification
    end
    
    Admin->>MapView: Update location/radius
    MapView->>Database: Update profile
    Database-->>MapView: Updated
    MapView-->>Admin: Show updated coverage
```

---

## File Storage Architecture

```mermaid
graph LR
    subgraph "Client Upload"
        User[User]
        FileUpload[FileUploadZone]
    end
    
    subgraph "Validation"
        ValidateEdgeFn[validate-file-upload<br/>Edge Function]
    end
    
    subgraph "Storage Buckets"
        OrderUploads[(order-uploads<br/>Bucket)]
        OrderDeliverables[(order-deliverables<br/>Bucket)]
    end
    
    subgraph "Database"
        UploadsTable[order_uploads Table]
        DeliverablesTable[order_deliverables Table]
    end
    
    User --> FileUpload
    FileUpload --> ValidateEdgeFn
    ValidateEdgeFn -.checks.-> FileUpload
    
    alt Valid File
        FileUpload --> OrderUploads
        OrderUploads --> UploadsTable
    end
    
    subgraph "Admin Delivery"
        Admin[Admin]
        DeliverableUpload[DeliverableUploadSection]
    end
    
    Admin --> DeliverableUpload
    DeliverableUpload --> OrderDeliverables
    OrderDeliverables --> DeliverablesTable
    
    style OrderUploads fill:#e3f2fd
    style OrderDeliverables fill:#c8e6c9
```

---

## Edge Functions Architecture

```mermaid
graph TB
    subgraph "Edge Functions"
        CreatePhoto[create-photographer]
        FindPhoto[find-available-photographers]
        Geocode[geocode-address]
        ResetPwd[reset-password]
        RequestReset[request-password-reset]
        SendReset[send-password-reset]
        TriggerZapier[trigger-zapier-webhook]
        ValidateFile[validate-file-upload]
    end
    
    subgraph "External APIs"
        Mapbox[Mapbox API]
        Resend[Resend Email API]
        Zapier[Zapier Webhooks]
    end
    
    subgraph "Database Operations"
        DB[(Supabase Database)]
    end
    
    CreatePhoto --> DB
    FindPhoto --> DB
    FindPhoto --> Mapbox
    Geocode --> Mapbox
    ResetPwd --> DB
    RequestReset --> DB
    RequestReset --> Resend
    SendReset --> Resend
    TriggerZapier --> Zapier
    ValidateFile -.validates.-> DB
    
    style CreatePhoto fill:#bbdefb
    style FindPhoto fill:#bbdefb
    style Geocode fill:#bbdefb
    style TriggerZapier fill:#c8e6c9
    style ValidateFile fill:#fff9c4
```

---

## Notification System

```mermaid
sequenceDiagram
    participant OrderSubmission
    participant NotificationService
    participant Database
    participant Admin1
    participant Admin2
    participant NotificationBell
    
    OrderSubmission->>NotificationService: Create notifications
    
    loop For each admin
        NotificationService->>Database: Fetch admin users
        Database-->>NotificationService: Admin list
        NotificationService->>Database: Insert notification
    end
    
    Database-->>NotificationService: Notifications created
    
    Admin1->>NotificationBell: Open dropdown
    NotificationBell->>Database: Fetch unread count
    Database-->>NotificationBell: Count: 5
    NotificationBell->>Database: Fetch notifications
    Database-->>NotificationBell: Notification list
    NotificationBell-->>Admin1: Display notifications
    
    Admin1->>NotificationBell: Click notification
    NotificationBell->>Database: Mark as read
    Database-->>NotificationBell: Updated
    NotificationBell->>Admin1: Navigate to order
```

---

## Key Architectural Decisions

### 1. Service Layer Pattern
- **Decision**: Implement dedicated service classes for business logic
- **Benefits**: 
  - Separation of concerns
  - Testability
  - Reusability
  - Maintainability

### 2. Custom Hooks for State
- **Decision**: Create custom hooks wrapping services + React Query
- **Benefits**:
  - Encapsulated data fetching
  - Automatic caching
  - Optimistic updates
  - Consistent error handling

### 3. Strategy Pattern for Pricing
- **Decision**: Base pricing service with category-specific implementations
- **Benefits**:
  - Extensibility for new categories
  - Consistent interface
  - Isolated pricing logic

### 4. Component Composition
- **Decision**: Break large components into focused sub-components
- **Benefits**:
  - Reusability
  - Easier testing
  - Better readability
  - Reduced complexity

### 5. Validation Layer
- **Decision**: Dedicated validation services
- **Benefits**:
  - Centralized validation logic
  - Consistent error messages
  - Business rule enforcement
  - Easy to test

---

## Performance Optimizations

### 1. React Query Caching
```typescript
// Configured cache times
staleTime: 30000,  // 30 seconds
gcTime: 300000,    // 5 minutes
```

### 2. Component Lazy Loading
```typescript
const OrderWizard = lazy(() => import('./OrderWizard'));
```

### 3. Memoization
```typescript
const memoizedValue = useMemo(() => 
  expensiveCalculation(data), 
  [data]
);
```

### 4. Query Key Management
```typescript
queryKey: ['user-orders', user?.id]  // Automatic invalidation
```

---

## Security Architecture

### 1. Row-Level Security (RLS)
```sql
-- Users can only view their own orders
CREATE POLICY "Users can view their own orders"
ON orders FOR SELECT
USING (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
ON orders FOR SELECT
USING (is_admin(auth.uid()));
```

### 2. Role-Based Access Control
```typescript
// Separate user_roles table
// Security definer functions: is_admin(), has_role()
// Protected routes with role checks
```

### 3. Edge Function Security
```typescript
// Service role access for elevated permissions
// Rate limiting on sensitive endpoints
// Input validation and sanitization
```

---

## Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevCode[Local Development]
        Git[Git Repository]
    end
    
    subgraph "Lovable Platform"
        Frontend[Frontend Deployment]
        Backend[Backend Auto-Deploy]
    end
    
    subgraph "Production"
        CDN[Lovable CDN]
        SubabaseDB[(Supabase Database)]
        EdgeFns[Edge Functions]
        Storage[Storage Buckets]
    end
    
    subgraph "Custom Domain"
        Domain[app.spaceseller.de]
    end
    
    DevCode --> Git
    Git --> Frontend
    Git --> Backend
    
    Frontend --> CDN
    Backend --> EdgeFns
    Backend --> SubabaseDB
    Backend --> Storage
    
    CDN --> Domain
    Domain --> User[End Users]
    
    style Frontend fill:#e3f2fd
    style Backend fill:#c8e6c9
    style CDN fill:#fff9c4
```

---

## Monitoring & Logging

### Database Monitoring
- Query performance tracking
- Connection pool monitoring
- RLS policy verification

### Application Monitoring
- Error tracking via console
- Network request logging
- User interaction analytics

### Edge Function Logging
- Execution logs
- Error rates
- Latency metrics

---

## Future Architecture Enhancements

### 1. Real-time Features
- WebSocket connections for live updates
- Real-time order status changes
- Live photographer availability

### 2. Advanced Caching
- Service worker for offline support
- IndexedDB for local data persistence
- Background sync for uploads

### 3. Performance Monitoring
- Lighthouse CI integration
- Core Web Vitals tracking
- Bundle size monitoring

### 4. E2E Testing
- Playwright test suite
- Visual regression testing
- Performance testing

---

*Generated: 2025-01-23*
*Project: Spaceseller Platform*
*Refactoring Phases: 1-12*
