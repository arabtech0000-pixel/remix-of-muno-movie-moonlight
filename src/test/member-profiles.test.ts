import { beforeEach, describe, expect, it, vi } from 'vitest';
const mocks = vi.hoisted(() => ({ from: vi.fn(), select: vi.fn(), update: vi.fn(), eq: vi.fn(), single: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: { from: mocks.from } }));
import { loadMemberProfile, saveMemberProfile } from '@/muno/services/profiles';
beforeEach(() => {
  vi.clearAllMocks();
  const chain = { select: mocks.select, update: mocks.update, eq: mocks.eq, single: mocks.single };
  mocks.from.mockReturnValue(chain); mocks.select.mockReturnValue(chain); mocks.update.mockReturnValue(chain); mocks.eq.mockReturnValue(chain);
  mocks.single.mockResolvedValue({ data: { display_name: 'Member', avatar_url: '' }, error: null });
});
describe('Cloud member profiles', () => {
  it('reads the signed-in member profile by their ID', async () => {
    await loadMemberProfile('member-id');
    expect(mocks.from).toHaveBeenCalledWith('profiles');
    expect(mocks.eq).toHaveBeenCalledWith('id', 'member-id');
  });
  it('saves names and avatars without writing roles', async () => {
    await saveMemberProfile('member-id', 'Ashraf', '/avatar.png');
    expect(mocks.update).toHaveBeenCalledWith({ display_name: 'Ashraf', avatar_url: '/avatar.png' });
    expect(mocks.eq).toHaveBeenCalledWith('id', 'member-id');
  });
});