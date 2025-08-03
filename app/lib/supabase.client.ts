import { createBrowserClient } from '@supabase/ssr';

declare global {
  interface Window {
    ENV: {
      SUPABASE_URL: string;
      SUPABASE_ANON_KEY: string;
      APP_URL: string;
    };
  }
}

export const createClient = () =>
  createBrowserClient(window.ENV.SUPABASE_URL, window.ENV.SUPABASE_ANON_KEY);
