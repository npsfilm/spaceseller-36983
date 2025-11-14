import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface DeclineReasonDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string, additionalNotes?: string) => void;
}

const DECLINE_REASONS = [
  { value: 'not_available_date', label: 'Nicht verfügbar an diesem Datum' },
  { value: 'not_available_time', label: 'Nicht verfügbar zu dieser Uhrzeit' },
  { value: 'too_far', label: 'Zu weit entfernt' },
  { value: 'schedule_conflict', label: 'Terminkonflikt' },
  { value: 'equipment_unavailable', label: 'Ausrüstung nicht verfügbar' },
  { value: 'other', label: 'Anderer Grund' }
];

export const DeclineReasonDialog = ({ open, onClose, onConfirm }: DeclineReasonDialogProps) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');

  const handleConfirm = () => {
    if (!selectedReason) return;
    
    const reasonLabel = DECLINE_REASONS.find(r => r.value === selectedReason)?.label || selectedReason;
    const fullReason = additionalNotes 
      ? `${reasonLabel}: ${additionalNotes}`
      : reasonLabel;
    
    onConfirm(selectedReason, fullReason);
    setSelectedReason('');
    setAdditionalNotes('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Grund für Ablehnung</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Bitte wählen Sie einen Grund für die Ablehnung:
          </p>
          
          <RadioGroup value={selectedReason} onValueChange={setSelectedReason}>
            {DECLINE_REASONS.map(reason => (
              <div key={reason.value} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.value} id={reason.value} />
                <Label htmlFor={reason.value} className="cursor-pointer">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
          
          {selectedReason === 'other' && (
            <Textarea
              placeholder="Bitte geben Sie weitere Details ein..."
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              rows={3}
            />
          )}
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={!selectedReason}
              variant="destructive"
            >
              Ablehnung bestätigen
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
