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
