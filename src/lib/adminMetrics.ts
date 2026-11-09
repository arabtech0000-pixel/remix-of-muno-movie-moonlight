export function adminMetrics(users: { status: string }[], payments: { status: string; amount_ugx: number; verified_at: string | null }[], catalogCount: number, now = Date.now()) {
  const verified = payments.filter(p => p.status === 'verified');
  return {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    disabled: users.filter(u => u.status === 'disabled').length,
    catalog: catalogCount,
    revenue: verified.reduce((sum, p) => sum + p.amount_ugx, 0),
    weekly: verified.filter(p => p.verified_at && Date.parse(p.verified_at) >= now - 7 * 86400000).reduce((sum, p) => sum + p.amount_ugx, 0),
  };
}