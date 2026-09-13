export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface Problem {
  id: string;
  title: string;
  companies: string[];
  topic: string;
  pattern: string;
  difficulty: Difficulty;
  prompt: string;
  keywords: string[];
  constraints?: string[];
}

export interface PatternTrack {
  id: string;
  title: string;
  tagline: string;
  invariant: string;
  problemIds: string[];
}

export interface ApproachData {
  name: string;
  explanation: string;
  why_this_works: string;
  code: string;
  language?: string;
}

export interface ComplexityData {
  time: string;
  space: string;
  explanation: string;
}

export interface AlternativeApproach {
  name: string;
  time: string;
  space: string;
  tradeoff: string;
}

export interface SocraticWalkthrough {
  id: string;
  title: string;
  summary: string;
  constraints: string[];
  socratic_hints: string[];
  approach: ApproachData;
  complexity: ComplexityData;
  alternatives: AlternativeApproach[];
}

export interface QAPair {
  q: string;
  a: string;
  timestamp: string;
}

export interface HypothesisResult {
  hypothesis: string;
  verdict: string;
  feedback: string;
  evaluatedAt: string;
}

export interface SessionState {
  sessionId: string;
  problemId: string;
  currentStep: number; // 0: Understand, 1: Think, 2: Approach, 3: Complexity, 4: Alternatives, 5: Summary
  hintsRevealed: number;
  userNotes: string;
  qaThread: QAPair[];
  hypothesis?: HypothesisResult;
  isCompleted: boolean;
  lastUpdated: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  isGuest: boolean;
  completedProblems: string[];
}
