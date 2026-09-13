-- Seed coding interview problems

insert into public.problems (
  id,
  title,
  prompt,
  category,
  difficulty
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    'Two Sum',
    'Given an array of integers nums and an integer target, return the indices of the two numbers that add up to target.',
    'Hash Map',
    'easy'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    'Valid Parentheses',
    'Given a string containing parentheses, brackets, and braces, determine whether the input string is valid.',
    'Stack',
    'easy'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    'Binary Search',
    'Given a sorted array of integers and a target value, return the target index. Return -1 when the target is not present.',
    'Binary Search',
    'easy'
  )
on conflict (id) do update
set
  title = excluded.title,
  prompt = excluded.prompt,
  category = excluded.category,
  difficulty = excluded.difficulty;

insert into public.problem_steps (
  problem_id,
  step_order,
  question,
  hint
)
values
  (
    '11111111-1111-4111-8111-111111111111',
    1,
    'What information should be stored while you examine each number?',
    'Store each previously seen number and its index.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    2,
    'How can you calculate the number needed to reach the target?',
    'Subtract the current number from the target.'
  ),
  (
    '11111111-1111-4111-8111-111111111111',
    3,
    'How do you know when the matching pair has been found?',
    'Check whether the needed number is already in the hash map.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    1,
    'Which data structure can track opening symbols in order?',
    'Use a stack.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    2,
    'What should happen when an opening symbol is encountered?',
    'Push it onto the stack.'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    3,
    'What must be true when a closing symbol is encountered?',
    'It must match the most recent opening symbol.'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    1,
    'Which two boundaries define the current search area?',
    'Use left and right indices.'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    2,
    'How do you calculate the middle index?',
    'Use (left + right) divided by 2 with integer division.'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    3,
    'Which boundary changes after comparing the middle value with the target?',
    'Move left when the middle value is too small; otherwise move right.'
  )
on conflict (problem_id, step_order) do update
set
  question = excluded.question,
  hint = excluded.hint;