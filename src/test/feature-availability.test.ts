import { describe, expect, it } from 'vitest';
import { MEMBERSHIP_ENFORCEMENT_ENABLED, PAYMENTS_ENABLED } from '@/lib/featureAvailability';
describe('Deferred membership rollout', () => {
  it('leaves the 20-minute restriction inactive', () => expect(MEMBERSHIP_ENFORCEMENT_ENABLED).toBe(false));
  it('leaves payments inactive', () => expect(PAYMENTS_ENABLED).toBe(false));
});