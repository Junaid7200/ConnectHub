import { supabase } from "@/src/lib/supabase";

export const getListByOwner = (ownerId: string) => {
  return supabase.from("lists").select("*").eq("owner_id", ownerId).order("created_at", { ascending: false })
};

export const getSubscribedLists = (profileId: string) => {
  return supabase.from("list_subscribers").select("*, lists(*").eq("profile_id", profileId).order("created_at", { ascending: false })
};

export const getMemberLists = (profileId: string) => {
  return supabase.from("list_members").select("*, lists(*)").eq("profile_id", profileId).order("created_at", { ascending: false })
};

export const createList = (payload: {
  owner_id: string;
  name: string;
  description?: string | null;
  is_private?: boolean;
  cover_image_url?: string | null;
}) => {
  return supabase.from("lists").insert(payload).select().single()
};

export const updateList = (
  listId: string,
  payload: Partial<{
    name: string;
    description: string | null;
    is_private: boolean;
    cover_image_url: string | null;
  }>
) => {
  return supabase.from("lists").update(payload).eq("id", listId).select()
};

export const deleteList = (listId: string) =>
  supabase.from('lists').delete().eq('id', listId);

export const addMember = (listId: string, profileId: string) =>
  supabase.from('list_members').insert({ list_id: listId, profile_id: profileId });

export const removeMember = (listId: string, profileId: string) =>
  supabase.from('list_members').delete().eq('list_id', listId).eq('profile_id', profileId);

export const subscribe = (listId: string, profileId: string) =>
  supabase.from('list_subscribers').insert({ list_id: listId, profile_id: profileId });

export const unsubscribe = (listId: string, profileId: string) =>
  supabase.from('list_subscribers').delete().eq('list_id', listId).eq('profile_id', profileId);