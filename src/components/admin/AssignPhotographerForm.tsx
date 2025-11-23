import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { photographerService, type User } from '@/lib/services/PhotographerService';
import { useToast } from '@/hooks/use-toast';

interface AssignPhotographerFormProps {
  users: User[];
  onSuccess: () => void;
  onCancel: () => void;
}

export const AssignPhotographerForm = ({ users, onSuccess, onCancel }: AssignPhotographerFormProps) => {
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!selectedUser) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie einen Benutzer aus',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await photographerService.assignPhotographerRole(selectedUser);

      toast({
        title: 'Erfolg',
        description: 'Fotograf wurde erfolgreich hinzugefügt',
      });

      setSelectedUser('');
      onSuccess();
    } catch (error) {
      console.error('Error adding photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fotograf konnte nicht hinzugefügt werden',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4 py-4">
      <Select value={selectedUser} onValueChange={setSelectedUser}>
        <SelectTrigger>
          <SelectValue placeholder="Benutzer auswählen..." />
        </SelectTrigger>
        <SelectContent>
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.profiles?.vorname && user.profiles?.nachname 
                ? `${user.profiles.vorname} ${user.profiles.nachname} (${user.email})`
                : user.email
              }
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <Button
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Abbrechen
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!selectedUser || isSubmitting}
        >
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Hinzufügen
        </Button>
      </div>
    </div>
  );
};
