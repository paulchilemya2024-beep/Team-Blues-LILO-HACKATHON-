import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;
let warned = false;

function mockClient(): SupabaseClient {
  // Minimal graceful-degradation stub. Every auth call resolves locally
  // so the UI never crashes when Supabase keys are absent (guest mode).
  const stub = {
    auth: {
      async getSession() {
        return { data: { session: null }, error: null };
      },
      async signInWithPassword() {
        return {
          data: { user: null, session: null },
          error: { message: 'Supabase not configured — continuing as Guest.' },
        };
      },
      async signUp() {
        return {
          data: { user: null, session: null },
          error: { message: 'Supabase not configured — continuing as Guest.' },
        };
      },
      async signInWithOAuth() {
        return {
          data: { provider: 'github', url: null },
          error: { message: 'Supabase not configured — continuing as Guest.' },
        };
      },
      async signOut() {
        return { error: null };
      },
      onAuthStateChange() {
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
    },
  };
  return stub as unknown as SupabaseClient;
}

export function getSupabase(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    if (!warned && typeof window !== 'undefined') {
      warned = true;
      console.info('[CodeGuide] Supabase keys absent — running in Guest mode.');
    }
    cached = mockClient();
    return cached;
  }
  cached = createClient(url, key);
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
