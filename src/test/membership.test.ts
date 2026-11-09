import { describe, it, expect } from 'vitest';
import { FREE_DAILY_SECONDS, PLANS, canWatch, canDownload, type AccessStatus } from '@/lib/membership';
const free: AccessStatus = { subscribed: false, subscribed_until: null, seconds_remaining: 1200, seconds_used: 0, is_admin: false };
describe('Muno membership rules', () => {
  it('provides 20 minutes per day', () => expect(FREE_DAILY_SECONDS).toBe(20 * 60));
  it('requires subscription after the allowance', () => expect(canWatch({ ...free, seconds_remaining: 0 })).toBe(false));
  it('allows free watching before exhaustion', () => expect(canWatch({ ...free, seconds_remaining: 1 })).toBe(true));
  it('disallows free downloads even for an admin', () => expect(canDownload({ ...free, is_admin: true })).toBe(false));
  it('allows paid downloads', () => expect(canDownload({ ...free, subscribed: true })).toBe(true));
  it('daily pass costs UGX 2500 for 24 hours', () => expect(PLANS.daily).toMatchObject({ amount: 2500, hours: 24 }));
  it('weekly pass costs UGX 7500 for 7 days', () => expect(PLANS.weekly).toMatchObject({ amount: 7500, hours: 168 }));
  it('monthly pass costs UGX 15500 for 30 days', () => expect(PLANS.monthly).toMatchObject({ amount: 15500, hours: 720 }));
});