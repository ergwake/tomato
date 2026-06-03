-- ============================================================================
-- Tomato Syndicate — 0001 Initial Schema
-- ----------------------------------------------------------------------------
-- Faithful reconstruction of the schema already live in the Supabase project
-- (migration "initial_schema", 20260602035223), captured from the database so
-- the repo is a true source of truth. Running it on a fresh project reproduces
-- production. Friend-read gaps and the username relaxation are in 0002.
--
-- Conventions that mirror the client (TomatoSyndicate.jsx):
--   * snake_case columns (toDb/fromDb map camelCase <-> snake_case).
--   * Record ids are client-generated UUIDs; gen_random_uuid() is a fallback.
--   * user_id references profiles(id); profiles(id) references auth.users(id).
--   * Only plants / harvest_sessions / harvests are soft-deletable.
-- ============================================================================

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  username     text not null unique,        -- relaxed to nullable in 0002
  display_name text not null default '',
  social_url   text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.seasons (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  year       integer not null,
  name       text not null,
  start_date date,
  end_date   date,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists seasons_user_id_idx on public.seasons (user_id);

create table if not exists public.gardens (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid not null references public.profiles (id) on delete cascade,
  name           text not null,
  location_label text,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index if not exists gardens_user_id_idx on public.gardens (user_id);

create table if not exists public.beds (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles (id) on delete cascade,
  garden_id  uuid references public.gardens (id) on delete set null,
  name       text not null,
  notes      text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists beds_user_id_idx   on public.beds (user_id);
create index if not exists beds_garden_id_idx on public.beds (garden_id);

create table if not exists public.plants (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references public.profiles (id) on delete cascade,
  season_id          uuid not null references public.seasons (id) on delete cascade,
  bed_id             uuid references public.beds (id) on delete set null,
  variety            text not null,
  plant_label        text not null,
  status             text not null default 'active'
                       check (status in ('active', 'retired', 'removed')),
  planted_date       date,
  first_harvest_date date,
  removed_date       date,
  notes              text,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  deleted_at         timestamptz,
  synced_at          timestamptz default now()
);
create index if not exists plants_user_id_idx   on public.plants (user_id);
create index if not exists plants_season_id_idx on public.plants (season_id);
create index if not exists plants_bed_id_idx    on public.plants (bed_id);

create table if not exists public.harvest_sessions (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  season_id    uuid not null references public.seasons (id) on delete cascade,
  harvest_date date not null,
  notes        text,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  deleted_at   timestamptz,
  synced_at    timestamptz default now()
);
create index if not exists harvest_sessions_user_id_idx   on public.harvest_sessions (user_id);
create index if not exists harvest_sessions_season_id_idx on public.harvest_sessions (season_id);

create table if not exists public.harvests (
  id             uuid primary key default gen_random_uuid(),
  session_id     uuid not null references public.harvest_sessions (id) on delete cascade,
  plant_id       uuid not null references public.plants (id) on delete cascade,
  user_id        uuid not null references public.profiles (id) on delete cascade,
  quantity_count integer not null default 0 check (quantity_count >= 0),
  weight_value   numeric,
  weight_unit    text default 'oz',
  harvest_date   date not null,
  notes          text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  deleted_at     timestamptz,
  synced_at      timestamptz default now()
);
create index if not exists harvests_user_id_idx    on public.harvests (user_id);
create index if not exists harvests_session_id_idx on public.harvests (session_id);
create index if not exists harvests_plant_id_idx   on public.harvests (plant_id);

create table if not exists public.friendships (
  id           uuid primary key default gen_random_uuid(),
  requester_id uuid not null references public.profiles (id) on delete cascade,
  recipient_id uuid not null references public.profiles (id) on delete cascade,
  status       text not null default 'pending'
                 check (status in ('pending', 'accepted', 'declined', 'blocked')),
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (requester_id, recipient_id),
  check (requester_id <> recipient_id)
);
create index if not exists friendships_requester_idx on public.friendships (requester_id);
create index if not exists friendships_recipient_idx on public.friendships (recipient_id);

-- Accepted-friend check used by the friend-visibility policies. SECURITY
-- DEFINER so the check is not itself filtered by RLS on friendships.
-- (search_path is pinned in 0002 as a hardening step.)
create or replace function public.is_friend(viewer uuid, target uuid)
returns boolean
language sql
stable
security definer
as $FN$
  select exists (
    select 1 from public.friendships
    where status = 'accepted'
      and ((requester_id = viewer and recipient_id = target)
        or (recipient_id = viewer and requester_id = target))
  );
$FN$;

alter table public.profiles         enable row level security;
alter table public.seasons          enable row level security;
alter table public.gardens          enable row level security;
alter table public.beds             enable row level security;
alter table public.plants           enable row level security;
alter table public.harvest_sessions enable row level security;
alter table public.harvests         enable row level security;
alter table public.friendships      enable row level security;

create policy "Own profile: full access" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "Search profiles by username (for friend requests)" on public.profiles
  for select using (true);
create policy "Friends can view each other's profiles" on public.profiles
  for select using (is_friend(auth.uid(), id));

create policy "Own seasons: full access" on public.seasons
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own gardens: full access" on public.gardens
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own beds: full access" on public.beds
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own plants: full access" on public.plants
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own sessions: full access" on public.harvest_sessions
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Own harvests: full access" on public.harvests
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Friends can view plants (for leaderboards)" on public.plants
  for select using (is_friend(auth.uid(), user_id) and deleted_at is null);
create policy "Friends can view harvests (for leaderboards)" on public.harvests
  for select using (is_friend(auth.uid(), user_id) and deleted_at is null);

create policy "View own friendships" on public.friendships
  for select using (auth.uid() = requester_id or auth.uid() = recipient_id);
create policy "Send friend requests" on public.friendships
  for insert with check (auth.uid() = requester_id);
create policy "Update friendship status (recipient or requester)" on public.friendships
  for update using (auth.uid() = recipient_id or auth.uid() = requester_id);
create policy "Delete own friendships" on public.friendships
  for delete using (auth.uid() = requester_id or auth.uid() = recipient_id);
