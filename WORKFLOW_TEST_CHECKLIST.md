# Tomato Syndicate Workflow Test Checklist

Use this checklist for manual QA before deployment and again after production OAuth/Supabase setup. Mark each workflow as pass, fail, or blocked, and note the account, browser, and date tested.

## Latest Production Auth QA - 2026-06-03

- PASS: Production URL `https://tomato-syndicate-ten.vercel.app/` serves the app
  with HTTP 200.
- PASS: Production smoke run using `.tools/headless-workflow-check.cjs` against
  the Vercel URL completed 30 pass, 0 fail, 6 blocked. Signed-out screen renders
  in the deployed bundle.
- PASS: Supabase auth public settings show Google and email enabled; Apple is
  disabled.
- PASS: Supabase accepts `redirect_to=https://tomato-syndicate-ten.vercel.app/`
  for Google and redirects to Google with callback
  `https://igesyghkejktphbzrhyt.supabase.co/auth/v1/callback`.
- PASS: Following the Google authorize redirect reaches a normal Google sign-in
  page with no `redirect_uri_mismatch`.
- PARTIAL: Email magic-link request to `erg.wake@gmail.com` with production
  `redirect_to` returned HTTP 200 and Supabase logs recorded `mail.send`
  `mail_type=magic_link`.
- PASS: Manual production browser run confirmed Google callback, magic-link inbox
  click, refresh persistence, sign-out, and same-cloud-data reload all work.
- FIXED LOCALLY: Google OAuth and email magic-link requests now force
  `https://tomato-syndicate-ten.vercel.app/` as the auth callback instead of
  deriving it from `window.location`, preventing new links from returning to
  `127.0.0.1`.
- BLOCKED: Apple sign-in is intentionally deferred. Supabase Apple provider is
  disabled and `/authorize?provider=apple` returns 400 `provider is not enabled`.
  The Apple button is disabled locally until Apple Developer credentials are
  added; production still needs a successful redeploy.

## Test Accounts And Baseline

- [x] Account A can sign in with Google. PASS 2026-06-03: manual production
  browser run completed successfully.
- [ ] Account B can sign in with Google for friend and leaderboard tests.
- [ ] Account A can sign in with Apple. BLOCKED 2026-06-03: Apple disabled in
  Supabase; defer and hide/disable button until configured.
- [x] Account A can create/sign in with an email magic link. PASS 2026-06-03:
  production magic-link send and inbox click-through completed successfully.
- [ ] Account A starts from a clean reset using `More > Settings > Reset garden data`.
- [ ] After reset, Account A has one active empty season and no gardens, beds, plants, harvest sessions, or harvest rows.
- [ ] The header shows online and saved/synced status after the reset.
- [ ] Hard refresh does not resurrect old local backup data.

## Authentication And Session

- [x] Signed-out user sees the sign-in screen. PASS 2026-06-03: production
  headless smoke rendered sign-in controls.
- [x] Google sign-in redirects back to the app successfully. PASS 2026-06-03:
  manual production browser run completed successfully.
- [ ] Apple sign-in redirects back to the app successfully. BLOCKED 2026-06-03:
  Apple provider disabled.
- [x] Email magic link sends successfully and redirects back to the app. PASS
  2026-06-03: manual production inbox click-through completed successfully.
- [x] Existing signed-in session persists after refresh. PASS 2026-06-03: manual
  production browser run completed successfully.
- [x] Sign out returns to the sign-in screen. PASS 2026-06-03: manual production
  browser run completed successfully.
- [ ] Sign out does not delete local backup data.
- [x] Sign back in loads the same cloud data. PASS 2026-06-03: manual production
  browser run completed successfully.
- [ ] Local demo mode opens without an account.
- [ ] Local demo mode does not overwrite signed-in cloud data.

## First-Run And Empty Setup States

- [ ] Signed-in user with no season sees the first-run setup screen.
- [ ] `Set up my garden` creates an empty active season.
- [ ] Harvest tab with no gardens shows setup guidance, not an add-plant button.
- [ ] Harvest empty-state `Open Garden` switches to the Garden tab.
- [ ] Garden tab with no gardens shows only Garden setup actions for garden creation.
- [ ] Beds section does not show an add-garden action.
- [ ] Beds section disables add-bed until a garden exists.
- [ ] Plants section disables add-plant until a bed exists.

## Seasons

- [ ] Open seasons modal from the header season chip.
- [ ] Create a new season.
- [ ] New season becomes active.
- [ ] Edit season name, year, and start date.
- [ ] Switch active season.
- [ ] Delete or soft-delete a non-active season.
- [ ] Active season cannot be accidentally deleted from the normal season list.
- [ ] Garden, harvest, stats, and export views reflect the active season.

## Gardens

- [ ] Create a garden with name only.
- [ ] Create or edit a garden with optional location label and notes.
- [ ] Edit garden name, location label, and notes.
- [ ] Delete a garden with confirmation.
- [ ] Deleting a garden also removes its beds.
- [ ] Plants from a deleted garden remain in the season but lose bed assignment.
- [ ] Deleted gardens do not appear in live Garden lists after refresh.
- [ ] Deleted gardens do not reappear after sign out/sign in.

## Beds

- [ ] Create a bed inside an existing garden.
- [ ] Edit bed name, garden assignment, and notes.
- [ ] Create multiple beds under one garden.
- [ ] Create beds under multiple gardens.
- [ ] Delete a bed with confirmation.
- [ ] Deleting a bed keeps its plants but clears their bed assignment.
- [ ] Deleted beds do not appear in live Garden lists after refresh.
- [ ] Deleted beds do not appear in Harvest bed selector.

## Plants

- [ ] Create a plant with required variety, label, bed, status, and planted date.
- [ ] Create a plant with optional notes.
- [ ] Edit plant variety, label, bed, status, planted date, removed date, and notes.
- [ ] Duplicate a plant and confirm the label increments without collision.
- [ ] Retire a plant from the Garden list.
- [ ] Retired plant disappears from active Harvest entry but remains in stats/history.
- [ ] Mark a plant removed/failed and verify status display.
- [ ] Delete a plant with no harvest history.
- [ ] Attempt to delete a plant with harvest history and verify the warning is clear.
- [ ] Deleted plants do not appear as active entries after refresh.
- [ ] Plants without beds are visible in Garden but not incorrectly shown on Harvest.

## Harvest Entry

- [ ] Harvest tab with one active plant shows the harvest date control.
- [ ] Harvest tab shows bed selector for active beds with active plants.
- [ ] Increment and decrement count for a plant.
- [ ] Count cannot go below zero.
- [ ] Add optional weight for a plant.
- [ ] Add optional note for a plant.
- [ ] Save is disabled when no plant has count, weight, or note.
- [ ] Saving a harvest creates one session and one or more harvest rows.
- [ ] Save success toast shows total tomatoes and plant count.
- [ ] Undo from save toast removes the new session and rows.
- [ ] First positive harvest updates plant first harvest date.
- [ ] Harvest with weight-only or note-only entry behaves intentionally and appears in logs/stats as expected.
- [ ] Harvest save failure shows `Cloud sync needs attention` while retaining local data.

## Harvest Log And Editing

- [ ] More tab harvest log lists non-empty sessions only.
- [ ] Harvest log sorts newest sessions first.
- [ ] Open a harvest session from the log.
- [ ] Edit harvest session date.
- [ ] Session date change updates related harvest rows.
- [ ] Delete an individual harvest row from a session.
- [ ] Undo deleting an individual harvest row restores it.
- [ ] Deleted harvest row is excluded from stats, exports, and leaderboards.
- [ ] Delete or empty all rows in a session and verify empty sessions are hidden.
- [ ] Refresh and sign back in after edits to verify persistence.

## Stats And Analytics

- [ ] Stats total count matches saved harvest rows.
- [ ] Stats total weight matches saved weight rows.
- [ ] Top plant matches highest plant count.
- [ ] First ripe date uses earliest plant first harvest date.
- [ ] Plant ranking table matches harvest totals.
- [ ] Variety averages use average per plant, not only total variety yield.
- [ ] Cumulative season chart appears when harvest data exists.
- [ ] Empty stats state is readable when there are no harvests.
- [ ] Stats update after editing or deleting harvest rows.
- [ ] Stats update when switching active seasons.

## Export

- [ ] Plants CSV downloads.
- [ ] Plants CSV includes plant label, variety, bed, status, planted date, first harvest date, total count, and notes.
- [ ] Harvests CSV downloads.
- [ ] Harvests CSV includes harvest date, plant, variety, bed, count, weight, unit, notes, and season.
- [ ] Season summary CSV downloads.
- [ ] Season summary includes total count, plant count, session count, and variety summary.
- [ ] Exported CSVs reflect active season only.
- [ ] Exported CSVs exclude deleted/hidden records.

## Profile

- [ ] Open profile edit modal.
- [ ] Edit display name.
- [ ] Edit username.
- [ ] Edit optional social URL.
- [ ] Empty username is handled as blank/null without sync failure.
- [ ] Profile changes persist after refresh.
- [ ] Profile changes persist after sign out/sign in.
- [ ] Profile display is used in Syndicate/friend UI.

## Settings And Reset

- [ ] Change preferred weight unit to `oz`.
- [ ] Change preferred weight unit to `lb`.
- [ ] Change preferred weight unit to `g`.
- [ ] Change preferred weight unit to `kg`.
- [ ] New harvest rows use the selected weight unit.
- [ ] Reset garden data prompts with a clear destructive warning.
- [ ] Signed-in reset deletes cloud seasons, gardens, beds, plants, sessions, and harvests for the current account.
- [ ] Signed-in reset preserves profile/settings/friendships.
- [ ] Signed-in reset creates one clean empty active season.
- [ ] Local-mode reset clears local data and returns to signed-out/empty local state.

## Sync And Offline Behavior

- [ ] Header shows saving/saved state after local changes.
- [ ] Header shows `Cloud sync needs attention` when Supabase write fails.
- [ ] Local backup preserves unsynced changes after refresh.
- [ ] Cloud data wins when cloud has equal or more garden records than local backup.
- [ ] Local backup uploads to Supabase when it has more garden records for the same owner.
- [ ] Local backup does not upload into a different user's account.
- [ ] Fresh clean flow persists: create garden, bed, plant, harvest, refresh, sign out/in.
- [ ] Empty harvest sessions are hidden from logs after reload.
- [ ] Orphan beds/plants/harvest rows show in Garden data consistency check.
- [ ] Cloud reset plus hard refresh does not restore deleted garden data.

## Syndicate And Friends

- [ ] Signed-in user sees Syndicate tab.
- [ ] Username search returns matching profiles.
- [ ] Username search excludes or handles the current user's own profile.
- [ ] Send friend request by username.
- [ ] Outgoing request appears for requester.
- [ ] Incoming request appears for recipient.
- [ ] Recipient accepts request.
- [ ] Accepted friend appears in Garden Friends list for both users.
- [ ] Recipient declines request.
- [ ] Declined request no longer appears as pending.
- [ ] Remove an accepted friend.
- [ ] Removed friend no longer contributes to friend leaderboards.
- [ ] Block a user.
- [ ] Blocked user cannot send or appear as a normal friend candidate.
- [ ] Friend data read failure shows the RLS warning note.

## Friend Leaderboards

- [ ] Self appears in leaderboard rows.
- [ ] Accepted friends appear in leaderboard rows.
- [ ] Non-friends do not appear in leaderboard rows.
- [ ] First Ripe Tomato ranks by earliest first harvest date.
- [ ] Golden Root ranks by highest single-plant count.
- [ ] Grand Yield ranks by total season count.
- [ ] Leaderboard values update after new harvests.
- [ ] Leaderboard values update after harvest deletion.
- [ ] Leaderboards reflect active season.
- [ ] Friend leaderboard data persists after refresh and sign out/sign in.

## Navigation And UI Regression

- [ ] Bottom nav switches between Harvest, Garden, Stats, Syndicate, and More.
- [ ] Modal close buttons dismiss without saving when expected.
- [ ] Confirm modals require explicit destructive confirmation.
- [ ] Toasts appear and auto-dismiss.
- [ ] Undo toasts perform the intended reversal only once.
- [ ] Main mobile layout fits without clipped button labels.
- [ ] Header season chip does not overlap wordmark.
- [ ] Bed selector remains usable with many beds.
- [ ] Harvest stepper remains usable with many plants.
- [ ] No duplicate setup actions appear in secondary sections.

## Production Readiness

- [x] Production Vercel URL is added to Supabase auth redirect URLs. PASS
  2026-06-03: Supabase accepted production `redirect_to` for Google and email
  magic link. Dashboard visual confirmation still useful if available.
- [x] Production Vercel URL is added to Google OAuth authorized redirect/origin settings.
  PASS 2026-06-03: Google sign-in completed successfully on production. Google
  Cloud dashboard values were not directly readable through connectors, but the
  live callback behavior validates the configuration.
- [ ] Production Vercel URL is added to Apple OAuth authorized redirect/origin settings.
  BLOCKED 2026-06-03: Apple provider disabled and Apple Developer credentials
  are not available.
- [x] Supabase email passwordless auth is enabled and email templates use the production redirect URL.
  PASS 2026-06-03: production magic-link send and inbox click-through returned
  successfully to the app.
- [x] Google sign-in works on production URL. PASS 2026-06-03: manual production
  browser run completed successfully.
- [ ] Apple sign-in works on production URL. BLOCKED 2026-06-03: defer Apple;
  Apple button is disabled locally until configured, pending successful
  production redeploy.
- [x] Email magic-link sign-in works on production URL. PASS 2026-06-03: manual
  production inbox click-through completed successfully.
- [ ] Supabase RLS allows current user CRUD for owned garden data.
- [ ] Supabase RLS allows intended friend-visible reads only.
- [ ] Supabase RLS prevents non-friend access to private garden data.
- [ ] Production clean persistence test passes.
- [ ] Production two-account friend and leaderboard test passes.
