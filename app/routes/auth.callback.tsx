import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { createSupabaseServerClient } from '../lib/supabase.server';

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  if (code) {
    const supabase = createSupabaseServerClient(request);
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error('Error exchanging code for session:', error);
    }
  }

  return redirect('/');
};
