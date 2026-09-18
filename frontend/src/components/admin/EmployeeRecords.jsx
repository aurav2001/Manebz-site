import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  UserPlus, Search, Trash2, Edit3, Loader2, X, Clock, MapPin, Phone,
  GraduationCap, Briefcase, TrendingUp, Users, Download, AlertTriangle,
  Building2, Plus, List, LayoutGrid, ChevronDown, ChevronRight
} from 'lucide-react';
import api from '../../api/client';

const BLANK = {
  fullName: '', age: '', qualification: '', location: '', phone: '',
  email: '', designation: '', clientSite: '', status: 'Placed', notes: '',
  companyId: '', companyName: '', requestId: '',
};

/**
 * Company picker that also accepts a name that is not on the list yet.
 *
 * A recruiter logging a placement for a brand new client should not have to stop and get
 * the company created first — typing the name creates it on save.
 */
const CompanyPicker = ({ companies, valueId, valueName, onChange }) => {
  const [typing, setTyping] = useState(!valueId && Boolean(valueName));
  const [query, setQuery] = useState(valueName || '');

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return companies.slice(0, 6);
    return companies.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 6);
  }, [companies, query]);

  const exactMatch = companies.find(
    (c) => c.name.trim().toLowerCase() === query.trim().toLowerCase()
  );

  if (!typing && valueId) {
    const picked = companies.find((c) => c.id === valueId);
    return (
      <div>
        <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
          Company *
        </label>
        <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl border border-sky-300 bg-sky-50">
          <span className="text-sm font-bold text-sky-900 truncate flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0" />
            {picked?.name || valueName}
          </span>
          <button type="button"
            onClick={() => { setTyping(true); setQuery(''); onChange({ companyId: '', companyName: '' }); }}
            className="text-xs font-bold text-sky-700 hover:text-sky-900 shrink-0 cursor-pointer">
            Change
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
        Company * <span className="text-gray-400 normal-case font-medium">— pick one or type a new client</span>
      </label>
      <div className="relative">
        <Building2 className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          required
          value={query}
          placeholder="e.g. Apex Tower & Business Parks"
          onChange={(e) => {
            setQuery(e.target.value);
            onChange({ companyId: '', companyName: e.target.value });
          }}
          className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 font-medium text-sm"
        />
      </div>

      {matches.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {matches.map((c) => (
            <button key={c.id} type="button"
              onClick={() => { setQuery(c.name); setTyping(false); onChange({ companyId: c.id, companyName: c.name }); }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-sky-400 hover:text-sky-700 text-xs font-semibold text-slate-700 cursor-pointer">
              {c.name}
              {c.employeeCount > 0 && <span className="text-slate-400 ml-1.5">({c.employeeCount})</span>}
            </button>
          ))}
        </div>
      )}

      {query.trim() && !exactMatch && (
        <p className="mt-2 text-[11px] font-semibold text-emerald-700 flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5 shrink-0" />
          &ldquo;{query.trim()}&rdquo; will be added as a new client company.
        </p>
      )}
    </div>
  );
};

const STATUSES = ['Placed', 'Interview Scheduled', 'Documentation', 'Joined', 'Dropped Out'];

const STATUS_STYLES = {
  'Placed': 'bg-sky-50 text-sky-700 border-sky-200',
  'Interview Scheduled': 'bg-amber-50 text-amber-700 border-amber-200',
  'Documentation': 'bg-purple-50 text-purple-700 border-purple-200',
  'Joined': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Dropped Out': 'bg-gray-100 text-gray-600 border-gray-200',
};

const formatWhen = (value) => {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

const Field = ({ label, value, onChange, required, type = 'text', placeholder, options }) => (
  <div>
    <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
      {label}{required ? ' *' : ''}
    </label>
    {options ? (
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm bg-white cursor-pointer">
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    ) : (
      <input type={type} required={required} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
    )}
  </div>
);

/**
 * Placement log.
 *
 * A recruiter sees and edits only their own entries; admin and HR see everyone's, with
 * the recruiter's name and the exact time each row was added.
 */
const EmployeeRecords = ({ currentUser, showToast }) => {
  const [records, setRecords] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [requests, setRequests] = useState([]);
  const [view, setView] = useState('list'); // 'list' | 'company'
  const [openCompany, setOpenCompany] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(BLANK);

  const isManager = currentUser?.role === 'admin' || currentUser?.role === 'hr';

  const openRequestsForCompany = useMemo(() => {
    if (!form.companyId && !form.companyName) return [];
    const name = (form.companyName || '').trim().toLowerCase();
    return requests.filter((r) =>
      !['Fulfilled', 'Closed'].includes(r.status)
      && (r.companyId === form.companyId || (r.companyName || '').trim().toLowerCase() === name)
    );
  }, [requests, form.companyId, form.companyName]);

  const load = useCallback(async () => {
    try {
      const [rec, st, comp, reqs] = await Promise.allSettled([
        api.employees.getAll(),
        isManager ? api.employees.stats() : Promise.resolve(null),
        api.companies.getAll(),
        api.hiringRequests.getAll(),
      ]);
      if (rec.status === 'fulfilled') setRecords(rec.value.data || []);
      else setError(rec.reason?.message || 'Could not load records');
      if (st.status === 'fulfilled' && st.value) setStats(st.value.data);
      if (comp.status === 'fulfilled') setCompanies(comp.value.data || []);
      if (reqs.status === 'fulfilled') setRequests(reqs.value.data || []);
    } finally {
      setLoading(false);
    }
  }, [isManager]);

  useEffect(() => { load(); }, [load]);

  const open = (record = null) => {
    setEditing(record);
    setForm(record ? { ...BLANK, ...record } : BLANK);
    setError('');
    setModalOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      await api.employees.save(editing ? { ...form, id: editing.id } : form);
      showToast?.(editing ? 'Record updated' : 'Employee record added');
      setModalOpen(false);
      await load();
    } catch (err) {
      setError(err.message || 'Could not save the record');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (record) => {
    if (!window.confirm(`Delete the record for ${record.fullName}?`)) return;
    try {
      await api.employees.delete(record.id);
      showToast?.('Record deleted');
      await load();
    } catch (err) {
      showToast?.(err.message || 'Delete failed');
    }
  };

  const exportCsv = () => {
    const cols = ['companyName', 'fullName', 'age', 'qualification', 'location', 'phone', 'email', 'designation', 'clientSite', 'status', 'addedByName', 'createdAt'];
    const header = ['Company', 'Name', 'Age', 'Qualification', 'Location', 'Phone', 'Email', 'Designation', 'Client Site', 'Status', 'Added By', 'Added At'];
    const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const csv = [header.join(','), ...records.map((r) => cols.map((c) => escape(r[c])).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `MANEBZ_Employee_Records_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return records;
    return records.filter((r) =>
      [r.fullName, r.phone, r.location, r.qualification, r.designation, r.clientSite, r.companyName, r.addedByName]
        .some((v) => String(v || '').toLowerCase().includes(q))
    );
  }, [records, search]);

  /** Groups the visible records by client, newest client activity first. */
  const byCompany = useMemo(() => {
    const groups = new Map();
    for (const r of filtered) {
      const key = r.companyId || r.companyName || '__none__';
      if (!groups.has(key)) {
        groups.set(key, { key, name: r.companyName || 'Not assigned to a company', records: [] });
      }
      groups.get(key).records.push(r);
    }
    return [...groups.values()]
      .map((g) => ({
        ...g,
        latest: g.records.reduce((a, r) => (new Date(r.createdAt) > new Date(a) ? r.createdAt : a), 0),
        meta: companies.find((c) => c.id === g.key),
      }))
      .sort((a, b) => new Date(b.latest) - new Date(a.latest));
  }, [filtered, companies]);

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
          <h2 className="text-lg sm:text-xl font-black text-gray-900">Employee Records</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {isManager
              ? 'Every placement logged by the recruiting team, with who added it and when.'
              : 'People you have placed or processed. Only you and management can see these.'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          {records.length > 0 && (
            <button onClick={exportCsv}
              className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-sky-400 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
              <Download className="w-3.5 h-3.5" /> CSV
            </button>
          )}
          <button onClick={() => open()}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-md cursor-pointer">
            <UserPlus className="w-4 h-4" /> Add record
          </button>
        </div>
      </div>

      {/* Manager summary */}
      {isManager && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total records', value: stats.total, icon: Users, tint: 'text-sky-600 bg-sky-50' },
            { label: 'Added today', value: stats.today, icon: Clock, tint: 'text-emerald-600 bg-emerald-50' },
            { label: 'Last 7 days', value: stats.week, icon: TrendingUp, tint: 'text-red-600 bg-red-50' },
          ].map(({ label, value, icon: Icon, tint }) => (
            <div key={label} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-4">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${tint}`}>
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-gray-900 leading-none">{value}</p>
                <p className="text-[11px] font-bold uppercase tracking-wide text-gray-500 mt-1">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Per-recruiter totals */}
      {isManager && stats?.byRecruiter?.length > 0 && (
        <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-sm font-extrabold text-gray-900">By recruiter</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {stats.byRecruiter.map((r) => (
              <div key={r.userId || r.name} className="px-6 py-3.5 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">{r.name}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">Last added {formatWhen(r.lastAddedAt)}</p>
                </div>
                <span className="text-lg font-black text-sky-700 shrink-0">{r.total}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, phone, company, location, qualification…"
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
        </div>

        <div className="flex items-center gap-1.5 p-1.5 bg-slate-100 rounded-xl border border-slate-200 shrink-0">
          {[
            { id: 'list', label: 'All', icon: List },
            { id: 'company', label: 'By company', icon: LayoutGrid },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setView(id)}
              className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all inline-flex items-center gap-1.5 cursor-pointer ${
                view === id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}>
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>
      </div>

      {error && !modalOpen && (
        <p className="text-xs font-semibold text-red-600 flex items-center gap-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
        </p>
      )}

      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-3">
            <Users className="w-6 h-6" />
          </div>
          <p className="text-sm font-bold text-gray-700">
            {search ? 'No records match that search' : 'No records yet'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {search ? 'Try a different name or phone number.' : 'Add the first placement using the button above.'}
          </p>
        </div>
      ) : view === 'company' ? (
        /* Grouped by client — answers "who did we find for which company". */
        <div className="space-y-3">
          {byCompany.map((group) => {
            const isOpen = openCompany === group.key;
            return (
              <div key={group.key} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenCompany(isOpen ? null : group.key)}
                  className="w-full px-5 py-4 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer text-left"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-gray-900 truncate">{group.name}</h3>
                      <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {group.meta?.location ? `${group.meta.location} • ` : ''}
                        Last added {formatWhen(group.latest)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-extrabold">
                      {group.records.length}
                    </span>
                    {isOpen ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="border-t border-gray-100 divide-y divide-gray-100">
                    {group.records.map((r) => (
                      <div key={r.id} className="px-5 py-3.5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">
                            {r.fullName}
                            {r.designation && <span className="font-normal text-gray-500"> — {r.designation}</span>}
                          </p>
                          <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                            {r.phone}
                            {r.location ? ` • ${r.location}` : ''}
                            {' • '}{formatWhen(r.createdAt)}
                            {isManager && r.addedByName ? ` • ${r.addedByName}` : ''}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded-md border ${STATUS_STYLES[r.status] || STATUS_STYLES.Placed}`}>
                            {r.status || 'Placed'}
                          </span>
                          <button onClick={() => open(r)} className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 cursor-pointer" aria-label="Edit">
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:border-sky-400 hover:shadow-md transition-all">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="min-w-0">
                  <h3 className="text-base font-extrabold text-gray-900 truncate">{r.fullName}</h3>
                  {r.designation && <p className="text-xs text-gray-500 mt-0.5 truncate">{r.designation}</p>}
                  {r.companyName && (
                    <p className="text-xs font-bold text-sky-700 mt-1 flex items-center gap-1.5 truncate">
                      <Building2 className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{r.companyName}</span>
                    </p>
                  )}
                </div>
                <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md border shrink-0 ${STATUS_STYLES[r.status] || STATUS_STYLES.Placed}`}>
                  {r.status || 'Placed'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs text-gray-600">
                <span className="flex items-center gap-1.5 truncate">
                  <Phone className="w-3.5 h-3.5 text-sky-600 shrink-0" />{r.phone}
                </span>
                {r.age && <span className="truncate">Age: {r.age}</span>}
                {r.qualification && (
                  <span className="flex items-center gap-1.5 truncate col-span-2">
                    <GraduationCap className="w-3.5 h-3.5 text-red-600 shrink-0" />{r.qualification}
                  </span>
                )}
                {r.location && (
                  <span className="flex items-center gap-1.5 truncate col-span-2">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />{r.location}
                  </span>
                )}
                {r.clientSite && (
                  <span className="flex items-center gap-1.5 truncate col-span-2">
                    <Briefcase className="w-3.5 h-3.5 text-purple-600 shrink-0" />{r.clientSite}
                  </span>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-3">
                <p className="text-[11px] text-gray-400 flex items-center gap-1.5 min-w-0">
                  <Clock className="w-3 h-3 shrink-0" />
                  <span className="truncate">
                    {formatWhen(r.createdAt)}
                    {isManager && r.addedByName ? ` • ${r.addedByName}` : ''}
                  </span>
                </p>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button onClick={() => open(r)} className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 cursor-pointer" aria-label="Edit">
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => remove(r)} className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 cursor-pointer" aria-label="Delete">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 my-auto max-h-[92vh] overflow-y-auto">
            <button onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-700 rounded-full cursor-pointer" aria-label="Close">
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-black text-gray-950 mb-6 pb-3 border-b border-gray-100">
              {editing ? `Edit: ${editing.fullName}` : 'Add Employee Record'}
            </h3>

            <form onSubmit={save} className="space-y-4">
              {/* Which client this person was found for — the whole point of the log. */}
              <CompanyPicker
                companies={companies}
                valueId={form.companyId}
                valueName={form.companyName}
                onChange={(patch) => setForm({ ...form, ...patch, requestId: '' })}
              />

              {/* Attaching the placement to an open requirement is what moves its
                  "filled of headcount" progress. Only that company's requests appear. */}
              {openRequestsForCompany.length > 0 && (
                <div>
                  <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
                    Fills which requirement? <span className="text-gray-400 normal-case font-medium">(optional)</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {openRequestsForCompany.map((r) => {
                      const picked = form.requestId === r.id;
                      return (
                        <button
                          key={r.id}
                          type="button"
                          onClick={() => setForm({ ...form, requestId: picked ? '' : r.id })}
                          className={`px-3 py-2 rounded-lg border text-xs font-semibold transition-colors cursor-pointer text-left ${
                            picked ? 'border-sky-500 bg-sky-50 text-sky-900' : 'border-slate-300 text-slate-700 hover:border-sky-400'
                          }`}
                        >
                          <span className="block">{r.headcount} × {r.roleTitle}</span>
                          <span className="block text-[10px] text-slate-500 mt-0.5">
                            {r.filled} of {r.headcount} filled
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Full name" required value={form.fullName} onChange={(v) => setForm({ ...form, fullName: v })} />
                <Field label="Phone" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} placeholder="+91 …" />
                <Field label="Age" value={form.age} onChange={(v) => setForm({ ...form, age: v })} placeholder="28" />
                <Field label="Email" type="email" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
                <Field label="Qualification" value={form.qualification} onChange={(v) => setForm({ ...form, qualification: v })} placeholder="B.Com / ITI / 12th" />
                <Field label="Location" value={form.location} onChange={(v) => setForm({ ...form, location: v })} placeholder="Noida, UP" />
                <Field label="Designation" value={form.designation} onChange={(v) => setForm({ ...form, designation: v })} placeholder="Housekeeping Supervisor" />
                <Field label="Client site" value={form.clientSite} onChange={(v) => setForm({ ...form, clientSite: v })} />
                <Field label="Status" value={form.status} onChange={(v) => setForm({ ...form, status: v })} options={STATUSES} />
              </div>

              <div>
                <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">Notes</label>
                <textarea rows={3} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm resize-y" />
              </div>

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
                  {editing ? 'Save changes' : 'Add record'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeRecords;
