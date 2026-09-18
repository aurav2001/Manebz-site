import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Briefcase, Users, Clock, MapPin, Phone, IndianRupee, Loader2, Trash2, X,
  AlertTriangle, Plus, Globe, UserCog, Zap, Search, CheckCircle2, Calendar
} from 'lucide-react';
import api from '../../api/client';

const STATUSES = ['New', 'Assigned', 'In Progress', 'Fulfilled', 'Closed'];

const STATUS_STYLES = {
  'New': 'bg-red-50 text-red-700 border-red-200',
  'Assigned': 'bg-amber-50 text-amber-700 border-amber-200',
  'In Progress': 'bg-sky-50 text-sky-700 border-sky-200',
  'Fulfilled': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Closed': 'bg-gray-100 text-gray-600 border-gray-200',
};

const URGENCY_STYLES = {
  Immediate: 'bg-red-600 text-white',
  Urgent: 'bg-amber-500 text-white',
  Standard: 'bg-slate-200 text-slate-700',
};

const BLANK = {
  companyName: '', contactPerson: '', phone: '', email: '',
  roleTitle: '', headcount: 1, location: '', experience: '',
  salaryRange: '', startDate: '', urgency: 'Standard', notes: '',
};

const formatWhen = (v) => {
  if (!v) return '—';
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? '—' : d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Field = ({ label, children, required }) => (
  <div>
    <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
      {label}{required ? ' *' : ''}
    </label>
    {children}
  </div>
);

const input = 'w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm';

/**
 * The queue of staffing requirements from client companies.
 *
 * Progress is counted from the placements recruiters log against each request, so the
 * "filled of headcount" bar cannot drift out of step with reality.
 */
const HiringRequests = ({ currentUser, showToast }) => {
  const [requests, setRequests] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(BLANK);

  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'hr';

  const load = useCallback(async () => {
    try {
      const [req, st, users] = await Promise.allSettled([
        api.hiringRequests.getAll(),
        isManager ? api.hiringRequests.stats() : Promise.resolve(null),
        isManager ? api.users.getAll() : Promise.resolve(null),
      ]);
      if (req.status === 'fulfilled') setRequests(req.value.data || []);
      else setError(req.reason?.message || 'Could not load requirements');
      if (st.status === 'fulfilled' && st.value) setStats(st.value.data);
      if (users.status === 'fulfilled' && users.value) {
        setRecruiters((users.value.data || []).filter((u) => u.role === 'recruiter' && u.isActive));
      }
    } finally {
      setLoading(false);
    }
  }, [isManager]);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await api.hiringRequests.create({ ...form, headcount: Number(form.headcount) || 1 });
      showToast?.('Requirement added');
      setModalOpen(false);
      setForm(BLANK);
      await load();
    } catch (err) {
      setError(err.message || 'Could not save the requirement');
    } finally {
      setSaving(false);
    }
  };

  const patch = async (id, changes) => {
    try {
      await api.hiringRequests.update(id, changes);
      await load();
    } catch (err) {
      showToast?.(err.message || 'Update failed');
    }
  };

  const remove = async (r) => {
    if (!window.confirm(`Delete the requirement for ${r.headcount} × ${r.roleTitle} at ${r.companyName}?`)) return;
    try {
      await api.hiringRequests.delete(r.id);
      showToast?.('Requirement deleted');
      await load();
    } catch (err) {
      showToast?.(err.message || 'Delete failed');
    }
  };

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase();
    return requests.filter((r) => {
      if (statusFilter === 'open' && ['Fulfilled', 'Closed'].includes(r.status)) return false;
      if (statusFilter !== 'open' && statusFilter !== 'all' && r.status !== statusFilter) return false;
      if (!q) return true;
      return [r.companyName, r.roleTitle, r.location, r.contactPerson, r.phone, r.assignedToName]
        .some((v) => String(v || '').toLowerCase().includes(q));
    });
  }, [requests, search, statusFilter]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-gray-900">Hiring Requests</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isManager
              ? 'Staffing requirements from client companies — from the website form or added here.'
              : 'Requirements assigned to you.'}
          </p>
        </div>
        {isManager && (
          <button onClick={() => { setForm(BLANK); setError(''); setModalOpen(true); }}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md cursor-pointer shrink-0">
            <Plus className="w-4 h-4" /> Add requirement
          </button>
        )}
      </div>

      {isManager && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Open requests', value: stats.open, icon: Briefcase, tint: 'text-sky-600 bg-sky-50' },
            { label: 'Not assigned', value: stats.unassigned, icon: AlertTriangle, tint: 'text-red-600 bg-red-50' },
            { label: 'Positions open', value: stats.positions, icon: Users, tint: 'text-amber-600 bg-amber-50' },
            { label: 'Filled so far', value: stats.filled, icon: CheckCircle2, tint: 'text-emerald-600 bg-emerald-50' },
          ].map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className="bg-white p-4 sm:p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3.5">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-gray-900 leading-none">{value}</p>
                <p className="text-[10px] font-bold uppercase tracking-wide text-gray-500 mt-1 truncate">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by company, role, location, recruiter…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm bg-white cursor-pointer shrink-0">
          <option value="open">Open only</option>
          <option value="all">All</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {visible.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Briefcase className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-700">
            {search || statusFilter !== 'open' ? 'Nothing matches that filter' : 'No open requirements'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Requirements posted from the website appear here automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {visible.map((r) => {
            const pct = Math.min(100, Math.round((r.filled / Math.max(1, r.headcount)) * 100));
            return (
              <div key={r.id} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${URGENCY_STYLES[r.urgency] || URGENCY_STYLES.Standard}`}>
                        {r.urgency}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${STATUS_STYLES[r.status]}`}>
                        {r.status}
                      </span>
                      <span className="text-[10px] font-bold uppercase text-gray-400 inline-flex items-center gap-1">
                        {r.source === 'website' ? <Globe className="w-3 h-3" /> : <UserCog className="w-3 h-3" />}
                        {r.source === 'website' ? 'Website' : 'Added in panel'}
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-gray-900">
                      {r.headcount} × {r.roleTitle}
                    </h3>
                    <p className="text-sm font-bold text-sky-700 mt-0.5 flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />{r.companyName}
                    </p>
                  </div>

                  {isManager && (
                    <button onClick={() => remove(r)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer shrink-0" aria-label="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Filled from the placements logged against this request */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                    <span className="text-gray-700">{r.filled} of {r.headcount} filled</span>
                    <span className="text-gray-400">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-sky-500 to-blue-600'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs text-gray-600 mb-4">
                  {r.location && <span className="flex items-center gap-1.5 truncate"><MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{r.location}</span>}
                  {r.salaryRange && <span className="flex items-center gap-1.5 truncate"><IndianRupee className="w-3.5 h-3.5 text-amber-600 shrink-0" />{r.salaryRange}</span>}
                  {r.experience && <span className="truncate">Exp: {r.experience}</span>}
                  {r.startDate && <span className="flex items-center gap-1.5 truncate"><Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />{r.startDate}</span>}
                </div>

                {r.notes && <p className="text-xs text-gray-600 bg-slate-50 rounded-xl p-3 mb-4 leading-relaxed">{r.notes}</p>}

                <div className="pt-4 border-t border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                  <div className="text-[11px] text-gray-500 min-w-0">
                    <p className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3 h-3 shrink-0" />
                      {r.contactPerson ? `${r.contactPerson} • ` : ''}{r.phone}
                    </p>
                    <p className="flex items-center gap-1.5 mt-0.5 truncate">
                      <Clock className="w-3 h-3 shrink-0" />{formatWhen(r.createdAt)}
                    </p>
                  </div>

                  {isManager && (
                    <div className="flex items-center gap-2 shrink-0 flex-wrap">
                      <select
                        value={r.assignedTo || ''}
                        onChange={(e) => {
                          const rec = recruiters.find((x) => x.id === e.target.value);
                          patch(r.id, { assignedTo: e.target.value || null, assignedToName: rec?.name || null });
                        }}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold bg-white cursor-pointer"
                      >
                        <option value="">Assign recruiter…</option>
                        {recruiters.map((u) => <option key={u.id} value={u.id}>{u.name}</option>)}
                      </select>
                      <select
                        value={r.status}
                        onChange={(e) => patch(r.id, { status: e.target.value })}
                        className="px-3 py-2 rounded-lg border border-gray-300 text-xs font-semibold bg-white cursor-pointer"
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}

                  {!isManager && r.assignedToName && (
                    <span className="text-[11px] font-bold text-sky-700 shrink-0">
                      Assigned to you
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 my-auto max-h-[92vh] overflow-y-auto relative">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              Add Hiring Requirement
            </h3>

            <form onSubmit={create} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Company name" required>
                  <input type="text" required value={form.companyName}
                    onChange={(e) => setForm({ ...form, companyName: e.target.value })} className={input} />
                </Field>
                <Field label="Contact person">
                  <input type="text" value={form.contactPerson}
                    onChange={(e) => setForm({ ...form, contactPerson: e.target.value })} className={input} />
                </Field>
                <Field label="Phone" required>
                  <input type="tel" required value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} className={input} />
                </Field>
                <Field label="Email">
                  <input type="email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} className={input} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-gray-100">
                <div className="sm:col-span-2 pt-4">
                  <Field label="Role needed" required>
                    <input type="text" required value={form.roleTitle}
                      onChange={(e) => setForm({ ...form, roleTitle: e.target.value })} className={input} />
                  </Field>
                </div>
                <div className="pt-4">
                  <Field label="How many" required>
                    <input type="number" required min="1" max="999" value={form.headcount}
                      onChange={(e) => setForm({ ...form, headcount: e.target.value })} className={input} />
                  </Field>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Location">
                  <input type="text" value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })} className={input} />
                </Field>
                <Field label="Experience">
                  <input type="text" value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })} className={input} />
                </Field>
                <Field label="Salary range">
                  <input type="text" value={form.salaryRange}
                    onChange={(e) => setForm({ ...form, salaryRange: e.target.value })} className={input} />
                </Field>
                <Field label="Required from">
                  <input type="text" value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })} className={input} />
                </Field>
              </div>

              <Field label="Urgency">
                <div className="grid grid-cols-3 gap-2.5">
                  {['Standard', 'Urgent', 'Immediate'].map((u) => (
                    <button key={u} type="button" onClick={() => setForm({ ...form, urgency: u })}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                        form.urgency === u ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}>
                      <Zap className="w-3.5 h-3.5" /> {u}
                    </button>
                  ))}
                </div>
              </Field>

              <Field label="Notes">
                <textarea rows={3} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className={`${input} resize-y`} />
              </Field>

              {error && (
                <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
                </p>
              )}

              <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 font-bold rounded-xl text-sm cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="px-7 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md inline-flex items-center gap-2 cursor-pointer">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Add requirement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HiringRequests;
