import { WelcomeSection, getTimeOfDayGreeting } from '@/components/shared';
import { usePhotographerProfile } from '@/lib/hooks/usePhotographerProfile';

interface WelcomeGreetingProps {
  pendingCount: number;
  nextShootingDate?: string | null;
}

export const WelcomeGreeting = ({ pendingCount, nextShootingDate }: WelcomeGreetingProps) => {
  const { profile } = usePhotographerProfile();
  
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

  const firstName = profile?.vorname || 'Fotograf';

  return (
    <WelcomeSection
      userName={firstName}
      subtitle={getSubtitle()}
      showTimeGreeting={true}
      variant="gradient"
    />
  );
};
