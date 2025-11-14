import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { validatePassword } from '@/lib/passwordValidation';
import { validateEmail } from '@/lib/emailValidation';
import { z } from 'zod';
import { Lock, Mail, Eye, EyeOff, ExternalLink, ArrowLeft } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BenefitsCarousel } from '@/components/auth/BenefitsCarousel';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

const emailSchema = z.string().email('Ungültige E-Mail-Adresse').max(255);
const passwordSchema = z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein');

type AuthView = 'initial' | 'login' | 'register';

export default function Auth() {
  const [currentView, setCurrentView] = useState<AuthView>('initial');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [emailSuggestion, setEmailSuggestion] = useState('');
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const { signUp, signIn, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const passwordValidation = validatePassword(password);

  useEffect(() => {
    if (user) {
      navigate('/order');
    }
  }, [user, navigate]);

  useEffect(() => {
    // Load remembered email
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    // Auto-focus email when in login or register view
    if (currentView !== 'initial') {
      emailInputRef.current?.focus();
    }
  }, [currentView]);

  useEffect(() => {
    // Validate email in real-time
    if (email) {
      const validation = validateEmail(email);
      setEmailError(validation.isValid ? '' : validation.error || '');
      setEmailSuggestion(validation.suggestion || '');
    } else {
      setEmailError('');
      setEmailSuggestion('');
    }
  }, [email]);

  const triggerSuccessConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['hsl(var(--primary))', 'hsl(var(--accent))', '#ffffff'],
    });
  };

  const handleBack = () => {
    setCurrentView('initial');
    setEmail('');
    setPassword('');
    setPasswordFocused(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      emailSchema.parse(email.trim());
      passwordSchema.parse(password);

      if (currentView === 'login' && rememberMe) {
        localStorage.setItem('remembered_email', email.trim());
      } else {
        localStorage.removeItem('remembered_email');
      }

      if (currentView === 'login') {
        const { error } = await signIn(email.trim(), password);
        if (error) {
          // Shake animation will be handled by motion.div
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
          triggerSuccessConfetti();
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
          triggerSuccessConfetti();
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 flex">
      <BenefitsCarousel />

      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="relative backdrop-blur-xl bg-card/40 border border-border/50 rounded-2xl p-8 shadow-2xl">
            
            <AnimatePresence mode="wait">
              {/* Initial View - 3 Buttons */}
              {currentView === 'initial' && (
                <motion.div
                  key="initial"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Willkommen</h1>
                    <p className="text-muted-foreground">
                      Wählen Sie eine Option, um fortzufahren
                    </p>
                  </div>

                  {/* Large Login Button */}
                  <Button
                    size="lg"
                    className="w-full h-16 text-lg font-semibold"
                    onClick={() => setCurrentView('login')}
                  >
                    <Lock className="mr-2 h-5 w-5" />
                    Anmelden
                  </Button>

                  {/* Two Smaller Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setCurrentView('register')}
                    >
                      Registrieren
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => window.open('https://www.spaceseller.de/fotograf-werden', '_blank')}
                    >
                      Fotografen Werden
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="pt-4">
                    <SocialAuthButtons />
                  </div>
                </motion.div>
              )}

              {/* Login View */}
              {currentView === 'login' && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="mb-6"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück
                  </Button>

                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Willkommen zurück</h1>
                    <p className="text-muted-foreground">
                      Melden Sie sich an, um fortzufahren
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FloatingLabelInput
                      ref={emailInputRef}
                      label="E-Mail-Adresse"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailError}
                      icon={<Mail className="h-5 w-5" />}
                      autoFocus
                    />

                    {emailSuggestion && (
                      <motion.button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setEmail(emailSuggestion)}
                      >
                        Meinten Sie <span className="underline">{emailSuggestion}</span>?
                      </motion.button>
                    )}

                    <FloatingLabelInput
                      label="Passwort"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<Lock className="h-5 w-5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      }
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={rememberMe}
                          onCheckedChange={(checked) => setRememberMe(checked === true)}
                        />
                        <label htmlFor="remember" className="text-sm">
                          Angemeldet bleiben
                        </label>
                      </div>
                      
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-primary hover:underline"
                      >
                        Passwort vergessen?
                      </button>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={loading || !email || !password || !!emailError}
                    >
                      {loading ? 'Wird angemeldet...' : 'Anmelden'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Noch kein Konto?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentView('register')}
                        className="text-primary hover:underline"
                      >
                        Jetzt registrieren
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}

              {/* Register View */}
              {currentView === 'register' && (
                <motion.div
                  key="register"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleBack}
                    className="mb-6"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Zurück
                  </Button>

                  <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2">Starten Sie jetzt</h1>
                    <p className="text-muted-foreground">
                      Erstellen Sie Ihr kostenloses Konto
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <FloatingLabelInput
                      ref={emailInputRef}
                      label="E-Mail-Adresse"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      error={emailError}
                      icon={<Mail className="h-5 w-5" />}
                      autoFocus
                    />

                    {emailSuggestion && (
                      <motion.button
                        type="button"
                        className="text-sm text-muted-foreground hover:text-foreground"
                        onClick={() => setEmail(emailSuggestion)}
                      >
                        Meinten Sie <span className="underline">{emailSuggestion}</span>?
                      </motion.button>
                    )}

                    <FloatingLabelInput
                      label="Passwort"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      icon={<Lock className="h-5 w-5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                      }
                    />

                    <PasswordRequirements password={password} show={passwordFocused || !!password} />

                    <div className="flex items-start space-x-2">
                      <Checkbox id="terms" required />
                      <label htmlFor="terms" className="text-sm leading-relaxed">
                        Ich akzeptiere die{' '}
                        <a href="/agb" className="text-primary hover:underline">
                          AGB
                        </a>{' '}
                        und{' '}
                        <a href="/datenschutz" className="text-primary hover:underline">
                          Datenschutzerklärung
                        </a>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={
                        loading ||
                        !email ||
                        !password ||
                        !!emailError ||
                        passwordValidation.strength === 'very-weak' ||
                        passwordValidation.strength === 'weak'
                      }
                    >
                      {loading ? 'Wird registriert...' : 'Konto erstellen'}
                    </Button>

                    <p className="text-center text-sm text-muted-foreground">
                      Bereits ein Konto?{' '}
                      <button
                        type="button"
                        onClick={() => setCurrentView('login')}
                        className="text-primary hover:underline"
                      >
                        Jetzt anmelden
                      </button>
                    </p>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <ForgotPasswordModal
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}
