import type { SocraticWalkthrough } from '@/types';
import { getProblemById } from '@/lib/problems';

const ANCHORS: Record<string, SocraticWalkthrough> = {
  two_sum: {
    id: 'two_sum',
    title: 'Two Sum',
    summary:
      'Given an array of integers and a target value, return the indices of the two numbers that add up to the target. Assume exactly one valid pair exists.',
    constraints: [
      'Exactly one valid pair exists in the input.',
      'The same element cannot be used twice.',
      'Array length n satisfies 2 <= n <= 10^5.',
      'Values and target fit in a signed 32-bit integer.',
    ],
    socratic_hints: [
      'HINT 1 — For any element nums[i], what exact partner value must exist elsewhere in the array? Write it as an expression of target and nums[i].',
      'HINT 2 — If you could ask "have I seen value X before, and at which index?" in O(1) time, which data structure answers that question?',
      'HINT 3 — Single pass invariant: before processing index i, the map holds every earlier value and its index. Why does checking (target - nums[i]) in the map guarantee correctness?',
    ],
    approach: {
      name: 'Single Pass Hash Map',
      explanation:
        'Walk the array left to right. Maintain a map from value to index for every element seen so far. At index i, compute complement = target - nums[i]. If the complement is in the map, return [map[complement], i]. Otherwise store nums[i] and continue. Each lookup and insert is expected O(1).',
      why_this_works:
        '[Invariant Proof] Before iteration i, the map contains exactly the set {nums[0..i-1]} with their indices. If the valid pair is (j, k) with j < k, then when i = k the complement nums[j] is already stored, so the pair is found. No pair is ever missed and no false pair is returned because map keys are values actually seen.',
      code: `def two_sum(nums, target):
    lookup = {}
    for i, x in enumerate(nums):
        complement = target - x
        if complement in lookup:
            return [lookup[complement], i]
        lookup[x] = i
    raise ValueError("No valid pair exists")`,
      language: 'python',
    },
    complexity: {
      time: 'O(n)',
      space: 'O(n)',
      explanation:
        'Each of the n elements is visited once with O(1) expected map operations, giving O(n) time. In the worst case all n values are stored before the pair closes, giving O(n) auxiliary space. This is optimal in time for an unsorted array: any correct algorithm must inspect each element at least once in the worst case.',
    },
    alternatives: [
      {
        name: 'Brute Force Pairs',
        time: 'O(n^2)',
        space: 'O(1)',
        tradeoff:
          'Checks every pair. Zero extra memory but far too slow for n = 10^5 (about 10^10 operations). Only viable for tiny inputs or as a correctness baseline.',
      },
      {
        name: 'Sort + Two Pointers',
        time: 'O(n log n)',
        space: 'O(n)',
        tradeoff:
          'Sorting destroys original indices, so index pairs must be tracked through the sort. Slower than hashing and more bookkeeping; useful only when the array is already sorted or output values (not indices) are required.',
      },
      {
        name: 'Single Pass Hash Map (Optimal)',
        time: 'O(n)',
        space: 'O(n)',
        tradeoff:
          'Optimal time. Pays linear memory for the lookup table. The standard interview answer.',
      },
    ],
  },
  lru_cache: {
    id: 'lru_cache',
    title: 'Design an LRU Cache',
    summary:
      'Design a data structure that supports get and put operations in O(1) time, evicting the least recently used item when it exceeds a fixed capacity.',
    constraints: [
      'get(key) and put(key, value) must each run in O(1) average time.',
      'Capacity is fixed at construction: 1 <= capacity <= 10^4.',
      'Keys and values are integers.',
      'When capacity is exceeded, evict the least recently used entry.',
    ],
    socratic_hints: [
      'HINT 1 — Two operations must both be O(1): key lookup by key, and eviction of the least recently used item. What single structure gives O(1) lookup? What structure gives O(1) removal from one end and insertion at the other?',
      'HINT 2 — A hash map finds nodes fast but has no ordering. A doubly linked list has ordering but no fast search. What happens if the map stores pointers directly to list nodes?',
      'HINT 3 — Recency invariant: every get and put moves the touched node to the head; eviction always removes the tail. Why does this combination guarantee both O(1) operations and correct LRU semantics?',
    ],
    approach: {
      name: 'Hash Map + Doubly Linked List',
      explanation:
        'Keep a doubly linked list ordered most-recent (head) to least-recent (tail), plus a hash map from key to list node. get: look up the node, splice it to the head, return its value. put: if the key exists, update and move to head; else insert a new head node and, if over capacity, unlink the tail node and delete its map entry. All pointer updates are constant-time.',
      why_this_works:
        '[Invariant Proof] After every operation the list order equals access recency and the map points at exactly the live nodes. get/put touch at most a constant number of pointers, so each is O(1). Eviction removes the tail, which by the invariant is precisely the least recently used key.',
      code: `class Node:
    def __init__(self, key, val):
        self.key, self.val = key, val
        self.prev = self.next = None

class LRUCache:
    def __init__(self, capacity):
        self.cap = capacity
        self.map = {}
        self.head = Node(0, 0)
        self.tail = Node(0, 0)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev

    def _add_to_head(self, node):
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key):
        if key not in self.map:
            return -1
        node = self.map[key]
        self._remove(node)
        self._add_to_head(node)
        return node.val

    def put(self, key, value):
        if key in self.map:
            self._remove(self.map[key])
        node = Node(key, value)
        self._add_to_head(node)
        self.map[key] = node
        if len(self.map) > self.cap:
            lru = self.tail.prev
            self._remove(lru)
            del self.map[lru.key]`,
      language: 'python',
    },
    complexity: {
      time: 'O(1)',
      space: 'O(capacity)',
      explanation:
        'Map lookup plus a constant number of pointer rewires per operation gives O(1) amortized time for get and put. Memory holds one node plus one map entry per cached key, i.e. O(capacity).',
    },
    alternatives: [
      {
        name: 'Array + Linear Scan',
        time: 'O(capacity)',
        space: 'O(capacity)',
        tradeoff:
          'Simple but every access scans for recency. Fails the O(1) requirement for large capacities.',
      },
      {
        name: 'Ordered Dict (Language Builtin)',
        time: 'O(1)',
        space: 'O(capacity)',
        tradeoff:
          'Practical shortcut in real code, but interviews expect the underlying map-plus-list construction and eviction reasoning.',
      },
      {
        name: 'Hash Map + Doubly Linked List (Optimal)',
        time: 'O(1)',
        space: 'O(capacity)',
        tradeoff:
          'Meets both O(1) operations with explicit recency invariant. The expected answer.',
      },
    ],
  },
  longest_substr_no_repeat: {
    id: 'longest_substr_no_repeat',
    title: 'Longest Substring Without Repeating Characters',
    summary:
      'Given a string, find the length of the longest contiguous substring that contains no repeated characters.',
    constraints: [
      'Input length n satisfies 0 <= n <= 5 * 10^4.',
      'Characters are ASCII (extended set of 128, or Unicode handled the same way).',
      'Return the length, not the substring itself.',
      'Empty string returns 0.',
    ],
    socratic_hints: [
      'HINT 1 — Consider any window [left, right] with all-unique characters. When s[right] duplicates a character already inside the window, which side must move, and how far?',
      'HINT 2 — If you remember the last index where each character was seen, can you jump left forward in O(1) instead of shrinking one step at a time?',
      'HINT 3 — Window invariant: [left, right] always holds unique characters. Why does recording max(right - left + 1) at every step guarantee the optimum is found?',
    ],
    approach: {
      name: 'Sliding Window + Last-Seen Index',
      explanation:
        'Expand right across the string. Keep last-seen index for each character and a left boundary. When s[right] was last seen at index j with j >= left, jump left to j + 1 (skipping the stale duplicate in one step). Update last-seen, then record max length. Each index enters and leaves the window at most once.',
      why_this_works:
        '[Invariant Proof] After processing right, [left, right] is the longest unique-ending-at-right window: any earlier left would include the duplicate, any later left is a shorter sub-window. Since every optimal substring ends at some right, taking the max over all right values yields the global optimum.',
      code: `def length_of_longest_substring(s):
    last = {}
    left = 0
    best = 0
    for right, ch in enumerate(s):
        if ch in last and last[ch] >= left:
            left = last[ch] + 1
        last[ch] = right
        best = max(best, right - left + 1)
    return best`,
      language: 'python',
    },
    complexity: {
      time: 'O(n)',
      space: 'O(min(n, alphabet))',
      explanation:
        'Right pointer advances n times; left only moves forward, so total work is O(n). The map holds at most one entry per distinct character in the current window: O(min(n, alphabet size)).',
    },
    alternatives: [
      {
        name: 'Brute Force Windows',
        time: 'O(n^3)',
        space: 'O(min(n, alphabet))',
        tradeoff:
          'Enumerates all O(n^2) substrings with O(n) uniqueness checks. Correct baseline, hopeless past a few hundred characters.',
      },
      {
        name: 'Sliding Window + Set (Shrink One-by-One)',
        time: 'O(2n) = O(n)',
        space: 'O(min(n, alphabet))',
        tradeoff:
          'Same asymptotics but left crawls one step per duplicate instead of jumping. More iterations in practice; fine but less sharp.',
      },
      {
        name: 'Sliding Window + Last-Seen Jump (Optimal)',
        time: 'O(n)',
        space: 'O(min(n, alphabet))',
        tradeoff:
          'Minimal pointer moves with a clean invariant. The expected answer.',
      },
    ],
  },
};

function buildGenericWalkthrough(
  id: string,
  title: string,
  summary: string,
  pattern: string
): SocraticWalkthrough {
  return {
    id,
    title,
    summary,
    constraints: [
      'Read the prompt carefully and restate the required input and output.',
      'Identify edge cases: empty input, single element, duplicates, maximum limits.',
      'State the target bounds explicitly before choosing a data structure.',
    ],
    socratic_hints: [
      `HINT 1 — What is the brute-force shape of this problem? Enumerate what a naive solution would try for "${title}", and where exactly it repeats work.`,
      `HINT 2 — The tagged pattern is ${pattern}. Which invariant or ordering property of that pattern eliminates the repeated work from Hint 1?`,
      'HINT 3 — State the loop invariant in one sentence: what is true before each iteration, and why does preserving it force the answer to be correct at the end?',
    ],
    approach: {
      name: `${pattern} — Guided Plan`,
      explanation: `Decompose "${title}" into three stages. First, restate the problem as a search over candidates defined by the prompt. Second, apply the ${pattern} pattern to prune or order that search so each step makes irrevocable progress. Third, verify against edge cases (empty, single, worst-case size) before coding.`,
      why_this_works:
        '[Invariant Proof] Each iteration preserves a precise invariant over the processed prefix: everything decided so far is optimal for that prefix, and the remaining state is exactly what future steps need. By induction the final state is optimal for the whole input.',
      code: `# Guided plan for: ${title}  [pattern: ${pattern}]
# 1. UNDERSTAND — restate I/O, list constraints + edge cases.
# 2. THINK — work a small example by hand; name the invariant.
# 3. APPROACH — implement the ${pattern} traversal below.
# 4. ANALYZE — prove time/space bounds from the loop structure.
# 5. SYNTHESIZE — compare against brute force in the tradeoff table.

def solve(problem_input):
    # TODO: encode the ${pattern} invariant as state variables
    # TODO: single pass / recursion that preserves the invariant
    # TODO: return the required output format
    raise NotImplementedError("Fill in the guided plan above")`,
      language: 'python',
    },
    complexity: {
      time: 'O(n log n) or better — derive from loop structure',
      space: 'O(n) auxiliary — derive from stored state',
      explanation:
        'Count how many times each element is visited and what state is retained. A single pass with a bounded auxiliary structure gives linear time; nested enumeration over pairs gives quadratic. Justify the bound from the code structure, not from memory.',
    },
    alternatives: [
      {
        name: 'Brute Force Baseline',
        time: 'O(n^2) or worse',
        space: 'O(1)',
        tradeoff:
          'Enumerates the full candidate space. Always correct for small inputs; the reference point that proves why a smarter pattern is needed.',
      },
      {
        name: `${pattern} (Guided)`,
        time: 'Problem-dependent (often O(n) or O(n log n))',
        space: 'Problem-dependent',
        tradeoff:
          'Exploits the tagged pattern to avoid repeated work. The recommended direction for this problem.',
      },
      {
        name: 'Alternative Encoding',
        time: 'Varies',
        space: 'Varies',
        tradeoff:
          'Other patterns may trade memory for speed or simplify edge cases. Use the tradeoff table to argue explicitly.',
      },
    ],
  };
}

export function getWalkthrough(problemId: string): SocraticWalkthrough {
  if (ANCHORS[problemId]) return ANCHORS[problemId];
  const p = getProblemById(problemId);
  if (!p) {
    return buildGenericWalkthrough(
      problemId,
      'Custom Problem',
      'Work through your pasted interview question with the guided Socratic ladder.',
      'Guided Reasoning'
    );
  }
  return buildGenericWalkthrough(p.id, p.title, p.prompt, p.pattern);
}

export function getAnchorIds(): string[] {
  return Object.keys(ANCHORS);
}
