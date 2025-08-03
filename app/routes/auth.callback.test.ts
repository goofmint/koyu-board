import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { LoaderFunctionArgs } from '@remix-run/node';
import { loader } from './auth.callback';

// Mock the Supabase server client
const mockExchangeCodeForSession = vi.fn();

vi.mock('../lib/supabase.server', () => ({
  createSupabaseServerClient: vi.fn(() => ({
    auth: {
      exchangeCodeForSession: mockExchangeCodeForSession,
    },
  })),
}));

// Mock Remix redirect
vi.mock('@remix-run/node', async () => {
  const actual = await vi.importActual('@remix-run/node');
  return {
    ...actual,
    redirect: vi.fn(
      (url: string) =>
        new Response(null, { status: 302, headers: { Location: url } })
    ),
  };
});

describe('Auth Callback Loader', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key');
    mockExchangeCodeForSession.mockResolvedValue({ error: null });
  });

  it('exchanges code for session when code is present', async () => {
    const request = new Request(
      'http://localhost:3000/auth/callback?code=test-code'
    );

    const response = await loader({ request } as LoaderFunctionArgs);

    expect(mockExchangeCodeForSession).toHaveBeenCalledWith('test-code');
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
  });

  it('redirects without exchange when no code is present', async () => {
    const request = new Request('http://localhost:3000/auth/callback');

    const response = await loader({ request } as LoaderFunctionArgs);

    expect(mockExchangeCodeForSession).not.toHaveBeenCalled();
    expect(response.status).toBe(302);
    expect(response.headers.get('Location')).toBe('/');
  });
});
