export function authErrorMessage(error: unknown): string {
  const message = error instanceof Error ? error.message : String((error as { message?: string })?.message || '');
  if (/invalid login credentials/i.test(message)) return 'Wrong email or password.';
  if (/already registered/i.test(message)) return 'That email already has an account. Sign in instead.';
  if (/password/i.test(message)) return 'Use a stronger password with at least 6 characters.';
  if (/rate limit|too many/i.test(message)) return 'Too many attempts. Please wait a moment and try again.';
  if (/email not confirmed/i.test(message)) return 'Please confirm your email before signing in.';
  if (/fetch|network/i.test(message)) return 'Connection failed. Check your internet and try again.';
  return 'Sign-in could not finish. Please try again.';
}