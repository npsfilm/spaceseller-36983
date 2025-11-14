import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { UserPlus, UserMinus, Camera, TrendingUp, CheckCircle, XCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

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
    <Layout>
      <Helmet>
        <meta name="robots" content="noindex, nofollow" />
        <title>Fotografen-Verwaltung - spaceseller</title>
      </Helmet>

      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Fotografen-Verwaltung</h1>
            <p className="text-muted-foreground mt-2">
              Verwalten Sie Fotografen und überwachen Sie deren Performance
            </p>
          </div>

          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <UserPlus className="h-4 w-4" />
                Fotograf hinzufügen
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Fotograf hinzufügen</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Benutzer auswählen
                  </label>
                  <Select value={selectedUser} onValueChange={setSelectedUser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Benutzer auswählen..." />
                    </SelectTrigger>
                    <SelectContent>
                      {allUsers.map(user => (
                        <SelectItem key={user.id} value={user.id}>
                          {user.profiles?.vorname} {user.profiles?.nachname} - {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addPhotographerRole} className="w-full">
                  Fotograf hinzufügen
                </Button>
              </div>
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
    </Layout>
  );
}
