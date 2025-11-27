# Project Breakdown

## MUST HAVES

- state management must be through redux
- backend must be done using supabase
- design should be according to figma exactly
- all typescript types should be in a dedicated types/types.ts file, not inline
- create components as much as you can, keep the code super modular
- components should be pascal case and functions etc should be camel case
- OneSignal notifications must be implemented

## Functional Requirments

- the user needs to be able to make his account (complete auth, signup and login etc)
- the user needs to be able to post tweets
- the user needs to be able to view tweets (of his followers in the home feed)
- the user should be able to like, retweet, share, and reply to a tweet
- the user should be able to create lists, be member of and subscribe to lists
- the user should be able to send messages and receive messages (both group chats and dms)

## Non Functional Requirements

- Responsive design
- very fast response times

## Current Status

- Frontend is 90% complete all around
- Db has been created in supabase, view db_code.txt to view the sql code
- supabase helpers created in src/lib
- rtk queries created in src/store/services
- backend implemented in login.tsx and signup.tsx as well as app/_layout.tsx
- backend also implemented into app/(app)/home.tsx and tweets are being fetched from the db and displayed
- CURRENT ISSUE: if a tweet has multiple media items then only the first item renders correctly, the second or more items do not render and fail to be fetched from supabase and I end up with placeholder
