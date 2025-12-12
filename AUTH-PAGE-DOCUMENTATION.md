# Authentifizierungsseite - Vollständige Dokumentation

Diese Dokumentation enthält alle relevanten Code-Stellen, Farben, Animationen und Texte für die Nachbildung der Authentifizierungsseite.

---

## 📁 Dateistruktur

```
src/
├── pages/
│   └── Auth.tsx                          # Hauptkomponente
├── components/
│   └── auth/
│       ├── BenefitsCarousel.tsx          # Linke Seite mit Animation
│       ├── FloatingLabelInput.tsx        # Floating Label Input
│       ├── SocialAuthButtons.tsx         # Google OAuth Button
│       ├── PasswordRequirements.tsx      # Passwort-Checklist
│       └── ForgotPasswordModal.tsx       # Passwort vergessen Modal
├── lib/
│   ├── passwordValidation.ts             # Passwort-Stärke Logik
│   └── emailValidation.ts                # Email Typo-Erkennung
├── contexts/
│   └── AuthContext.tsx                   # Auth State Management
└── index.css                             # CSS Variables & Animations
```

---

## 🎨 Farbpalette (CSS Custom Properties)

### Light Mode (`:root`)
```css
:root {
  /* Hauptfarben */
  --background: 0 0% 100%;           /* Weiß */
  --foreground: 147 30% 20%;         /* Dunkelgrün Text */
  
  /* Primary (Grün) */
  --primary: 152 38% 28%;            /* #2a5a40 - Hauptgrün */
  --primary-foreground: 0 0% 100%;   /* Weiß auf Primary */
  
  /* Karten & Oberflächen */
  --card: 0 0% 100%;                 /* Weiß */
  --card-foreground: 147 30% 20%;    /* Dunkelgrün */
  
  /* Eingabefelder */
  --muted: 140 20% 96%;              /* Sehr helles Grün-Grau */
  --muted-foreground: 147 15% 45%;   /* Gedämpfter Text */
  
  /* Ränder */
  --border: 140 20% 88%;             /* Hellgrauer Rand */
  --ring: 152 38% 28%;               /* Fokus-Ring = Primary */
  
  /* Semantische Farben */
  --destructive: 0 84% 60%;          /* Rot für Fehler */
  --success: 152 38% 28%;            /* Grün für Erfolg */
}
```

### Dark Mode (`.dark`)
```css
.dark {
  --background: 147 30% 8%;          /* Sehr dunkles Grün */
  --foreground: 140 20% 96%;         /* Heller Text */
  
  --primary: 152 45% 45%;            /* Helleres Grün */
  --primary-foreground: 147 30% 8%;  /* Dunkler Text auf Primary */
  
  --card: 147 25% 12%;               /* Dunkle Karte */
  --card-foreground: 140 20% 96%;    /* Heller Text */
  
  --muted: 147 20% 18%;              /* Gedämpfter Hintergrund */
  --muted-foreground: 140 15% 60%;   /* Gedämpfter Text */
  
  --border: 147 20% 20%;             /* Dunkler Rand */
}
```

### Passwort-Stärke Farben (Hardcoded)
```typescript
const strengthColors = {
  'very-weak': '#ef4444',  // Rot
  'weak': '#f59e0b',       // Orange/Gelb
  'medium': '#3b82f6',     // Blau
  'strong': '#22c55e'      // Grün
};
```

---

## ✨ Animationen

### 1. Gradient Wave Animation (CSS Keyframes)

```css
/* In index.css */
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}
```

**Verwendung in BenefitsCarousel.tsx:**
```tsx
<div className="relative h-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 animate-gradient-shift">
```

### 2. Framer Motion Animationen

#### Page Entry Animation
```tsx
// Auth.tsx - Hauptcontainer
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
};

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
>
```

#### Header Switch Animation (Login/Signup)
```tsx
<AnimatePresence mode="wait">
  <motion.div
    key={isLogin ? 'login' : 'signup'}
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 20 }}
    transition={{ duration: 0.3 }}
  >
```

#### Carousel Benefit Transition
```tsx
// BenefitsCarousel.tsx
<AnimatePresence mode="wait">
  <motion.div
    key={currentIndex}
    initial={{ opacity: 0, x: 50 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -50 }}
    transition={{ duration: 0.5 }}
  >
```

#### Icon Spring Animation
```tsx
<motion.div
  initial={{ scale: 0.5, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
>
```

#### Password Strength Bar Animation
```tsx
<motion.div
  className="h-full rounded-full"
  initial={{ width: 0 }}
  animate={{
    width: `${(score / 4) * 100}%`,
    backgroundColor: strengthColors[strength]
  }}
  transition={{ duration: 0.3 }}
/>
```

#### Button Hover/Tap Animation
```tsx
<motion.div
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
>
```

#### Button Shine Effect
```tsx
{/* Shine effect on button */}
<span className="absolute inset-0 overflow-hidden rounded-lg">
  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
</span>
```

#### Floating Label Animation
```tsx
// FloatingLabelInput.tsx
<motion.label
  animate={{
    top: isFocused || hasValue || props.value ? '0.5rem' : '50%',
    fontSize: isFocused || hasValue || props.value ? '0.75rem' : '1rem',
    translateY: isFocused || hasValue || props.value ? '0' : '-50%',
  }}
  transition={{ duration: 0.2 }}
>
```

#### Password Requirement Item Animation
```tsx
// PasswordRequirements.tsx
<motion.div
  initial={{ x: -10, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  transition={{ delay: index * 0.05 }}
>
```

---

## 📝 Alle Texte (Deutsch)

### Headlines & Buttons
```typescript
const texts = {
  // Login
  loginTitle: 'Willkommen zurück',
  loginSubtitle: 'Melden Sie sich an, um fortzufahren',
  loginButton: 'Anmelden',
  
  // Signup
  signupTitle: 'Konto erstellen',
  signupSubtitle: 'Starten Sie mit der Bestellung Ihrer Immobilienmedien',
  signupButton: 'Registrieren',
  
  // Toggle
  noAccount: 'Noch kein Konto?',
  hasAccount: 'Bereits ein Konto?',
  createAccount: 'Jetzt registrieren',
  loginLink: 'Jetzt anmelden',
  
  // Form Labels
  emailLabel: 'E-Mail Adresse',
  passwordLabel: 'Passwort',
  
  // Social Auth
  googleButton: 'Mit Google fortfahren',
  separator: 'Oder mit E-Mail',
  
  // Forgot Password
  forgotPassword: 'Passwort vergessen?',
  forgotPasswordTitle: 'Passwort zurücksetzen',
  forgotPasswordSubtitle: 'Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.',
  sendResetLink: 'Link senden',
  backToLogin: 'Zurück zur Anmeldung',
  resetEmailSent: 'E-Mail gesendet!',
  resetEmailSentMessage: 'Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts gesendet.',
  
  // Errors
  invalidEmail: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
  passwordTooShort: 'Das Passwort muss mindestens 8 Zeichen lang sein',
  loginError: 'Ungültige E-Mail oder Passwort',
  signupError: 'Registrierung fehlgeschlagen',
  unexpectedError: 'Ein unerwarteter Fehler ist aufgetreten',
  
  // Password Requirements
  passwordMustContain: 'Passwort muss enthalten:',
  minChars: 'Mindestens 8 Zeichen',
  uppercase: 'Ein Großbuchstabe',
  lowercase: 'Ein Kleinbuchstabe',
  number: 'Eine Zahl',
  special: 'Ein Sonderzeichen',
  
  // Password Strength Labels
  veryWeak: 'Sehr schwach',
  weak: 'Schwach',
  medium: 'Mittel',
  strong: 'Stark',
  
  // Loading States
  loading: 'Wird geladen...',
};
```

### Benefits Carousel Texte
```typescript
const benefits = [
  {
    title: 'Schnelle Lieferung',
    description: 'Erhalten Sie Ihre bearbeiteten Immobilienbilder innerhalb von 24-48 Stunden.',
    stats: '24-48h'
  },
  {
    title: 'Professionelle Qualität',
    description: 'HDR-Bildbearbeitung und virtuelle Möblierung auf höchstem Niveau.',
    stats: '100%'
  },
  {
    title: 'Einfache Bestellung',
    description: 'Laden Sie Ihre Bilder hoch und erhalten Sie professionelle Ergebnisse.',
    stats: '3 Schritte'
  },
  {
    title: 'Faire Preise',
    description: 'Transparente Preisgestaltung ohne versteckte Kosten.',
    stats: 'ab 2,90€'
  }
];

const trustBadges = [
  '500+ zufriedene Kunden',
  '10.000+ bearbeitete Bilder',
  '4.9/5 Bewertung'
];
```

---

## 📦 Vollständige Code-Snippets

### 1. Auth.tsx (Hauptkomponente)

```tsx
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { FloatingLabelInput } from '@/components/auth/FloatingLabelInput';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { PasswordRequirements } from '@/components/auth/PasswordRequirements';
import { BenefitsCarousel } from '@/components/auth/BenefitsCarousel';
import { ForgotPasswordModal } from '@/components/auth/ForgotPasswordModal';
import { validatePassword, type PasswordValidationResult } from '@/lib/passwordValidation';
import { detectEmailTypo, type EmailTypoSuggestion } from '@/lib/emailValidation';

// Email validation schema
const emailSchema = z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein');

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordValidation, setPasswordValidation] = useState<PasswordValidationResult | null>(null);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<EmailTypoSuggestion | null>(null);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  // Validate password on change (only for signup)
  useEffect(() => {
    if (!isLogin && password) {
      const result = validatePassword(password);
      setPasswordValidation(result);
    } else {
      setPasswordValidation(null);
    }
  }, [password, isLogin]);

  // Check email typos
  useEffect(() => {
    if (email && email.includes('@')) {
      const suggestion = detectEmailTypo(email);
      setEmailSuggestion(suggestion);
    } else {
      setEmailSuggestion(null);
    }
  }, [email]);

  const validateForm = (): boolean => {
    let isValid = true;
    setEmailError('');
    setPasswordError('');

    // Validate email
    const emailResult = emailSchema.safeParse(email);
    if (!emailResult.success) {
      setEmailError(emailResult.error.errors[0].message);
      isValid = false;
    }

    // Validate password
    if (!isLogin) {
      if (password.length < 8) {
        setPasswordError('Das Passwort muss mindestens 8 Zeichen lang sein');
        isValid = false;
      } else if (passwordValidation && passwordValidation.score < 2) {
        setPasswordError('Das Passwort ist zu schwach');
        isValid = false;
      }
    } else if (password.length === 0) {
      setPasswordError('Bitte geben Sie Ihr Passwort ein');
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: 'Anmeldung fehlgeschlagen',
            description: error.message === 'Invalid login credentials'
              ? 'Ungültige E-Mail oder Passwort'
              : error.message,
            variant: 'destructive',
          });
        }
      } else {
        const { error } = await signUp(email, password, {});
        if (error) {
          toast({
            title: 'Registrierung fehlgeschlagen',
            description: error.message,
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Willkommen!',
            description: 'Ihr Konto wurde erfolgreich erstellt.',
          });
        }
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = () => {
    setIsLogin(!isLogin);
    setEmailError('');
    setPasswordError('');
    setPassword('');
    setShowPasswordRequirements(false);
  };

  const applyEmailSuggestion = () => {
    if (emailSuggestion) {
      setEmail(emailSuggestion.suggestion);
      setEmailSuggestion(null);
    }
  };

  const strengthColors: Record<string, string> = {
    'very-weak': '#ef4444',
    'weak': '#f59e0b',
    'medium': '#3b82f6',
    'strong': '#22c55e'
  };

  const strengthLabels: Record<string, string> = {
    'very-weak': 'Sehr schwach',
    'weak': 'Schwach',
    'medium': 'Mittel',
    'strong': 'Stark'
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Benefits Carousel (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-2/5">
        <BenefitsCarousel />
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-background via-background to-muted/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-md"
        >
          {/* Card Container */}
          <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-primary/5 p-6 sm:p-8">
            {/* Header */}
            <AnimatePresence mode="wait">
              <motion.div
                key={isLogin ? 'login' : 'signup'}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="text-center mb-8"
              >
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  {isLogin ? 'Willkommen zurück' : 'Konto erstellen'}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin 
                    ? 'Melden Sie sich an, um fortzufahren'
                    : 'Starten Sie mit der Bestellung Ihrer Immobilienmedien'
                  }
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Social Auth */}
            <SocialAuthButtons />

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              {/* Email Input */}
              <div>
                <FloatingLabelInput
                  type="email"
                  label="E-Mail Adresse"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  error={emailError}
                  icon={<Mail className="w-5 h-5" />}
                  autoComplete="email"
                />
                
                {/* Email Typo Suggestion */}
                {emailSuggestion && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-2 p-2 rounded-lg bg-primary/5 border border-primary/20"
                  >
                    <p className="text-sm text-muted-foreground">
                      Meinten Sie{' '}
                      <button
                        type="button"
                        onClick={applyEmailSuggestion}
                        className="text-primary font-medium hover:underline"
                      >
                        {emailSuggestion.suggestion}
                      </button>
                      ?
                    </p>
                  </motion.div>
                )}
              </div>

              {/* Password Input */}
              <div>
                <FloatingLabelInput
                  type={showPassword ? 'text' : 'password'}
                  label="Passwort"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => !isLogin && setShowPasswordRequirements(true)}
                  error={passwordError}
                  icon={<Lock className="w-5 h-5" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  }
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />

                {/* Password Strength Indicator (Signup only) */}
                {!isLogin && passwordValidation && password.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3"
                  >
                    {/* Strength Bar */}
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(passwordValidation.score / 4) * 100}%`,
                            backgroundColor: strengthColors[passwordValidation.strength]
                          }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                      <span 
                        className="text-xs font-medium min-w-[80px] text-right"
                        style={{ color: strengthColors[passwordValidation.strength] }}
                      >
                        {strengthLabels[passwordValidation.strength]}
                      </span>
                    </div>

                    {/* Feedback */}
                    {passwordValidation.feedback.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-2 space-y-1"
                      >
                        {passwordValidation.feedback.map((tip, index) => (
                          <p key={index} className="text-xs text-muted-foreground flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {tip}
                          </p>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>
                )}

                {/* Password Requirements Checklist (Signup only) */}
                {!isLogin && (
                  <PasswordRequirements 
                    password={password} 
                    show={showPasswordRequirements}
                  />
                )}
              </div>

              {/* Forgot Password Link (Login only) */}
              {isLogin && (
                <div className="text-right">
                  <button
                    type="button"
                    onClick={() => setShowForgotPassword(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Passwort vergessen?
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold relative overflow-hidden group"
                  disabled={loading}
                >
                  {/* Shine effect */}
                  <span className="absolute inset-0 overflow-hidden rounded-lg">
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:translate-x-full transition-transform duration-700" />
                  </span>
                  
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                      />
                      Wird geladen...
                    </span>
                  ) : (
                    isLogin ? 'Anmelden' : 'Registrieren'
                  )}
                </Button>
              </motion.div>
            </form>

            {/* Mode Switch */}
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Noch kein Konto?' : 'Bereits ein Konto?'}{' '}
                <button
                  type="button"
                  onClick={handleModeSwitch}
                  className="text-primary font-medium hover:underline"
                >
                  {isLogin ? 'Jetzt registrieren' : 'Jetzt anmelden'}
                </button>
              </p>
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
```

### 2. BenefitsCarousel.tsx

```tsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Clock, Shield, ChevronRight } from 'lucide-react';

const benefits = [
  {
    icon: Clock,
    title: 'Schnelle Lieferung',
    description: 'Erhalten Sie Ihre bearbeiteten Immobilienbilder innerhalb von 24-48 Stunden.',
    stats: '24-48h'
  },
  {
    icon: Sparkles,
    title: 'Professionelle Qualität',
    description: 'HDR-Bildbearbeitung und virtuelle Möblierung auf höchstem Niveau.',
    stats: '100%'
  },
  {
    icon: Camera,
    title: 'Einfache Bestellung',
    description: 'Laden Sie Ihre Bilder hoch und erhalten Sie professionelle Ergebnisse.',
    stats: '3 Schritte'
  },
  {
    icon: Shield,
    title: 'Faire Preise',
    description: 'Transparente Preisgestaltung ohne versteckte Kosten.',
    stats: 'ab 2,90€'
  }
];

export function BenefitsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % benefits.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentBenefit = benefits[currentIndex];
  const Icon = currentBenefit.icon;

  return (
    <div className="relative h-full w-full bg-gradient-to-br from-primary via-primary/90 to-primary/80 animate-gradient-shift overflow-hidden">
      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" className="text-white"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col justify-center p-12">
        {/* Logo Area */}
        <div className="mb-12">
          <img 
            src="/spaceseller-logo.png" 
            alt="spaceseller" 
            className="h-10 brightness-0 invert"
          />
        </div>

        {/* Benefit Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center"
            >
              <Icon className="w-8 h-8 text-white" />
            </motion.div>

            {/* Stats Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm"
            >
              <span className="text-2xl font-bold text-white">{currentBenefit.stats}</span>
            </motion.div>

            {/* Title & Description */}
            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">
                {currentBenefit.title}
              </h2>
              <p className="text-lg text-white/80 max-w-md">
                {currentBenefit.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="mt-12 flex items-center gap-2">
          {benefits.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 rounded-full transition-all duration-300",
                index === currentIndex 
                  ? "w-8 bg-white" 
                  : "w-2 bg-white/40 hover:bg-white/60"
              )}
            />
          ))}
        </div>

        {/* Trust Badges */}
        <div className="mt-auto pt-12 border-t border-white/10">
          <div className="flex flex-wrap gap-4">
            {['500+ zufriedene Kunden', '10.000+ bearbeitete Bilder', '4.9/5 Bewertung'].map((badge, index) => (
              <motion.div
                key={badge}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex items-center gap-2 text-sm text-white/70"
              >
                <ChevronRight className="w-4 h-4" />
                {badge}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(' ');
}
```

### 3. FloatingLabelInput.tsx

```tsx
import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface FloatingLabelInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const FloatingLabelInput = React.forwardRef<HTMLInputElement, FloatingLabelInputProps>(
  ({ label, error, icon, rightIcon, className, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(e.target.value.length > 0);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        <div className={cn(
          "relative flex items-center rounded-lg border bg-background/50 backdrop-blur-sm transition-all duration-200",
          isFocused ? "border-primary ring-2 ring-primary/20" : "border-border",
          error && "border-destructive ring-2 ring-destructive/20",
          className
        )}>
          {icon && (
            <motion.div
              animate={{ color: isFocused ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))' }}
              transition={{ duration: 0.2 }}
              className="absolute left-3 pointer-events-none"
            >
              {icon}
            </motion.div>
          )}
          
          <input
            ref={ref}
            {...props}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={cn(
              "peer h-14 w-full bg-transparent px-3 pt-4 pb-1 text-base outline-none transition-all disabled:cursor-not-allowed disabled:opacity-50",
              icon && "pl-10",
              rightIcon && "pr-10"
            )}
          />
          
          <motion.label
            animate={{
              top: isFocused || hasValue || props.value ? '0.5rem' : '50%',
              fontSize: isFocused || hasValue || props.value ? '0.75rem' : '1rem',
              translateY: isFocused || hasValue || props.value ? '0' : '-50%',
            }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute pointer-events-none transition-colors",
              icon ? "left-10" : "left-3",
              isFocused ? "text-primary" : "text-muted-foreground"
            )}
          >
            {label}
          </motion.label>

          {rightIcon && (
            <div className="absolute right-3">
              {rightIcon}
            </div>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-1.5 text-xs text-destructive flex items-center gap-1"
          >
            <span className="inline-block">⚠</span>
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

FloatingLabelInput.displayName = 'FloatingLabelInput';
```

### 4. SocialAuthButtons.tsx

```tsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function SocialAuthButtons() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/order`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        toast({
          title: 'Fehler',
          description: error.message,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        <Button
          type="button"
          variant="outline"
          className="w-full h-12 text-base relative overflow-hidden group"
          onClick={handleGoogleSignIn}
          disabled={loading}
        >
          {/* Ripple effect */}
          <span className="absolute inset-0 bg-primary/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          
          {/* Google Logo SVG */}
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          {loading ? 'Wird geladen...' : 'Mit Google fortfahren'}
        </Button>
      </motion.div>

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">Oder mit E-Mail</span>
        </div>
      </div>
    </div>
  );
}
```

### 5. PasswordRequirements.tsx

```tsx
import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PasswordRequirementsProps {
  password: string;
  show: boolean;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'Mindestens 8 Zeichen', test: (pwd) => pwd.length >= 8 },
  { label: 'Ein Großbuchstabe', test: (pwd) => /[A-Z]/.test(pwd) },
  { label: 'Ein Kleinbuchstabe', test: (pwd) => /[a-z]/.test(pwd) },
  { label: 'Eine Zahl', test: (pwd) => /\d/.test(pwd) },
  { label: 'Ein Sonderzeichen', test: (pwd) => /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd) },
];

export function PasswordRequirements({ password, show }: PasswordRequirementsProps) {
  if (!show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border space-y-2">
        <p className="text-xs font-medium text-muted-foreground">Passwort muss enthalten:</p>
        <div className="space-y-1.5">
          {requirements.map((req, index) => {
            const passed = req.test(password);
            return (
              <motion.div
                key={index}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-center gap-2 text-xs"
              >
                <motion.div
                  animate={{
                    scale: passed ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {passed ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <X className="w-4 h-4 text-muted-foreground" />
                  )}
                </motion.div>
                <span className={passed ? 'text-foreground' : 'text-muted-foreground'}>
                  {req.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
```

### 6. ForgotPasswordModal.tsx

```tsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowLeft, CheckCircle2, X } from 'lucide-react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { FloatingLabelInput } from './FloatingLabelInput';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const emailSchema = z.string().email('Bitte geben Sie eine gültige E-Mail-Adresse ein');

export function ForgotPasswordModal({ isOpen, onClose }: ForgotPasswordModalProps) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = emailSchema.safeParse(email);
    if (!result.success) {
      toast({
        title: 'Fehler',
        description: result.error.errors[0].message,
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.functions.invoke('request-password-reset', {
        body: { email }
      });

      if (error) {
        toast({
          title: 'Fehler',
          description: 'E-Mail konnte nicht gesendet werden.',
          variant: 'destructive',
        });
      } else {
        setSuccess(true);
      }
    } catch (error) {
      toast({
        title: 'Fehler',
        description: 'Ein unerwarteter Fehler ist aufgetreten.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setSuccess(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card rounded-2xl border border-border shadow-2xl p-6 z-50"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {success ? (
              /* Success State */
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 15 }}
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center"
                >
                  <CheckCircle2 className="w-8 h-8 text-primary" />
                </motion.div>
                <h2 className="text-xl font-bold text-foreground mb-2">
                  E-Mail gesendet!
                </h2>
                <p className="text-muted-foreground mb-6">
                  Wir haben Ihnen einen Link zum Zurücksetzen Ihres Passworts gesendet.
                </p>
                <Button onClick={handleClose} variant="outline">
                  Zurück zur Anmeldung
                </Button>
              </motion.div>
            ) : (
              /* Form State */
              <>
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Passwort zurücksetzen
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <FloatingLabelInput
                    type="email"
                    label="E-Mail Adresse"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-5 h-5" />}
                    autoComplete="email"
                  />

                  <Button
                    type="submit"
                    className="w-full h-12"
                    disabled={loading}
                  >
                    {loading ? 'Wird gesendet...' : 'Link senden'}
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    className="w-full"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Zurück zur Anmeldung
                  </Button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 7. passwordValidation.ts

```typescript
import { z } from 'zod';
import { zxcvbn, zxcvbnOptions } from '@zxcvbn-ts/core';
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common';

// Basic Zod schema for password validation
export const passwordSchema = z.string()
  .min(8, 'Das Passwort muss mindestens 8 Zeichen lang sein');

// Initialize zxcvbn with common dictionaries
const options = {
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
  },
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
};
zxcvbnOptions.setOptions(options);

export type PasswordStrength = 'very-weak' | 'weak' | 'medium' | 'strong';

export interface PasswordValidationResult {
  strength: PasswordStrength;
  score: number; // 0-4
  feedback: string[];
  estimatedCrackTime: string;
  isCommonPassword: boolean;
}

const germanFeedback: Record<string, string> = {
  'Use a few words, avoid common phrases': 'Verwenden Sie mehrere Wörter, vermeiden Sie gängige Phrasen',
  'No need for symbols, digits, or uppercase letters': 'Symbole, Zahlen oder Großbuchstaben sind nicht erforderlich',
  'Add another word or two. Uncommon words are better.': 'Fügen Sie ein oder zwei weitere Wörter hinzu. Ungewöhnliche Wörter sind besser.',
  'Straight rows of keys are easy to guess': 'Gerade Tastenreihen sind leicht zu erraten',
  'Short keyboard patterns are easy to guess': 'Kurze Tastaturmuster sind leicht zu erraten',
  'Use a longer keyboard pattern with more turns': 'Verwenden Sie ein längeres Tastaturmuster mit mehr Richtungswechseln',
  'Repeats like "aaa" are easy to guess': 'Wiederholungen wie "aaa" sind leicht zu erraten',
  'Repeats like "abcabcabc" are only slightly harder to guess than "abc"': 'Wiederholungen wie "abcabcabc" sind nur geringfügig schwerer zu erraten als "abc"',
  'Avoid repeated words and characters': 'Vermeiden Sie wiederholte Wörter und Zeichen',
  'Sequences like "abc" or "6543" are easy to guess': 'Sequenzen wie "abc" oder "6543" sind leicht zu erraten',
  'Avoid sequences': 'Vermeiden Sie Sequenzen',
  'Recent years are easy to guess': 'Aktuelle Jahreszahlen sind leicht zu erraten',
  'Avoid recent years': 'Vermeiden Sie aktuelle Jahreszahlen',
  'Avoid years that are associated with you': 'Vermeiden Sie Jahreszahlen, die mit Ihnen verbunden sind',
  'Dates are often easy to guess': 'Daten sind oft leicht zu erraten',
  'Avoid dates and years that are associated with you': 'Vermeiden Sie Daten und Jahre, die mit Ihnen verbunden sind',
  'This is a top-10 common password': 'Dies ist eines der 10 häufigsten Passwörter',
  'This is a top-100 common password': 'Dies ist eines der 100 häufigsten Passwörter',
  'This is a very common password': 'Dies ist ein sehr häufiges Passwort',
  'This is similar to a commonly used password': 'Dies ähnelt einem häufig verwendeten Passwort',
  'A word by itself is easy to guess': 'Ein einzelnes Wort ist leicht zu erraten',
  'Names and surnames by themselves are easy to guess': 'Namen und Nachnamen allein sind leicht zu erraten',
  'Common names and surnames are easy to guess': 'Gängige Namen und Nachnamen sind leicht zu erraten',
  'Capitalization doesn\'t help very much': 'Großschreibung hilft nicht viel',
  'All-uppercase is almost as easy to guess as all-lowercase': 'Nur Großbuchstaben sind fast so leicht zu erraten wie nur Kleinbuchstaben',
  'Reversed words aren\'t much harder to guess': 'Umgekehrte Wörter sind nicht viel schwerer zu erraten',
  'Predictable substitutions like \'@\' instead of \'a\' don\'t help very much': 'Vorhersehbare Ersetzungen wie \'@\' statt \'a\' helfen nicht viel',
};

export function validatePassword(password: string): PasswordValidationResult {
  // Check minimum requirements
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  // Use zxcvbn for advanced analysis
  const result = zxcvbn(password);
  
  // Map zxcvbn score (0-4) to our strength levels
  const strengthMap: PasswordStrength[] = ['very-weak', 'weak', 'weak', 'medium', 'strong'];
  let strength = strengthMap[result.score];

  // Adjust strength based on our requirements
  if (!hasMinLength) {
    strength = 'very-weak';
  } else if (result.score >= 3 && hasUppercase && hasLowercase && hasNumber && hasSpecial) {
    strength = 'strong';
  } else if (result.score >= 2 && hasUppercase && hasLowercase && hasNumber) {
    strength = 'medium';
  }

  // Translate feedback to German
  const feedback: string[] = [];
  
  if (result.feedback.warning) {
    feedback.push(germanFeedback[result.feedback.warning] || result.feedback.warning);
  }
  
  result.feedback.suggestions.forEach(suggestion => {
    const translated = germanFeedback[suggestion] || suggestion;
    if (!feedback.includes(translated)) {
      feedback.push(translated);
    }
  });

  // Add our own feedback if needed
  if (!hasUppercase) {
    feedback.push('Fügen Sie einen Großbuchstaben hinzu');
  }
  if (!hasLowercase) {
    feedback.push('Fügen Sie einen Kleinbuchstaben hinzu');
  }
  if (!hasNumber) {
    feedback.push('Fügen Sie eine Zahl hinzu');
  }
  if (!hasSpecial) {
    feedback.push('Fügen Sie ein Sonderzeichen hinzu');
  }

  return {
    strength,
    score: result.score,
    feedback: feedback.slice(0, 3), // Limit to 3 suggestions
    estimatedCrackTime: result.crackTimesDisplay.offlineSlowHashing1e4PerSecond,
    isCommonPassword: result.score === 0 && result.feedback.warning?.includes('common'),
  };
}
```

### 8. emailValidation.ts

```typescript
export interface EmailTypoSuggestion {
  original: string;
  suggestion: string;
  domain: string;
}

const commonDomains = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.de',
  'hotmail.com',
  'hotmail.de',
  'outlook.com',
  'outlook.de',
  'web.de',
  'gmx.de',
  'gmx.net',
  'icloud.com',
  't-online.de',
  'freenet.de',
  'posteo.de',
  'mailbox.org',
];

const domainTypos: Record<string, string> = {
  // Gmail typos
  'gmal.com': 'gmail.com',
  'gmial.com': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'gamil.com': 'gmail.com',
  'gnail.com': 'gmail.com',
  'gmail.co': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.om': 'gmail.com',
  'gmailcom': 'gmail.com',
  'gmail.de': 'gmail.com',
  
  // Yahoo typos
  'yaho.com': 'yahoo.com',
  'yahooo.com': 'yahoo.com',
  'yahoo.co': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yaoo.com': 'yahoo.com',
  
  // Hotmail typos
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'hotmail.co': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'homail.com': 'hotmail.com',
  
  // Outlook typos
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'outlook.co': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'outlool.com': 'outlook.com',
  
  // German domain typos
  'web.ed': 'web.de',
  'wbe.de': 'web.de',
  'webde': 'web.de',
  'gmx.ed': 'gmx.de',
  'gmx.ne': 'gmx.net',
  'gmxde': 'gmx.de',
  't-onlien.de': 't-online.de',
  't-online.ed': 't-online.de',
  'tonline.de': 't-online.de',
  
  // iCloud typos
  'iclod.com': 'icloud.com',
  'icoud.com': 'icloud.com',
  'icloud.co': 'icloud.com',
  'icloud.cm': 'icloud.com',
};

function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function detectEmailTypo(email: string): EmailTypoSuggestion | null {
  if (!email || !email.includes('@')) {
    return null;
  }

  const [localPart, domain] = email.toLowerCase().split('@');
  
  if (!domain) {
    return null;
  }

  // Check for known typos first
  if (domainTypos[domain]) {
    return {
      original: email,
      suggestion: `${localPart}@${domainTypos[domain]}`,
      domain: domainTypos[domain],
    };
  }

  // Check if domain is already correct
  if (commonDomains.includes(domain)) {
    return null;
  }

  // Find closest matching domain using Levenshtein distance
  let closestDomain = '';
  let minDistance = Infinity;

  for (const commonDomain of commonDomains) {
    const distance = levenshteinDistance(domain, commonDomain);
    if (distance < minDistance && distance <= 2) {
      minDistance = distance;
      closestDomain = commonDomain;
    }
  }

  if (closestDomain && minDistance > 0) {
    return {
      original: email,
      suggestion: `${localPart}@${closestDomain}`,
      domain: closestDomain,
    };
  }

  return null;
}
```

---

## 🎨 CSS aus index.css (Relevante Abschnitte)

### Gilroy Font-Faces

```css
@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-Light.ttf') format('truetype');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-Regular.ttf') format('truetype');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-Medium.ttf') format('truetype');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-SemiBold.ttf') format('truetype');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-Bold.ttf') format('truetype');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'Gilroy';
  src: url('/fonts/Gilroy-ExtraBold.ttf') format('truetype');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
```

### Gradient Animation Keyframes

```css
@keyframes gradient-shift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.animate-gradient-shift {
  background-size: 200% 200%;
  animation: gradient-shift 15s ease infinite;
}
```

### Base Styles

```css
body {
  font-family: 'Gilroy', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

html {
  scroll-behavior: smooth;
}
```

---

## 📦 Abhängigkeiten

```json
{
  "dependencies": {
    "framer-motion": "^12.x",
    "lucide-react": "^0.x",
    "zod": "^3.x",
    "@zxcvbn-ts/core": "^3.x",
    "@zxcvbn-ts/language-common": "^3.x",
    "@supabase/supabase-js": "^2.x",
    "react": "^18.x",
    "react-dom": "^18.x",
    "react-router-dom": "^6.x"
  }
}
```

### Verwendete Lucide Icons

```typescript
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  Check,
  X,
  ArrowLeft,
  Camera,
  Sparkles,
  Clock,
  Shield,
  ChevronRight
} from 'lucide-react';
```

---

## 🏗️ Architektur Diagramm

```
┌─────────────────────────────────────────────────────────────────┐
│                        Auth Page                                │
│  ┌─────────────────────────┐  ┌─────────────────────────────┐  │
│  │   BenefitsCarousel      │  │      Auth Form Card         │  │
│  │   (40% - Desktop)       │  │      (60% - Desktop)        │  │
│  │                         │  │                             │  │
│  │  ┌───────────────────┐  │  │  ┌───────────────────────┐  │  │
│  │  │ Gradient BG +     │  │  │  │ Header (AnimatePresence)│ │  │
│  │  │ Pattern Overlay   │  │  │  └───────────────────────┘  │  │
│  │  └───────────────────┘  │  │  ┌───────────────────────┐  │  │
│  │  ┌───────────────────┐  │  │  │ SocialAuthButtons     │  │  │
│  │  │ Logo              │  │  │  └───────────────────────┘  │  │
│  │  └───────────────────┘  │  │  ┌───────────────────────┐  │  │
│  │  ┌───────────────────┐  │  │  │ FloatingLabelInput    │  │  │
│  │  │ Benefit Content   │  │  │  │ (Email)               │  │  │
│  │  │ (AnimatePresence) │  │  │  └───────────────────────┘  │  │
│  │  └───────────────────┘  │  │  ┌───────────────────────┐  │  │
│  │  ┌───────────────────┐  │  │  │ FloatingLabelInput    │  │  │
│  │  │ Carousel Dots     │  │  │  │ (Password)            │  │  │
│  │  └───────────────────┘  │  │  └───────────────────────┘  │  │
│  │  ┌───────────────────┐  │  │  ┌───────────────────────┐  │  │
│  │  │ Trust Badges      │  │  │  │ PasswordRequirements  │  │  │
│  │  └───────────────────┘  │  │  └───────────────────────┘  │  │
│  │                         │  │  ┌───────────────────────┐  │  │
│  └─────────────────────────┘  │  │ Submit Button         │  │  │
│                               │  └───────────────────────┘  │  │
│                               │  ┌───────────────────────┐  │  │
│                               │  │ Mode Switch           │  │  │
│                               │  └───────────────────────┘  │  │
│                               └─────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
              ┌───────────────────────────────┐
              │    ForgotPasswordModal        │
              │    (Overlay Portal)           │
              └───────────────────────────────┘
```

---

## 📝 Zusammenfassung

Diese Dokumentation enthält alle notwendigen Informationen zum Nachbau der Authentifizierungsseite:

1. **Alle Komponenten** mit vollständigem Code
2. **CSS Custom Properties** für Light/Dark Mode
3. **Animationen** (CSS Keyframes + Framer Motion)
4. **Deutsche Texte** für alle UI-Elemente
5. **Abhängigkeiten** und Icons
6. **Architektur-Diagramm** zur Visualisierung

Bei Fragen oder für weitere Details, schauen Sie in die jeweiligen Quelldateien im Projekt.
