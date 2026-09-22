import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, AlertTriangle, Send, RefreshCw, KeyRound } from 'lucide-react';
import api from '../../api/client';

/**
 * Shows whether the backend can send email (SMTP via nodemailer) and lets the admin
 * fire a real test message. Credentials live in backend/.env, never in the browser —
 * this card only reads a masked status and triggers sends.
 */
const EmailDeliveryCard = ({ showToast }) => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(null); // 'verify' | 'send'
  const [result, setResult] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.settings.mailStatus();
      setStatus(res.data);
    } catch (err) {
      setStatus(null);
      setResult({ ok: false, message: err.message || 'Could not read mail status' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const run = async (verifyOnly) => {
    setBusy(verifyOnly ? 'verify' : 'send');
    setResult(null);
    try {
      const res = await api.settings.testEmail(to.trim() || undefined, verifyOnly);
      setResult({ ok: true, message: res.message });
      showToast?.(res.message);
    } catch (err) {
      setResult({ ok: false, message: err.message || 'Failed' });
    } finally {
      setBusy(null);
    }
  };

  const configured = Boolean(status?.smtpConfigured);

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
        <h4 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <Mail className="w-4 h-4 text-slate-500" /> Email Delivery (SMTP)
        </h4>
        <button
          type="button"
          onClick={load}
          className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {loading && !status ? (
        <p className="text-sm text-gray-500 font-medium">Checking mail configuration…</p>
      ) : configured ? (
        <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-emerald-900">SMTP configured</p>
            <p className="text-emerald-800 mt-0.5">
              Sending as <span className="font-mono">{status.user}</span> via{' '}
              <span className="font-mono">{status.host}:{status.port}</span>
              {status.secure ? ' (SSL)' : ' (STARTTLS)'} · notifications go to{' '}
              <span className="font-mono">{status.notifyTo}</span>
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-bold text-amber-900">SMTP not configured — emails are not being sent</p>
            <p className="text-amber-800 mt-0.5">
              Add <span className="font-mono">SMTP_USER</span> and <span className="font-mono">SMTP_PASS</span>{' '}
              (plus <span className="font-mono">SMTP_HOST</span> / <span className="font-mono">SMTP_PORT</span> if not Gmail)
              to <span className="font-mono">backend/.env</span>, restart the app, then test here.
              {status?.fallback && <> Until then, <span className="font-mono">{status.fallback}</span> is used as a fallback.</>}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 items-end">
        <div>
          <label className="block text-xs font-bold text-gray-700 uppercase mb-1.5">Send test to (optional)</label>
          <input
            type="email"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            placeholder={status?.notifyTo || 'you@manebz.com'}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 text-sm font-semibold focus:border-red-500 focus:outline-none"
          />
        </div>
        <button
          type="button"
          disabled={!configured || busy !== null}
          onClick={() => run(true)}
          className="px-5 py-3 rounded-xl border border-gray-300 text-xs font-bold uppercase tracking-wider text-slate-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          <KeyRound className="w-4 h-4" /> {busy === 'verify' ? 'Checking…' : 'Check login'}
        </button>
        <button
          type="button"
          disabled={!configured || busy !== null}
          onClick={() => run(false)}
          className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" /> {busy === 'send' ? 'Sending…' : 'Send test email'}
        </button>
      </div>

      {result && (
        <p className={`text-sm font-semibold ${result.ok ? 'text-emerald-700' : 'text-red-700'}`}>
          {result.ok ? '✓ ' : '✗ '}{result.message}
        </p>
      )}

      <p className="text-xs text-gray-500">
        Used for: new inquiries, job applications, hiring requests and password-reset links.
        Form submissions are saved even when email fails.
      </p>
    </div>
  );
};

export default EmailDeliveryCard;
