import type { SessionState, UserProfile } from '@/types';

function keyFor(problemId: string): string {
  return `codeguide_session_${problemId}`;
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

export function defaultSession(problemId: string): SessionState {
  return {
    sessionId: `sess_${problemId}_${Date.now()}`,
    problemId,
    currentStep: 0,
    hintsRevealed: 0,
    userNotes: '',
    qaThread: [],
    isCompleted: false,
    lastUpdated: new Date().toISOString(),
  };
}

export function saveSession(state: SessionState): void {
  if (!isBrowser()) return;
  try {
    const payload = { ...state, lastUpdated: new Date().toISOString() };
    localStorage.setItem(keyFor(state.problemId), JSON.stringify(payload));
  } catch {
    // Storage full or unavailable — sessions are best-effort in guest mode.
  }
}

export function loadSession(problemId: string): SessionState | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem(keyFor(problemId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SessionState;
    if (!parsed || parsed.problemId !== problemId) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearSession(problemId: string): void {
  if (!isBrowser()) return;
  try {
    localStorage.removeItem(keyFor(problemId));
  } catch {
    // ignore
  }
}

export function markProblemComplete(problemId: string): void {
  if (!isBrowser()) return;
  try {
    const raw = localStorage.getItem('codeguide_completed');
    const list: string[] = raw ? (JSON.parse(raw) as string[]) : [];
    if (!list.includes(problemId)) {
      list.push(problemId);
      localStorage.setItem('codeguide_completed', JSON.stringify(list));
    }
  } catch {
    // ignore
  }
}

export function getCompletedProblems(): string[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem('codeguide_completed');
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

export function getCurrentUser(): UserProfile | null {
  if (!isBrowser()) return null;
  try {
    const raw = localStorage.getItem('codeguide_user');
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null): void {
  if (!isBrowser()) return;
  try {
    if (!user) {
      localStorage.removeItem('codeguide_user');
    } else {
      localStorage.setItem('codeguide_user', JSON.stringify(user));
    }
  } catch {
    // ignore
  }
}
