import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AuthService, SignUpData, SignInData } from './AuthService';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: {
      signUp: vi.fn(),
      signInWithPassword: vi.fn(),
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      updateUser: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: {
          subscription: {
            unsubscribe: vi.fn()
          }
        }
      }))
    },
    functions: {
      invoke: vi.fn()
    }
  }
}));

import { supabase } from '@/integrations/supabase/client';

describe('AuthService', () => {
  let authService: AuthService;

  beforeEach(() => {
    authService = new AuthService();
    vi.clearAllMocks();
    
    // Mock window.location.origin
    Object.defineProperty(window, 'location', {
      value: { origin: 'https://test.example.com' },
      writable: true
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('signUp', () => {
    const signUpData: SignUpData = {
      email: 'test@example.com',
      password: 'securePassword123',
      userData: { vorname: 'Test', nachname: 'User' }
    };

    it('should register a new user successfully', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { access_token: 'token-123' };
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: mockUser, session: mockSession } as any,
        error: null
      });

      const result = await authService.signUp(signUpData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
      expect(result.error).toBeUndefined();
    });

    it('should return error for duplicate email', async () => {
      const mockError = { message: 'User already registered', status: 400 };
      
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any
      });

      const result = await authService.signUp(signUpData);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });

    it('should include redirect URL in options', async () => {
      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null
      });

      await authService.signUp(signUpData);

      expect(supabase.auth.signUp).toHaveBeenCalledWith({
        email: signUpData.email,
        password: signUpData.password,
        options: {
          emailRedirectTo: 'https://test.example.com/',
          data: signUpData.userData
        }
      });
    });

    it('should pass user metadata correctly', async () => {
      const dataWithMetadata: SignUpData = {
        email: 'test@example.com',
        password: 'password123',
        userData: { firma: 'Test GmbH', branche: 'Immobilien' }
      };

      vi.mocked(supabase.auth.signUp).mockResolvedValue({
        data: { user: null, session: null },
        error: null
      });

      await authService.signUp(dataWithMetadata);

      expect(supabase.auth.signUp).toHaveBeenCalledWith(
        expect.objectContaining({
          options: expect.objectContaining({
            data: dataWithMetadata.userData
          })
        })
      );
    });
  });

  describe('signIn', () => {
    const signInData: SignInData = {
      email: 'test@example.com',
      password: 'password123'
    };

    it('should authenticate valid credentials', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      const mockSession = { access_token: 'token-123' };
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: mockUser, session: mockSession } as any,
        error: null
      });

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(result.session).toEqual(mockSession);
    });

    it('should return error for invalid credentials', async () => {
      const mockError = { message: 'Invalid login credentials', status: 400 };
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any
      });

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(mockError);
    });

    it('should return error for non-existent user', async () => {
      const mockError = { message: 'User not found', status: 404 };
      
      vi.mocked(supabase.auth.signInWithPassword).mockResolvedValue({
        data: { user: null, session: null },
        error: mockError as any
      });

      const result = await authService.signIn(signInData);

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('User not found');
    });
  });

  describe('signInWithOAuth', () => {
    it('should initiate Google OAuth flow', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: 'https://google.com/oauth' },
        error: null
      });

      const result = await authService.signInWithOAuth('google');

      expect(result.error).toBeNull();
      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: expect.objectContaining({
          redirectTo: 'https://test.example.com/order'
        })
      });
    });

    it('should include correct redirect URL', async () => {
      vi.mocked(supabase.auth.signInWithOAuth).mockResolvedValue({
        data: { provider: 'google', url: 'https://google.com/oauth' },
        error: null
      });

      await authService.signInWithOAuth('google');

      expect(supabase.auth.signInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'https://test.example.com/order',
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });
    });
  });

  describe('signOut', () => {
    it('should clear session', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      await authService.signOut();

      expect(supabase.auth.signOut).toHaveBeenCalled();
    });

    it('should handle already logged out state', async () => {
      vi.mocked(supabase.auth.signOut).mockResolvedValue({ error: null });

      // Should not throw even if already logged out
      await expect(authService.signOut()).resolves.not.toThrow();
    });
  });

  describe('requestPasswordReset', () => {
    it('should call edge function with email', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { success: true },
        error: null
      });

      const result = await authService.requestPasswordReset('test@example.com');

      expect(result.success).toBe(true);
      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'request-password-reset',
        { body: { email: 'test@example.com' } }
      );
    });

    it('should handle rate limiting errors', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { error: 'Too many requests. Please wait before trying again.' },
        error: null
      });

      const result = await authService.requestPasswordReset('test@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Too many requests');
    });

    it('should handle invalid email errors', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: null,
        error: { message: 'Invalid email format' }
      });

      const result = await authService.requestPasswordReset('invalid-email');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });
  });

  describe('resetPassword', () => {
    const validToken = 'valid-token-123';
    const newPassword = 'newSecurePassword123!';

    it('should reset password with valid token', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { success: true },
        error: null
      });

      const result = await authService.resetPassword(validToken, newPassword);

      expect(result.success).toBe(true);
      expect(supabase.functions.invoke).toHaveBeenCalledWith(
        'reset-password',
        { body: { token: validToken, newPassword } }
      );
    });

    it('should return error for expired token', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { error: 'Token has expired' },
        error: null
      });

      const result = await authService.resetPassword('expired-token', newPassword);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token has expired');
    });

    it('should return error for invalid token', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { error: 'Invalid or already used token' },
        error: null
      });

      const result = await authService.resetPassword('invalid-token', newPassword);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Invalid or already used token');
    });

    it('should return detailed validation errors', async () => {
      vi.mocked(supabase.functions.invoke).mockResolvedValue({
        data: { 
          error: 'Password validation failed',
          details: ['Password too short', 'Must contain uppercase letter']
        },
        error: null
      });

      const result = await authService.resetPassword(validToken, 'weak');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Password too short. Must contain uppercase letter');
    });
  });

  describe('updatePassword', () => {
    it('should update password for authenticated user', async () => {
      const mockUser = { id: 'user-123', email: 'test@example.com' };
      
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: mockUser } as any,
        error: null
      });

      const result = await authService.updatePassword('newPassword123!');

      expect(result.success).toBe(true);
      expect(result.user).toEqual(mockUser);
      expect(supabase.auth.updateUser).toHaveBeenCalledWith({
        password: 'newPassword123!'
      });
    });

    it('should return error if not authenticated', async () => {
      const mockError = { message: 'User not authenticated', status: 401 };
      
      vi.mocked(supabase.auth.updateUser).mockResolvedValue({
        data: { user: null },
        error: mockError as any
      });

      const result = await authService.updatePassword('newPassword123!');

      expect(result.success).toBe(false);
      expect(result.error?.message).toBe('User not authenticated');
    });
  });

  describe('getSession', () => {
    it('should return current session', async () => {
      const mockSession = { 
        access_token: 'token-123',
        user: { id: 'user-123', email: 'test@example.com' }
      };
      
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: mockSession as any },
        error: null
      });

      const result = await authService.getSession();

      expect(result).toEqual(mockSession);
    });

    it('should return null when not authenticated', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null
      });

      const result = await authService.getSession();

      expect(result).toBeNull();
    });
  });

  describe('onAuthStateChange', () => {
    it('should call callback on auth events', () => {
      const mockCallback = vi.fn();
      
      authService.onAuthStateChange(mockCallback);

      expect(supabase.auth.onAuthStateChange).toHaveBeenCalledWith(mockCallback);
    });

    it('should return unsubscribe function', () => {
      const mockUnsubscribe = vi.fn();
      vi.mocked(supabase.auth.onAuthStateChange).mockReturnValue({
        data: {
          subscription: {
            unsubscribe: mockUnsubscribe
          }
        }
      } as any);

      const unsubscribe = authService.onAuthStateChange(vi.fn());
      unsubscribe();

      expect(mockUnsubscribe).toHaveBeenCalled();
    });
  });
});
