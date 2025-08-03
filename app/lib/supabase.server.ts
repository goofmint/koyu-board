import { createServerClient } from '@supabase/ssr';

export const createSupabaseServerClient = (request: Request) =>
  createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          const cookieHeader = request.headers.get('cookie');
          if (!cookieHeader) return undefined;

          const cookies = cookieHeader.split(';').reduce(
            (acc, cookie) => {
              const [key, value] = cookie.trim().split('=');
              acc[key] = value;
              return acc;
            },
            {} as Record<string, string>
          );

          return cookies[name];
        },
        set() {
          // Server-side cookies are handled by response headers
        },
        remove() {
          // Server-side cookies are handled by response headers
        },
      },
    }
  );
