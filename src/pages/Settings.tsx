import { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Save, Shield } from 'lucide-react';
import { z } from 'zod';
import { GDPRSection } from '@/components/settings/GDPRSection';

const profileSchema = z.object({
  vorname: z.string().trim().min(1).max(100),
  nachname: z.string().trim().min(1).max(100),
  telefon: z.string().trim().min(1).max(50),
  firma: z.string().trim().min(1).max(200),
  strasse: z.string().trim().max(200),
  plz: z.string().trim().max(10),
  stadt: z.string().trim().max(100)
});

const passwordSchema = z.object({
  newPassword: z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein'),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwörter stimmen nicht überein",
  path: ["confirmPassword"]
});

function SettingsContent() {
  const [profile, setProfile] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (data) setProfile(data);
  };

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      profileSchema.parse(profile);

      const { error } = await supabase
        .from('profiles')
        .update({
          vorname: profile.vorname,
          nachname: profile.nachname,
          telefon: profile.telefon,
          firma: profile.firma,
          strasse: profile.strasse,
          plz: profile.plz,
          stadt: profile.stadt
        })
        .eq('id', user?.id);

      if (error) throw error;

      toast({
        title: 'Profil aktualisiert',
        description: 'Ihre Änderungen wurden gespeichert'
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Profil konnte nicht aktualisiert werden',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setLoading(true);
    try {
      passwordSchema.parse(passwordData);

      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: 'Passwort geändert',
        description: 'Ihr Passwort wurde erfolgreich aktualisiert'
      });

      setPasswordData({ newPassword: '', confirmPassword: '' });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
          variant: 'destructive'
        });
      } else {
        toast({
          title: 'Fehler',
          description: 'Passwort konnte nicht geändert werden',
          variant: 'destructive'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen pt-32 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-4">Einstellungen</h1>
            <p className="text-muted-foreground">Verwalten Sie Ihr Konto und Ihre Einstellungen</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">
                <User className="h-4 w-4 mr-2" />
                Profil
              </TabsTrigger>
              <TabsTrigger value="security">
                <Lock className="h-4 w-4 mr-2" />
                Sicherheit
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Shield className="h-4 w-4 mr-2" />
                Datenschutz
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Persönliche Informationen</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>E-Mail-Adresse</Label>
                      <Input value={profile.email} disabled className="bg-muted" />
                      <p className="text-xs text-muted-foreground">E-Mail kann nicht geändert werden</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Telefon</Label>
                      <Input
                        value={profile.telefon || ''}
                        onChange={(e) => setProfile({ ...profile, telefon: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Vorname</Label>
                      <Input
                        value={profile.vorname || ''}
                        onChange={(e) => setProfile({ ...profile, vorname: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Nachname</Label>
                      <Input
                        value={profile.nachname || ''}
                        onChange={(e) => setProfile({ ...profile, nachname: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Unternehmensinformationen</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label>Firma</Label>
                      <Input
                        value={profile.firma || ''}
                        onChange={(e) => setProfile({ ...profile, firma: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <Label>Straße</Label>
                      <Input
                        value={profile.strasse || ''}
                        onChange={(e) => setProfile({ ...profile, strasse: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>PLZ</Label>
                      <Input
                        value={profile.plz || ''}
                        onChange={(e) => setProfile({ ...profile, plz: e.target.value })}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Stadt</Label>
                      <Input
                        value={profile.stadt || ''}
                        onChange={(e) => setProfile({ ...profile, stadt: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button onClick={handleProfileUpdate} disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Wird gespeichert...' : 'Änderungen speichern'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="security">
              <div className="bg-card border border-border rounded-xl p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Passwort ändern</h3>
                  <div className="space-y-4 max-w-md">
                    <div className="space-y-2">
                      <Label>Neues Passwort</Label>
                      <Input
                        type="password"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Mindestens 6 Zeichen"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Passwort bestätigen</Label>
                      <Input
                        type="password"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Passwort wiederholen"
                      />
                    </div>

                    <Button onClick={handlePasswordChange} disabled={loading}>
                      <Lock className="h-4 w-4 mr-2" />
                      {loading ? 'Wird geändert...' : 'Passwort ändern'}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy">
              <div className="bg-card border border-border rounded-xl p-6">
                <GDPRSection />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}

export default function Settings() {
  return (
    <ProtectedRoute requireOnboarding>
      <SettingsContent />
    </ProtectedRoute>
  );
}
