import { useState, useEffect } from "react";
import { format, addDays, addWeeks, addMonths, startOfMonth, endOfMonth } from "date-fns";
import { de } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WeekdaySelector } from "./WeekdaySelector";
import { UnavailabilityCard } from "./UnavailabilityCard";
import { AddUnavailabilityDialog } from "./AddUnavailabilityDialog";
import { Separator } from "@/components/ui/separator";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

interface AvailabilitySectionProps {
  photographerId: string;
}

interface UnavailablePeriod {
  id: string;
  date: string;
  reason?: string;
}

export const AvailabilitySection = ({ photographerId }: AvailabilitySectionProps) => {
  const [isGenerallyAvailable, setIsGenerallyAvailable] = useState(true);
  const [availableWeekdays, setAvailableWeekdays] = useState<number[]>([1, 2, 3, 4, 5]);
  const [unavailablePeriods, setUnavailablePeriods] = useState<UnavailablePeriod[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadAvailability();
  }, [photographerId]);

  const loadAvailability = async () => {
    try {
      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("available_weekdays")
        .eq("id", photographerId)
        .single();

      if (profileError) throw profileError;
      
      if (profile?.available_weekdays) {
        setAvailableWeekdays(profile.available_weekdays);
      }

      // Load unavailable dates
      const { data: unavailable, error: unavailableError } = await supabase
        .from("photographer_availability")
        .select("id, date, reason")
        .eq("photographer_id", photographerId)
        .eq("is_available", false)
        .gte("date", format(new Date(), "yyyy-MM-dd"))
        .order("date", { ascending: true });

      if (unavailableError) throw unavailableError;

      setUnavailablePeriods(unavailable || []);
    } catch (error) {
      console.error("Error loading availability:", error);
      toast.error("Fehler beim Laden der Verfügbarkeit");
    }
  };

  const handleAddUnavailability = async (startDate: Date, endDate: Date | null, reason: string) => {
    try {
      const dates: Date[] = [];
      const end = endDate || startDate;
      
      let currentDate = startDate;
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate = addDays(currentDate, 1);
      }

      const entries = dates.map(date => ({
        photographer_id: photographerId,
        date: format(date, "yyyy-MM-dd"),
        is_available: false,
        reason: reason,
      }));

      const { error } = await supabase
        .from("photographer_availability")
        .upsert(entries, { onConflict: "photographer_id,date" });

      if (error) throw error;

      toast.success("Zeitraum blockiert");
      loadAvailability();
    } catch (error) {
      console.error("Error adding unavailability:", error);
      toast.error("Fehler beim Blockieren des Zeitraums");
    }
  };

  const handleDeleteUnavailability = async (id: string) => {
    try {
      const { error } = await supabase
        .from("photographer_availability")
        .delete()
        .eq("id", id);

      if (error) throw error;

      toast.success("Blockierung entfernt");
      loadAvailability();
    } catch (error) {
      console.error("Error deleting unavailability:", error);
      toast.error("Fehler beim Entfernen der Blockierung");
    }
  };

  const handleQuickBlock = async (days: number) => {
    const startDate = new Date();
    const endDate = addDays(startDate, days - 1);
    await handleAddUnavailability(startDate, endDate, "Kurzfristig nicht verfügbar");
  };

  const handleBlockMonth = async () => {
    const startDate = startOfMonth(new Date());
    const endDate = endOfMonth(new Date());
    await handleAddUnavailability(startDate, endDate, "Monat blockiert");
  };

  const handleClearAll = async () => {
    try {
      const { error } = await supabase
        .from("photographer_availability")
        .delete()
        .eq("photographer_id", photographerId)
        .eq("is_available", false)
        .gte("date", format(new Date(), "yyyy-MM-dd"));

      if (error) throw error;

      toast.success("Alle Blockierungen entfernt");
      loadAvailability();
    } catch (error) {
      console.error("Error clearing blocks:", error);
      toast.error("Fehler beim Entfernen der Blockierungen");
    }
  };

  const handleSaveWeekdays = async () => {
    try {
      setIsSaving(true);
      
      const { error } = await supabase
        .from("profiles")
        .update({ available_weekdays: availableWeekdays })
        .eq("id", photographerId);

      if (error) throw error;

      toast.success("Arbeitstage gespeichert");
    } catch (error) {
      console.error("Error saving weekdays:", error);
      toast.error("Fehler beim Speichern");
    } finally {
      setIsSaving(false);
    }
  };

  const unavailableDates = unavailablePeriods.map(p => new Date(p.date));

  const hasNoWeekdays = availableWeekdays.length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-1">Verfügbarkeit *</h3>
        <p className="text-sm text-muted-foreground">
          Verwalten Sie Ihre Verfügbarkeit für neue Aufträge
        </p>
      </div>

      <Separator />

      {/* General Availability Toggle */}
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30">
        <div>
          <Label htmlFor="general-availability" className="text-base font-medium">
            Generell verfügbar
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Neue Aufträge annehmen
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={cn(
            "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
            isGenerallyAvailable 
              ? "bg-green-500/10 text-green-700 dark:text-green-400" 
              : "bg-destructive/10 text-destructive"
          )}>
            <div className={cn(
              "w-2 h-2 rounded-full",
              isGenerallyAvailable ? "bg-green-500" : "bg-destructive"
            )} />
            {isGenerallyAvailable ? "Verfügbar" : "Pausiert"}
          </div>
          <Switch
            id="general-availability"
            checked={isGenerallyAvailable}
            onCheckedChange={setIsGenerallyAvailable}
          />
        </div>
      </div>

      <Separator />

      {/* Regular Working Days */}
      <div className="space-y-3">
        <div>
          <Label className="text-base font-medium">Regelmäßige Arbeitstage</Label>
          <p className="text-sm text-muted-foreground mt-1">
            An diesen Wochentagen sind Sie grundsätzlich verfügbar
          </p>
        </div>
        <WeekdaySelector
          selectedDays={availableWeekdays}
          onChange={setAvailableWeekdays}
        />
        {hasNoWeekdays && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Bitte wählen Sie mindestens einen Arbeitstag aus
            </AlertDescription>
          </Alert>
        )}
        <Button onClick={handleSaveWeekdays} disabled={isSaving || hasNoWeekdays} size="sm">
          Arbeitstage speichern
        </Button>
      </div>

      <Separator />

      {/* Blocked Periods */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-medium">Blockierte Zeiträume</Label>
            <p className="text-sm text-muted-foreground mt-1">
              Einzelne Tage oder Zeiträume, an denen Sie nicht verfügbar sind
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} variant="outline">
            + Zeitraum hinzufügen
          </Button>
        </div>

        {unavailablePeriods.length > 0 ? (
          <div className="space-y-2">
            {unavailablePeriods.map(period => (
              <UnavailabilityCard
                key={period.id}
                id={period.id}
                startDate={period.date}
                reason={period.reason}
                onDelete={handleDeleteUnavailability}
              />
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground py-4 text-center border rounded-lg bg-muted/20">
            Keine blockierten Zeiträume
          </p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <Label className="text-base font-medium">Schnellaktionen</Label>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => handleQuickBlock(7)} variant="outline" size="sm">
            Nächste 7 Tage blockieren
          </Button>
          <Button onClick={() => handleQuickBlock(14)} variant="outline" size="sm">
            Nächste 2 Wochen blockieren
          </Button>
          <Button onClick={handleBlockMonth} variant="outline" size="sm">
            Monat blockieren
          </Button>
          {unavailablePeriods.length > 0 && (
            <Button onClick={handleClearAll} variant="outline" size="sm" className="text-destructive">
              Alle Blockierungen entfernen
            </Button>
          )}
        </div>
      </div>

      <AddUnavailabilityDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onAdd={handleAddUnavailability}
      />
    </div>
  );
};
