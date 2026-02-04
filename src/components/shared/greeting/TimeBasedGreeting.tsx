import { Sun, Moon, CloudSun, Stars, LucideIcon } from 'lucide-react';

export interface TimeGreeting {
  text: string;
  icon: LucideIcon;
  colorClass: string;
}

export const getTimeOfDayGreeting = (): TimeGreeting => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return { text: 'Guten Morgen', icon: Sun, colorClass: 'text-yellow-500' };
  } else if (hour >= 12 && hour < 18) {
    return { text: 'Guten Tag', icon: CloudSun, colorClass: 'text-orange-500' };
  } else if (hour >= 18 && hour < 22) {
    return { text: 'Guten Abend', icon: Moon, colorClass: 'text-blue-500' };
  } else {
    return { text: 'Gute Nacht', icon: Stars, colorClass: 'text-indigo-500' };
  }
};
