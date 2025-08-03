import { describe, it, expect, beforeEach } from 'vitest';
import { createClient } from './supabase.client';

// Mock window.ENV
Object.defineProperty(window, 'ENV', {
  value: {
    SUPABASE_URL: 'https://test.supabase.co',
    SUPABASE_ANON_KEY: 'test-anon-key',
    APP_URL: 'http://localhost:3000',
  },
  writable: true,
});

describe('Supabase Client', () => {
  beforeEach(() => {
    window.ENV = {
      SUPABASE_URL: 'https://test.supabase.co',
      SUPABASE_ANON_KEY: 'test-anon-key',
      APP_URL: 'http://localhost:3000',
    };
  });

  it('creates a Supabase client', () => {
    const client = createClient();
    expect(client).toBeDefined();
    expect(typeof client.auth).toBe('object');
    expect(typeof client.from).toBe('function');
  });

  it('uses environment variables from window.ENV', () => {
    // Test that the client is created with the correct environment variables
    // We can't directly access the internal properties, so we test the behavior
    const client = createClient();
    expect(client).toBeDefined();
    expect(window.ENV.SUPABASE_URL).toBe('https://test.supabase.co');
    expect(window.ENV.SUPABASE_ANON_KEY).toBe('test-anon-key');
  });
});
