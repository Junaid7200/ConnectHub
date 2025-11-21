# ConnectHub (Twitter Clone) – Project Summary

This repo is an Expo Router + React Native Twitter-like app. Current state: UI-first with static data; navigation is wired, drawer/menu implemented, and many screens scaffolded from Figma. Backend (Supabase), Redux data flows, and OneSignal are not yet integrated.

## App Structure
- Expo Router with root `app/_layout.tsx` stack:
  - `(app)`: bottom tab navigator (Home, Search, Notifications, Messages).
  - `(settings)`: modal stack for settings screens (messages, notifications, search).
  - `(New)`: modal stack for New Tweet and New Message.
- Custom drawer overlay (`src/components/Drawer.tsx`) wrapped around `(app)` (and root), opened via header avatar.
- Shared UI/types: `src/types/types.tsx`, avatar component with fallback initials, shared SearchBar, SettingsHeader, TweetCard, NotiAll, FAB (iconSource-capable), MediaToolBar, etc.

## Completed Screens/Features (UI only, static data)
- Tabs:
  - Home: Tweet list with FAB → New Tweet.
  - Search: Trends list placeholder with FAB → New Tweet.
  - Notifications: All/Mentions tabs (header tabs), NotiAll/TweetCard entries, FAB → New Tweet.
  - Messages: Search + message list, FAB → New Message (/(New)/newMsg).
- Modals:
  - New Tweet: header (Cancel/Tweet), avatar + multiline input, MediaToolBar (shows above keyboard), uses toolbar assets in `assets/images/project_images/MediaToolBar/`.
  - New Message: header + flat search bar + people list cards.
- Settings (modal stack): messages, notifications, search settings with toggles and section headers.
- Drawer: custom animated panel (no @react-navigation/drawer) with profile, lists/topics/bookmarks/moments using SVGs from `assets/images/project_images/Drawer/`, stats, footer icons (bulb, QR). Avatar tap in header opens it. Overlay dims and content shifts.
- Navigation: Back from modals/settings uses stack navigation (no manual `from` param now); default fallback to Home if no history.

## Assets
- Drawer icons in `assets/images/project_images/Drawer/` (profile, lists, topics, bookmark, moments).
- FAB icons: `feather.svg` (default), `newMessage.svg` (messages FAB).
- Media toolbar icons/thumbs: `assets/images/project_images/MediaToolBar/`.
- Misc: `bulb.svg`, `QRCode.svg`, `verified.svg`, `p1.png` placeholder avatars, etc.

## Tech/State
- Expo Router + React Native.
- Redux store scaffolded (`src/store`), auth slice exists, but most screens use static mocks; no real data wiring yet.
- Supabase client present but not actively used in UI (auth flow commented/placeholder).
- No OneSignal integration yet.

## Known Gaps / Next Steps
1) Navigation:
   - Consider replacing custom drawer with `@react-navigation/drawer` if gestures are needed; current custom overlay works but is manual.
2) Data/Redux:
   - Replace mock data with Redux slices (timeline, notifications, messages, profile) and async thunks.
   - Use RTK Query or thunks to fetch/post via Supabase.
3) Supabase (planned):
   - Schema: users/profiles, tweets (text/media/hashtags), likes, retweets, bookmarks, follows, notifications, messages/threads, media table/storage; enable RLS; policies per table.
   - Implement auth (email/password or OAuth), session handling, and hydrate Redux on login.
   - Realtime channels for notifications/messages/likes if required.
4) OneSignal:
   - Integrate for push notifications (configure in app.json/app.config, register device, handle topics/alerts).
5) Screens still to build (from Figma/brief):
   - Profiles (tabs: Tweets, Tweets & replies, Media, Likes), Tweet detail/threads, Lists screens, search results/recent, video player, settings & privacy, etc.
6) Polish:
   - Spacing/UX parity with Figma (ongoing), ensure tap areas are generous (avatar already enlarged).

## Running
```bash
npm install
npx expo start
```

## External Requirements (from bootcamp brief)
- Backend: Supabase for auth/DB/realtime.
- State: Redux for user/tweets/interactions.
- Notifications: OneSignal.
- Frontend: React Native (Expo).
- Clean, modular components; remove unused imports/assets; responsive layouts; QA posting/liking/commenting/profiles before review.

Use this summary in the next chat to continue implementation (Supabase schema/design, Redux wiring, OneSignal, remaining screens).***

---

## Additional context (Lists/Tweet detail/Profile work)
- Lists screen added under `/(app)/lists` as a hidden tab entry with drawer navigation; two tabs (Subscribed/Member) and List FAB icon.
- Tweet detail views consolidated into one screen `/(app)/tweet-detail` with `variant` param (`mine` or `other`). Comment icon in TweetCard routes there; “View Tweet activity” row shows when viewing own tweet. Replies mocked for other variant; reply bar sticky.
- Profile screen (`/(app)/profile`) matches Figma: banner under status bar, white-ring avatar, edit profile button, bio/meta, follower counts, tab strip (Tweets / Tweets & replies / Media / Likes). FAB opens New Tweet. Pinned tweet label uses Pin SVG, tabs are single-line with tighter spacing.
- TweetCard: supports linkified text, retweet sheet, like/share actions; can hide engagement, and shows an extra activity icon for own tweets via `showActivityIcon`/`isOwnTweet`. Avatar component supports fallback initials.
- MediaToolBar: standard keyboard show/hide listeners; absolute at bottom with safe-area bottom padding.
- Hidden tabs for profile and tweet-detail keep bottom bar visible without adding real tabs.
- Route warnings remain because SafeAreaView deprecation and unused group layouts; address by using `react-native-safe-area-context` SafeAreaView and ensuring layout files match group names.

---

## Deep Project Overview (files/folders, current state, and pending work)

### Structure & Navigation
- `app/_layout.tsx`: Root router stack (no SafeAreaView wrapper). Registers `(app)` (tabs + drawer), `(settings)` modal stack, `(New)` modal stack, and routes to auth screens.
- `app/(app)`: Main tab screens (home, search, notifications, messages), plus hidden routes for profile and tweet-detail. bottom tabs defined in `src/components/(app)/Nav.tsx` with a custom header. Tabs use a hidden entry `/(app)/profile`, `/(app)/tweet-detail`, `/(app)/lists`; video-player now lives at `app/video-player.tsx` (no tab).
- `src/components/Drawer.tsx`: Custom drawer that overlays tabs; links to Profile, Lists, Settings & privacy. Uses `Avatar` fallback logic. Settings & privacy route: `/(settings)/settingsPrivacy`.

### Screens (UI-first, mostly static)
- Home (`app/(app)/home.tsx`): Tweet list using `TweetCard`, FAB to New Tweet.
- Search, Notifications, Messages: Static/mock data; notifications has tabs; messages has search + msg cards; FAB to modals.
- New Tweet (`app/(New)/NewTweet.tsx`): KAV + MediaToolBar; simple router back.
- New Message (`app/(New)/newMsg.tsx`): Search + people list modal.
- Tweet Detail (`app/(app)/tweet-detail.tsx` + `src/screens/TweetDetailScreen.tsx`): Single screen with `variant` param (`mine` / `other`). Own variant shows “View Tweet activity,” other variant shows replies. Engagement actions mock/toggle. Reply bar sticky.
- Profile (`app/(app)/profile.tsx` + `src/screens/ProfileScreen.tsx`): Banner, avatar ring, edit profile, bio/meta, follower counts, tabs (Tweets, Tweets & replies, Media, Likes). Pinned label with Pin SVG. FAB to New Tweet. Tab/scroll reset on focus.
- Lists (`app/(app)/lists.tsx`): Two tabs (Subscribed/Member) with empty/member mock data, List FAB icon.
- Settings modal screens: Messages, notifications, search (simple toggles). New Settings & Privacy page (`/(settings)/settingsPrivacy.tsx`) with grouped rows and “Done” back handler.
- Video Player (`app/video-player.tsx` + `src/screens/VideoPlayerScreen.tsx`): Uses `expo-video` (`VideoView`, `useVideoPlayer`), custom controls / engagement; no bottom tabs.

### Components
- `TweetCard`: Linkifies @/#/URLs; handles images and videos (media type), play overlay routes to video-player; engagement bar with optional activity icon for own tweets; can hide engagement; retweet sheet; like/share handlers. Accepts `media: MediaItem[]`, `pinned`, `showActivityIcon`, `isOwnTweet`, `hideEngagement`, etc.
- `MediaToolBar`: Absolute toolbar above keyboard; simple show/hide listeners.
- `Drawer` + tab header components (`Nav.tsx`, `SearchHeader`, `icons`, `Avatar` with fallback initials).
- Settings helpers: `SectionHeader`, `SettingRow` (chevron).

### State & Backend
- Redux scaffold (`src/store`) with only `auth` slice; Supabase client (`src/lib/supabase.ts`) exists; auth screens call Supabase login/signup. No RTK slices for data yet; most screens use static mocks.
- Env/shims: `expo-env.d.ts`, `nativewind` config; TS strict enabled; path alias `@/*`.

### Video Handling
- Uses `expo-video` (install with `npx expo install expo-video`). Video in TweetCard requires `media: [{ type: 'video', source: { uri: 'https://...' }, poster?: require(...) }]`. Local mp4: `Asset.fromModule(require('@/assets/images/project_videos/video.mp4')).uri`. Thumbnails: uses `expo-video-thumbnails` to grab first frame when no poster provided.
- Video-player route is root-level (`/video-player`), no bottom tabs.

### Known Issues / TODOs
- Route warnings: Root references `(settings)/(New)` groups; ensure layout files exist for all referenced groups (we added `(settings)/settingsPrivacy` and `(New)/_layout`, but warnings remain—verify group layouts or remove unused entries).
- SafeArea: Replace any RN SafeAreaView with `react-native-safe-area-context` (some warnings persist).
- Tab state persistence: Lists/Notifications still preserve tab/scroll; add focus reset like Profile if desired.
- MediaToolBar: Works with keyboard show/hide; monitor for edge cases when navigating from other screens.
- Video thumbnails: Currently poster or placeholder; extracting first-frame thumbnail not implemented.
- Data wiring: Replace mock data with real Supabase/Redux slices; add video upload/storage handling; implement tweet/reply/like/retweet flows.
- Expo-video config: If you need background/PiP, add plugin to app.json as per docs.

### How to Run
1) Install deps: `npm install` (Windows) or `npx expo install` for SDK-aligned native modules. Ensure `expo-video` and `@react-native-community/slider` installed.
2) `npx expo start` and launch on device/simulator.

### Pending Feature Work
- Backend: Supabase schema, auth flow, Redux slices for tweets/notifications/messages/profile.
- Video: Better thumbnail (first frame), fullscreen UX polish, error states.
- Tabs: Reset state on Lists/Notifications if desired; ensure back navigation stays on previous screen (check drawer navigations too).
- Other screens from Figma: Tweet thread view, Media tab behavior, Likes tab, search results, etc.
