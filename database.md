# ConnectHub Database Schema (Supabase)

> Goal: map the current UI (tweets + replies, media/video, likes/retweets/bookmarks, lists, notifications, messages, profiles) into a Supabase schema with RLS-ready tables. All UUIDs use `gen_random_uuid()` (pgcrypto).

## Core entities

### profiles
- `id uuid pk references auth.users(id) on delete cascade`
- `username text unique not null check (char_length(username) between 3 and 30)`
- `display_name text`
- `avatar_url text`
- `banner_url text`
- `bio text`
- `link text`
- `location text`
- `onesignal_player_id text` (for push)
- `is_verified boolean default false`
- `pinned_tweet_id uuid references public.tweets(id) on delete set null`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### follows
- `id uuid pk default gen_random_uuid()`
- `follower_id uuid not null references profiles(id) on delete cascade`
- `following_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(follower_id, following_id)`; check `follower_id <> following_id`

## Tweets, media, interactions

### tweets
- `id uuid pk default gen_random_uuid()`
- `author_id uuid not null references profiles(id) on delete cascade`
- `body text not null`
- `created_at timestamptz default now()`
- `parent_tweet_id uuid references tweets(id) on delete cascade` (thread/reply)
- `reply_to_user_id uuid references profiles(id) on delete set null`
- `visibility text default 'public' check (visibility in ('public','followers'))`
- `geo jsonb` (optional)

### tweet_media
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `storage_path text not null` (Supabase Storage path)
- `media_type text not null check (media_type in ('image','video'))`
- `thumbnail_url text` (poster for video)
- `duration_seconds numeric` (for video)
- `width int`, `height int`
- `position int default 0` (ordering)

### tweet_hashtags
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `tag text not null` (stored lowercase, no #)
- unique `(tweet_id, tag)`

### tweet_mentions
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `mentioned_profile_id uuid not null references profiles(id) on delete cascade`
- unique `(tweet_id, mentioned_profile_id)`

### tweet_likes
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(tweet_id, user_id)`

### tweet_retweets
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(tweet_id, user_id)`

### tweet_bookmarks
- `id uuid pk default gen_random_uuid()`
- `tweet_id uuid not null references tweets(id) on delete cascade`
- `user_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(tweet_id, user_id)`

## Lists

### lists
- `id uuid pk default gen_random_uuid()`
- `owner_id uuid not null references profiles(id) on delete cascade`
- `name text not null`
- `description text`
- `is_private boolean default false`
- `cover_image_url text`
- `created_at timestamptz default now()`

### list_members
- `id uuid pk default gen_random_uuid()`
- `list_id uuid not null references lists(id) on delete cascade`
- `profile_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(list_id, profile_id)`

### list_subscribers
- `id uuid pk default gen_random_uuid()`
- `list_id uuid not null references lists(id) on delete cascade`
- `profile_id uuid not null references profiles(id) on delete cascade`
- `created_at timestamptz default now()`
- unique `(list_id, profile_id)`

## Messaging (DMs)

### conversations
- `id uuid pk default gen_random_uuid()`
- `created_at timestamptz default now()`

### conversation_participants
- `id uuid pk default gen_random_uuid()`
- `conversation_id uuid not null references conversations(id) on delete cascade`
- `profile_id uuid not null references profiles(id) on delete cascade`
- `role text default 'member' check (role in ('member','admin'))`
- unique `(conversation_id, profile_id)`

### messages
- `id uuid pk default gen_random_uuid()`
- `conversation_id uuid not null references conversations(id) on delete cascade`
- `sender_id uuid not null references profiles(id) on delete cascade`
- `content text not null`
- `created_at timestamptz default now()`

### message_media
- `id uuid pk default gen_random_uuid()`
- `message_id uuid not null references messages(id) on delete cascade`
- `storage_path text not null`
- `media_type text check (media_type in ('image','video'))`
- `thumbnail_url text`
- `duration_seconds numeric`

### message_reads (optional but useful)
- `id uuid pk default gen_random_uuid()`
- `message_id uuid not null references messages(id) on delete cascade`
- `profile_id uuid not null references profiles(id) on delete cascade`
- `read_at timestamptz default now()`
- unique `(message_id, profile_id)`

## Notifications

### notifications
- `id uuid pk default gen_random_uuid()`
- `recipient_id uuid not null references profiles(id) on delete cascade`
- `actor_id uuid references profiles(id) on delete set null`
- `tweet_id uuid references tweets(id) on delete set null`
- `message_id uuid references messages(id) on delete set null`
- `type text not null check (type in ('like','retweet','reply','mention','follow','message','system'))`
- `body text`
- `created_at timestamptz default now()`
- `read_at timestamptz`

## User settings (matches Settings screens)

### user_settings
- `profile_id uuid pk references profiles(id) on delete cascade`
- Notifications: `push_likes boolean default true`, `push_replies boolean default true`, `push_mentions boolean default true`, `push_retweets boolean default true`
- Messages: `allow_messages_from text default 'everyone' check (allow_messages_from in ('everyone','people_you_follow'))`
- Search: `safe_search boolean default true`, `personalized_results boolean default true`
- `updated_at timestamptz default now()`

## Storage/buckets
- Create a `media` bucket; store under `tweets/{tweet_id}/...` and `messages/{message_id}/...`.
- For videos, store poster frames; keep `thumbnail_url` in media tables.

## Indexes (examples)
- `create index on tweets(author_id, created_at desc);`
- `create index on tweets(parent_tweet_id);`
- `create index on tweet_likes(user_id);`
- `create index on tweet_retweets(user_id);`
- `create index on tweet_bookmarks(user_id);`
- `create index on notifications(recipient_id, created_at desc);`
- `create index on messages(conversation_id, created_at desc);`

## RLS policies (outline)
- Enable RLS on all tables.
- profiles: select all; insert/update only self (`auth.uid() = id`).
- follows: select all; insert/delete where `auth.uid() = follower_id`.
- tweets: select all (or restrict to visibility); insert/delete where `auth.uid() = author_id`.
- tweet_likes/retweets/bookmarks: select all; insert/delete where `auth.uid() = user_id`.
- tweet_media/hashtags/mentions: insert/delete where `auth.uid()` matches tweet author via FK check; select all.
- lists: select all if public; full access for owner; for private lists wrap select with `auth.uid()` owner or member/subscriber.
- list_members/subscribers: select all for authenticated; insert/delete where `auth.uid() = profile_id`.
- conversations: select where id in participant subquery; insert allowed; delete/update limited to participants/admins.
- conversation_participants: select where conversation in participant subquery; insert allowed; delete where `auth.uid()` is participant or admin.
- messages/message_media: select where conversation in participant subquery; insert where `auth.uid() = sender_id` and participant; delete own messages (optional).
- message_reads: insert/select where participant.
- notifications: select where `recipient_id = auth.uid()`; actors insert via RPC or trigger.
- user_settings: select/update where `profile_id = auth.uid();` insert on first login.

## Triggers (recommended)
- `set_updated_at` trigger on profiles, user_settings.
- On tweet insert: auto-extract hashtags/mentions into `tweet_hashtags` / `tweet_mentions`.
- On like/retweet/reply/follow/message insert: enqueue notification into `notifications`.
- On message insert: optional fan-out to OneSignal using Edge Function reading notifications table.
- On profiles insert: default `user_settings` row.

## Notes for frontend mapping
- Pinned tweet: `profiles.pinned_tweet_id` drives the “Pinned Tweet” label.
- Tabs (Tweets/Tweets & replies/Media/Likes): queries filter `tweets` by `author_id`, join `tweet_media`, join `tweet_likes` etc.
- Video player: use `tweet_media` rows with `media_type='video'` and `thumbnail_url`.
- Lists screen: `lists` + `list_members` + `list_subscribers` for subscribed/member tabs.
- Notifications screen: query `notifications` with type filters; mentions are replies/mentions to user.
- Messages: `conversations` + `conversation_participants` + `messages` (+ `message_reads` for read state).
