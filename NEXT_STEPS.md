# Tomato Syndicate — Next Steps

Handoff brief. Paste relevant parts into a new chat to continue.

## Current app-development status

- Production auth is passing on desktop and phone. Supabase Auth URL
  Configuration uses the production Vercel URL and localhost / `127.0.0.1`
  redirects have been removed.
- 2026-06-04 auth/PWA follow-up: deployment-specific Vercel URLs return
  `401 Access Required` when Vercel SSO deployment protection is enabled.
  Vercel SSO deployment protection was disabled on 2026-06-04, and those aliases
  now return the app instead of Access Required. Google OAuth now sends
  `prompt=select_account` to force account selection.
- Apple Sign-In remains intentionally deferred; the Apple button is disabled.
- Real two-account UI QA for friends and leaderboards is complete.
- PWA basics were deployed to production on 2026-06-04. Production serves the
  manifest, app icons, maskable icon, and same-origin app-shell service worker.
- Next active development task: manually verify installability/home-screen launch
  and first-load/offline app-shell behavior on desktop and phone.
- Offline strategy decision: keep the existing whole-state localStorage mirror
  for now. Do not build a per-record sync queue yet.
- Hold for now: splitting `TomatoSyndicate.jsx` and adding automated regression
  tests.

## Where things stand (as of 2026-06-03)

- **Frontend:** Full MVP implemented in a single ~2,450-line component
  `TomatoSyndicate.jsx` (React 19 + Vite + Supabase + recharts). Builds; local/demo
  headless QA passed (30/30 non-backend checks).
- **PWA basics:** Added `public/manifest.webmanifest`, icon assets under
  `public/icons/`, `public/sw.js`, installability metadata in `index.html`, and
  production-only service worker registration in `src/main.jsx`. The service
  worker caches only the same-origin app shell/assets and does not replace the
  Supabase/localStorage data behavior. Deployed to production as
  `dpl_9CNhkrWYHWQaJ7zQ6xW6EYQjcmam` on 2026-06-04.
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
  - Auth redirects are now hardcoded to the production Vercel URL
    `https://tomato-syndicate-ten.vercel.app/` for both Google OAuth and email
    magic links, so new sign-in flows cannot return to `127.0.0.1`.
  - Google OAuth now includes `prompt=select_account`, deployed in
    `dpl_4RtWyYy3pfb6AaFNrbotaoedt991`, so desktop sign-in should show Google's
    account chooser instead of silently reusing an existing Google browser
    session.
  - Vercel SSO deployment protection was disabled on 2026-06-04 after phone
    Google sign-in redirected to a Vercel Access Required page. Verification
    afterwards showed `ssoProtection: null`, with
    `https://tomato-syndicate-erg-wake.vercel.app/` returning HTTP 200 instead
    of 401.
  - Supabase Auth URL configuration was updated manually: the production Site
    URL is set, localhost / `127.0.0.1` redirect URLs were removed, and phone
    sign-in now returns to production successfully.

## What is NOT yet done (the remaining risk)

1. **Production auth is currently passing.** Google auth, email magic-link auth,
   refresh persistence, sign-out, same-cloud-data reload, and phone redirect
   behavior are working against the production Vercel URL. Apple remains
   intentionally deferred.
2. **Deployment exists.** App is deployed to Vercel under `erg.wake@gmail.com`
   / `erg-wake`.
   - Production URL: `https://tomato-syndicate-ten.vercel.app`
   - Current production deployment: `dpl_4RtWyYy3pfb6AaFNrbotaoedt991`
   - Current production commit metadata still points to `e813d0d`
     (`Force production auth redirects`) with `gitDirty=1`, because the PWA and
     Google account-chooser deploys were made from the local dirty workspace via
     Vercel CLI.
   - Project: `erg-wake/tomato-syndicate`
   - Vercel env vars set for Production and Development:
     `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - Preview env vars are not yet set; Vercel CLI required a branch-specific
     preview target during setup.
3. **PWA basics are deployed, but install/offline behavior still needs manual
   device QA.** Production serves `/manifest.webmanifest`, `/sw.js`, and all icon
   assets with HTTP 200. Next: verify Chrome/Edge installability, phone
   home-screen launch, and offline app-shell refresh after one online load.
   Use the canonical production URL for manual tests:
   `https://tomato-syndicate-ten.vercel.app/`. Vercel SSO deployment protection
   is now disabled, so secondary aliases should no longer show Access Required,
   but the canonical URL remains the intended install/sign-in URL.
4. **Offline is a simplified whole-state localStorage mirror,** not the per-record
   sync queue the plan specifies. Decide if "good enough" before any big refactor,
   since it's a data-layer decision.
5. **The single 2,450-line component** should be split once behavior is stable
   (do this AFTER de, not before).
6. **No automated RLS/regression tests in the repo** (the QA was run manually).

## Recommended order for the next session

### 1. Production auth maintenance
- Deployment is live on Vercel:
  `https://tomato-syndicate-ten.vercel.app`.
- Vercel account verified as `erg.wake@gmail.com` / `ergwake`.
- Production and Development env vars are set in Vercel:
  `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
- Supabase Auth public settings currently show Google + email enabled and Apple
  disabled. Google authorize checks returned 302 for
  `https://tomato-syndicate-ten.vercel.app/`, so Supabase accepts that redirect;
  Google's auth page did not show `redirect_uri_mismatch`.
- Supabase Auth URL Configuration has been manually corrected:
  - Site URL uses `https://tomato-syndicate-ten.vercel.app`.
  - Production redirect URL is allowlisted.
  - Localhost / `127.0.0.1` redirect URLs were removed.
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
- New auth links should return to
  `https://tomato-syndicate-ten.vercel.app/`. If a future test returns to local,
  first check for an old magic link or a re-added localhost redirect URL in
  Supabase Auth URL Configuration.

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

### 3. Finish production PWA verification
- Local PWA files are in place:
  - `public/manifest.webmanifest`
  - `public/icons/icon.svg`
  - `public/icons/icon-192.png`
  - `public/icons/icon-512.png`
  - `public/icons/maskable-512.png`
  - `public/icons/apple-touch-icon.png`
  - `public/sw.js`
- `src/main.jsx` registers `/sw.js` only in production builds, so local Vite dev
  does not get a sticky development service worker.
- The service worker is same-origin only. It caches the app shell, Vite assets,
  manifest, and icon files; it does not intercept Supabase API/auth traffic and
  does not change the localStorage mirror.
- Local verification on 2026-06-04:
  - PASS: `npm.cmd run build`
  - PASS: `dist/` contains manifest, service worker, and icon assets.
  - PASS: built manifest parses and includes 192px, 512px, and maskable 512px
    PNG icons.
- Production verification on 2026-06-04:
  - PASS: deployed production `dpl_9CNhkrWYHWQaJ7zQ6xW6EYQjcmam`.
  - PASS: deployed follow-up auth fix `dpl_4RtWyYy3pfb6AaFNrbotaoedt991` with
    Google `prompt=select_account`.
  - PASS: production alias `https://tomato-syndicate-ten.vercel.app` points to
    the new deployment.
  - PASS: production returns HTTP 200 for `/`, `/manifest.webmanifest`, `/sw.js`,
    `/icons/icon.svg`, `/icons/icon-192.png`, `/icons/icon-512.png`,
    `/icons/maskable-512.png`, and `/icons/apple-touch-icon.png`.
  - PASS: manifest content parses and includes standalone display, root
    start/scope, theme/background colors, and maskable icon.
  - PASS: production service worker content includes the app/runtime cache names,
    same-origin guard, and Vite asset caching.
  - PASS: production JS bundle contains both the canonical auth redirect URL and
    `select_account`.
  - PASS: Vercel SSO deployment protection was disabled after phone OAuth was
    redirected to Access Required. Follow-up checks showed `ssoProtection: null`
    and previously protected aliases returning HTTP 200.
  - BLOCKED: in-app browser automation still fails to start in the Windows
    sandbox; Lighthouse also fails during Chrome temp cleanup before writing a
    report.
- Next manual checks:
  - Confirm production Chrome/Edge shows the app as installable.
  - Install on phone and confirm launch from home screen.
  - After one successful online load, toggle offline and confirm the app shell
    reloads. Cloud data sync should still require network; keep localStorage
    mirror behavior unchanged.

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
