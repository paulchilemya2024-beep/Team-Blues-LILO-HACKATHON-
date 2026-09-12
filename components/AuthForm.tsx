'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getSupabase, isSupabaseConfigured } from '@/lib/supabase';
import { setCurrentUser, getCompletedProblems } from '@/lib/storage';
import type { UserProfile } from '@/types';

export default function AuthForm({ mode }: { mode: 'login' | 'signup' }) {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const isLogin = mode === 'login';

  function getDestination(): string {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const redirect = params.get('redirect');
        if (redirect && redirect.startsWith('/')) {
          return redirect;
        }
        const lastId = localStorage.getItem('codeguide_last_problem');
        if (lastId) {
          return `/solve/${lastId}`;
        }
      } catch {
        // ignore
      }
    }
    return '/solve/two_sum';
  }

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setStatus(null);
    try {
      const dest = getDestination();
      const sb = getSupabase();
      if (isSupabaseConfigured()) {
        if (isLogin) {
          const { data, error } = await sb.auth.signInWithPassword({ email, password });
          if (error) {
            setStatus(error.message);
            return;
          }
          if (data?.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email,
              isGuest: false,
              completedProblems: getCompletedProblems(),
            };
            setCurrentUser(profile);
          }
          setStatus('Signed in. Launching workspace…');
          window.location.href = dest;
          return;
        } else {
          const { data, error } = await sb.auth.signUp({ email, password });
          if (error) {
            setStatus(error.message);
            return;
          }
          if (data?.user) {
            const profile: UserProfile = {
              id: data.user.id,
              email: data.user.email,
              isGuest: false,
              completedProblems: getCompletedProblems(),
            };
            setCurrentUser(profile);
          }
          setStatus('Account created. Launching workspace…');
          window.location.href = dest;
          return;
        }
      }

      // Offline / Local developer fallback
      const profile: UserProfile = {
        id: `usr_${Date.now()}`,
        email: email || 'developer@codeguide.dev',
        isGuest: false,
        completedProblems: getCompletedProblems(),
      };
      setCurrentUser(profile);
      setStatus(isLogin ? `Signed in as ${email}. Launching workspace…` : `Account created. Launching workspace…`);
      window.location.href = dest;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication error. Continuing…';
      setStatus(msg);
      window.location.href = getDestination();
    } finally {
      setBusy(false);
    }
  }

  async function handleGithub() {
    setBusy(true);
    try {
      const dest = getDestination();
      const sb = getSupabase();
      if (isSupabaseConfigured()) {
        const { error } = await sb.auth.signInWithOAuth({ provider: 'github' });
        if (error) {
          setStatus(error.message);
          return;
        }
      }

      // Offline / Local developer fallback
      const profile: UserProfile = {
        id: `gh_${Date.now()}`,
        email: 'github-developer@codeguide.dev',
        isGuest: false,
        completedProblems: getCompletedProblems(),
      };
      setCurrentUser(profile);
      setStatus('Authenticated with GitHub. Launching workspace…');
      window.location.href = dest;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'OAuth error';
      setStatus(msg);
    } finally {
      setBusy(false);
    }
  }

  function handleGuest() {
    const profile: UserProfile = {
      id: `guest_${Date.now()}`,
      isGuest: true,
      completedProblems: getCompletedProblems(),
    };
    setCurrentUser(profile);
    window.location.href = getDestination();
  }

  return (
    <div className="bg-[#191e28] border border-[#2a303c] rounded-sm p-6 sm:p-8 w-full max-w-md">
      <p className="font-mono text-sm text-[#38bdf8]">
        &gt;_ auth.{isLogin ? 'login' : 'signup'}()
      </p>
      <h1 className="font-serif font-semibold text-2xl text-[#f3f1eb] mt-2">
        {isLogin ? 'Sign in to sync progress' : 'Create your account'}
      </h1>
      <p className="text-[#a3abbb] text-sm mt-1">
        {isLogin
          ? 'Sync your walkthroughs across devices.'
          : 'Sync walkthroughs across devices. Guest mode keeps working either way.'}
      </p>

      <button
        onClick={handleGithub}
        disabled={busy}
        className="mt-5 w-full flex items-center justify-center gap-2.5 font-mono text-sm font-semibold border border-[#3b4455] rounded-sm px-3 py-2.5 text-[#f3f1eb] bg-[#12151c] hover:bg-[#222936] hover:border-[#38bdf8] disabled:opacity-60 transition-colors"
      >
        <svg
          className="w-4 h-4 fill-current shrink-0 text-[#f3f1eb]"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
          />
        </svg>
        <span>Continue with GitHub</span>
      </button>

      <div className="flex items-center gap-3 my-5">
        <span className="h-px flex-1 bg-[#2a303c]" />
        <span className="font-mono text-xs text-[#6e7687]">or</span>
        <span className="h-px flex-1 bg-[#2a303c]" />
      </div>

      <form onSubmit={handleEmail} className="space-y-3">
        <div>
          <label className="font-mono text-xs text-[#a3abbb]">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="user@example.com"
            className="mt-1 w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2.5 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8]"
          />
        </div>
        <div>
          <label className="font-mono text-xs text-[#a3abbb]">Password</label>
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="mt-1 w-full bg-[#12151c] border border-[#2a303c] rounded-sm px-3 py-2.5 text-sm text-[#f3f1eb] placeholder:text-[#6e7687] focus:outline-none focus:border-[#38bdf8]"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full font-mono text-sm font-semibold rounded-sm px-3 py-2.5 bg-[#38bdf8] text-[#0a131f] hover:bg-[#7dd3fc] disabled:opacity-60 transition-colors"
        >
          {busy ? '$ working…' : isLogin ? 'Sign In' : 'Create Account'}
        </button>
      </form>

      {status && (
        <p className="mt-3 font-mono text-xs leading-relaxed text-[#38bdf8] border border-[#2a303c] bg-[#12151c] rounded-sm px-3 py-2">
          $ {status}
        </p>
      )}

      <div className="mt-5 border-t border-[#2a303c] pt-4 text-center">
        <p className="text-[#a3abbb] text-sm">Don&apos;t want an account?</p>
        <button
          type="button"
          onClick={handleGuest}
          className="inline-block mt-2 font-mono text-[13px] text-[#59a89c] border border-[#59a89c] rounded-sm px-3 py-1.5 hover:bg-[#59a89c] hover:text-[#12151c] transition-colors cursor-pointer"
        >
          Continue as Guest
        </button>
        <p className="mt-3 text-xs text-[#6e7687]">
          {isLogin ? (
            <>
              New here?{' '}
              <Link href="/signup" className="text-[#38bdf8] underline">
                Create account
              </Link>
            </>
          ) : (
            <>
              Have an account?{' '}
              <Link href="/login" className="text-[#38bdf8] underline">
                Sign in
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
