import { AreaRangeSelector } from '../components/AreaRangeSelector';
import { ProductCategoryCollapsible } from '../components/ProductCategoryCollapsible';
import { PackageSection } from '../components/PackageSection';
import { PhotoProductList } from '../components/PhotoProductList';
import { PackageTierList } from '../components/PackageTierList';
import { OrderSummaryCard } from '../components/OrderSummaryCard';
import type { Service } from '../OrderWizard';

interface ProductConfigurationStepProps {
  category: string | null;
  services: Service[];
  selectedAreaRange: string | null;
  selectedProducts: {
    [serviceId: string]: {
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }
  };
  selectedPackage: string | null;
  travelCost: number;
  onAreaRangeChange: (range: string) => void;
  onProductToggle: (serviceId: string, quantity: number, unitPrice: number) => void;
  onPackageSelect: (packageId: string | null) => void;
}

export const ProductConfigurationStep = ({
  category,
  services,
  selectedAreaRange,
  selectedProducts,
  selectedPackage,
  travelCost,
  onAreaRangeChange,
  onProductToggle,
  onPackageSelect
}: ProductConfigurationStepProps) => {
  const [activeView, setActiveView] = React.useState<'products' | 'package'>('products');
  const [activeCategory, setActiveCategory] = React.useState<string | null>(null);

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-3 space-y-4">
            <AreaRangeSelector
              selectedRange={selectedAreaRange}
              onRangeChange={onAreaRangeChange}
            />
            
            <ProductCategoryCollapsible
              activeCategory={activeCategory}
              selectedProducts={selectedProducts}
              onCategoryClick={(cat) => {
                setActiveCategory(cat);
                setActiveView('products');
              }}
            />
            
            <PackageSection
              selectedPackage={selectedPackage}
              onPackageClick={() => {
                setActiveView('package');
              }}
            />
          </div>

          {/* Main Content - Product/Package List */}
          <div className="lg:col-span-6">
            {activeView === 'products' && activeCategory === 'photo' && (
              <PhotoProductList
                services={services.filter(s => s.category === 'photography')}
                selectedAreaRange={selectedAreaRange}
                selectedProducts={selectedProducts}
                onProductToggle={onProductToggle}
              />
            )}

            {activeView === 'package' && (
              <PackageTierList
                selectedAreaRange={selectedAreaRange}
                selectedPackage={selectedPackage}
                onPackageSelect={onPackageSelect}
              />
            )}

            {!activeCategory && activeView === 'products' && (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                Wählen Sie eine Kategorie aus der linken Seitenleiste
              </div>
            )}
          </div>

          {/* Right Sidebar - Summary */}
          <div className="lg:col-span-3">
            <OrderSummaryCard
              selectedProducts={selectedProducts}
              services={services}
              travelCost={travelCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
