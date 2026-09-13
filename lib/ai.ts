import type { QAPair } from '@/types';

// Optional tutor client. When no AI key is configured, generate
// deterministic local guidance so the workspace works 100% offline.

const SUGGESTION_ANSWERS: Array<{ match: RegExp; answer: string }> = [
  {
    match: /memory|space|bottleneck/i,
    answer:
      'Memory scales with the auxiliary structure, not the input traversal. The hash map (or window map) holds at most one entry per distinct key in the live window. If memory is the bottleneck, consider: (1) a sort + two-pointer encoding that trades time for O(1) extra space, or (2) streaming the input when order permits. State the bound explicitly: O(n) entries worst-case, O(window) typical.',
  },
  {
    match: /two.?pointer|pointer/i,
    answer:
      'Two pointers apply when the input has exploitable order (sorted array, linked structure, or a window with a monotone property). On unsorted data with index-based output (like Two Sum), sorting destroys the index mapping, so hashing dominates. Use two pointers when order is given or cheap to create; otherwise prefer the map.',
  },
  {
    match: /brute|naive|slow/i,
    answer:
      'Brute force enumerates the full candidate space (all pairs, all windows) and re-checks work from scratch each time. The optimal approach memoizes exactly the repeated subquery — complement lookup, last-seen index, recency order — turning a repeated O(n) scan into an O(1) query. That is the entire gap: identify the repeated question, then index it.',
  },
  {
    match: /invariant|proof|correct|why.*work/i,
    answer:
      'Invariant method: state what is true before each iteration, show the step preserves it, and show it implies the answer at termination. Example: "before index i, the map holds exactly values 0..i-1". The pair closes precisely when the second endpoint is processed. No case is missed because every pair has a second endpoint.',
  },
  {
    match: /time|complexity|big.?o|o\(n/i,
    answer:
      'Derive bounds from the code structure: count visits per element and retained state. Single pass with O(1) map ops gives O(n) time. Nested loops over pairs give O(n^2). Recursion depth or stored entries give the space bound. Never quote a bound without pointing at the loop or structure that produces it.',
  },
];

const FALLBACK_ANSWER =
  'Good question. Work from the invariant: name exactly what your structure knows after each step, then check which step could first observe the answer. If no step can observe it, the structure is missing an index — add the map, pointer, or ordering that makes the key query O(1). Try restating your question in terms of "what repeated lookup am I paying for?"';

export const SUGGESTED_QUESTIONS = [
  'Memory bottleneck?',
  'Why not two pointers?',
  'Brute force gap?',
  'Invariant proof?',
];

export async function askTutor(
  question: string,
  context: { problemTitle: string; pattern: string }
): Promise<string> {
  const contextPrompt = `You are a technical interview tutor mentoring a student through the problem: "${context.problemTitle}" (${context.pattern} pattern). Provide a direct, concise answer (2 to 4 sentences) guiding their intuition without spoiling the full solution outright.`;

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: question,
        context: contextPrompt,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer && typeof data.answer === 'string' && data.answer.trim()) {
        return data.answer.trim();
      }
    }
  } catch (err) {
    // Network drop or offline testing — continue with deterministic local fallback
  }

  // Graceful deterministic Socratic fallback
  return answerLocally(question, context);
}

export function answerLocally(
  question: string,
  context: { problemTitle: string; pattern: string }
): string {
  for (const entry of SUGGESTION_ANSWERS) {
    if (entry.match.test(question)) return entry.answer;
  }
  return `${FALLBACK_ANSWER} (context: ${context.problemTitle} [${context.pattern}])`;
}

export function buildQAPair(q: string, a: string): QAPair {
  return { q, a, timestamp: new Date().toISOString() };
}

export async function evaluateHypothesis(
  hypothesis: string,
  context: { problemTitle: string; pattern: string; expectedApproach?: string }
): Promise<{ verdict: string; feedback: string }> {
  const contextPrompt = `You are an elite technical interview mentor evaluating a candidate's hypothesis for the problem: "${context.problemTitle}" (optimal pattern: ${context.pattern}). Evaluate their proposal in 2 to 4 sentences: (1) Affirm what is promising or correct, (2) Highlight any time or space bottlenecks or missing edge cases, and (3) Give a subtle Socratic nudge towards the invariant without spoiling the code.`;

  try {
    const res = await fetch('/api/gemini', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        prompt: `Candidate's proposed approach:\n"${hypothesis}"\n\nEvaluate this hypothesis against "${context.problemTitle}" (${context.pattern}).`,
        context: contextPrompt,
        mode: 'followup',
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data.answer && typeof data.answer === 'string' && data.answer.trim()) {
        const text = data.answer.trim();
        let verdict = 'Promising Direction';
        const lower = text.toLowerCase();
        if (
          lower.includes('optimal') ||
          lower.includes('excellent') ||
          lower.includes('spot on') ||
          lower.includes('great') ||
          lower.includes('correct')
        ) {
          verdict = 'Key Insight Identified';
        } else if (
          lower.includes('slow') ||
          lower.includes('quadratic') ||
          lower.includes('bottleneck') ||
          lower.includes('o(n^2)')
        ) {
          verdict = 'Sub-optimal Bottleneck';
        }
        return { verdict, feedback: text };
      }
    }
  } catch {
    // offline fallback
  }

  return evaluateHypothesisLocally(hypothesis, context);
}

export function evaluateHypothesisLocally(
  hypothesis: string,
  context: { problemTitle: string; pattern: string; expectedApproach?: string }
): { verdict: string; feedback: string } {
  const h = hypothesis.toLowerCase();
  const pattern = context.pattern.toLowerCase();

  if (
    (pattern.includes('hash') &&
      (h.includes('hash') || h.includes('map') || h.includes('dict') || h.includes('set'))) ||
    (pattern.includes('two pointer') &&
      (h.includes('pointer') || h.includes('two pointer') || h.includes('window'))) ||
    (pattern.includes('heap') &&
      (h.includes('heap') || h.includes('priority queue'))) ||
    (pattern.includes('tree') &&
      (h.includes('dfs') || h.includes('bfs') || h.includes('recurse') || h.includes('traversal'))) ||
    (pattern.includes('graph') &&
      (h.includes('bfs') || h.includes('dfs') || h.includes('visited') || h.includes('topological'))) ||
    (pattern.includes('dynamic programming') &&
      (h.includes('dp') || h.includes('memo') || h.includes('subproblem') || h.includes('tabulation'))) ||
    (pattern.includes('binary search') &&
      (h.includes('binary search') || h.includes('halv') || h.includes('mid') || h.includes('log')))
  ) {
    return {
      verdict: 'Key Insight Identified',
      feedback: `Strong intuition! Leveraging ${context.pattern} directly attacks the core bottleneck of "${context.problemTitle}". Focus on maintaining the invariant: verify how your auxiliary structure updates at each iteration and ensure no edge cases are skipped before reviewing the canonical code.`,
    };
  }

  if (
    h.includes('loop') &&
    (h.includes('nested') || h.includes('all pairs') || h.includes('brute') || h.includes('check every'))
  ) {
    return {
      verdict: 'Sub-optimal Bottleneck',
      feedback: `Enumerating all candidates is sound for correctness, but incurs a quadratic O(n^2) time penalty. Ask yourself: what repeated subquery are the nested loops recalculating on every step, and what data structure can answer that query in O(1) or O(log n)?`,
    };
  }

  if (h.includes('sort')) {
    return {
      verdict: 'Order Constraint Tradeoff',
      feedback: `Sorting establishes a monotonic order that enables binary search or two pointers, but costs O(n log n) time and destroys original indices. Check if the problem requires original index preservation or if an O(n) auxiliary lookup exists.`,
    };
  }

  return {
    verdict: 'Promising Direction',
    feedback: `Good reasoning. To refine this into an optimal solution, formulate the invariant: what state must you remember from previously processed elements so you can evaluate the current element in O(1) time? Compare your hypothesis with the hints above.`,
  };
}

