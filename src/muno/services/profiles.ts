import { supabase } from '@/integrations/supabase/client';

export async function loadMemberProfile(userId: string) {
  const { data, error } = await supabase.from('profiles').select('display_name, avatar_url').eq('id', userId).single();
  if (error) throw error;
  return data;
}

export async function saveMemberProfile(userId: string, displayName: string, avatarUrl: string) {
  const { data, error } = await supabase.from('profiles').update({ display_name: displayName, avatar_url: avatarUrl }).eq('id', userId).select('display_name, avatar_url').single();
  if (error) throw error;
  return data;
}