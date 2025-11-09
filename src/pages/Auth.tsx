import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { calculatePasswordStrength } from '@/lib/passwordStrength';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';

const emailSchema = z.string().email('Ungültige E-Mail-Adresse').max(255);
const passwordSchema = z.string().min(6, 'Passwort muss mindestens 6 Zeichen lang sein');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const passwordStrength = calculatePasswordStrength(password);

  useEffect(() => {
    if (user) {
      navigate('/order');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email
      emailSchema.parse(email.trim());
      
      // Validate password
      passwordSchema.parse(password);

      if (isLogin) {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            toast({
              title: 'Anmeldung fehlgeschlagen',
              description: 'E-Mail oder Passwort ist falsch.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Fehler',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Erfolgreich angemeldet',
            description: 'Willkommen zurück!'
          });
          navigate('/order');
        }
      } else {
        const { error } = await signUp(email.trim(), password, { email: email.trim() });
        if (error) {
          if (error.message.includes('already registered')) {
            toast({
              title: 'Registrierung fehlgeschlagen',
              description: 'Diese E-Mail-Adresse ist bereits registriert.',
              variant: 'destructive'
            });
          } else {
            toast({
              title: 'Fehler',
              description: error.message,
              variant: 'destructive'
            });
          }
        } else {
          toast({
            title: 'Konto erstellt',
            description: 'Ihr Konto wurde erfolgreich erstellt!'
          });
          navigate('/onboarding');
        }
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: 'Validierungsfehler',
          description: error.errors[0].message,
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
        <div className="container mx-auto max-w-md">
          <div className="bg-card border border-border rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">
                {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
              </h1>
              <p className="text-muted-foreground">
                {isLogin 
                  ? 'Melden Sie sich an, um fortzufahren' 
                  : 'Registrieren Sie sich für spaceseller'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="ihre@email.de"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passwort</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                
                {!isLogin && password && (
                  <div className="space-y-1">
                    <div className="flex gap-1">
                      <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'weak' ? 'bg-destructive' : 'bg-muted'}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'medium' || passwordStrength.strength === 'strong' ? 'bg-yellow-500' : 'bg-muted'}`} />
                      <div className={`h-1 flex-1 rounded ${passwordStrength.strength === 'strong' ? 'bg-green-500' : 'bg-muted'}`} />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {passwordStrength.feedback[0]}
                    </p>
                  </div>
                )}
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading ? 'Wird geladen...' : isLogin ? 'Anmelden' : 'Registrieren'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {isLogin ? (
                  <>
                    Noch kein Konto? <span className="text-primary font-semibold">Jetzt registrieren</span>
                  </>
                ) : (
                  <>
                    Bereits registriert? <span className="text-primary font-semibold">Anmelden</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
