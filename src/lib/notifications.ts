import { supabase } from "@/src/lib/supabase";

export const getNotifications = (recipientId: string, limit = 20, offset = 0) => {
  return supabase.from("notifications").select("*").eq("recipient_id", recipientId).order("created_at", {ascending: false}).range(offset, offset + limit - 1)
};

export const markRead = (notificationId: string) => {
  return supabase.from("notifications").update({read_at: new Date().toISOString()}).eq("id", notificationId)
};

export const markAllRead = (recipientId: string) => {
  return supabase.from("notifications").update({read_at: new Date().toISOString()}).eq("recipient_id", recipientId)
};