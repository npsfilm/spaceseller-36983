import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { passwordSchema } from '@/lib/passwordValidation';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [token, setToken] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [matchError, setMatchError] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (!tokenFromUrl) {
      toast({
        title: "Ungültiger Link",
        description: "Dieser Link ist ungültig. Bitte fordern Sie einen neuen Passwort-Reset an.",
        variant: "destructive",
      });
      navigate('/auth');
    } else {
      setToken(tokenFromUrl);
    }
  }, [searchParams, navigate, toast]);

  useEffect(() => {
    if (password) {
      const result = passwordSchema.safeParse(password);
      if (!result.success) {
        setPasswordError(result.error.errors[0].message);
      } else {
        setPasswordError(null);
      }
    } else {
      setPasswordError(null);
    }
  }, [password]);

  useEffect(() => {
    if (confirmPassword && password !== confirmPassword) {
      setMatchError('Passwörter stimmen nicht überein');
    } else {
      setMatchError(null);
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast({
        title: "Fehler",
        description: "Bitte füllen Sie alle Felder aus.",
        variant: "destructive",
      });
      return;
    }

    if (passwordError || matchError) {
      toast({
        title: "Fehler",
        description: "Bitte beheben Sie die Fehler im Formular.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('reset-password', {
        body: { token, newPassword: password },
      });

      if (error) throw error;

      if (data.error) {
        throw new Error(data.error);
      }

      setSuccess(true);
      toast({
        title: "Erfolg!",
        description: "Ihr Passwort wurde erfolgreich zurückgesetzt.",
      });

      // Redirect to auth page after 3 seconds
      setTimeout(() => {
        navigate('/auth');
      }, 3000);
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast({
        title: "Fehler",
        description: error.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-full max-w-md"
        >
          <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 text-center shadow-xl">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10"
            >
              <CheckCircle2 className="w-10 h-10 text-primary" />
            </motion.div>
            
            <h2 className="text-2xl font-bold text-foreground mb-3">
              Passwort zurückgesetzt!
            </h2>
            
            <p className="text-muted-foreground mb-6">
              Ihr Passwort wurde erfolgreich geändert. Sie werden in Kürze zur Anmeldeseite weitergeleitet.
            </p>
            
            <Button
              onClick={() => navigate('/auth')}
              className="w-full"
            >
              Jetzt anmelden
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Neues Passwort erstellen
            </h1>
            <p className="text-muted-foreground">
              Bitte wählen Sie ein sicheres Passwort
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <FloatingLabelInput
                id="password"
                type={showPassword ? "text" : "password"}
                label="Neues Passwort"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                }
              />

              <PasswordRequirements password={password} show={!!password} />

              <FloatingLabelInput
                id="confirmPassword"
                type={showPassword ? "text" : "password"}
                label="Passwort bestätigen"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={matchError}
              />
            </div>

            {matchError && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-destructive text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                <span>{matchError}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold"
              disabled={loading || !!passwordError || !!matchError || !password || !confirmPassword}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin" />
                  <span>Wird verarbeitet...</span>
                </div>
              ) : (
                'Passwort zurücksetzen'
              )}
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => navigate('/auth')}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Zurück zur Anmeldung
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
