# Tomato Syndicate — Next Steps

Handoff brief. Paste relevant parts into a new chat to continue.

## Where things stand (as of 2026-06-03)

- **Frontend:** Full MVP implemented in a single ~2,450-line component
  `TomatoSyndicate.jsx` (React 19 + Vite + Supabase + recharts). Builds; local/demo
  headless QA passed (30/30 non-backend checks).
- **Backend:** Live Supabase project `Tomato Syndicate`
  (ref `igesyghkejktphbzrhyt`) has all 8 tables with real data, RLS enabled.
- **Schema is now in the repo** under `supabase/` as committed migrations
  (`0001_initial_schema.sql`, `0002_friend_reads_and_username.sql`, `README.md`),
  reconciled to match production. Commit `8483ee9`.
- **Backend fixes applied live + recorded as migrations:**
  - Friend-read RLS added to `seasons` and `harvest_sessions` (leaderboards read
    them; they previously had no friend policy — friend boards were partly broken).
  - `profiles.username` relaxed to nullable (client writes `null` when unset;
    NOT NULL would have blocked first-time sign-in).
  - `is_friend()` search_path pinned (security advisor hardening).
- **RLS QA passed against the live DB** (database-level, impersonating the two
  real accounts `coreykinsman` and `erg_wake`, who are accepted friends):
  friends see each other's seasons/plants/sessions/harvests and tomato totals;
  gardens/beds stay private; non-friends see nothing; blocking hides data;
  owner-write isolation holds; forged friend requests are denied. All tests were
  transaction-rolled-back — live data untouched.

- **Production auth QA passed on 2026-06-03.**
  - Vercel production URL `https://tomato-syndicate-ten.vercel.app/` returns
    HTTP 200 and served the deployed SPA.
  - Existing `.tools/headless-workflow-check.cjs` was run against the production
    URL: 30 pass, 0 fail, 6 account/auth-dependent checks blocked. This confirms
    the signed-out production screen renders and the deployed bundle is usable.
  - Supabase public auth settings show `google: true`, `email: true`,
    `apple: false`, signup enabled, and email autoconfirm off.
  - Google authorize for
    `redirect_to=https://tomato-syndicate-ten.vercel.app/` returns 302 to Google
    with callback
    `https://igesyghkejktphbzrhyt.supabase.co/auth/v1/callback`; following to
    Google shows a normal sign-in page and no `redirect_uri_mismatch`.
  - A production magic-link request for `erg.wake@gmail.com` with
    `redirect_to=https://tomato-syndicate-ten.vercel.app/` returned HTTP 200,
    and Supabase auth logs recorded `mail.send` with `mail_type=magic_link`.
  - Manual production browser QA confirmed Google callback, magic-link inbox
    click, refresh persistence, sign-out, and same-cloud-data reload all work.
  - Apple Auth remains intentionally deferred; the Apple button is disabled in
    the app locally until Apple Developer credentials are available.
  - Production redeploy for the Apple-disabled UI is still blocked: Vercel CLI
    created production deployments that stayed `BLOCKED` / `UNKNOWN` with no
    build logs and could not be promoted. The live production URL still serves
    the prior asset until this is deployed through Vercel dashboard/Git or the
    Vercel deployment block is resolved.

## What is NOT yet done (the remaining risk)

1. **Deploy the Apple-disabled UI.** Production Google auth, email magic-link
   auth, refresh persistence, sign-out, and same-cloud-data reload passed manual
   QA. Apple Auth is disabled in Supabase and the app button is disabled locally,
   but the Vercel production deploy is blocked until a ready deployment can be
   created/promoted.
2. **Deployment exists.** App is deployed to Vercel under `erg.wake@gmail.com`
   / `erg-wake`.
   - Production URL: `https://tomato-syndicate-ten.vercel.app`
   - Production deployment: `dpl_8M7uW9Qbm3dsrtBpdc6VLDh7oRTd`
   - Project: `erg-wake/tomato-syndicate`
   - Vercel env vars set for Production and Development:
     `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Preview env vars are not yet set; Vercel CLI required a branch-specific
     preview target during setup.
3. **No PWA layer.** Plan calls it a PWA but there's no manifest and no service
   worker — currently a plain SPA.
4. **Offline is a simplified whole-state localStorage mirror,** not the per-record
   sync queue the plan specifies. Decide if "good enough" before any big refactor,
   since it's a data-layer decision.
5. **The single 2,450-line component** should be split once behavior is stable
   (do this AFTER de, not before).
6. **No automated RLS/regression tests in the repo** (the QA was run manually).

## Recommended order for the next session

### 1. Ship Apple-disabled auth UI / redeploy
- Deployment is live on Vercel:
  `https://tomato-syndicate-ten.vercel.app`.
- Vercel account verified as `erg.wake@gmail.com` / `ergwake`.
- Production and Development env vars are set in Vercel:
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Supabase Auth public settings currently show Google + email enabled and Apple
  disabled. Google authorize checks returned 302 for
  `https://tomato-syndicate-ten.vercel.app/`, so Supabase accepts that redirect;
  Google's auth page did not show `redirect_uri_mismatch`.
- Confirm the production Vercel URL in Supabase Auth URL Configuration as Site
  URL / redirect allowlist from the dashboard if possible. The live redirect
  behavior already indicates the URL is allowlisted.
- Google OAuth provider console should include:
  - Authorized JavaScript origin: `https://tomato-syndicate-ten.vercel.app`
  - Authorized redirect URI:
    `https://igesyghkejktphbzrhyt.supabase.co/auth/v1/callback`
- Google Cloud dashboard values were not directly readable through the available
  connectors; use the live no-mismatch Google auth page as the current practical
  validation, then verify the dashboard values manually when logged into Google
  Cloud.
- Email magic link send is confirmed for `erg.wake@gmail.com`; the inbox
  click-through and production redirect back into the app passed manual QA.
- Confirm Supabase email templates from the dashboard if desired. The observed
  production magic-link behavior is working.
- Redeploy after the Apple button disable change so production users cannot
  trigger the unconfigured Apple provider.
- Attempted Vercel CLI deploys:
  - `dpl_AUeRZiom9fZ5nqgHqSAyeUj4p2oG` -- `BLOCKED` / `UNKNOWN`, no logs.
  - `dpl_DMNAmrSpFpcFTrDW2V316hsz6bGU` -- `BLOCKED` / `UNKNOWN`, no logs.
  - `dpl_JAR8PqiVH5JHgdn45LCUrYfcbik5` -- `BLOCKED` / `UNKNOWN`, no logs;
    `vercel promote` failed because the deployment was not ready.
  - Production alias `https://tomato-syndicate-ten.vercel.app/` still serves the
    previous asset `index-BkFmtdo3.js`.

### 1a. Apple Auth decision
- **Decision: defer Apple Sign-In for now.** Current Supabase settings show
  Apple disabled, the Apple authorize endpoint returns 400
  `provider is not enabled`, and the app button is now disabled until configured.
- Enabling Apple now is not feasible without Apple Developer access and provider
  credentials. It likely requires a paid Apple Developer Program account.
- Apple Developer values needed:
  - Team ID.
  - App ID with the Sign in with Apple capability enabled.
  - Services ID for the web app.
  - Website URL domain: `igesyghkejktphbzrhyt.supabase.co`.
  - Return URL:
    `https://igesyghkejktphbzrhyt.supabase.co/auth/v1/callback`.
  - Sign in with Apple key ID and downloaded `.p8` private key.
  - Email relay/source setup if Apple private relay email support is needed.
- Supabase Apple provider values needed:
  - Provider enabled.
  - Client ID / authorized client ID: the Apple Services ID.
  - Apple client secret generated from Team ID, Services ID, Key ID, and `.p8`
    private key.
  - Production app URL kept in Supabase Site URL / redirect allowlist:
    `https://tomato-syndicate-ten.vercel.app/`.

### 2. Real two-account UI pass for friends/leaderboards
- The RLS boundary is already verified at the DB level. Now confirm the *UI flow*
  end-to-end with two real signed-in browsers: send request → accept → leaderboards
  populate → remove/block → data drops. (`coreykinsman` + `erg_wake` already exist
  and are accepted friends.)

### 3. Add PWA basics
- `manifest.json`, icons, a service worker, install + offline behavior.
- Independent of backend; can be parallelized. Lower risk.

### 4. Decide offline strategy, then refactor
- Decide whether to keep the localStorage mirror or build the real per-record
  sync queue (client UUIDs + `synced_at`/pending). Make this call BEFORE splitting
  the big component, because it touches the data layer.
- Then split `TomatoSyndicate.jsx` into modules.

### 5. (Nice to have) Automated tests
- A small RLS test script in the repo (the manual QA, scripted) so the friend-
  visibility suite re-runs after future schema changes.
- A couple of analytics-recalculation tests (delete/edit a harvest → stats,
  exports, leaderboards update) — a core correctness promise that's easy to regress.

## Useful facts for a new chat
- Repo / working folder: `Tomato Syndicate` (this folder).
- Supabase project ref: `igesyghkejktphbzrhyt` (name "Tomato Syndicate").
- Two real users: `coreykinsman` (A) and `erg_wake` (B), accepted friends, both
  have data. Useful for testing.
- Migration history in Supabase: `initial_schema`,
  `add_friend_read_policies_and_relax_username`, `harden_is_friend_search_path`.
- The QA approach that worked: impersonate a user with
  `begin; set local role authenticated; set local request.jwt.claims='{"sub":"<uuid>"}'; <select>; rollback;`
  via the Supabase `execute_sql` tool (rolls back, returns the pre-rollback result).
- Note: the bash mount can briefly serve stale copies of edited files; verify file
  size before committing.
