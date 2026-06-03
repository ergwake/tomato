# Tomato Syndicate — Supabase backend

This folder is the source of truth for the database. The schema previously lived
only inside the live Supabase project (project ref `igesyghkejktphbzrhyt`);
these files reproduce it in version control.

`0001` is a faithful reconstruction of the schema already deployed (the live
`initial_schema` migration). `0002` contains the additive fixes that were
**already applied to the live project** on 2026-06-03 — recorded there as
`add_friend_read_policies_and_relax_username` and `harden_is_friend_search_path`.
So the live database and this repo are in sync; you do not need to re-apply
anything to the existing project. These files exist for review and for standing
up a fresh project.

## Files

- `migrations/0001_initial_schema.sql` — tables, keys, indexes, RLS, `is_friend`
- `migrations/0002_friend_reads_and_username.sql` — friend-read policies for
  seasons & harvest_sessions, `username` nullable, `is_friend` search_path pinned

## Applying to a fresh project

**Option A — Supabase CLI (recommended).** From the repo root:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

`db push` runs the files in `supabase/migrations` in filename order.

**Option B — SQL editor.** Paste `0001_…` then `0002_…` and run them in order;
`0002` depends on `0001`. Re-running on a project that already has these objects
will error on duplicates — that's expected, since the live project is already at
this state.

## How the schema maps to the app

The client stores records in camelCase and converts to snake_case on the way to
Supabase (`toDb` / `fromDb` in `TomatoSyndicate.jsx`). Every column here is the
snake_case form of a field the client reads or writes.

Record ids are **client-generated UUIDs** (`crypto.randomUUID()`), so the app
supplies `id` on insert; the `gen_random_uuid()` defaults are only a fallback.

Only the soft-deletable tables — `plants`, `harvest_sessions`, `harvests` —
carry `deleted_at` and `synced_at`. The client soft-deletes those by setting
`deleted_at` and filters with `live(arr) = arr.filter(x => !x.deletedAt)`, so
deletes can still sync after the fact. `seasons`, `gardens`, and `beds` are
hard-deleted and have no `deleted_at`. `username` is nullable (the client writes
`null` when no username is chosen); `UNIQUE` still allows multiple NULLs.

## The RLS model (the important part)

Every garden table is owner-scoped: a user can read and write only rows where
`user_id = auth.uid()`. On top of that:

**Friend-visible reads.** The Syndicate/leaderboard view reads each accepted
friend's `seasons`, `plants`, `harvest_sessions`, and `harvests` by `user_id`.
All four tables therefore have a second SELECT policy of the form:

```sql
using (is_friend(auth.uid(), user_id))   -- plus "and deleted_at is null" where the column exists
```

`is_friend(viewer, target)` is a `SECURITY DEFINER` function that returns true
when a `status = 'accepted'` friendship exists between the two users in either
direction. It is `SECURITY DEFINER` (with a pinned `search_path`) so the
visibility check is not itself filtered by RLS on `friendships`.

> The friend policies on `seasons` and `harvest_sessions` were the gap found
> during this work: the leaderboard reads them but they had no friend policy,
> so friend boards could not resolve the active season. `0002` adds them.

Postgres OR's multiple permissive SELECT policies, so on these tables a row is
readable if the caller owns it **or** is an accepted friend of the owner.

**What friends cannot see.** `gardens` and `beds` have owner-only policies and
no friend policy — they are never part of the leaderboard bundle, so friends
never read garden names, bed names, or location labels. This keeps the "private
by default / no public exposure of garden data" principle intact.

**profiles** are readable by any authenticated user (a `using (true)` SELECT
policy). This is required: you find people by typing their username, and
leaderboards show display names. Profile rows only hold `username`,
`display_name`, and `social_url`. Writes are self-only (`id = auth.uid()`).

**friendships.** You can SELECT rows where you are the requester or recipient,
INSERT only with `requester_id = auth.uid()` (you can't forge a request from
someone else), and UPDATE/DELETE as either party (accept, decline, block,
remove). A unique index on `(requester_id, recipient_id)` plus the app's
reuse-existing-row logic prevents reverse-duplicate friendships.

## What to verify against two real accounts

After applying, walk the checklist's friend and leaderboard sections with
Accounts A and B. The policies above are designed to make these true:

1. A and B can each only read their own gardens and beds.
2. Before accepting, neither can read the other's plants/harvests.
3. After accepting, each sees the other's seasons/plants/sessions/harvests and
   the leaderboards populate — but still not gardens or beds.
4. A non-friend (Account C) sees nothing of A's or B's garden data.
5. C cannot insert a friendship that claims A as the requester.
6. Blocking/removing flips visibility back off on the next leaderboard read.
