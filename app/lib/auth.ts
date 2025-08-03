import { createClient } from './supabase.client';

export const signInWithProvider = async (provider: 'google' | 'github') => {
  const supabase = createClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${window.ENV.APP_URL}/auth/callback`,
    },
  });

  if (error) throw error;
};

export const signOut = async () => {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};
