
# Phase 6 Nachbesserung: OrderWizard Vereinfachung

## Analyse

Der OrderWizard hat aktuell **424 Zeilen** und enthält trotz der bereits extrahierten Step-Komponenten zu viel Render-Logik:

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    AKTUELLE STRUKTUR (424 LOC)                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  IMPORTS & TYPES (25 LOC)                                               │
│  ├── 19 Imports                                                          │
│  └── getStepsForCategory() Hilfsfunktion                                │
│                                                                          │
│  HOOKS & HANDLER (60 LOC)                                               │
│  ├── useOrderState Destrukturierung                                     │
│  ├── handleStepClick, handleLocationValidated                           │
│  └── handleSubmitOrder                                                  │
│                                                                          │
│  RENDER-LOGIK (339 LOC) ← HIER IST DAS PROBLEM                          │
│  ├── Auto-Save Indicator Desktop (~25 LOC)                              │
│  ├── Step Router mit verschachtelten Bedingungen (~100 LOC)             │
│  ├── Auto-Save Indicator Mobile (~20 LOC) - DUPLIZIERT!                 │
│  └── Navigation Buttons (~70 LOC) mit 7 verschiedenen Zuständen         │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Plan: Extraktion von 3 Sub-Komponenten

### 1. AutoSaveIndicator Component

```typescript
// src/pages/Order/components/AutoSaveIndicator.tsx (NEU - ~40 LOC)

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
  onSaveNow: () => void;
  variant?: 'desktop' | 'mobile';
}

export const AutoSaveIndicator = ({
  isSaving,
  lastSaved,
  onSaveNow,
  variant = 'desktop'
}: AutoSaveIndicatorProps) => {
  // Unified component that renders differently based on variant
  // Eliminates ~20 lines of duplicated code
};
```

### 2. OrderStepRouter Component

```typescript
// src/pages/Order/components/OrderStepRouter.tsx (NEU - ~120 LOC)

interface OrderStepRouterProps {
  orderState: OrderState;
  services: Service[];
  
  // Step callbacks
  onLocationValidated: (travelCost: number, distance: number, available: boolean) => void;
  onBack: () => void;
  
  // Category callbacks
  onSelectCategory: (categoryId: string) => void;
  
  // Configuration callbacks
  onAreaRangeChange: (range: string) => void;
  onProductToggle: (serviceId: string, qty: number, price: number) => void;
  onPackageSelect: (packageId: string | null) => void;
  onAddOnToggle: (addOnId: string) => void;
  onSchedulingChange: (data: SchedulingData) => void;
  onSpecialInstructionsChange: (text: string) => void;
  onTermsChange: (agb: boolean, privacy: boolean) => void;
}

export const OrderStepRouter = ({ ... }: OrderStepRouterProps) => {
  // Single switch/case for step rendering
  // Replaces ~100 lines of nested conditionals
};
```

### 3. OrderNavigationBar Component

```typescript
// src/pages/Order/components/OrderNavigationBar.tsx (NEU - ~80 LOC)

interface OrderNavigationBarProps {
  orderState: OrderState;
  onPrevStep: () => void;
  onNextStep: () => void;
  onSubmit: () => void;
  
  // Auto-save props (for mobile indicator)
  isSaving?: boolean;
  lastSaved?: Date | null;
}

export const OrderNavigationBar = ({ ... }: OrderNavigationBarProps) => {
  // Unified navigation logic with validation checks
  // Replaces ~70 lines of repetitive button conditions
};
```

---

## Refaktorierter OrderWizard

Nach der Extraktion wird der Wizard auf **~150 LOC** reduziert:

```typescript
// src/pages/Order/OrderWizard.tsx (NACH REFACTORING)

export const OrderWizard = () => {
  const { services, orderState, ...actions } = useOrderState();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { lastSaved, isSaving, saveNow } = useDraftAutoSave(orderState, {
    enabled: true,
    intervalMs: 30000
  });

  const handleStepClick = (targetStep: number) => { ... };
  const handleLocationValidated = (...) => { ... };
  const handleSubmitOrder = async () => { ... };
  const getCategoryLabel = () => { ... };

  return (
    <OrderLayout>
      <div className="h-full flex flex-col">
        {/* Progress Indicator with Auto-Save */}
        <div className="relative">
          <ProgressIndicator
            steps={getStepsForCategory(orderState.selectedCategory)}
            currentStep={orderState.step}
            onStepClick={handleStepClick}
          />
          
          {orderState.step > 1 && (
            <AutoSaveIndicator
              variant="desktop"
              isSaving={isSaving}
              lastSaved={lastSaved}
              onSaveNow={saveNow}
            />
          )}
        </div>

        {/* Step Content */}
        <div className="flex-1 overflow-y-auto">
          <OrderStepRouter
            orderState={orderState}
            services={services}
            onLocationValidated={handleLocationValidated}
            onBack={() => navigate('/dashboard')}
            onSelectCategory={actions.setCategory}
            onAreaRangeChange={actions.setAreaRange}
            onProductToggle={actions.toggleProduct}
            onPackageSelect={actions.setPackage}
            onAddOnToggle={actions.toggleAddOn}
            onSchedulingChange={actions.setScheduling}
            onSpecialInstructionsChange={actions.setSpecialInstructions}
            onTermsChange={actions.setTermsAcceptance}
          />
        </div>

        {/* Navigation */}
        <OrderNavigationBar
          orderState={orderState}
          onPrevStep={actions.prevStep}
          onNextStep={actions.nextStep}
          onSubmit={handleSubmitOrder}
          isSaving={isSaving}
          lastSaved={lastSaved}
        />
      </div>
    </OrderLayout>
  );
};
```

---

## Neue Dateistruktur

```text
src/pages/Order/
├── OrderWizard.tsx                    (424 → ~150 LOC)
├── components/
│   ├── AutoSaveIndicator.tsx          (NEU - ~40 LOC)
│   ├── OrderStepRouter.tsx            (NEU - ~120 LOC)
│   ├── OrderNavigationBar.tsx         (NEU - ~80 LOC)
│   ├── ProgressIndicator.tsx          (unverändert)
│   └── shared/                        (unverändert)
│       ├── ConfigurationCard.tsx
│       ├── ConfigurationHeader.tsx
│       └── ...
└── steps/                             (unverändert)
    ├── LocationCheckStep.tsx
    ├── CategorySelectionStep.tsx
    ├── PhotographyPackageSelectionStep.tsx
    └── ...
```

---

## Zusammenfassung der Änderungen

| Aktion | Datei | LOC |
|--------|-------|-----|
| **NEU** | `src/pages/Order/components/AutoSaveIndicator.tsx` | ~40 |
| **NEU** | `src/pages/Order/components/OrderStepRouter.tsx` | ~120 |
| **NEU** | `src/pages/Order/components/OrderNavigationBar.tsx` | ~80 |
| **EDIT** | `src/pages/Order/OrderWizard.tsx` | 424 → ~150 |

---

## Metriken

| Metrik | Vorher | Nachher | Verbesserung |
|--------|--------|---------|--------------|
| OrderWizard LOC | 424 | ~150 | **-65%** |
| Verschachtelte Bedingungen | 7 | 0 | -100% |
| Duplizierter Code (Auto-Save) | 2x | 1x | -50% |
| Cyclomatic Complexity | Hoch | Niedrig | Signifikant |
| Testbarkeit | Schwierig | Einfach | Verbessert |

---

## Technische Details

### OrderStepRouter Logik

```typescript
// Vereinfachte Step-Routing-Logik
const renderStep = () => {
  const { step, selectedCategory } = orderState;

  // Step 1: Location (always)
  if (step === 1) return <LocationCheckStep ... />;

  // Step 2: Category Selection (always)
  if (step === 2) return <CategorySelectionStep ... />;

  // Photography Flow (steps 3-6)
  if (selectedCategory === 'onsite') {
    switch (step) {
      case 3: return <PhotographyPackageSelectionStep ... />;
      case 4: return <PhotographyAddOnsStep ... />;
      case 5: return <PhotographySchedulingStep ... />;
      case 6: return <PhotographySummaryStep ... />;
    }
  }

  // Other Categories (step 3 only)
  return (
    <TwoColumnLayout>
      <ProductConfigurationStep ... />
      <OrderSummarySidebar ... />
    </TwoColumnLayout>
  );
};
```

### OrderNavigationBar Validierung

```typescript
// Zentralisierte Validierungslogik
const getNavigationState = () => {
  const { step, selectedCategory } = orderState;

  return {
    showBackButton: step > 1,
    showNextButton: shouldShowNextButton(step, selectedCategory),
    showSubmitButton: shouldShowSubmitButton(step, selectedCategory),
    nextDisabled: !canProceedToNextStep(orderState),
    submitDisabled: !orderValidationService.canSubmitOrder(orderState)
  };
};
```

---

## Vorteile

### 1. Lesbarkeit
- OrderWizard zeigt nur noch die Orchestrierung
- Step-Logik in dediziertem Router
- Keine verschachtelten ternären Operatoren mehr

### 2. Testbarkeit
- `OrderStepRouter` isoliert testbar
- `OrderNavigationBar` Validierung testbar
- Klare Prop-Interfaces

### 3. Wartbarkeit
- Neue Steps nur im Router hinzufügen
- Navigation-Logik zentral änderbar
- Auto-Save nur einmal implementiert

### 4. Konsistenz
- Einheitliches Pattern für alle Flows
- Wiederverwendbare Sub-Komponenten
