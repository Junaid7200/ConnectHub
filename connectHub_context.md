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
- CURRENT ISSUE: if a tweet has multiple media items and the second item is a video, then I get the placeholder of the video instead of first frame simply. When I click the video, the video player DOES open and it plays and its awesome. The only issue is that I want ALL videos in tweets to just have no custom posters or placeholders, I just want the first frame of the video to render simply (which I think renders automatically may be)
- Immediate work other then the above issue: we gotta make the like, retweet, share, and replies work, the user can view tweets in the home page, but nothing gets added to the db when he likes or retweets or shares or anything. We need to make the tweetCards fully functional.
- cleanup: there is a weird maybeGenerateThumb in TweetCard.tsx which I cannot understand does what, if it is useless then we should clean up the file
