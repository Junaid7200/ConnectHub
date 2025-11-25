import { supabase } from "@/src/lib/supabase";

export const getConversationsForUser = (profileId: string) => {
  return supabase.from("conversations").select("*, conversation_participants!inner(profile_id)").eq("conversation_participants.profile_id", profileId).order("created_at", {ascending: false})
};

export const getMessages = (conversationId: string, limit = 50, offset = 0) => {
  return supabase.from("messages").select("*").eq("conversation_id", conversationId).order("created_at", {ascending: false}).range(offset, offset + limit - 1)
};

export const startConversationTwoStep = async (participantIds: string[]) => {
  const { data: convo, error: convoError } = await supabase
    .from('conversations')
    .insert({})
    .select()
    .single();
  if (convoError) throw convoError;

  const rows = participantIds.map((pid) => ({ conversation_id: convo.id, profile_id: pid }));
  const { error: partError } = await supabase.from('conversation_participants').insert(rows);
  if (partError) {
    await supabase.from('conversations').delete().eq('id', convo.id); // cleanup
    throw partError;
  }
  return convo;
};



export const sendMessage = (payload: {
  conversation_id: string;
  sender_id: string;
  content: string;
}) => {
  return supabase.from("messages").insert(payload).select().single()
};