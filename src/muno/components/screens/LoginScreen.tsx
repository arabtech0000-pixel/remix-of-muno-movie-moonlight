import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import munoLogo from '../../assets/munno_movies_logo.png';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { authErrorMessage } from '@/lib/authErrors';

interface LoginScreenProps {
  onBack?: () => void;
  onLoginSuccess: (isAdmin?: boolean, userName?: string, email?: string) => void;
  onShowToast?: (msg: string) => void;
  isFirstLaunch?: boolean;
}

// Email/password sign-in only, with no email confirmation step.
export const LoginScreen: React.FC<LoginScreenProps> = ({ onBack, isFirstLaunch = false }) => {
  const [mode, setMode] = useState<'register' | 'login' | 'forgot'>('register');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); setStatusMessage(null);
    try {
      if (mode === 'register') {
        const { data, error } = await supabase.auth.signUp({ email: email.trim(), password, options: { emailRedirectTo: window.location.origin } });
        if (error) throw error;
        if (!data.session) setStatusMessage('Check your email to confirm your account, or sign in if you already have one.');
      } else if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
        if (error) throw error;
        setStatusMessage('Check your email for a reset link.');
      }
    } catch (err) { setStatusMessage(authErrorMessage(err)); }
    finally { setIsLoading(false); }
  };

  const input = 'w-full h-11 px-3.5 bg-input border border-border text-foreground placeholder:text-muted-foreground rounded-md text-xs focus:outline-none focus:border-primary';

  return (
    <div className="muno-account-theme relative min-h-full w-full bg-background text-foreground flex flex-col justify-between overflow-hidden select-none">

      <div className="relative z-10 px-6 pt-6 flex items-center justify-between">
        {onBack && !isFirstLaunch ? (
          <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
            <ArrowLeft className="w-6 h-6 stroke-[2.2]" />
          </Button>
        ) : (
          <div className="w-6" />
        )}
      </div>

      <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-4 flex flex-col items-center my-auto">
        <img src={munoLogo} alt="Muno Movies" className="w-28 h-28 rounded-lg object-cover mb-4" />
        <div className="mb-2 text-4xl font-black">
          <span>Muno</span><span className="text-primary">Movies</span>
        </div>
        <p className="text-sm text-muted-foreground mb-6 text-center">{mode === 'register' ? 'Create your account' : mode === 'login' ? 'Sign in to start watching' : 'Reset your password'}</p>

        {statusMessage && (
          <div role="status" className="w-full mb-4 p-2.5 bg-secondary border border-border rounded-md text-xs text-center">
            {statusMessage}
          </div>
        )}

        <form onSubmit={submit} className="w-full space-y-3">
          <input aria-label="Email address" autoComplete="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email address" className={input} />
          {mode !== 'forgot' && <input aria-label="Password" autoComplete={mode === 'register' ? 'new-password' : 'current-password'} type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className={input} />}
          <Button type="submit" disabled={isLoading} className="w-full h-11 font-bold text-xs">
            {isLoading ? 'Please wait…' : mode === 'register' ? 'Create Account' : mode === 'login' ? 'Sign In' : 'Send Reset Link'}
          </Button>
        </form>

        <div className="mt-4 flex flex-col items-center gap-2 text-xs text-muted-foreground">
          {mode === 'register' && <Button variant="link" type="button" onClick={() => { setMode('login'); setStatusMessage(null); }}>Already have an account? Sign In</Button>}
          {mode === 'login' && <>
            <Button variant="link" type="button" onClick={() => { setMode('register'); setStatusMessage(null); }}>New here? Create Account</Button>
            <Button variant="link" type="button" onClick={() => { setMode('forgot'); setStatusMessage(null); }}>Forgot password?</Button>
          </>}
          {mode === 'forgot' && <Button variant="link" type="button" onClick={() => { setMode('login'); setStatusMessage(null); }}>Back to Sign In</Button>}
        </div>
      </div>

      <div className="relative z-10 pb-6" />
    </div>
  );
};
