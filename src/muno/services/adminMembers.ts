import { supabase } from '@/integrations/supabase/client';

export async function fetchAdminMembers() {
  const { data, error } = await supabase.rpc('admin_member_activity');
  if (error) throw new Error(error.code === 'P0001' ? 'Admin access required. Sign in with the admin account.' : 'Could not load members. Check your connection and try Refresh.');
  return (data || []).map(member => ({
    uid: member.id,
    displayName: member.email,
    email: member.email,
    role: member.is_admin ? 'admin' : 'user',
    status: member.status,
    createdAt: member.created_at,
    lastLogin: member.last_sign_in_at ? Date.parse(member.last_sign_in_at) : 0,
    plan: member.subscribed_until ? 'Subscribed' : 'Free',
    amountPaid: member.total_paid,
  }));
}