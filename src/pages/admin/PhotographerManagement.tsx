import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { UserPlus, UserMinus, Camera, TrendingUp, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';

interface Photographer {
  user_id: string;
  email: string;
  vorname: string;
  nachname: string;
  telefon: string;
  total_assignments: number;
  accepted: number;
  declined: number;
  completed: number;
  acceptance_rate: number;
}

interface User {
  id: string;
  email: string;
  profiles?: {
    vorname: string;
    nachname: string;
  };
}

export default function PhotographerManagement() {
  const [photographers, setPhotographers] = useState<Photographer[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('existing');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // New photographer form state
  const [newPhotographer, setNewPhotographer] = useState({
    email: '',
    vorname: '',
    nachname: '',
    telefon: '',
    strasse: '',
    plz: '',
    stadt: '',
    land: 'Deutschland',
    service_radius_km: 50
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchPhotographers();
    fetchAllUsers();
  }, []);

  const fetchPhotographers = async () => {
    try {
      setLoading(true);
      
      // Get all users with photographer role
      const { data: photographerRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'photographer');

      if (rolesError) throw rolesError;

      if (!photographerRoles || photographerRoles.length === 0) {
        setPhotographers([]);
        return;
      }

      const photographerIds = photographerRoles.map(r => r.user_id);

      // Get profiles for these users
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, vorname, nachname, telefon')
        .in('id', photographerIds);

      if (profilesError) throw profilesError;

      // Get assignment stats for each photographer
      const photographersWithStats = await Promise.all(
        (profiles || []).map(async (profile) => {
          const { data: assignments } = await (supabase as any)
            .from('order_assignments')
            .select('status')
            .eq('photographer_id', profile.id);

          const total = assignments?.length || 0;
          const accepted = assignments?.filter((a: any) => a.status === 'accepted' || a.status === 'completed').length || 0;
          const declined = assignments?.filter((a: any) => a.status === 'declined').length || 0;
          const completed = assignments?.filter((a: any) => a.status === 'completed').length || 0;
          const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;

          return {
            user_id: profile.id,
            email: profile.email,
            vorname: profile.vorname || '',
            nachname: profile.nachname || '',
            telefon: profile.telefon || '',
            total_assignments: total,
            accepted,
            declined,
            completed,
            acceptance_rate: Math.round(acceptanceRate),
          };
        })
      );

      setPhotographers(photographersWithStats);
    } catch (error) {
      console.error('Error fetching photographers:', error);
      toast({
        title: 'Fehler',
        description: 'Fotografen konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, vorname, nachname')
        .order('email');

      if (error) throw error;

      // Get existing photographer IDs
      const { data: photographerRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .eq('role', 'photographer');

      const photographerIds = new Set(photographerRoles?.map(r => r.user_id) || []);

      // Filter out users who are already photographers
      const nonPhotographers = (data || []).filter(user => !photographerIds.has(user.id));

      setAllUsers(nonPhotographers.map(user => ({
        id: user.id,
        email: user.email,
        profiles: {
          vorname: user.vorname || '',
          nachname: user.nachname || ''
        }
      })));
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Validation schema
  const newPhotographerSchema = z.object({
    email: z.string().email('Ungültige E-Mail-Adresse'),
    vorname: z.string().min(1, 'Vorname ist erforderlich'),
    nachname: z.string().min(1, 'Nachname ist erforderlich'),
    telefon: z.string().optional(),
    strasse: z.string().optional(),
    plz: z.string().optional(),
    stadt: z.string().optional(),
    land: z.string().min(1, 'Land ist erforderlich'),
    service_radius_km: z.number().min(10).max(200)
  });

  const validateNewPhotographerForm = () => {
    try {
      newPhotographerSchema.parse(newPhotographer);
      setFormErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0].toString()] = err.message;
          }
        });
        setFormErrors(errors);
      }
      return false;
    }
  };

  const createNewPhotographer = async () => {
    if (!validateNewPhotographerForm()) {
      toast({
        title: 'Validierungsfehler',
        description: 'Bitte überprüfen Sie die Formulareingaben',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-photographer', {
        body: newPhotographer
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      toast({
        title: 'Fotograf erstellt',
        description: data.message || 'Der Fotograf wurde erfolgreich erstellt',
      });

      // Reset form
      setNewPhotographer({
        email: '',
        vorname: '',
        nachname: '',
        telefon: '',
        strasse: '',
        plz: '',
        stadt: '',
        land: 'Deutschland',
        service_radius_km: 50
      });
      setFormErrors({});
      setAddDialogOpen(false);
      setActiveTab('existing');
      
      // Refresh the photographers list
      await fetchPhotographers();
      await fetchAllUsers();
    } catch (error: any) {
      console.error('Error creating photographer:', error);
      toast({
        title: 'Fehler',
        description: error.message || 'Fotograf konnte nicht erstellt werden',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const addPhotographerRole = async () => {
    if (!selectedUser) {
      toast({
        title: 'Fehler',
        description: 'Bitte wählen Sie einen Benutzer aus',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('user_roles')
        .insert({
          user_id: selectedUser,
          role: 'photographer',
          created_by: userData?.user?.id
        });

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Fotograf wurde erfolgreich hinzugefügt',
      });

      setAddDialogOpen(false);
      setSelectedUser('');
      fetchPhotographers();
      fetchAllUsers();
    } catch (error) {
      console.error('Error adding photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fotograf konnte nicht hinzugefügt werden',
        variant: 'destructive',
      });
    }
  };

  const removePhotographerRole = async (userId: string) => {
    if (!confirm('Möchten Sie die Fotografen-Rolle wirklich entfernen?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId)
        .eq('role', 'photographer');

      if (error) throw error;

      toast({
        title: 'Erfolg',
        description: 'Fotografen-Rolle wurde entfernt',
      });

      fetchPhotographers();
      fetchAllUsers();
    } catch (error) {
      console.error('Error removing photographer:', error);
      toast({
        title: 'Fehler',
        description: 'Fotografen-Rolle konnte nicht entfernt werden',
        variant: 'destructive',
      });
    }
  };

  const getAcceptanceRateBadge = (rate: number) => {
    if (rate >= 80) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (rate >= 60) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
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
                
                <TabsContent value="existing" className="space-y-4">
                  <div className="py-4">
                    <Select value={selectedUser} onValueChange={setSelectedUser}>
                      <SelectTrigger>
                        <SelectValue placeholder="Benutzer auswählen..." />
                      </SelectTrigger>
                      <SelectContent>
                        {allUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.profiles?.vorname && user.profiles?.nachname 
                              ? `${user.profiles.vorname} ${user.profiles.nachname} (${user.email})`
                              : user.email
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAddDialogOpen(false);
                        setSelectedUser('');
                      }}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={addPhotographerRole}
                      disabled={!selectedUser || isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Hinzufügen
                    </Button>
                  </DialogFooter>
                </TabsContent>
                
                <TabsContent value="new" className="space-y-4">
                  <div className="space-y-4 py-4">
                    {/* Contact Information Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Kontaktdaten</h4>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="vorname">Vorname *</Label>
                          <Input
                            id="vorname"
                            value={newPhotographer.vorname}
                            onChange={(e) => setNewPhotographer({ ...newPhotographer, vorname: e.target.value })}
                            placeholder="Max"
                          />
                          {formErrors.vorname && <p className="text-sm text-destructive">{formErrors.vorname}</p>}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="nachname">Nachname *</Label>
                          <Input
                            id="nachname"
                            value={newPhotographer.nachname}
                            onChange={(e) => setNewPhotographer({ ...newPhotographer, nachname: e.target.value })}
                            placeholder="Mustermann"
                          />
                          {formErrors.nachname && <p className="text-sm text-destructive">{formErrors.nachname}</p>}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-Mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={newPhotographer.email}
                          onChange={(e) => setNewPhotographer({ ...newPhotographer, email: e.target.value })}
                          placeholder="max@beispiel.de"
                        />
                        {formErrors.email && <p className="text-sm text-destructive">{formErrors.email}</p>}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="telefon">Telefon</Label>
                        <Input
                          id="telefon"
                          type="tel"
                          value={newPhotographer.telefon}
                          onChange={(e) => setNewPhotographer({ ...newPhotographer, telefon: e.target.value })}
                          placeholder="+49 123 456789"
                        />
                      </div>
                    </div>

                    {/* Address Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Adresse</h4>
                      
                      <div className="space-y-2">
                        <Label htmlFor="strasse">Straße & Hausnummer</Label>
                        <Input
                          id="strasse"
                          value={newPhotographer.strasse}
                          onChange={(e) => setNewPhotographer({ ...newPhotographer, strasse: e.target.value })}
                          placeholder="Musterstraße 123"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="plz">PLZ</Label>
                          <Input
                            id="plz"
                            value={newPhotographer.plz}
                            onChange={(e) => setNewPhotographer({ ...newPhotographer, plz: e.target.value })}
                            placeholder="12345"
                          />
                        </div>
                        
                        <div className="space-y-2 col-span-2">
                          <Label htmlFor="stadt">Stadt</Label>
                          <Input
                            id="stadt"
                            value={newPhotographer.stadt}
                            onChange={(e) => setNewPhotographer({ ...newPhotographer, stadt: e.target.value })}
                            placeholder="München"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="land">Land *</Label>
                        <Select 
                          value={newPhotographer.land} 
                          onValueChange={(value) => setNewPhotographer({ ...newPhotographer, land: value })}
                        >
                          <SelectTrigger id="land">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Deutschland">Deutschland</SelectItem>
                            <SelectItem value="Österreich">Österreich</SelectItem>
                            <SelectItem value="Schweiz">Schweiz</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {/* Service Area Section */}
                    <div className="space-y-3">
                      <h4 className="text-sm font-semibold">Servicebereich</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="radius">Serviceradius</Label>
                          <span className="text-sm text-muted-foreground">{newPhotographer.service_radius_km} km</span>
                        </div>
                        <Slider
                          id="radius"
                          min={10}
                          max={200}
                          step={5}
                          value={[newPhotographer.service_radius_km]}
                          onValueChange={(value) => setNewPhotographer({ ...newPhotographer, service_radius_km: value[0] })}
                        />
                        <p className="text-xs text-muted-foreground">
                          Der Fotograf kann Aufträge in diesem Umkreis annehmen
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">
                        * Der Fotograf erhält eine E-Mail zum Festlegen seines Passworts
                      </p>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAddDialogOpen(false);
                        setFormErrors({});
                        setActiveTab('existing');
                      }}
                    >
                      Abbrechen
                    </Button>
                    <Button
                      onClick={createNewPhotographer}
                      disabled={isSubmitting}
                    >
                      {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Fotograf erstellen
                    </Button>
                  </DialogFooter>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aktive Fotografen</CardTitle>
              <Camera className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{photographers.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gesamt Aufträge</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {photographers.reduce((sum, p) => sum + p.total_assignments, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Abgeschlossen</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {photographers.reduce((sum, p) => sum + p.completed, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ø Annahmequote</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {photographers.length > 0
                  ? Math.round(
                      photographers.reduce((sum, p) => sum + p.acceptance_rate, 0) /
                        photographers.length
                    )
                  : 0}
                %
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Photographers Table */}
        <Card>
          <CardHeader>
            <CardTitle>Fotografen</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Lädt...</div>
            ) : photographers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Noch keine Fotografen registriert
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>E-Mail</TableHead>
                      <TableHead>Telefon</TableHead>
                      <TableHead className="text-center">Aufträge</TableHead>
                      <TableHead className="text-center">Angenommen</TableHead>
                      <TableHead className="text-center">Abgelehnt</TableHead>
                      <TableHead className="text-center">Abgeschlossen</TableHead>
                      <TableHead className="text-center">Annahmequote</TableHead>
                      <TableHead className="text-right">Aktionen</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {photographers.map((photographer) => (
                      <TableRow key={photographer.user_id}>
                        <TableCell className="font-medium">
                          {photographer.vorname} {photographer.nachname}
                        </TableCell>
                        <TableCell>{photographer.email}</TableCell>
                        <TableCell>{photographer.telefon || '-'}</TableCell>
                        <TableCell className="text-center">
                          {photographer.total_assignments}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            {photographer.accepted}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">
                            {photographer.declined}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
                            {photographer.completed}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant="outline"
                            className={getAcceptanceRateBadge(photographer.acceptance_rate)}
                          >
                            {photographer.acceptance_rate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removePhotographerRole(photographer.user_id)}
                            className="gap-2 text-destructive hover:text-destructive"
                          >
                            <UserMinus className="h-4 w-4" />
                            Entfernen
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
