# ConnectHub Context Log

Purpose: running context for ongoing work (what was read, observed, and planned). Keep this file updated as changes land.

## Latest updates (current session)
- Auth bootstrap now fetches `supabase.auth.getSession()` on launch and routes accordingly; root `app/index.tsx` redirects based on Redux auth.
- Profile screen now fetches the logged-in profile from Supabase, shows `banner_url` if present, and lets the user pick & upload a banner to Storage (`media/profiles/{userId}/banner-<timestamp>`), persisting `profiles.banner_url`.
- Added `expo-image-picker` dependency for banner selection.
- Added `Profile` type to `src/types/types.tsx` for schema-aligned profile data.
- Directory structure refreshed:
  - Routes: grouped under `app/(app)`, `(auth)`, `(settings)`, `(New)`, `(media)`; `video-player` now at `app/(media)/video-player.tsx`.
  - Components: reorganized into `src/components/features/*` (Cards, Search with `BaseSearchBar`, New, lists, Drawer, TabHeaders) and `src/components/primitives/*` (Header, GenericHeader, Fab), plus settings components.
  - Screens: now live under `src/components/screens` (Profile/TweetDetail/VideoPlayer), imported by thin route wrappers.
- Supabase storage: bucket `media` created. Policies:
  - Auth write (insert/update/delete) for `profiles/{auth.uid()}/...`
  - Public read (anon) for `profiles/...` and `tweets/...`
- Seed data loaded:
  - 5 profiles linked to auth IDs; avatars set via `profiles/{id}/avatar*.png`, banner for alex.
  - Follows seeded (6 rows).
  - 20 tweets with replies; tweet_media seeded with 6 rows (mix images/videos) under `tweets/{tweet_id}/...`; interactions seeded (likes 4, retweets 2, bookmarks 2).
  - Storage now has profile avatars/banners and tweet media for several tweets.

## Requirements (from Requirements_code_quality.md)
- Components PascalCase; variables camelCase; types live in `src/types/types.tsx`.
- Modular folders (screens/components/redux); avoid redundant imports/assets; consistent naming.
- Must use Supabase backend + Redux for state; optimize requests.
- Must use OneSignal; smooth rendering/responsive layout.

## Supabase schema (database.md / database.txt)
- Core: `profiles` (avatar_url, banner_url, bio, link, location, onesignal_player_id, pinned_tweet_id), `follows`.
- Tweets: `tweets` + `tweet_media` (image/video with thumbnail/dimensions), `tweet_hashtags`, `tweet_mentions`.
- Interactions: `tweet_likes`, `tweet_retweets`, `tweet_bookmarks`.
- Lists: `lists`, `list_members`, `list_subscribers`.
- Messaging: `conversations`, `conversation_participants`, `messages`, `message_media`, optional `message_reads`.
- Notifications: `notifications` table.
- Settings: `user_settings` (push/search/message prefs).
- RLS enabled everywhere with per-table policies; media stored in `media` bucket (tweets/messages).

## Current app state (scan)
- Expo Router + RN; UI mostly static mocks. Supabase client configured via env; auth screens call Supabase login/signup; `_layout` now bootstraps session via `getSession` + listener.
- Redux: only `auth` slice (User + isAuthenticated). No slices/services for tweets/profile/notifications/messages/lists/settings.
- OneSignal: not integrated.
- Profile screen pulls profile data for the logged-in user, displays `banner_url`, and supports banner upload to Storage; still uses static placeholder tweets/bio when data absent.
- `app/index.tsx` now redirects based on Redux auth state.
- Routes: tabs under `app/(app)`, modals under `(New)` and `(settings)`, video-player route sits at `app/video-player.tsx`.
- Storage policies applied to `media` bucket (see Latest updates).
- Seed data present in DB and Storage (avatars/banners/tweet media).

## Folder notes
- Routes live under `app/…` (grouped), but feature components/screens are mixed in `src/components/(app)` and `src/screens`. `video-player.tsx` is alongside `index.tsx` (no feature folder).
- Shared pieces: Drawer/Nav/FAB/TweetCard/SearchBar/SettingsHeader/etc in `src/components`; types centralized in `src/types/types.tsx`.

### Suggested future structure (for discussion)
- `app/` keeps route wrappers only, delegating to feature screens.
- `src/features/{auth,tweets,profile,messages,lists,notifications,settings,media}` for screens + slices + services.
- `src/components/ui` for primitives (Avatar, FAB, SearchBar, SettingsHeader); `src/components/layout` for Drawer/Nav.
- `src/lib` for supabase client/utils; `src/hooks` for typed hooks; `src/store` for root store/slices; `src/assets` if desired.

## Immediate priorities
1) Wire media paths: ensure `tweet_media` rows match real storage paths; stray thumbnail_url cleared.
2) Add supabase data layer: TS helpers + RTK Query services for profiles, tweets/media/interactions, notifications, messages, lists, settings (place under `src/lib` and `src/store`).
3) Implement `src/lib/storage.ts`: uploadProfileAvatar, uploadProfileBanner, uploadTweetMedia (multi), getPublicUrl.
4) Solidify profile flow: add profile slice + avatar/banner upload helpers; wire “Edit profile” button in `ProfileScreen` to an edit screen/form that uses these helpers to update profile fields and media.
5) OneSignal: integrate SDK, persist `onesignal_player_id`, respect `user_settings`.
6) Optionally reorganize into feature folders as data wiring progresses.

## Supabase access
MCP Supabase server is reportedly configured; use it to inspect the ConnectHub project when wiring backend and Storage.
