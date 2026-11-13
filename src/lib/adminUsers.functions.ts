import { createServerFn } from '@tanstack/react-start';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { z } from 'zod';

export const listAdminUsers = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || !allowed) throw new Error('Admin access required');
    const { data: members, error: membersError } = await context.supabase.rpc('admin_member_list');
    if (membersError) throw new Error('Could not load members');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    const lastSignIns = new Map<string, number>();
    for (let page = 1; ; page++) {
      const { data, error: authError } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 1000 });
      if (authError) throw new Error('Could not load account activity');
      for (const user of data.users) lastSignIns.set(user.id, user.last_sign_in_at ? Date.parse(user.last_sign_in_at) : 0);
      if (data.users.length < 1000) break;
    }
    return members.map(member => ({
      uid: member.id, displayName: member.email, email: member.email,
      role: member.is_admin ? 'admin' : 'user', status: member.status,
      createdAt: member.created_at, lastLogin: lastSignIns.get(member.id) || 0,
      plan: member.subscribed_until ? 'Subscribed' : 'Free', amountPaid: member.total_paid,
    }));
  });

export const changeAdminUser = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .validator(z.object({ userId: z.string().uuid(), action: z.enum(['enable', 'disable', 'delete']) }))
  .handler(async ({ context, data }) => {
    const { data: allowed, error } = await context.supabase.rpc('has_role', { _user_id: context.userId, _role: 'admin' });
    if (error || !allowed) throw new Error('Admin access required');
    const { data: targetAdmin, error: targetError } = await context.supabase.rpc('has_role', { _user_id: data.userId, _role: 'admin' });
    if (targetError || targetAdmin || data.userId === context.userId) throw new Error('Admin accounts cannot be changed here');
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server');
    if (data.action === 'delete') {
      const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
      if (deleteError) throw new Error('Could not delete account');
    } else {
      const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, { ban_duration: data.action === 'disable' ? '876000h' : 'none' });
      if (banError) throw new Error('Could not change account access');
      const { error: statusError } = await context.supabase.rpc('admin_set_member_status', { _user_id: data.userId, _status: data.action === 'disable' ? 'disabled' : 'active' });
      if (statusError) throw new Error('Could not update member status');
    }
    return { success: true };
  });
