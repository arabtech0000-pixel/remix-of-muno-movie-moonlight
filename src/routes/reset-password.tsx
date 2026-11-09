import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { authErrorMessage } from '@/lib/authErrors';

export const Route = createFileRoute('/reset-password')({
  head: () => ({ meta: [
    { title: 'Reset password — MunoMovies' },
    { name: 'description', content: 'Set a new password for your MunoMovies account.' },
    { property: 'og:title', content: 'Reset password — MunoMovies' },
    { property: 'og:description', content: 'Set a new password for your MunoMovies account.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: ResetPassword,
});

function ResetPassword() {
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('Open the reset link from your email.');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const recoveryLink = new URLSearchParams(window.location.hash.slice(1)).get('type') === 'recovery';
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY' || (recoveryLink && session)) {
        setReady(true); setMessage('');
      }
    });
    if (recoveryLink) void supabase.auth.getUser().then(({ data }) => {
      if (data.user) { setReady(true); setMessage(''); }
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return <main className="muno-account-theme min-h-dvh bg-background text-foreground flex items-center justify-center px-6">
    <div className="w-full max-w-sm space-y-5">
      <h1 className="text-2xl font-bold">Reset your password</h1>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      {ready && !done && <form className="space-y-4" onSubmit={async event => {
        event.preventDefault(); setBusy(true);
        const { error } = await supabase.auth.updateUser({ password });
        setBusy(false);
        if (error) setMessage(authErrorMessage(error));
        else { setDone(true); setMessage('Your password has been updated.'); }
      }}>
        <input aria-label="New password" type="password" autoComplete="new-password" required minLength={6} value={password} onChange={event => setPassword(event.target.value)} className="h-11 w-full rounded-md border border-border bg-input px-3 text-foreground" />
        <Button className="w-full" disabled={busy} type="submit">{busy ? 'Please wait…' : 'Save new password'}</Button>
      </form>}
      <Button variant="link" asChild><a href="/">Back to MunoMovies</a></Button>
    </div>
  </main>;
}