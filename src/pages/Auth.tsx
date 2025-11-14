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
import { Lock, Mail, Eye, EyeOff, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';
import { BenefitsCarousel } from '@/components/auth/BenefitsCarousel';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';

const emailSchema = z.string().email('Ungültige E-Mail-Adresse').max(255);
const passwordSchema = z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein');

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
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
    // Auto-focus email input on mount
    emailInputRef.current?.focus();

    // Load remembered email
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate email
      emailSchema.parse(email.trim());
      
      // Validate password
      passwordSchema.parse(password);

      // Save email if remember me is checked
      if (rememberMe) {
        localStorage.setItem('remembered_email', email.trim());
      } else {
        localStorage.removeItem('remembered_email');
      }

      if (isLogin) {
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
          // Navigate to home which will handle role-based redirect
          setTimeout(() => {
            navigate('/');
          }, 500);
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

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setPassword('');
    setEmailError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits Carousel (hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:block lg:w-2/5 relative overflow-hidden"
      >
        <BenefitsCarousel />
      </motion.div>

        {/* Right Side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
          {/* Animated gradient background (mobile) */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 lg:hidden" />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full max-w-md relative z-10"
          >
            {/* Glassmorphism card */}
            <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl p-8 shadow-2xl">
              {/* Header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'signup'}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mb-8"
                >
                  <h1 className="text-3xl font-bold mb-2">
                    {isLogin ? 'Willkommen zurück' : 'Starten Sie jetzt'}
                  </h1>
                  <p className="text-muted-foreground">
                    {isLogin 
                      ? 'Melden Sie sich an, um fortzufahren' 
                      : 'Erstellen Sie Ihr kostenloses Konto'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Social Auth */}
              <SocialAuthButtons />

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                <div className="space-y-4">
                  <FloatingLabelInput
                    ref={emailInputRef}
                    label="E-Mail-Adresse"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                    error={emailError}
                    required
                  />

                  {emailSuggestion && !emailError && (
                    <motion.button
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      type="button"
                      onClick={() => setEmail(emailSuggestion)}
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Meinten Sie <span className="text-primary font-semibold">{emailSuggestion}</span>?
                    </motion.button>
                  )}

                  <div className="space-y-2">
                    <FloatingLabelInput
                      label="Passwort"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => setPasswordFocused(false)}
                      icon={<Lock className="w-5 h-5" />}
                      rightIcon={
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      }
                      required
                    />

                    {/* Password strength indicator (signup only) */}
                    {!isLogin && password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-2"
                      >
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((index) => (
                            <motion.div
                              key={index}
                              initial={{ scaleX: 0 }}
                              animate={{ scaleX: 1 }}
                              transition={{ delay: index * 0.1 }}
                              className={`h-1 flex-1 rounded-full transition-colors ${
                                passwordValidation.score > index
                                  ? passwordValidation.score === 1
                                    ? 'bg-red-500'
                                    : passwordValidation.score === 2
                                    ? 'bg-yellow-500'
                                    : passwordValidation.score === 3
                                    ? 'bg-blue-500'
                                    : 'bg-green-500'
                                  : 'bg-muted'
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">
                            {passwordValidation.feedback[0]}
                          </span>
                          {passwordValidation.score >= 2 && (
                            <span className="text-muted-foreground">
                              Knackzeit: {passwordValidation.crackTime}
                            </span>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Password requirements checklist */}
                    {!isLogin && (
                      <PasswordRequirements 
                        password={password} 
                        show={passwordFocused && password.length > 0} 
                      />
                    )}
                  </div>
                </div>

                {/* Remember me & Forgot password */}
                {isLogin && (
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        id="remember"
                        checked={rememberMe}
                        onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                      />
                      <label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                        Angemeldet bleiben
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      Passwort vergessen?
                    </button>
                  </div>
                )}

                {/* Submit button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base relative overflow-hidden group" 
                    size="lg" 
                    disabled={loading}
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
                    {loading ? 'Wird geladen...' : isLogin ? 'Anmelden' : 'Kostenloses Konto erstellen'}
                  </Button>
                </motion.div>

                {/* Trust indicators */}
                {!isLogin && (
                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3" />
                    <span>Ihre Daten sind sicher verschlüsselt</span>
                  </div>
                )}
              </form>

              {/* Toggle mode */}
              <div className="mt-8 text-center">
                <button
                  onClick={handleModeSwitch}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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

              {/* Legal links */}
              <div className="mt-6 text-center text-xs text-muted-foreground">
                {!isLogin && (
                  <p>
                    Mit der Registrierung stimmen Sie unseren{' '}
                    <a href="/agb" className="text-primary hover:underline">AGB</a>
                    {' '}und der{' '}
                    <a href="/datenschutz" className="text-primary hover:underline">Datenschutzerklärung</a>
                    {' '}zu.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword} 
        onClose={() => setShowForgotPassword(false)} 
      />
    </div>
  );
}
