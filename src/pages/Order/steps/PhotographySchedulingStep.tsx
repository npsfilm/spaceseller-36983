import { useState } from 'react';
import { Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { ConfigurationHeader } from '../components/shared';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PhotographySchedulingStepProps {
  primaryDate: Date | null;
  primaryTime: string | null;
  alternativeDate: Date | null;
  alternativeTime: string | null;
  onPrimaryDateChange: (date: Date | null) => void;
  onPrimaryTimeChange: (time: string | null) => void;
  onAlternativeDateChange: (date: Date | null) => void;
  onAlternativeTimeChange: (time: string | null) => void;
}

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export const PhotographySchedulingStep = ({
  primaryDate,
  primaryTime,
  alternativeDate,
  alternativeTime,
  onPrimaryDateChange,
  onPrimaryTimeChange,
  onAlternativeDateChange,
  onAlternativeTimeChange
}: PhotographySchedulingStepProps) => {
  return (
    <div className="min-h-screen py-8">
      <ConfigurationHeader
        icon={CalendarIcon}
        title="Wunschdatum & Uhrzeit"
        description="Wählen Sie Ihren bevorzugten Termin und einen Alternativtermin"
      />

      <div className="max-w-4xl mx-auto px-4 mt-12 space-y-12">
        
        {/* Primary Date & Time */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
              1
            </div>
            <h3 className="text-2xl font-semibold">Wunschtermin</h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Date Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Datum auswählen</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 text-base",
                      !primaryDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {primaryDate ? format(primaryDate, "PPP", { locale: de }) : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={primaryDate || undefined}
                    onSelect={onPrimaryDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Uhrzeit auswählen</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    variant={primaryTime === time ? "default" : "outline"}
                    onClick={() => onPrimaryTimeChange(time)}
                    className="h-12"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Alternative Date & Time */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-semibold">
              2
            </div>
            <h3 className="text-2xl font-semibold">Alternativtermin (optional)</h3>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-6">
            {/* Date Picker */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Alternativdatum auswählen</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-14 text-base",
                      !alternativeDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {alternativeDate ? format(alternativeDate, "PPP", { locale: de }) : "Datum wählen"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={alternativeDate || undefined}
                    onSelect={onAlternativeDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time Slots */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Uhrzeit auswählen</label>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {TIME_SLOTS.map((time) => (
                  <Button
                    key={time}
                    variant={alternativeTime === time ? "default" : "outline"}
                    onClick={() => onAlternativeTimeChange(time)}
                    className="h-12"
                  >
                    <Clock className="w-4 h-4 mr-2" />
                    {time}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-muted/50 border border-border rounded-xl p-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong>Hinweis:</strong> Wir bemühen uns, Ihren Wunschtermin zu realisieren.
            Sollte dieser nicht verfügbar sein, kontaktieren wir Sie zeitnah mit einer
            Alternative oder nutzen Ihren angegebenen Alternativtermin.
          </p>
        </div>
      </div>
    </div>
  );
};
