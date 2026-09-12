-- Coding interview problems
create table public.problems (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  prompt text not null,
  category text not null,
  difficulty text not null
    check (difficulty in ('easy', 'medium', 'hard')),
  created_at timestamptz not null default now()
);

alter table public.problems enable row level security;

create policy "Anyone can view problems"
on public.problems
for select
using (true);


-- Guided questions and hints for each problem
create table public.problem_steps (
  id uuid primary key default gen_random_uuid(),
  problem_id uuid not null
    references public.problems(id) on delete cascade,
  step_order integer not null check (step_order > 0),
  question text not null,
  hint text,
  created_at timestamptz not null default now(),
  unique (problem_id, step_order)
);

alter table public.problem_steps enable row level security;

create policy "Anyone can view problem steps"
on public.problem_steps
for select
using (true);


-- User interview attempts
create table public.sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null
    references auth.users(id) on delete cascade,
  problem_id uuid not null
    references public.problems(id) on delete cascade,
  status text not null default 'in_progress'
    check (status in ('in_progress', 'completed')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.sessions enable row level security;

create policy "Users can view their own sessions"
on public.sessions
for select
using (auth.uid() = user_id);

create policy "Users can create their own sessions"
on public.sessions
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own sessions"
on public.sessions
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);


-- User answers and Gemini feedback
create table public.responses (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null
    references public.sessions(id) on delete cascade,
  step_id uuid not null
    references public.problem_steps(id) on delete cascade,
  response_text text not null,
  ai_feedback text,
  created_at timestamptz not null default now()
);

alter table public.responses enable row level security;

create policy "Users can view responses from their sessions"
on public.responses
for select
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = responses.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "Users can create responses in their sessions"
on public.responses
for insert
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = responses.session_id
      and sessions.user_id = auth.uid()
  )
);

create policy "Users can update responses in their sessions"
on public.responses
for update
using (
  exists (
    select 1
    from public.sessions
    where sessions.id = responses.session_id
      and sessions.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.sessions
    where sessions.id = responses.session_id
      and sessions.user_id = auth.uid()
  )
);

-- Data API permissions
grant usage on schema public to anon, authenticated;

grant select
on table public.problems, public.problem_steps
to anon, authenticated;

grant select, insert, update
on table public.sessions, public.responses
to authenticated;