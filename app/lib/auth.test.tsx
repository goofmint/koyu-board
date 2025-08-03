import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock window.ENV first
Object.defineProperty(window, 'ENV', {
  value: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    APP_URL: 'http://localhost:3000',
  },
  writable: true,
});

// Create mock functions
const mockSignInWithOAuth = vi.fn();
const mockSignOut = vi.fn();

// Mock the Supabase client
vi.mock('./supabase.client', () => ({
  createClient: () => ({
    auth: {
      signInWithOAuth: mockSignInWithOAuth,
      signOut: mockSignOut,
    },
  }),
}));

// Import after mocking
const { signInWithProvider, signOut } = await import('./auth');

describe('Auth Functions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockSignInWithOAuth.mockResolvedValue({ error: null });
    mockSignOut.mockResolvedValue({ error: null });
  });

  describe('signInWithProvider', () => {
    it('calls signInWithOAuth with correct parameters for Google', async () => {
      await signInWithProvider('google');

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'google',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      });
    });

    it('calls signInWithOAuth with correct parameters for GitHub', async () => {
      await signInWithProvider('github');

      expect(mockSignInWithOAuth).toHaveBeenCalledWith({
        provider: 'github',
        options: {
          redirectTo: 'http://localhost:3000/auth/callback',
        },
      });
    });

    it('throws error when signInWithOAuth returns error', async () => {
      const testError = new Error('Test error');
      mockSignInWithOAuth.mockResolvedValue({ error: testError });

      await expect(signInWithProvider('google')).rejects.toThrow('Test error');
    });
  });

  describe('signOut', () => {
    it('calls signOut on Supabase client', async () => {
      await signOut();
      expect(mockSignOut).toHaveBeenCalled();
    });

    it('throws error when signOut returns error', async () => {
      const testError = new Error('Sign out error');
      mockSignOut.mockResolvedValue({ error: testError });

      await expect(signOut()).rejects.toThrow('Sign out error');
    });
  });
});
