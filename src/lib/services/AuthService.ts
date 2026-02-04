import { supabase } from '@/integrations/supabase/client';
import { User, Session, AuthError, AuthChangeEvent } from '@supabase/supabase-js';

/**
 * Data required for user registration
 */
export interface SignUpData {
  email: string;
  password: string;
  userData?: Record<string, unknown>;
}

/**
 * Data required for user login
 */
export interface SignInData {
  email: string;
  password: string;
}

/**
 * Result of authentication operations
 */
export interface AuthResult {
  success: boolean;
  user?: User;
  session?: Session;
  error?: AuthError | null;
}

/**
 * Result of password reset operations
 */
export interface PasswordResetResult {
  success: boolean;
  error?: string;
}

/**
 * Callback type for auth state changes
 */
export type AuthStateChangeCallback = (
  event: AuthChangeEvent,
  session: Session | null
) => void;

/**
 * Centralized authentication service that handles all auth operations.
 * This service abstracts Supabase auth calls and provides a consistent
 * interface for all authentication-related functionality.
 * 
 * Benefits:
 * - Testable: Service can be mocked in unit tests
 * - Centralized: All auth logic in one place for security auditing
 * - Consistent: Unified error handling and result types
 */
export class AuthService {
  /**
   * Get the redirect URL for auth callbacks
   */
  private getRedirectUrl(path: string = '/'): string {
    return `${window.location.origin}${path}`;
  }

  /**
   * Register a new user with email/password
   * @param data - User registration data including email, password, and optional metadata
   * @returns AuthResult with success status and user/session or error
   */
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

  /**
   * Sign in with email/password
   * @param data - User login credentials
   * @returns AuthResult with success status and user/session or error
   */
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

  /**
   * Sign in with OAuth provider (Google)
   * @param provider - OAuth provider name
   * @returns Object with error if any occurred
   */
  async signInWithOAuth(provider: 'google'): Promise<{ error: AuthError | null }> {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: this.getRedirectUrl('/order'),
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });

    return { error };
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<void> {
    await supabase.auth.signOut();
  }

  /**
   * Get the current session
   * @returns Current session or null if not authenticated
   */
  async getSession(): Promise<Session | null> {
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }

  /**
   * Request a password reset email
   * Uses custom edge function for branded email template
   * @param email - User's email address
   * @returns PasswordResetResult with success status or error message
   */
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

  /**
   * Reset password with a token from email
   * @param token - Password reset token from email link
   * @param newPassword - New password to set
   * @returns PasswordResetResult with success status or error message
   */
  async resetPassword(token: string, newPassword: string): Promise<PasswordResetResult> {
    const { data, error } = await supabase.functions.invoke('reset-password', {
      body: { token, newPassword },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data?.error) {
      // If there are detailed validation errors, join them
      const errorMessage = data.details?.join('. ') || data.error;
      return { success: false, error: errorMessage };
    }

    return { success: true };
  }

  /**
   * Update the current user's password
   * Requires user to be authenticated
   * @param newPassword - New password to set
   * @returns AuthResult with success status or error
   */
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

  /**
   * Subscribe to authentication state changes
   * @param callback - Function to call when auth state changes
   * @returns Unsubscribe function
   */
  onAuthStateChange(callback: AuthStateChangeCallback): () => void {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(callback);
    return () => subscription.unsubscribe();
  }
}

/**
 * Singleton instance of AuthService for use throughout the application
 */
export const authService = new AuthService();
