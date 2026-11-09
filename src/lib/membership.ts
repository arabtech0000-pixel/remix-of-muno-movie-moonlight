export const FREE_DAILY_SECONDS = 1200;
export const PLANS = {
  daily: { name: 'Daily VIP Pass', amount: 2500, hours: 24 },
  weekly: { name: 'Weekly VIP Pass', amount: 7500, hours: 168 },
  monthly: { name: 'Monthly VIP Pass', amount: 15500, hours: 720 },
} as const;
export type Plan = keyof typeof PLANS;
export interface AccessStatus {
  subscribed: boolean;
  subscribed_until: string | null;
  seconds_remaining: number;
  seconds_used: number;
  is_admin: boolean;
}
export function canWatch(access: AccessStatus) { return access.subscribed || access.seconds_remaining > 0; }
export function canDownload(access: AccessStatus) { return access.subscribed; }