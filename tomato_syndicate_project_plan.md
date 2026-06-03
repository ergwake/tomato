# Tomato Syndicate — Project Plan

## Overview

**Tomato Syndicate** is a mobile-first, offline-capable Progressive Web App (PWA) for serious tomato gardeners who want to track individual plant performance, optimize garden yields, compare seasons, and optionally compete with trusted garden friends.

The app is primarily a **tomato performance tracker**. The social and competition features add fun, but the core value is helping gardeners understand which individual plants, beds, and varieties actually performed best over time.

## Current Status

- **Phase:** Feature Planning Complete
- **Next Steps:** Code Generation & Development
- **App Name:** Tomato Syndicate
- **Primary User:** Serious home tomato gardener
- **Secondary Use Case:** Friendly garden competition

## Product Positioning

Tomato Syndicate is not a general-purpose gardening journal. It is a focused, plant-level tomato tracking app with enough structure to support meaningful season-over-season analysis.

Core product idea:

> Track every tomato plant. Log every harvest. Find out what actually performs.

Tone:

- Serious enough for data-driven gardeners
- Playful enough for friendly competition
- Not cartoonish
- Practical, fast, and outdoor-friendly

## Core Architecture

- **Frontend:** React/Vite or Svelte PWA
- **Backend/Database:** Supabase with PostgreSQL
- **Authentication:** Google/Apple OAuth plus email magic link
- **Offline Support:** Local harvest queue with later sync
- **Data Model:** Season-based, plant-level tracking

## Key Product Principles

1. **Plant-level tracking is the core feature.**
   - Users track individual plants, not just generic tomato totals.
   - Variety-level information is useful mostly for calculating averages across plants of the same variety.

2. **Count is the default harvest metric.**
   - The primary logging action is tomato count.
   - Weight is supported but optional.
   - The app should never make weight entry feel required.

3. **Fast harvest entry matters more than complex journaling.**
   - Users may be outside, in sunlight, with dirty hands.
   - Harvest logging should be possible with large, high-contrast controls.

4. **Social features are private and friend-based.**
   - Leaderboards are populated only by mutually accepted friends.
   - There is no public global leaderboard in the MVP.

5. **Trust users for competition categories.**
   - For the Grand Yield competition, cherry tomatoes should not count.
   - The app does not need to automatically classify cherry vs. non-cherry varieties.
   - Users are trusted to follow the rules.

6. **No in-app photos for MVP.**
   - The app will not support photo uploads or plant images in the initial version.
   - User profiles may include an optional social account link, such as Instagram, for gardeners who maintain a public garden account.

## Core Features

### 1. Edit and Delete Built In

Editing and deleting should be treated as core product behavior, not afterthoughts.

Users should be able to edit and delete the main records they create, including:

- Profiles
- Seasons
- Gardens
- Beds
- Plants
- Harvest sessions
- Individual harvest entries
- Friend requests or friendships

Recommended behavior:

- Use edit screens or edit drawers for structured records.
- Confirm destructive delete actions.
- Prefer soft delete for records that affect historical analytics or offline sync.
- Allow undo where practical, especially immediately after deleting a harvest entry.
- Maintain data integrity when deleting parent records.

Deletion rules should be conservative:

- Deleting a plant should not accidentally erase historical harvest records without clear confirmation.
- Retiring a plant should be the preferred action when the plant existed and produced data.
- Deleting a plant should be reserved for setup mistakes or duplicate entries.
- Deleting a harvest entry should update all analytics and leaderboards.
- Editing a harvest entry should update all analytics and leaderboards.

### 2. Muddy Hands UX

The harvest logging experience should be optimized for use in the garden.

Required UX characteristics:

- High contrast
- Large tap targets
- Chunky `+` and `-` buttons
- One-tap incrementing by plant
- Minimal typing
- Standard text fields for optional notes
- Clear save state
- Clear offline/sync state
- No voice notes
- No photo upload

Primary design goal:

> A user should be able to log a harvest from 10 plants in under 60 seconds.

### 3. Plant-Level Tracking

Users should track yields by individual plant.

Each plant should include:

- Variety
- Plant label
- Bed assignment
- Status
- Planted date
- Optional notes
- Optional first harvest date
- Optional removed/retired date

Example plant labels:

- Cherokee Purple 1
- Cherokee Purple 2
- Sungold 1
- Roma 4

The app should support multiple plants of the same variety and make it easy to distinguish them.

### 4. Bed Organization

Plants are organized by bed.

The harvest entry screen should use a sticky horizontal bed selector so the user can quickly move between beds while logging harvests.

Beds should support names instead of only numbers.

Examples:

- Bed 1
- South Trellis
- Back Fence Bed
- Raised Bed 3

### 5. Duplicate Plant Option

The app should include a fast duplicate plant workflow.

Purpose:

- Reduce friction when users add several plants of the same variety.
- Support common garden setup patterns like planting 4 Roma plants or 6 paste tomatoes in the same bed.

Possible behavior:

- User creates one plant.
- User taps "Duplicate."
- App creates a copy with an incremented plant label.

Example:

- Original: `Roma 1`
- Duplicate: `Roma 2`
- Duplicate again: `Roma 3`

### 6. Retire Plant

Users should be able to retire a plant instead of deleting it.

A retired plant remains part of the season's historical data but is removed from active harvest entry.

Plant status options should include:

- Active
- Retired
- Removed / Failed

Retiring a plant should preserve:

- Harvest history
- Variety
- Bed assignment
- Notes
- Performance metrics

### 7. Harvest Logging

Harvest logging should support:

- Tomato count, default
- Optional weight
- Optional notes
- Harvest date
- Batch/session saving
- Offline queueing

The user should not need to enter weight unless they want to.

Recommended harvest entry flow:

1. Open harvest screen.
2. Select date, defaulting to today.
3. Select bed from sticky selector.
4. Tap `+` or `-` beside each plant.
5. Optionally enter weight or notes.
6. Save harvest session.
7. App syncs immediately if online or queues locally if offline.

### 8. Optional Weight Tracking

Weight should be available but secondary.

Recommended approach:

- Count field is always visible.
- Weight field is optional and less prominent.
- User can choose preferred weight unit in settings later.
- MVP may default to ounces or pounds, depending on target audience.

The app should support analytics by:

- Count
- Weight, where available

But count remains the default experience.

### 9. Social Profile

User profiles should support:

- Username
- Display name
- Optional avatar later, but not necessary for MVP
- Optional social account link

The social link can be used for Instagram, TikTok, YouTube, personal garden blog, or another public garden-related profile.

The app should not need to host garden photos directly.

### 10. Garden Friends

Garden Friends is the private social layer.

Friendship model:

- Users search by unique username.
- Users send friend requests.
- Leaderboards are shown only among mutually accepted friends.
- No public global leaderboard in the MVP.

Privacy expectations:

- Private by default
- Friend-only leaderboard visibility
- No exact garden location required
- No public exposure of garden data
- Display name shown on leaderboards
- Social link visible only according to user preference, or friend-only by default

### 11. Social Leaderboards

Initial friend-only leaderboards:

#### The First Ripe Tomato

Awarded to the earliest logged harvest of the season among friends.

Metric:

- First harvest date

#### The Golden Root

Awarded to the individual plant with the highest tomato count.

Metric:

- Highest cumulative count from a single plant

#### The Grand Yield

Awarded to the highest cumulative harvest across the garden for non-cherry tomato varieties.

Metric:

- Highest cumulative tomato count across qualifying plants

Rule:

- Cherry tomatoes do not count for this competition.
- The app does not need to enforce this automatically in MVP.
- Users are trusted to exclude cherry tomatoes from this competition.

Potential future enhancement:

- Add optional variety type classification, such as cherry, slicer, paste, beefsteak, grape, etc.
- Allow leaderboard filters by type.

## Analytics

### 1. Plant-Level Yield — Current Year

Show total count per individual plant for the active season.

Useful questions:

- Which plant produced the most tomatoes?
- Which plants underperformed?
- Which plants should be repeated next year?

### 2. Variety Averages

Variety-level analytics should focus on averages per plant, not just total variety yield.

Example:

- Cherokee Purple: 4 plants, 92 total tomatoes, 23 average tomatoes per plant
- Roma: 6 plants, 210 total tomatoes, 35 average tomatoes per plant

Useful metrics:

- Total count by variety
- Average count per plant by variety
- Average weight per plant, where available
- First harvest date by variety
- Days from planting to first harvest

### 3. Daily Average vs. Historical

Compare current daily harvest rate against historical averages.

Useful questions:

- Is this season ahead or behind previous seasons?
- Is the garden peaking earlier or later?
- Is production fading faster than normal?

### 4. Cumulative S-Curve

Show running season-to-date tomato totals over time.

Overlay current year against previous years.

Useful questions:

- How does this season compare to last season?
- When did production accelerate?
- When did production peak?
- When did the harvest curve flatten?

### 5. Recommended Future Analytics

Not required for MVP, but valuable later:

- Yield per plant-day
- Peak harvest date
- 7-day rolling harvest rate
- Yield by bed
- Yield by variety
- Days from planting to first harvest
- Days from first harvest to retirement
- Plant survival/failure rate
- Season recap summary

## Export to CSV

MVP should include CSV export.

At minimum, users should be able to export:

- Plants
- Harvests
- Season summary

Recommended harvest export fields:

- harvest_date
- plant_label
- variety
- bed_name
- quantity_count
- weight
- notes
- season

CSV export is important because serious gardeners may want to analyze data in spreadsheets or preserve their own records outside the app.

## Offline Support

Offline support should be included from the beginning.

Core behavior:

- Harvests can be logged without internet.
- Harvest sessions are saved locally.
- Records sync to Supabase when connectivity returns.
- User can see whether a harvest is synced or pending.

Recommended implementation detail:

- Use client-generated UUIDs for offline-created records.
- Include sync metadata fields.
- Avoid relying only on database-generated IDs.

Important fields for offline-capable tables:

- id
- client_id, if needed
- created_at
- updated_at
- deleted_at
- synced_at

Soft deletes are recommended for records that may need to sync after deletion.

## Database Schema

### profiles

```text
profiles:
id
username UNIQUE
display_name
social_url
created_at
updated_at
```

Notes:

- `social_url` is optional.
- This can support Instagram, TikTok, YouTube, garden blogs, etc.
- Avatar/photo support is not required for MVP.

### seasons

```text
seasons:
id
user_id
year
name
start_date
end_date
is_active
created_at
updated_at
```

Notes:

- Seasons should be explicit rather than inferred only from calendar year.
- This supports cleaner year-over-year comparisons.

### gardens

```text
gardens:
id
user_id
name
location_label
notes
created_at
updated_at
```

Notes:

- `location_label` should be optional and non-specific.
- Avoid requiring exact location.

### beds

```text
beds:
id
user_id
garden_id
name
notes
created_at
updated_at
```

Notes:

- Beds should have names, not just numbers.

### plants

```text
plants:
id
user_id
season_id
bed_id
variety
plant_label
status
planted_date
first_harvest_date
removed_date
notes
created_at
updated_at
deleted_at
synced_at
```

Notes:

- `status` should support active, retired, removed/failed.
- `deleted_at` allows soft delete.
- `plant_label` distinguishes multiple plants of the same variety.

### harvest_sessions

```text
harvest_sessions:
id
user_id
season_id
harvest_date
notes
created_at
updated_at
deleted_at
synced_at
```

Notes:

- A harvest session represents one garden harvest event.
- It can contain harvest entries from multiple plants.

### harvests

```text
harvests:
id
session_id
plant_id
user_id
quantity_count
weight_value
weight_unit
harvest_date
notes
created_at
updated_at
deleted_at
synced_at
```

Notes:

- `quantity_count` is the default harvest metric.
- `weight_value` and `weight_unit` are optional.
- `harvest_date` is duplicated here for simpler querying and analytics, even though it is also present on the session.

### friendships

```text
friendships:
id
requester_id
recipient_id
status
created_at
updated_at
```

Notes:

- `status` should support pending, accepted, declined, blocked.
- The data model should prevent duplicate reverse friendships.
- Example: User A → User B and User B → User A should not become two accepted friendship records.

## MVP Scope

### MVP Feature Set

1. User authentication
2. User profile with username, display name, and optional social link
3. Create, edit, and delete seasons
4. Create, edit, and delete gardens
5. Create, edit, and delete beds
6. Create, edit, delete, duplicate, and retire plants
7. Log, edit, and delete harvests by plant
8. Create, edit, and delete harvest sessions
9. Count-based harvest entry as default
10. Optional weight entry
11. Offline harvest queue
12. Sync status indicator
13. Basic dashboard
14. Plant-level current-year totals
15. Variety averages per plant
16. Cumulative season-to-date curve
17. CSV export
18. Friend requests by username
19. Accept, decline, remove, or block garden friends
20. Friend-only leaderboards

### MVP Leaderboards

1. The First Ripe Tomato
2. The Golden Root
3. The Grand Yield

Grand Yield rule:

- Non-cherry tomatoes only.
- Honor system for MVP.

## Recommended Development Order

### Phase 1 — App Foundation

- Choose frontend framework.
- Set up PWA shell.
- Set up Supabase project.
- Configure authentication.
- Create database schema.
- Establish basic routing.

### Phase 2 — Garden Setup

- User profile creation and editing
- Season creation, editing, and deletion
- Garden creation, editing, and deletion
- Bed creation, editing, and deletion
- Plant creation, editing, deletion, duplication, and retirement
- Conservative delete confirmations
- Soft-delete behavior where historical data or sync integrity could be affected

### Phase 3 — Harvest Entry

- Harvest session model
- Muddy Hands UX
- Count entry
- Optional weight entry
- Notes
- Batch save
- Edit harvest session
- Delete harvest session
- Edit individual harvest entry
- Delete individual harvest entry
- Undo immediately after deleting harvest entries, where practical
- Offline local queue
- Sync to Supabase
- Analytics recalculation after harvest edits or deletes

### Phase 4 — Dashboard and Analytics

- Current season total
- Total by plant
- Average by variety
- Top plant
- Top variety by average per plant
- Cumulative S-curve
- Daily average vs. historical, if enough historical data exists

### Phase 5 — Export

- CSV export for plants
- CSV export for harvests
- CSV export for season summary

### Phase 6 — Garden Friends

- Username search
- Friend requests
- Accept/decline requests
- Remove friend
- Block user
- Delete or cancel outgoing friend request
- Friend-only leaderboard visibility
- First Ripe Tomato leaderboard
- Golden Root leaderboard
- Grand Yield leaderboard

## Deferred Features

The following features are valuable but should be deferred until after the MVP:

- QR code plant tags
- Manual historical data import
- Variety notes beyond basic fields
- Taste ratings
- Disease resistance ratings
- Cracking/splitting notes
- Pest pressure notes
- Weather integration
- Season recap narrative
- Advanced plant health tracking
- Plant height tracking
- Optional variety type classification
- Leaderboard filters by tomato type
- Social feed
- Public profiles
- Global competitions
- Photo uploads

## Important Non-Goals for MVP

The MVP should not include:

- Hard deletes that silently remove historical performance data
- In-app photo uploads
- Voice notes
- Public global leaderboards
- Automatic cherry tomato detection
- Weather integrations
- Pest/disease diagnosis
- AI gardening recommendations
- Full garden journaling system
- Marketplace features

## Success Criteria

The MVP is successful if a serious tomato gardener can:

1. Set up their season, beds, and individual tomato plants.
2. Quickly duplicate plants of the same variety.
3. Log harvests by plant in the garden with minimal friction.
4. Track count by default and weight optionally.
5. See which individual plants produced best.
6. See average performance by variety.
7. Export their data to CSV.
8. Edit mistakes without corrupting analytics.
9. Delete erroneous entries with appropriate confirmation and sync-safe handling.
10. Compare basic performance with accepted garden friends.

Primary usability benchmark:

> Log a harvest from 10 plants in under 60 seconds.

Primary product benchmark:

> At the end of the season, the user should know which plants and varieties earned a spot in next year's garden.
