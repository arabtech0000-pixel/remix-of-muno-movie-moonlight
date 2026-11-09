export function seekTime(current: number, delta: number, duration: number): number {
  return Math.max(0, Math.min(Number.isFinite(duration) && duration > 0 ? duration : current, current + delta));
}

export function formatPlayerTime(seconds: number): string {
  const time = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const secs = String(time % 60).padStart(2, '0');
  return hours ? `${hours}:${String(minutes).padStart(2, '0')}:${secs}` : `${String(minutes).padStart(2, '0')}:${secs}`;
}