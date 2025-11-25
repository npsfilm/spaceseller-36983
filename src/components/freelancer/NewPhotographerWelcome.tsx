import { motion } from 'framer-motion';
import { Camera, CheckCircle, Circle, MapPin, Calendar, CreditCard, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NewPhotographerWelcomeProps {
  missingFields: string[];
  completionPercentage: number;
}

export const NewPhotographerWelcome = ({ missingFields, completionPercentage }: NewPhotographerWelcomeProps) => {
  const navigate = useNavigate();

  const checklistItems = [
    {
      key: 'profile',
      label: 'Profil vervollständigen',
      icon: Award,
      fields: ['vorname', 'nachname', 'telefon'],
      completed: !missingFields.some(f => ['vorname', 'nachname', 'telefon'].includes(f))
    },
    {
      key: 'location',
      label: 'Standort & Serviceradius festlegen',
      icon: MapPin,
      fields: ['location_lat', 'location_lng', 'service_radius_km'],
      completed: !missingFields.some(f => ['location_lat', 'location_lng', 'service_radius_km'].includes(f))
    },
    {
      key: 'availability',
      label: 'Verfügbarkeit einstellen',
      icon: Calendar,
      fields: ['available_weekdays'],
      completed: !missingFields.includes('available_weekdays')
    },
    {
      key: 'banking',
      label: 'Bankverbindung hinzufügen',
      icon: CreditCard,
      fields: ['iban', 'bic', 'kontoinhaber'],
      completed: !missingFields.some(f => ['iban', 'bic', 'kontoinhaber'].includes(f))
    }
  ];

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
            {checklistItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${
                    item.completed 
                      ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900' 
                      : 'bg-muted/50 border-border'
                  }`}
                >
                  {item.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  )}
                  <Icon className={`h-4 w-4 ${item.completed ? 'text-green-600 dark:text-green-400' : 'text-muted-foreground'}`} />
                  <span className={`text-sm ${item.completed ? 'font-medium' : ''}`}>
                    {item.label}
                  </span>
                </motion.div>
              );
            })}
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
