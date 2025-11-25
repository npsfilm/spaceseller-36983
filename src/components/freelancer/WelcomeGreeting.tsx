import { motion } from 'framer-motion';
import { Sun, Moon, CloudSun, Stars } from 'lucide-react';
import { usePhotographerProfile } from '@/lib/hooks/usePhotographerProfile';

interface WelcomeGreetingProps {
  pendingCount: number;
  nextShootingDate?: string | null;
}

export const WelcomeGreeting = ({ pendingCount, nextShootingDate }: WelcomeGreetingProps) => {
  const { profile } = usePhotographerProfile();
  
  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return { text: 'Guten Morgen', icon: Sun, color: 'text-yellow-500' };
    } else if (hour >= 12 && hour < 18) {
      return { text: 'Guten Tag', icon: CloudSun, color: 'text-orange-500' };
    } else if (hour >= 18 && hour < 22) {
      return { text: 'Guten Abend', icon: Moon, color: 'text-blue-500' };
    } else {
      return { text: 'Gute Nacht', icon: Stars, color: 'text-indigo-500' };
    }
  };

  const getSubtitle = () => {
    if (pendingCount > 0) {
      return `Sie haben ${pendingCount} ${pendingCount === 1 ? 'neuen Auftrag' : 'neue Aufträge'} zur Prüfung`;
    }
    if (nextShootingDate) {
      const date = new Date(nextShootingDate);
      const formattedDate = date.toLocaleDateString('de-DE', { 
        day: '2-digit', 
        month: '2-digit',
        year: 'numeric'
      });
      return `Ihr nächstes Shooting ist am ${formattedDate}`;
    }
    return 'Aktuell keine neuen Aufträge';
  };

  const greeting = getTimeOfDayGreeting();
  const Icon = greeting.icon;
  const firstName = profile?.vorname || 'Fotograf';

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-primary/10 via-primary/5 to-background rounded-lg p-6 mb-6"
    >
      <div className="flex items-center gap-3">
        <Icon className={`h-8 w-8 ${greeting.color}`} />
        <div>
          <h1 className="text-3xl font-bold">
            {greeting.text}, {firstName}!
          </h1>
          <p className="text-muted-foreground mt-1">{getSubtitle()}</p>
        </div>
      </div>
    </motion.div>
  );
};
