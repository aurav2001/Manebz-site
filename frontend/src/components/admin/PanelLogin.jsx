import React, { useState } from 'react';
import { Unlock, Eye, EyeOff, X, Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import logoImg from '../../assets/logo.jpg';
import api from '../../api/client';

/**
 * Sign-in for all three panel roles.
 *
 * The server decides who you are — this screen only collects credentials and shows what
 * came back. "Forgot password" never reveals whether an email has an account.
 */
const PanelLogin = ({ onSignedIn, onNavigate, initialError = '' }) => {
  const [mode, setMode] = useState('login'); // 'login' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(initialError);
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);

  const submitLogin = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.auth.login(email.trim(), password);
      onSignedIn(res.user);
    } catch (err) {
      setError(err.message || 'Sign in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitForgot = async (e) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      const res = await api.auth.forgot(email.trim());
      setNotice(res.message);
    } catch (err) {
      setError(err.message || 'Could not start the reset. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060d1a] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="bg-white/[0.07] border border-white/15 rounded-3xl p-7 sm:p-9 backdrop-blur-xl shadow-2xl">

          <div className="text-center space-y-3 mb-7">
            <div className="bg-white p-2 rounded-2xl inline-block shadow-lg">
              <img src={logoImg} alt="MANEBZ" className="h-10 w-auto object-contain rounded-lg" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-sky-400 bg-sky-950/60 border border-sky-500/30 px-2.5 py-1 rounded-md">
                MANEBZ Panel
              </span>
            </div>
            <h1 className="text-2xl font-black text-white">
              {mode === 'login' ? 'Sign in' : 'Reset your password'}
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              {mode === 'login'
                ? 'Admin, HR and Recruiter accounts sign in here.'
                : 'Enter the email on your account and we will start a reset.'}
            </p>
          </div>

          {notice ? (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-px" />
                <span className="leading-relaxed">{notice}</span>
              </div>
              <button
                type="button"
                onClick={() => { setNotice(''); setMode('login'); setPassword(''); }}
                className="w-full py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-xs uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>
            </div>
          ) : (
            <form onSubmit={mode === 'login' ? submitLogin : submitForgot} className="space-y-4 text-left">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    autoFocus
                    placeholder="you@manebz.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/10 border border-white/25 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all font-semibold"
                  />
                </div>
              </div>

              {mode === 'login' && (
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); if (error) setError(''); }}
                      className="w-full px-4 py-3.5 pr-12 rounded-xl bg-white/10 border border-white/25 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 focus:bg-white/15 transition-all font-semibold"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors cursor-pointer"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-3 rounded-xl bg-red-950/80 border border-red-500/60 text-red-300 text-xs font-semibold flex items-start gap-2">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-px" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-sky-600 hover:from-red-500 hover:to-sky-500 disabled:opacity-60 disabled:cursor-not-allowed font-extrabold text-xs uppercase tracking-wider text-white rounded-xl transition-all shadow-lg shadow-red-500/25 active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Unlock className="w-4 h-4" />}
                <span>
                  {busy
                    ? (mode === 'login' ? 'Signing in…' : 'Sending…')
                    : (mode === 'login' ? 'Sign in' : 'Start password reset')}
                </span>
              </button>

              <div className="flex items-center justify-between pt-1 text-xs">
                <button
                  type="button"
                  onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setError(''); }}
                  className="font-semibold text-sky-400 hover:text-sky-300 transition-colors cursor-pointer"
                >
                  {mode === 'login' ? 'Forgot password?' : 'Back to sign in'}
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="font-semibold text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
                >
                  ← Public website
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default PanelLogin;
