-- ============================================================================
-- Tomato Syndicate — 0002 Friend reads + username relaxation + hardening
-- ----------------------------------------------------------------------------
-- Applied to the live project as two recorded migrations:
--   20260603035336  add_friend_read_policies_and_relax_username
--   20260603035414  harden_is_friend_search_path
-- Combined here for repo clarity. All changes are additive / permissive and do
-- not modify existing rows.
-- ============================================================================

-- 1) Friends already get read access to plants and harvests for leaderboards.
--    The leaderboard query (TomatoSyndicate.jsx) also reads friends' seasons
--    and harvest_sessions; without these policies friend leaderboards cannot
--    resolve the active season or map sessions -> harvests. Close the gap.
create policy "Friends can view seasons (for leaderboards)"
  on public.seasons
  for select
  using (is_friend(auth.uid(), user_id));

create policy "Friends can view sessions (for leaderboards)"
  on public.harvest_sessions
  for select
  using (is_friend(auth.uid(), user_id) and deleted_at is null);

-- 2) The client writes username = null for profiles with no chosen username
--    (ensureProfile + dbProfile). A NOT NULL constraint rejected first-time
--    profile creation. UNIQUE still allows multiple NULLs, so "no username yet"
--    never collides.
alter table public.profiles alter column username drop not null;

-- 3) Pin search_path on the SECURITY DEFINER helper behind the friend-read
--    policies so it cannot be hijacked via a mutable search_path.
alter function public.is_friend(uuid, uuid) set search_path = public, pg_temp;
