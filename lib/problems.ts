import type { Problem, Difficulty, PatternTrack } from '@/types';
import ragData from '@/rag.json';

const problems = ragData as Problem[];

export const TRACKS: PatternTrack[] = [
  {
    id: 'arrays_and_hashing',
    title: 'Arrays & Hashing',
    tagline: 'Prefix states, frequency counters, and O(1) lookups',
    invariant:
      'Store previously visited elements or prefix aggregates in a hash map/set to verify validity or find required pairs in O(1) time per element.',
    problemIds: [
      'two_sum',
      'contains_duplicate',
      'group_anagrams',
      'product_except_self',
      'subarray_sum_equals_k',
      'top_k_frequent',
      'longest_consecutive_subsequence',
      'valid_sudoku',
      'copy_list_random_pointer',
    ],
  },
  {
    id: 'two_pointers_and_sliding_window',
    title: 'Two Pointers & Sliding Window',
    tagline: 'Monotonic bounds and non-overlapping candidate evaluation',
    invariant:
      'Advance boundary pointers monotonically based on candidate conditions, evaluating every valid range or pair in a single pass without nested rescans.',
    problemIds: [
      'valid_palindrome',
      'three_sum',
      'container_with_most_water',
      'longest_substr_no_repeat',
      'trapping_rain_water',
      'min_window_substring',
      'sliding_window_max',
      'median_two_sorted_arrays',
    ],
  },
  {
    id: 'intervals_and_priority_queues',
    title: 'Intervals & Priority Queues',
    tagline: 'Boundary sweeps, active overlap tracking, and dynamic order',
    invariant:
      'Sort intervals by start timestamp or maintain a min/max heap invariant to dynamically resolve overlapping workloads and track top-k streaming elements.',
    problemIds: [
      'merge_intervals',
      'insert_interval',
      'meeting_rooms_ii',
      'employee_free_time',
      'task_scheduler',
      'find_median_stream',
      'k_closest_points',
      'reorganize_string',
      'merge_k_sorted_lists',
    ],
  },
  {
    id: 'trees_and_binary_search',
    title: 'Trees & Binary Search',
    tagline: 'Logarithmic space pruning and recursive subtree invariants',
    invariant:
      'Halve candidate search space at each branch or enforce bounded recursive subtree inequalities to guarantee O(log n) lookups and sound hierarchical representations.',
    problemIds: [
      'invert_binary_tree',
      'validate_bst',
      'kth_smallest_bst',
      'lowest_common_ancestor',
      'serialize_binary_tree',
      'binary_tree_max_path_sum',
      'search_rotated_sorted_array',
    ],
  },
  {
    id: 'graphs_and_grid_traversal',
    title: 'Graphs & Grid Traversal',
    tagline: 'Multi-source wavefronts, cycle detection, and dependency ordering',
    invariant:
      'Traverse unweighted states layer-by-layer (BFS) for shortest paths, memoize cycle states with visited colorings, and peel zero-in-degree nodes for topological order.',
    problemIds: [
      'number_of_islands',
      'course_schedule',
      'clone_graph',
      'rotting_oranges',
      'pacific_atlantic_water_flow',
      'word_ladder',
      'alien_dictionary',
      'redundant_connection',
    ],
  },
  {
    id: 'dynamic_programming',
    title: 'Dynamic Programming',
    tagline: 'Optimal substructure and memoized subproblem transitions',
    invariant:
      'Decompose target states into overlapping subproblems with optimal substructure, filling a memoization table in topological order so each transition is computed exactly once.',
    problemIds: [
      'climbing_stairs',
      'house_robber',
      'coin_change',
      'word_break',
      'longest_increasing_subsequence',
      'unique_paths',
      'edit_distance',
    ],
  },
  {
    id: 'system_and_architecture_design',
    title: 'System & Architecture Design',
    tagline: 'Distributed trade-offs, consistent hashing, and cache eviction',
    invariant:
      'Balance latency, throughput, eviction policies, and quorum replication across storage nodes, decoupling compute from stateful persistence.',
    problemIds: [
      'lru_cache',
      'design_rate_limiter',
      'design_parking_lot',
      'url_shortener',
      'design_key_value_store',
      'design_twitter_feed',
    ],
  },
];

export function getAllTracks(): PatternTrack[] {
  return TRACKS;
}

export function getTrackById(id: string): PatternTrack | undefined {
  return TRACKS.find((t) => t.id === id);
}

export function getTrackForProblem(problemId: string): PatternTrack | undefined {
  return TRACKS.find((t) => t.problemIds.includes(problemId));
}

export function getAllProblems(): Problem[] {
  return problems;
}

export function getProblemById(id: string): Problem | undefined {
  return problems.find((p) => p.id === id);
}

export function getNextProblem(currentId: string): Problem | undefined {
  const index = problems.findIndex((p) => p.id === currentId);
  if (index === -1) return problems[0];
  return problems[(index + 1) % problems.length];
}

export function getAllTopics(): string[] {
  const set = new Set(problems.map((p) => p.topic));
  return Array.from(set).sort();
}

export function getAllCompanies(): string[] {
  const set = new Set(problems.flatMap((p) => p.companies));
  return Array.from(set).sort();
}

export function getAllDifficulties(): Difficulty[] {
  return ['Easy', 'Medium', 'Hard'];
}

export function filterProblems(
  query = '',
  topic = 'All',
  difficulty = 'All',
  company = 'All'
): Problem[] {
  const q = query.trim().toLowerCase();
  return problems.filter((p) => {
    if (topic !== 'All' && p.topic !== topic) return false;
    if (difficulty !== 'All' && p.difficulty !== difficulty) return false;
    if (company !== 'All' && !p.companies.includes(company)) return false;
    if (!q) return true;
    const haystack = [
      p.title,
      p.prompt,
      p.pattern,
      p.topic,
      p.difficulty,
      ...p.companies,
      ...p.keywords,
    ]
      .join(' ')
      .toLowerCase();
    return q.split(/\s+/).every((token) => haystack.includes(token));
  });
}

