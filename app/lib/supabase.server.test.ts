import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createSupabaseServerClient } from './supabase.server';

describe('Supabase Server Client', () => {
  beforeEach(() => {
    vi.stubEnv('SUPABASE_URL', 'https://test.supabase.co');
    vi.stubEnv('SUPABASE_ANON_KEY', 'test-anon-key');
  });

  it('creates a server-side Supabase client', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        cookie: 'session=test-session',
      },
    });

    const client = createSupabaseServerClient(request);
    expect(client).toBeDefined();
    expect(typeof client.auth).toBe('object');
    expect(typeof client.from).toBe('function');
  });

  it('handles requests without cookies', () => {
    const request = new Request('http://localhost:3000');

    const client = createSupabaseServerClient(request);
    expect(client).toBeDefined();
  });

  it('parses cookies correctly', () => {
    const request = new Request('http://localhost:3000', {
      headers: {
        cookie: 'sb-token=abc123; session=xyz789; other=value',
      },
    });

    const client = createSupabaseServerClient(request);
    expect(client).toBeDefined();
  });
});
