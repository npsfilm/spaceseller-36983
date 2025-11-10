import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Plus, Check, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  base_price: number;
  category: string;
}

interface SelectedUpgrade {
  upgradeId: string;
  quantity: number;
  price: number;
}

interface UpgradesStepProps {
  selectedUpgrades: SelectedUpgrade[];
  onUpdateUpgrades: (upgrades: SelectedUpgrade[]) => void;
  virtualStagingCount: number;
  onUpdateVirtualStagingCount: (count: number) => void;
  onNext: () => void;
  onBack: () => void;
  category: string;
}

export const UpgradesStep = ({
  selectedUpgrades,
  onUpdateUpgrades,
  virtualStagingCount,
  onUpdateVirtualStagingCount,
  onNext,
  onBack,
  category
}: UpgradesStepProps) => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUpgrades();
  }, [category]);

  const loadUpgrades = async () => {
    try {
      const { data, error } = await supabase
        .from('upgrades')
        .select('*')
        .eq('is_active', true)
        .or(`category.eq.${category},category.eq.general`);

      if (error) throw error;
      setUpgrades(data || []);
    } catch (error) {
      console.error('Error loading upgrades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpgradeToggle = (upgrade: Upgrade) => {
    const existing = selectedUpgrades.find(u => u.upgradeId === upgrade.id);
    
    if (existing) {
      // Remove upgrade
      onUpdateUpgrades(selectedUpgrades.filter(u => u.upgradeId !== upgrade.id));
    } else {
      // Add upgrade
      onUpdateUpgrades([
        ...selectedUpgrades,
        {
          upgradeId: upgrade.id,
          quantity: 1,
          price: upgrade.base_price
        }
      ]);
    }
  };

  const isUpgradeSelected = (upgradeId: string) => {
    return selectedUpgrades.some(u => u.upgradeId === upgradeId);
  };

  // Virtual Staging Price Calculator
  const calculateStagingPrice = (count: number): number => {
    if (count === 0) return 0;
    
    const BASE_PRICE = 49;
    let discount = 0;
    
    if (count >= 5) discount = 0.15;
    else if (count >= 3) discount = 0.10;
    
    const pricePerImage = BASE_PRICE * (1 - discount);
    return pricePerImage * count;
  };

  const stagingTotal = calculateStagingPrice(virtualStagingCount);
  const stagingDiscount = virtualStagingCount >= 5 ? 15 : virtualStagingCount >= 3 ? 10 : 0;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mb-4">Optionale Upgrades</h1>
        <p className="text-lg text-muted-foreground">
          Erweitern Sie Ihr Paket mit zusätzlichen Leistungen
        </p>
      </motion.div>

      {/* Virtual Staging Calculator (if applicable) */}
      {category === 'photography' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Virtual Staging</h2>
                {stagingDiscount > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {stagingDiscount}% Mengenrabatt!
                  </Badge>
                )}
              </div>
              
              <p className="text-muted-foreground">
                Digitale Möblierung Ihrer Räume - realistische 3D-Visualisierung
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base">Anzahl der Räume</Label>
                  <Input
                    type="number"
                    min="0"
                    value={virtualStagingCount}
                    onChange={(e) => onUpdateVirtualStagingCount(Math.max(0, parseInt(e.target.value) || 0))}
                    className="text-lg h-14"
                  />
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>• Basis: €49 pro Raum</p>
                    <p>• Ab 3 Räume: 10% Rabatt</p>
                    <p>• Ab 5 Räume: 15% Rabatt</p>
                  </div>
                </div>

                <div className="flex flex-col justify-center p-6 bg-card rounded-xl border">
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">Gesamt</p>
                    <p className="text-4xl font-bold text-primary">
                      €{stagingTotal.toFixed(2)}
                    </p>
                    {stagingDiscount > 0 && (
                      <p className="text-sm text-accent font-medium">
                        Sie sparen {stagingDiscount}% = €{((virtualStagingCount * 49) - stagingTotal).toFixed(2)}
                      </p>
                    )}
                    {virtualStagingCount > 0 && (
                      <p className="text-xs text-muted-foreground">
                        €{(stagingTotal / virtualStagingCount).toFixed(2)} pro Raum
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Available Upgrades */}
      {upgrades.length > 0 && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Weitere Upgrades</h2>
            <p className="text-muted-foreground">Wählen Sie zusätzliche Leistungen</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upgrades.map((upgrade) => {
              const isSelected = isUpgradeSelected(upgrade.id);
              
              return (
                <motion.div key={upgrade.id} variants={itemVariants}>
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      isSelected ? 'border-2 border-primary bg-primary/5' : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleUpgradeToggle(upgrade)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{upgrade.name}</h3>
                          <p className="text-sm text-muted-foreground">{upgrade.description}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-primary border-primary' : 'border-border'
                        }`}>
                          {isSelected && <Check className="h-4 w-4 text-primary-foreground" />}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <span className="text-2xl font-bold text-primary">
                          €{upgrade.base_price}
                        </span>
                        <Button
                          size="sm"
                          variant={isSelected ? "secondary" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUpgradeToggle(upgrade);
                          }}
                        >
                          {isSelected ? (
                            <>
                              <Check className="h-4 w-4 mr-1" />
                              Hinzugefügt
                            </>
                          ) : (
                            <>
                              <Plus className="h-4 w-4 mr-1" />
                              Hinzufügen
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Skip Option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-center py-4"
      >
        <p className="text-muted-foreground">
          Keine Upgrades benötigt? Einfach weiter zum nächsten Schritt
        </p>
      </motion.div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-5 w-5" />
          Zurück
        </Button>
        <Button onClick={onNext} className="gap-2">
          Weiter zur Adresse
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};