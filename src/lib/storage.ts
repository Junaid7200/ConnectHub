import { TweetMediaInput, UploadResult } from '@/src/types/types';
import { supabase } from './supabase';




export async function getPublicUrl(path: string): Promise<string | null> {
  const { data } = supabase.storage.from('media').getPublicUrl(path);
  return data?.publicUrl ?? null;
}

export async function uploadProfileAvatar(profileId: string, file: Blob): Promise<UploadResult> {
  const ext = file.type?.split('/')[1] || 'jpg';
  const path = `profiles/${profileId}/avatar.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
  if (error) throw error;
  return { path, publicUrl: await getPublicUrl(path) };
}

export async function uploadProfileBanner(profileId: string, file: Blob): Promise<UploadResult> {
  const ext = file.type?.split('/')[1] || 'jpg';
  const path = `profiles/${profileId}/banner.${ext}`;
  const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
  if (error) throw error;
  return { path, publicUrl: await getPublicUrl(path) };
}


export async function uploadTweetMedia(
  tweetId: string,
  media: TweetMediaInput[]
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];
  for (let i = 0; i < media.length; i++) {
    const { file, position = i } = media[i];
    const ext = file.type?.split('/')[1] || (media[i].mediaType === 'video' ? 'mp4' : 'jpg');
    const path = `tweets/${tweetId}/media-${position}.${ext}`;
    const { error } = await supabase.storage.from('media').upload(path, file, { upsert: true });
    if (error) throw error;
    results.push({ path, publicUrl: await getPublicUrl(path) });
  }
  return results;
}


