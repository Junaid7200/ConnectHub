import { supabase } from './supabase';

export const getProfileById = (id: string) => {
    supabase.from("profiles").select("*").eq("id", id).single();
};

export const getProfileByUsername = (username: string) => {
    supabase.from("profiles").select("*").eq("username", username).single();
};

export const updateProfile = (id: string, fields: {
    display_name?: string | null;
    bio?: string | null;
    link?: string | null;
    location?: string | null;
    avatar_url?: string | null;
    banner_url?: string | null;
    onesignal_player_id?: string | null;
}) => {
    supabase.from("profiles").update(fields).eq("id", id);
};

export const getFollowers = (id: string) => {
    supabase.from("follows").select("*").eq("following_id", id);
};

export const getFollowing = (id: string) => {
    supabase.from("follows").select("*").eq("follower_id", id);
};

