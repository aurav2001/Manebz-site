import React, { useState, useEffect, useCallback } from 'react';
import {
  UserPlus, KeyRound, Trash2, Copy, Check, ShieldCheck, Users, Loader2,
  AlertTriangle, X, Power, Clock
} from 'lucide-react';
import api from '../../api/client';

const ROLE_STYLES = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  hr: 'bg-sky-50 text-sky-700 border-sky-200',
  recruiter: 'bg-emerald-50 text-emerald-700 border-emerald-200',
};

const formatDate = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
};

/** Shown once after a password is created or reset — it cannot be read back later. */
const PasswordReveal = ({ password, forUser, onClose }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked; the password is on screen either way.
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-gray-200">
        <div className="flex items-start gap-3 mb-5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-gray-900">Password for {forUser}</h3>
            <p className="text-xs text-gray-500 mt-0.5">Share it with them directly.</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white font-mono text-base tracking-wide break-all select-all text-center">
          {password}
        </div>

        <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-start gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-px" />
          <span>This is shown only once. Copy it now — it cannot be viewed again.</span>
        </div>

        <div className="flex gap-3 mt-5">
          <button onClick={copy}
            className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider inline-flex items-center justify-center gap-2 cursor-pointer">
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copied' : 'Copy'}
          </button>
          <button onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider cursor-pointer">
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

const UsersEditor = ({ currentUser, showToast }) => {
  const [users, setUsers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);
  const [reveal, setReveal] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', role: 'recruiter' });

  // HR may only create recruiters; admin may create any role.
  const creatableRoles = currentUser?.role === 'admin' ? ['recruiter', 'hr', 'admin'] : ['recruiter'];

  const load = useCallback(async () => {
    setError('');
    try {
      const [u, r] = await Promise.allSettled([api.users.getAll(), api.users.resetRequests()]);
      if (u.status === 'fulfilled') setUsers(u.value.data || []);
      else setError(u.reason?.message || 'Could not load accounts');
      if (r.status === 'fulfilled') setRequests(r.value.data || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (creating) return;
    setCreating(true);
    setError('');
    try {
      const res = await api.users.create(form);
      setReveal({ password: res.initialPassword, user: res.data.name });
      setForm({ name: '', email: '', phone: '', role: creatableRoles[0] });
      showToast?.(`${res.data.role} account created`);
      await load();
    } catch (err) {
      setError(err.message || 'Could not create the account');
    } finally {
      setCreating(false);
    }
  };

  const handleReset = async (user) => {
    if (!window.confirm(`Generate a new password for ${user.name}? Their current one stops working immediately.`)) return;
    try {
      const res = await api.users.resetPassword(user.id);
      setReveal({ password: res.newPassword, user: user.name });
      await load();
    } catch (err) {
      showToast?.(err.message || 'Reset failed');
    }
  };

  const handleToggleActive = async (user) => {
    try {
      await api.users.update(user.id, { isActive: !user.isActive });
      showToast?.(`${user.name} ${user.isActive ? 'deactivated' : 'reactivated'}`);
      await load();
    } catch (err) {
      showToast?.(err.message || 'Update failed');
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Permanently delete ${user.name}'s account? This cannot be undone.`)) return;
    try {
      await api.users.delete(user.id);
      showToast?.('Account deleted');
      await load();
    } catch (err) {
      showToast?.(err.message || 'Delete failed');
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.users.dismissRequest(id);
      await load();
    } catch (err) {
      showToast?.(err.message || 'Could not dismiss');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reveal && (
        <PasswordReveal password={reveal.password} forUser={reveal.user} onClose={() => setReveal(null)} />
      )}

      <div>
        <h2 className="text-lg sm:text-xl font-black text-gray-900">Team Accounts</h2>
        <p className="text-xs text-gray-500 mt-0.5">
          {currentUser?.role === 'admin'
            ? 'Create and manage Admin, HR and Recruiter logins.'
            : 'Create and manage Recruiter logins.'}
        </p>
      </div>

      {/* Pending password resets */}
      {requests.length > 0 && (
        <div className="bg-amber-50 rounded-3xl border border-amber-300 overflow-hidden">
          <div className="px-6 py-4 border-b border-amber-200 flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-amber-700 shrink-0" />
            <div>
              <h3 className="text-sm font-extrabold text-amber-900">
                {requests.length} password reset request{requests.length > 1 ? 's' : ''}
              </h3>
              <p className="text-xs text-amber-800 mt-0.5">
                Generate a new password and pass it to them.
              </p>
            </div>
          </div>
          <div className="divide-y divide-amber-200">
            {requests.map((r) => (
              <div key={r.id} className="px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-amber-900 truncate">{r.name || r.email}</p>
                  <p className="text-[11px] text-amber-700 flex items-center gap-1.5 mt-0.5">
                    <Clock className="w-3 h-3 shrink-0" />
                    {formatDate(r.requestedAt)}
                    {r.status === 'emailed' && <span className="font-bold">• link emailed</span>}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleReset({ id: r.userId, name: r.name || r.email })}
                    className="px-3.5 py-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Reset password
                  </button>
                  <button onClick={() => handleDismiss(r.id)}
                    className="p-2 rounded-lg text-amber-700 hover:bg-amber-100 cursor-pointer" aria-label="Dismiss">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create account */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
            <UserPlus className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-gray-900">Create an account</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              A password is generated and shown once — they change it at first sign-in.
            </p>
          </div>
        </div>

        <form onSubmit={handleCreate} className="p-6 sm:p-8 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">Full name *</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
            </div>
            <div>
              <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">Email *</label>
              <input type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
            </div>
            <div>
              <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">Phone</label>
              <input type="text" value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
            </div>
            <div>
              <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">Role *</label>
              <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm bg-white cursor-pointer">
                {creatableRoles.map((r) => (
                  <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
            </p>
          )}

          <button type="submit" disabled={creating}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md cursor-pointer">
            {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
            Create account
          </button>
        </form>
      </div>

      {/* Existing accounts */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-base font-extrabold text-gray-900">Accounts ({users.length})</h3>
        </div>

        {users.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No accounts yet. Create the first one above.
          </p>
        ) : (
          <div className="divide-y divide-gray-100">
            {users.map((u) => (
              <div key={u.id} className="px-6 sm:px-8 py-4 flex items-center justify-between gap-4 flex-wrap">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <p className="text-sm font-extrabold text-gray-900 truncate">{u.name}</p>
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${ROLE_STYLES[u.role] || ''}`}>
                      {u.role}
                    </span>
                    {!u.isActive && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                        Deactivated
                      </span>
                    )}
                    {u.mustChangePassword && (
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
                        Must change password
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{u.email}{u.phone ? ` • ${u.phone}` : ''}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    Last sign-in: {formatDate(u.lastLoginAt)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => handleReset(u)} title="Reset password"
                    className="p-2.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 cursor-pointer">
                    <KeyRound className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleToggleActive(u)} title={u.isActive ? 'Deactivate' : 'Reactivate'}
                    className="p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 cursor-pointer">
                    <Power className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(u)} title="Delete account"
                    className="p-2.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-gray-500 flex items-start gap-2 px-1 pb-4">
        <ShieldCheck className="w-3.5 h-3.5 shrink-0 mt-px text-gray-400" />
        <span>
          Passwords are stored as one-way hashes — nobody, including you, can read an
          existing password. Resetting generates a new one instead.
        </span>
      </p>
    </div>
  );
};

export default UsersEditor;
