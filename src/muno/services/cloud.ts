import { supabase } from '@/integrations/supabase/client';
import type { AccessStatus } from '@/lib/membership';

export async function getAccess(): Promise<AccessStatus> {
  const { data, error } = await supabase.rpc('get_access_status');
  if (error) throw error;
  return data as unknown as AccessStatus;
}
export async function recordWatch(seconds: number): Promise<AccessStatus> {
  const { data, error } = await supabase.rpc('record_watch_seconds', { _seconds: seconds });
  if (error) throw error;
  return data as unknown as AccessStatus;
}