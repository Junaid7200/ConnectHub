import { supabase } from './supabase';


export const createProfile = ({
    id, username, display_name = null}: {id: string, username: string; display_name?: string | null}) => {
    return supabase.from('profiles').insert({ id, username, display_name, avatar_url: null, banner_url: null, bio: null, link: null, location: null }).select().single();
};


export const getProfileById = (id: string) => {
    return supabase.from('profiles').select('*').eq('id', id).single();
};

export const getProfileByUsername = (username: string) => {
    return supabase.from('profiles').select('*').eq('username', username).single();
};

export const updateProfile = (
    id: string,
    fields: {
        username?: string | null;
        display_name?: string | null;
        bio?: string | null;
        link?: string | null;
        location?: string | null;
        avatar_url?: string | null;
        banner_url?: string | null;
        onesignal_player_id?: string | null;
    }
) => {
    return supabase.from('profiles').update(fields).eq('id', id);
};

export const getFollowers = (id: string) => {
    return supabase.from('follows').select('*').eq('following_id', id);
};

export const getFollowing = (id: string) => {
    return supabase.from('follows').select('*').eq('follower_id', id);
};

export const follow = (followerId: string, followingId: string) =>
    supabase.from('follows').insert({ follower_id: followerId, following_id: followingId });

export const unfollow = (followerId: string, followingId: string) =>
    supabase.from('follows').delete().eq('follower_id', followerId).eq('following_id', followingId);

export const getUserSettings = (profileId: string) =>
    supabase.from('user_settings').select('*').eq('profile_id', profileId).single();

export const updateUserSettings = (
    profileId: string,
    fields: Partial<{
        push_likes: boolean;
        push_replies: boolean;
        push_mentions: boolean;
        push_retweets: boolean;
        allow_messages_from: 'everyone' | 'people_you_follow';
        safe_search: boolean;
        personalized_results: boolean;
        quality_filter: boolean;
        read_receipts_enabled: boolean;
    }>
) => supabase.from('user_settings').update(fields).eq('profile_id', profileId);
