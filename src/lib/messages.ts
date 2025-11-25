import { supabase } from "@/src/lib/supabase";

export const getConversationForUser = (profileId: string) => {
  return supabase.from("conversations").select("*, conversation_participants!inner(profile_id)").eq("conversation_participants.profile_id", profileId).order("created_at", {ascending: false})
};

export const getMessages = (conversationId: string, limit = 50, offset = 0) => {
  return supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", {ascending: false}).range(offset, offset + limit - 1)
};

export const startConversation = (participantsIds: string[]) => {
  return supabase.rpc("start_conversation", {participants_ids: participantsIds})
};

export const sendMessage = (payload: {
  conversation_id: string;
  sender_id: string;
  content: string;
}) => {
  return supabase.from("messages").insert(payload).select().single()
};