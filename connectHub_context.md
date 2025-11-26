# ConnectHub Context Log

Purpose: running context for ongoing work (what was read, observed, and planned). Keep this file updated as changes land.

## Latest updates (current session)
- Added RTK Query services for auth, profiles, tweets, notifications, messages, and lists; store registers each reducer + middleware alongside the auth slice (baseQuery intentionally kept as `any` for now).
- `getHomeTimeline` now filters to the viewer’s own tweets plus people they follow (reverse-chron), keeping the old unfiltered version commented for reference; `tweetsApi.getHomeTimeline` now requires `viewerId`.
- Profiles API expanded to cover follow/unfollow, followers/following, and user settings.
- Supabase helpers remain the source of truth for data access; RTK Query endpoints now wrap them.

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
- Expo Router + RN; Supabase client configured via env; auth screens call Supabase login/signup; `_layout` bootstraps session via `getSession` + listener and redirects via Redux auth state.
- Redux: auth slice plus RTK Query services (authApi, profilesApi, tweetsApi, notificationsApi, messagesApi, listsApi); components not yet wired to the new hooks.
- OneSignal: not integrated.
- Profile screen pulls profile data for the logged-in user, displays `banner_url`, and supports banner upload to Storage; still uses static placeholder tweets/bio when data absent.
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
1) Wire media paths: ensure `tweet_media` rows match real storage paths; clear stray `thumbnail_url`.
2) Hook screens to RTK Query services (profiles/tweets/notifications/messages/lists); replace static mocks with data.
3) Solidify profile flow: add profile slice as needed for UI state; wire Edit Profile route; reuse storage helpers for avatar/banner.
4) OneSignal: integrate SDK, persist `onesignal_player_id`, respect `user_settings`.
5) Optionally reorganize into feature folders as data wiring progresses.

## RTK Query plan (next steps)
- Structure: `src/store/services/{auth,profiles,tweets,notifications,messages,lists}.ts` using `createApi` with a simple custom `supabaseBaseQuery` that accepts a `SupabaseQuery` type defined in `src/types/types.ts`.
- Always keep types in `src/types/types.ts` and import them; keep code simple and flat.
- Keep `auth` slice (existing). Add slices only for UI/local state; prefer RTK Query for data fetching.
- Screens should consume generated hooks to replace mock data (Home, Profile, Tweet Detail, Notifications, Messages, Lists, Edit Profile).

## Supabase access
MCP Supabase server is reportedly configured; use it to inspect the ConnectHub project when wiring backend and Storage.
