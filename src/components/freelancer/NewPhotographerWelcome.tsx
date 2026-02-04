import { Camera, MapPin, Calendar, CreditCard, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChecklistItem, ProgressBar } from '@/components/shared';
import type { ChecklistItemData } from '@/components/shared';

interface NewPhotographerWelcomeProps {
  missingFields: string[];
  completionPercentage: number;
}

export const NewPhotographerWelcome = ({ missingFields, completionPercentage }: NewPhotographerWelcomeProps) => {
  const navigate = useNavigate();

  const checklistItems: ChecklistItemData[] = [
    {
      id: 'profile',
      label: 'Profil vervollständigen',
      icon: Award,
      completed: !missingFields.some(f => ['vorname', 'nachname', 'telefon'].includes(f))
    },
    {
      id: 'location',
      label: 'Standort & Serviceradius festlegen',
      icon: MapPin,
      completed: !missingFields.some(f => ['location_lat', 'location_lng', 'service_radius_km'].includes(f))
    },
    {
      id: 'availability',
      label: 'Verfügbarkeit einstellen',
      icon: Calendar,
      completed: !missingFields.includes('available_weekdays')
    },
    {
      id: 'banking',
      label: 'Bankverbindung hinzufügen',
      icon: CreditCard,
      completed: !missingFields.some(f => ['iban', 'bic', 'kontoinhaber'].includes(f))
    }
  ];

  const completedCount = checklistItems.filter(item => item.completed).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Camera className="h-16 w-16 text-primary" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-8 w-8 flex items-center justify-center text-sm font-bold"
              >
                {Math.round(completionPercentage)}%
              </motion.div>
            </div>
          </div>
          <CardTitle className="text-2xl">Willkommen bei spaceseller!</CardTitle>
          <p className="text-muted-foreground mt-2">
            Vervollständigen Sie Ihr Profil, um Aufträge zu erhalten
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
              Setup-Checkliste
            </h3>
            <ProgressBar 
              current={completedCount} 
              total={checklistItems.length} 
              showLabel={false}
            />
            {checklistItems.map((item, index) => (
              <ChecklistItem
                key={item.id}
                {...item}
                index={index}
                variant="freelancer"
              />
            ))}
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-sm">So funktioniert's:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Administratoren weisen Ihnen Aufträge zu</li>
              <li>• Sie erhalten Benachrichtigungen über neue Anfragen</li>
              <li>• Nehmen Sie Aufträge an oder lehnen Sie sie ab</li>
              <li>• Führen Sie Shootings durch und laden Sie die Ergebnisse hoch</li>
            </ul>
          </div>

          <Button 
            onClick={() => navigate('/settings')}
            className="w-full"
            size="lg"
          >
            Profil jetzt vervollständigen
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};
