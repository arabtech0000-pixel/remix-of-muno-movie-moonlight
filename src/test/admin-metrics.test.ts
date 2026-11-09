import { describe, expect, it } from 'vitest';
import { adminMetrics } from '@/lib/adminMetrics';

describe('real admin counts', () => {
  it('starts every total at zero when no real records exist', () => {
    expect(adminMetrics([], [], 0)).toEqual({ total: 0, active: 0, disabled: 0, catalog: 0, revenue: 0, weekly: 0 });
  });
  it('counts actual members and only verified revenue, without invented offsets', () => {
    const now = Date.parse('2026-10-25T00:00:00Z');
    expect(adminMetrics([{ status: 'active' }, { status: 'disabled' }], [
      { status: 'verified', amount_ugx: 2500, verified_at: '2026-10-24T00:00:00Z' },
      { status: 'pending', amount_ugx: 7500, verified_at: null },
    ], 134, now)).toEqual({ total: 2, active: 1, disabled: 1, catalog: 134, revenue: 2500, weekly: 2500 });
  });
});