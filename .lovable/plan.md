

# Phase 10: Authentifizierung Refactoring

## Analyse der aktuellen Situation

### Bestandsaufnahme (`AuthContext.tsx` - 83 Zeilen)

| Bereich | Aktuelle Implementierung | Problem |
|---------|-------------------------|---------|
| **Session-Management** | Inline in `useEffect` | Nicht testbar |
| **signUp()** | Direkte Supabase-Aufrufe | Business-Logik im Context |
| **signIn()** | Direkte Supabase-Aufrufe | Business-Logik im Context |
| **signOut()** | Navigation + Auth kombiniert | Kopplung von Concerns |
| **Error Handling** | Keine zentrale Strategie | Inkonsistent über UI-Komponenten |

### Auth-Logik verstreut über mehrere Dateien

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    AKTUELLE AUTH-ARCHITEKTUR                            │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  AuthContext.tsx (83 LOC)                                               │
│  ├── signUp() - mit redirectUrl + userData                              │
│  ├── signIn() - Password-Auth                                           │
│  ├── signOut() - mit Navigation                                         │
│  └── Session-Listener (onAuthStateChange)                               │
│                                                                          │
│  SocialAuthButtons.tsx (50 LOC)                                         │
│  └── signInWithOAuth() - Google OAuth direkt                            │
│                                                                          │
│  ForgotPasswordModal.tsx (161 LOC)                                      │
│  └── supabase.functions.invoke('request-password-reset')                │
│                                                                          │
│  ResetPassword.tsx (257 LOC)                                            │
│  └── supabase.functions.invoke('reset-password')                        │
│                                                                          │
│  Settings.tsx (Password Update)                                         │
│  └── supabase.auth.updateUser({ password })                             │
│                                                                          │
│  Auth.tsx (382 LOC)                                                     │
│  └── UI-Komponente mit Validierung + Error Handling                     │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Plan: AuthService Extraktion

### 1. Neue Service-Klasse: `AuthService.ts`

Zentralisiert alle sicherheitskritischen Auth-Operationen:

```typescript
// src/lib/services/AuthService.ts

export interface SignUpData {
  email: string;
  password: string;
  userData?: Record<string, any>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: AuthError;
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export class AuthService {
  /**
   * Register a new user with email/password
   */
  async signUp(data: SignUpData): Promise<AuthResult>
  
  /**
   * Sign in with email/password
   */
  async signIn(data: SignInData): Promise<AuthResult>
  
  /**
   * Sign in with OAuth provider (Google)
   */
  async signInWithOAuth(provider: 'google'): Promise<AuthResult>
  
  /**
   * Sign out the current user
   */
  async signOut(): Promise<void>
  
  /**
   * Get current session
   */
  async getSession(): Promise<Session | null>
  
  /**
   * Request password reset email
   */
  async requestPasswordReset(email: string): Promise<PasswordResetResult>
  
  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResult>
  
  /**
   * Update current user's password
   */
  async updatePassword(newPassword: string): Promise<AuthResult>
  
  /**
   * Subscribe to auth state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback): Unsubscribe
}

export const authService = new AuthService();
```

### 2. Schlankerer AuthContext

```typescript
// src/contexts/AuthContext.tsx - NACH REFACTORING (~50 LOC)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Delegate to service
    const unsubscribe = authService.onAuthStateChange((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Initial session check
    authService.getSession().then((session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Wrapper functions that delegate to service
  const signUp = async (email: string, password: string, userData: any) => {
    return authService.signUp({ email, password, userData });
  };

  const signIn = async (email: string, password: string) => {
    return authService.signIn({ email, password });
  };

  const signOut = async () => {
    await authService.signOut();
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. Unit Tests für AuthService

```typescript
// src/lib/services/AuthService.test.ts

describe('AuthService', () => {
  describe('signUp', () => {
    it('should register a new user successfully')
    it('should return error for duplicate email')
    it('should include redirect URL in options')
    it('should pass user metadata correctly')
  });

  describe('signIn', () => {
    it('should authenticate valid credentials')
    it('should return error for invalid credentials')
    it('should return error for non-existent user')
  });

  describe('signInWithOAuth', () => {
    it('should initiate Google OAuth flow')
    it('should include correct redirect URL')
  });

  describe('signOut', () => {
    it('should clear session')
    it('should handle already logged out state')
  });

  describe('requestPasswordReset', () => {
    it('should call edge function with email')
    it('should handle rate limiting errors')
    it('should handle invalid email errors')
  });

  describe('resetPassword', () => {
    it('should reset password with valid token')
    it('should return error for expired token')
    it('should return error for invalid token')
    it('should validate password strength')
  });

  describe('updatePassword', () => {
    it('should update password for authenticated user')
    it('should return error if not authenticated')
  });

  describe('getSession', () => {
    it('should return current session')
    it('should return null when not authenticated')
  });

  describe('onAuthStateChange', () => {
    it('should call callback on auth events')
    it('should return unsubscribe function')
  });
});
```

---

## Detaillierte Änderungen

### Datei 1: `src/lib/services/AuthService.ts` (NEU - ~180 LOC)

```typescript
import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';

// Type definitions
export interface SignUpData {
  email: string;
  password: string;
  userData?: Record<string, any>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: AuthError | null;
}

export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

export class AuthService {
  private getRedirectUrl(): string {
    return `${window.location.origin}/`;
  }

  async signUp(data: SignUpData): Promise<AuthResult> {
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        emailRedirectTo: this.getRedirectUrl(),
        data: data.userData
      }
    });

    return {
      success: !error,
      user: authData?.user ?? undefined,
      session: authData?.session ?? undefined,
      error
    };
  }

  async signIn(data: SignInData): Promise<AuthResult> {
    const { data: authData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password
    });

    return {
      success: !error,
      user: authData?.user ?? undefined,
      session: authData?.session ?? undefined,
      error
    };
  }

  async signInWithOAuth(provider: 'google'): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/order`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    return { error };
  }

  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  async requestPasswordReset(email: string): Promise<PasswordResetResult> {
    const { data, error } = await supabase.functions.invoke('request-password-reset', {
      body: { email },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.error) {
      return { success: false, error: data.error };
    }

    return { success: true };
  }

  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
    const { data, error } = await supabase.functions.invoke('reset-password', {
      body: { token, newPassword },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.error) {
      const errorMessage = data.details?.join('. ') || data.error;
      return { success: false, error: errorMessage };
    }

    return { success: true };
  }

  async updatePassword(newPassword: string): Promise<AuthResult> {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    });

    return {
      success: !error,
      user: data?.user ?? undefined,
      error
    };
  }

  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  }
}

export const authService = new AuthService();
```

### Datei 2: `src/contexts/AuthContext.tsx` (EDIT - ~55 LOC)

Reduziert von 83 auf ~55 Zeilen durch Delegation an AuthService.

### Datei 3: `src/components/auth/SocialAuthButtons.tsx` (EDIT)

```typescript
// VORHER:
const { error } = await supabase.auth.signInWithOAuth({ ... });

// NACHHER:
const { error } = await authService.signInWithOAuth('google');
```

### Datei 4: `src/components/auth/ForgotPasswordModal.tsx` (EDIT)

```typescript
// VORHER:
const { data, error } = await supabase.functions.invoke('request-password-reset', { ... });

// NACHHER:
const result = await authService.requestPasswordReset(email);
if (!result.success) throw new Error(result.error);
```

### Datei 5: `src/pages/ResetPassword.tsx` (EDIT)

```typescript
// VORHER:
const { data, error } = await supabase.functions.invoke('reset-password', { ... });

// NACHHER:
const result = await authService.resetPassword(token, password);
if (!result.success) throw new Error(result.error);
```

### Datei 6: `src/pages/Settings.tsx` (EDIT)

```typescript
// VORHER:
const { error } = await supabase.auth.updateUser({ password: ... });

// NACHHER:
const result = await authService.updatePassword(passwordData.newPassword);
if (!result.success) throw new Error(result.error?.message);
```

### Datei 7: `src/lib/services/AuthService.test.ts` (NEU - ~250 LOC)

Umfassende Unit-Tests für alle AuthService-Methoden.

---

## Architektur nach Refactoring

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                    NEUE AUTH-ARCHITEKTUR                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  UI LAYER (Components)                                                  │
│  ├── Auth.tsx - Login/Signup Form (nutzt useAuth Hook)                  │
│  ├── SocialAuthButtons.tsx - OAuth Button (nutzt authService)           │
│  ├── ForgotPasswordModal.tsx - Reset Request (nutzt authService)        │
│  └── ResetPassword.tsx - Password Reset (nutzt authService)             │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                          │
│  CONTEXT LAYER (State Management)                                       │
│  └── AuthContext.tsx                                                    │
│      ├── user, session, loading State                                   │
│      ├── Delegiert an authService                                       │
│      └── Handled Navigation nach signOut                                │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                          │
│  SERVICE LAYER (Business Logic) ← NEU                                   │
│  └── AuthService.ts                                                     │
│      ├── signUp() / signIn() / signOut()                                │
│      ├── signInWithOAuth()                                              │
│      ├── requestPasswordReset() / resetPassword()                       │
│      ├── updatePassword()                                               │
│      ├── getSession()                                                   │
│      └── onAuthStateChange()                                            │
│                                                                          │
│  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ │
│                                                                          │
│  INFRASTRUCTURE LAYER                                                   │
│  ├── Supabase Client (src/integrations/supabase/client.ts)              │
│  └── Edge Functions (request-password-reset, reset-password)            │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## Vorteile der Extraktion

### 1. Testbarkeit

| Aspekt | Vorher | Nachher |
|--------|--------|---------|
| Unit Tests | Schwierig (Context-Abhängigkeit) | Einfach (Service isoliert testbar) |
| Mocking | Komplexes Context-Mocking | Simples Service-Mocking |
| Coverage | ~0% | Ziel: >90% |

### 2. Sicherheit

- **Zentrale Validierung**: Alle Auth-Operationen durchlaufen denselben Code
- **Konsistente Fehlerbehandlung**: Einheitliche Error-Patterns
- **Audit-Fähigkeit**: Ein Ort für alle sicherheitskritischen Operationen

### 3. Wartbarkeit

- **Single Responsibility**: Context = State, Service = Logic
- **Einfache Erweiterung**: Neue Auth-Methoden nur in einem File
- **Klare Abhängigkeiten**: Service hat keine UI-Abhängigkeiten

---

## Zusammenfassung der Dateien

| Aktion | Datei | Beschreibung | LOC |
|--------|-------|--------------|-----|
| **NEU** | `src/lib/services/AuthService.ts` | Zentrale Auth-Logik | ~180 |
| **NEU** | `src/lib/services/AuthService.test.ts` | Unit Tests | ~250 |
| **EDIT** | `src/contexts/AuthContext.tsx` | Schlankerer Context | 83→55 |
| **EDIT** | `src/components/auth/SocialAuthButtons.tsx` | Nutzt authService | ~50 |
| **EDIT** | `src/components/auth/ForgotPasswordModal.tsx` | Nutzt authService | ~161 |
| **EDIT** | `src/pages/ResetPassword.tsx` | Nutzt authService | ~257 |
| **EDIT** | `src/pages/Settings.tsx` | Nutzt authService | ~300 |

---

## Metriken

| Metrik | Vorher | Nachher | Verbesserung |
|--------|--------|---------|--------------|
| AuthContext LOC | 83 | ~55 | -34% |
| Direkte Supabase-Aufrufe in UI | 6 Dateien | 0 Dateien | -100% |
| Testbare Auth-Logik | 0% | 100% | +100% |
| Geplante Unit Tests | 0 | ~20 | +20 |
| Security-kritischer Code an einem Ort | Nein | Ja | Verbessert |

