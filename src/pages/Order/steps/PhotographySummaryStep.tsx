import { useState, useMemo } from 'react';
import { CheckCircle2, FileText, Shield, Award } from 'lucide-react';
import { PACKAGE_TIERS } from '@/data/photographyPackages';
import { ADD_ONS } from '@/data/photographyAddOns';
import { photographyPricingService } from '@/lib/services/CategoryPricingService';
import { ConfigurationHeader, PricingSummaryPanel, type LineItem } from '../components/shared';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface PhotographySummaryStepProps {
  selectedPackage: string | null;
  selectedAddOns: string[];
  travelCost: number;
  primaryDate: Date | null;
  primaryTime: string | null;
  alternativeDate: Date | null;
  alternativeTime: string | null;
  address: {
    strasse: string;
    hausnummer: string;
    plz: string;
    stadt: string;
  };
  agbAccepted: boolean;
  privacyAccepted: boolean;
  onAgbChange: (checked: boolean) => void;
  onPrivacyChange: (checked: boolean) => void;
}

export const PhotographySummaryStep = ({
  selectedPackage,
  selectedAddOns,
  travelCost,
  primaryDate,
  primaryTime,
  alternativeDate,
  alternativeTime,
  address,
  agbAccepted,
  privacyAccepted,
  onAgbChange,
  onPrivacyChange
}: PhotographySummaryStepProps) => {
  const selectedPackageData = PACKAGE_TIERS.find(p => p.id === selectedPackage);
  
  const selectedAddOnsData = selectedAddOns
    .map(id => ADD_ONS.find(a => a.id === id))
    .filter(Boolean) as typeof ADD_ONS;

  const pricingBreakdown = useMemo(() => {
    if (!selectedPackageData) return null;

    const addOnItems = selectedAddOnsData.map(addOn => ({
      id: addOn.id,
      price: addOn.price,
      quantity: 1
    }));

    return photographyPricingService.calculatePackageTotal(
      selectedPackageData.price,
      addOnItems,
      travelCost
    );
  }, [selectedPackageData, selectedAddOnsData, travelCost]);

  const summaryItems: LineItem[] = useMemo(() => {
    const items: LineItem[] = [];

    if (selectedPackageData) {
      items.push({
        id: 'package',
        label: `${selectedPackageData.name} (${selectedPackageData.photoCount} Fotos)`,
        price: selectedPackageData.price
      });
    }

    selectedAddOnsData.forEach(addOn => {
      items.push({
        id: addOn.id,
        label: addOn.name,
        price: addOn.price
      });
    });

    return items;
  }, [selectedPackageData, selectedAddOnsData]);

  const additionalFees: LineItem[] = useMemo(() => {
    if (travelCost > 0) {
      return [{
        id: 'travel',
        label: 'Anfahrt inkludiert',
        price: 0
      }];
    }
    return [];
  }, [travelCost]);

  return (
    <div className="min-h-screen py-8">
      <ConfigurationHeader
        icon={CheckCircle2}
        title="Zusammenfassung & Abschluss"
        description="Überprüfen Sie Ihre Bestellung und schließen Sie die Buchung ab"
      />

      <div className="max-w-5xl mx-auto px-4 mt-12 space-y-12">
        
        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Paket & Leistungen */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              Gewähltes Paket & Leistungen
            </h3>
            <div className="space-y-3">
              {selectedPackageData && (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{selectedPackageData.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedPackageData.photoCount} Fotos
                    </p>
                  </div>
                  <p className="font-semibold">€{selectedPackageData.price}</p>
                </div>
              )}
              
              {selectedAddOnsData.length > 0 && (
                <>
                  <div className="border-t pt-3 mt-3">
                    <p className="text-sm font-medium text-muted-foreground mb-2">Zusatzleistungen:</p>
                    {selectedAddOnsData.map(addOn => (
                      <div key={addOn.id} className="flex justify-between items-center text-sm">
                        <span>{addOn.name}</span>
                        <span>€{addOn.price}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Termin & Adresse */}
          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" />
              Termin & Objektadresse
            </h3>
            <div className="space-y-3">
              {primaryDate && primaryTime && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Wunschtermin:</p>
                  <p className="font-medium">
                    {format(primaryDate, "EEEE, dd. MMMM yyyy", { locale: de })} um {primaryTime} Uhr
                  </p>
                </div>
              )}
              
              {alternativeDate && alternativeTime && (
                <div className="text-sm">
                  <p className="text-muted-foreground">Alternativtermin:</p>
                  <p>
                    {format(alternativeDate, "dd.MM.yyyy", { locale: de })} um {alternativeTime} Uhr
                  </p>
                </div>
              )}

              <div className="border-t pt-3 mt-3">
                <p className="text-sm font-medium text-muted-foreground mb-1">Objektadresse:</p>
                <p className="text-sm">
                  {address.strasse} {address.hausnummer}<br />
                  {address.plz} {address.stadt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        {selectedPackage && pricingBreakdown && (
          <PricingSummaryPanel
            items={summaryItems}
            subtotal={pricingBreakdown.subtotal}
            additionalFees={additionalFees}
            emptyMessage=""
          />
        )}

        {/* Terms & Conditions */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="text-lg font-semibold">Rechtliche Hinweise</h3>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox 
                id="agb" 
                checked={agbAccepted}
                onCheckedChange={onAgbChange}
                className="mt-1"
              />
              <Label htmlFor="agb" className="text-sm leading-relaxed cursor-pointer">
                Ich habe die{' '}
                <a href="/agb" target="_blank" className="text-primary hover:underline">
                  Allgemeinen Geschäftsbedingungen (AGB)
                </a>{' '}
                gelesen und akzeptiere diese.
              </Label>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox 
                id="privacy" 
                checked={privacyAccepted}
                onCheckedChange={onPrivacyChange}
                className="mt-1"
              />
              <Label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                Ich habe die{' '}
                <a href="/datenschutz" target="_blank" className="text-primary hover:underline">
                  Datenschutzerklärung
                </a>{' '}
                zur Kenntnis genommen und stimme der Verarbeitung meiner Daten zu.
              </Label>
            </div>
          </div>
        </div>

        {/* Trust Logos */}
        <div className="bg-muted/30 border border-border rounded-xl p-8">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">Ihre Vorteile mit spaceseller</h3>
            <p className="text-sm text-muted-foreground">
              Professionelle Immobilienfotografie mit Zufriedenheitsgarantie
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Sichere Zahlung</p>
                <p className="text-xs text-muted-foreground">SSL-verschlüsselt</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Qualitätsgarantie</p>
                <p className="text-xs text-muted-foreground">100% Zufriedenheit</p>
              </div>
            </div>

            <div className="flex flex-col items-center text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">Schnelle Lieferung</p>
                <p className="text-xs text-muted-foreground">48-72 Stunden</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
