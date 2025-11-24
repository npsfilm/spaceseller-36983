import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { usePhotographerManagement } from '@/lib/hooks/usePhotographerManagement';
import { photographerService } from '@/lib/services/PhotographerService';
import { CreatePhotographerForm } from '@/components/admin/CreatePhotographerForm';
import { AssignPhotographerForm } from '@/components/admin/AssignPhotographerForm';
import { EditPhotographerDialog } from '@/components/admin/EditPhotographerDialog';
import { PhotographersTable } from '@/components/admin/PhotographersTable';
import { PhotographerStatsCards } from '@/components/admin/PhotographerStatsCards';

export default function PhotographerManagement() {
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [editDialogUserId, setEditDialogUserId] = useState<string | null>(null);
  const { toast } = useToast();

  const { photographers, allUsers, loading, refreshData } = usePhotographerManagement();

  const handleCreateSuccess = () => {
    setAddDialogOpen(false);
    setActiveTab('existing');
    refreshData();
  };

  const handleCreateCancel = () => {
    setAddDialogOpen(false);
    setActiveTab('existing');
  };

  const handleEmailExists = () => {
    setActiveTab('existing');
    refreshData();
  };

  const handleAssignSuccess = () => {
    setAddDialogOpen(false);
    refreshData();
  };

  const handleAssignCancel = () => {
    setAddDialogOpen(false);
  };

  const handleEditPhotographer = (userId: string) => {
    setEditDialogUserId(userId);
  };

  const handleEditSuccess = () => {
    setEditDialogUserId(null);
    refreshData();
  };

  const handleRemovePhotographer = async (userId: string) => {
    if (!confirm('Möchten Sie die Fotografen-Rolle wirklich entfernen?')) {
      return;
    }

    try {
      await photographerService.removePhotographerRole(userId);

      toast({
        title: 'Erfolg',
        description: 'Fotografen-Rolle wurde entfernt',
      });

      refreshData();
    } catch (error) {
      console.error('Error removing photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fotografen-Rolle konnte nicht entfernt werden',
        variant: 'destructive',
      });
    }
  };

  const handleResendPasswordReset = async (userId: string) => {
    try {
      await photographerService.resendPasswordReset(userId);

      toast({
        title: 'Erfolg',
        description: 'Passwort-Reset-Link wurde erfolgreich versendet',
      });
    } catch (error) {
      console.error('Error resending password reset:', error);
      toast({
        title: 'Fehler',
        description: 'Passwort-Reset-Link konnte nicht versendet werden',
        variant: 'destructive',
      });
    }
  };

  return (
    <AdminLayout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Fotografen-Verwaltung - spaceseller</title>
      </Helmet>

      <div>
        <div className="flex justify-between items-center mb-8">
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Fotograf hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Fotograf hinzufügen</DialogTitle>
                <DialogDescription>
                  Wählen Sie einen bestehenden Benutzer oder erstellen Sie einen neuen Fotografen
                </DialogDescription>
              </DialogHeader>
              
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="existing">Bestehender Benutzer</TabsTrigger>
                  <TabsTrigger value="new">Neuer Fotograf</TabsTrigger>
                </TabsList>
                
                <TabsContent value="existing">
                  <AssignPhotographerForm
                    users={allUsers}
                    onSuccess={handleAssignSuccess}
                    onCancel={handleAssignCancel}
                  />
                </TabsContent>
                
                <TabsContent value="new">
                  <CreatePhotographerForm
                    onSuccess={handleCreateSuccess}
                    onCancel={handleCreateCancel}
                    onEmailExists={handleEmailExists}
                  />
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        <PhotographerStatsCards photographers={photographers} />

        <PhotographersTable
          photographers={photographers}
          loading={loading}
          onEdit={handleEditPhotographer}
          onRemove={handleRemovePhotographer}
          onResendPasswordReset={handleResendPasswordReset}
        />

        <EditPhotographerDialog
          open={editDialogUserId !== null}
          userId={editDialogUserId}
          onOpenChange={(open) => !open && setEditDialogUserId(null)}
          onSuccess={handleEditSuccess}
        />
      </div>
    </AdminLayout>
  );
}
