import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/integrations/supabase/client';
import { Layout } from '@/components/Layout';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Users, Shield, Camera, Search, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface UserWithRoles {
  id: string;
  email: string;
  vorname: string | null;
  nachname: string | null;
  firma: string | null;
  created_at: string;
  roles: {
    isAdmin: boolean;
    isPhotographer: boolean;
  };
}

export default function UserRoleManagement() {
  const [users, setUsers] = useState<UserWithRoles[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserWithRoles[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingRoles, setUpdatingRoles] = useState<Set<string>>(new Set());
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      // Fetch all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, email, vorname, nachname, firma, created_at')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      if (!profiles || profiles.length === 0) {
        setUsers([]);
        return;
      }

      // Fetch all user roles
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine profiles with their roles
      const usersWithRoles: UserWithRoles[] = profiles.map(profile => {
        const roles = userRoles?.filter(r => r.user_id === profile.id) || [];
        
        return {
          id: profile.id,
          email: profile.email,
          vorname: profile.vorname,
          nachname: profile.nachname,
          firma: profile.firma,
          created_at: profile.created_at,
          roles: {
            isAdmin: roles.some(r => r.role === 'admin'),
            isPhotographer: roles.some(r => r.role === 'photographer'),
          },
        };
      });

      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Fehler',
        description: 'Benutzer konnten nicht geladen werden',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchQuery.trim()) {
      setFilteredUsers(users);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = users.filter(user => 
      user.email.toLowerCase().includes(query) ||
      user.vorname?.toLowerCase().includes(query) ||
      user.nachname?.toLowerCase().includes(query) ||
      user.firma?.toLowerCase().includes(query)
    );

    setFilteredUsers(filtered);
  };

  const toggleRole = async (userId: string, role: 'admin' | 'photographer', currentValue: boolean) => {
    try {
      setUpdatingRoles(prev => new Set(prev).add(userId));

      if (currentValue) {
        // Remove role
        const { error } = await supabase
          .from('user_roles')
          .delete()
          .eq('user_id', userId)
          .eq('role', role);

        if (error) throw error;

        toast({
          title: 'Rolle entfernt',
          description: `Die ${role === 'admin' ? 'Administrator' : 'Fotograf'}-Rolle wurde erfolgreich entfernt.`,
        });
      } else {
        // Add role
        const { error } = await supabase
          .from('user_roles')
          .insert({
            user_id: userId,
            role: role,
          });

        if (error) throw error;

        toast({
          title: 'Rolle zugewiesen',
          description: `Die ${role === 'admin' ? 'Administrator' : 'Fotograf'}-Rolle wurde erfolgreich zugewiesen.`,
        });
      }

      // Refresh users
      await fetchUsers();
    } catch (error) {
      console.error('Error toggling role:', error);
      toast({
        title: 'Fehler',
        description: 'Die Rolle konnte nicht aktualisiert werden',
        variant: 'destructive',
      });
    } finally {
      setUpdatingRoles(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const getUserRole = (user: UserWithRoles): string => {
    if (user.roles.isAdmin) return 'Admin';
    if (user.roles.isPhotographer) return 'Fotograf';
    return 'Kunde';
  };

  const getRoleBadgeVariant = (user: UserWithRoles) => {
    if (user.roles.isAdmin) return 'destructive';
    if (user.roles.isPhotographer) return 'default';
    return 'secondary';
  };

  const getDisplayName = (user: UserWithRoles): string => {
    if (user.vorname || user.nachname) {
      return `${user.vorname || ''} ${user.nachname || ''}`.trim();
    }
    if (user.firma) {
      return user.firma;
    }
    return 'Kein Name';
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <AdminLayout>
      <Helmet>
        <title>Benutzerverwaltung - Admin Dashboard</title>
      </Helmet>

      <div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gesamt Benutzer
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{users.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Administratoren
              </CardTitle>
              <Shield className="w-4 h-4 text-destructive" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => u.roles.isAdmin).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Fotografen
              </CardTitle>
              <Camera className="w-4 h-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => u.roles.isPhotographer).length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Kunden
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {users.filter(u => !u.roles.isAdmin && !u.roles.isPhotographer).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Table */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <CardTitle>Alle Benutzer</CardTitle>
              <div className="relative w-full md:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Suche nach Name, Email oder Firma..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Benutzer</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Aktuelle Rolle</TableHead>
                    <TableHead className="text-center">Administrator</TableHead>
                    <TableHead className="text-center">Fotograf</TableHead>
                    <TableHead>Registriert</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Keine Benutzer gefunden
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => {
                      const isUpdating = updatingRoles.has(user.id);
                      
                      return (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="font-medium">{getDisplayName(user)}</div>
                            {user.firma && (user.vorname || user.nachname) && (
                              <div className="text-sm text-muted-foreground">{user.firma}</div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{user.email}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(user)}>
                              {getUserRole(user)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Switch
                                  checked={user.roles.isAdmin}
                                  onCheckedChange={() => toggleRole(user.id, 'admin', user.roles.isAdmin)}
                                  disabled={isUpdating}
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center">
                              {isUpdating ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Switch
                                  checked={user.roles.isPhotographer}
                                  onCheckedChange={() => toggleRole(user.id, 'photographer', user.roles.isPhotographer)}
                                  disabled={isUpdating}
                                />
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {new Date(user.created_at).toLocaleDateString('de-DE')}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
