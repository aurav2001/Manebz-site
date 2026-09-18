import React, { useState, useEffect } from 'react';
import { Save, Plus, Trash2, ArrowUp, ArrowDown, HeartHandshake, ClipboardCheck, MapPin } from 'lucide-react';

const Row = ({ index, total, onUp, onDown, onRemove, label }) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
      {label} {index + 1}
    </span>
    <div className="flex items-center gap-1.5 shrink-0">
      <button type="button" onClick={onUp} disabled={index === 0}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Move up">
        <ArrowUp className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={onDown} disabled={index === total - 1}
        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Move down">
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
      <button type="button" onClick={onRemove} disabled={total <= 1}
        className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer" aria-label="Remove">
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  </div>
);

const Text = ({ label, value, onChange, textarea, placeholder }) => (
  <div>
    <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">{label}</label>
    {textarea ? (
      <textarea rows={2} value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm resize-y" />
    ) : (
      <input type="text" value={value ?? ''} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm" />
    )}
  </div>
);

const Card = ({ icon: Icon, title, desc, count, onAdd, addLabel, children }) => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3.5 min-w-0">
        <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-extrabold text-gray-900">{title} ({count})</h3>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
      </div>
      <button type="button" onClick={onAdd}
        className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer shrink-0">
        <Plus className="w-3.5 h-3.5" /> {addLabel}
      </button>
    </div>
    <div className="p-6 sm:p-8 space-y-4">{children}</div>
  </div>
);

/**
 * Edits the About page: the company's core values, quality-assurance points and the
 * regions list. Core values persist through their own endpoint; the other two ride in
 * the generic "about" section, which is why they save together.
 */
const AboutPageEditor = ({ coreValues, qaPoints, regions, onSaveValues, onSaveAbout, showToast }) => {
  const [vals, setVals] = useState(coreValues || []);
  const [qa, setQa] = useState(qaPoints || []);
  const [regs, setRegs] = useState(regions || []);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    if (dirty) return;
    setVals(coreValues || []);
    setQa(qaPoints || []);
    setRegs(regions || []);
  }, [coreValues, qaPoints, regions, dirty]);

  const move = (list, i, dir) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const edit = (setter) => (fn) => { setDirty(true); setter(fn); };
  const editVals = edit(setVals);
  const editQa = edit(setQa);
  const editRegs = edit(setRegs);

  const handleSave = () => {
    onSaveValues(vals);
    onSaveAbout({ qaPoints: qa, regions: regs });
    setDirty(false);
    showToast?.('About page content saved!');
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-slate-50/95 backdrop-blur border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 truncate">About Page Content</h2>
          <p className="text-xs text-gray-500">{dirty ? 'You have unsaved changes' : 'Everything is saved'}</p>
        </div>
        <button type="button" onClick={handleSave} disabled={!dirty}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer shrink-0">
          <Save className="w-4 h-4" /> Save Changes
        </button>
      </div>

      <Card icon={HeartHandshake} title="Core Values" count={vals.length}
        desc="Shown on the About page and the home page's about block."
        addLabel="Add value"
        onAdd={() => editVals((l) => [...l, { id: `v-${Date.now()}`, title: '', description: '', icon: 'Shield' }])}>
        {vals.map((v, i) => (
          <div key={v.id || i} className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/60 space-y-4">
            <Row label="Value" index={i} total={vals.length}
              onUp={() => editVals((l) => move(l, i, -1))}
              onDown={() => editVals((l) => move(l, i, 1))}
              onRemove={() => editVals((l) => l.filter((_, x) => x !== i))} />
            <Text label="Title" value={v.title}
              onChange={(val) => editVals((l) => l.map((it, x) => (x === i ? { ...it, title: val } : it)))} />
            <Text label="Description" textarea value={v.description}
              onChange={(val) => editVals((l) => l.map((it, x) => (x === i ? { ...it, description: val } : it)))} />
          </div>
        ))}
      </Card>

      <Card icon={ClipboardCheck} title="Quality Assurance Points" count={qa.length}
        desc="The QA checklist shown on About, Home and Services."
        addLabel="Add point"
        onAdd={() => editQa((l) => [...l, { title: '', desc: '' }])}>
        {qa.map((q, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/60 space-y-4">
            <Row label="Point" index={i} total={qa.length}
              onUp={() => editQa((l) => move(l, i, -1))}
              onDown={() => editQa((l) => move(l, i, 1))}
              onRemove={() => editQa((l) => l.filter((_, x) => x !== i))} />
            <Text label="Title" value={q.title}
              onChange={(val) => editQa((l) => l.map((it, x) => (x === i ? { ...it, title: val } : it)))} />
            <Text label="Description" textarea value={q.desc}
              onChange={(val) => editQa((l) => l.map((it, x) => (x === i ? { ...it, desc: val } : it)))} />
          </div>
        ))}
      </Card>

      <Card icon={MapPin} title="Regions Served" count={regs.length}
        desc="Shown on the About and Contact pages."
        addLabel="Add region"
        onAdd={() => editRegs((l) => [...l, { state: '', cities: [], status: '', isPrimary: false }])}>
        {regs.map((r, i) => (
          <div key={i} className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/60 space-y-4">
            <Row label="Region" index={i} total={regs.length}
              onUp={() => editRegs((l) => move(l, i, -1))}
              onDown={() => editRegs((l) => move(l, i, 1))}
              onRemove={() => editRegs((l) => l.filter((_, x) => x !== i))} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Text label="State / area" value={r.state}
                onChange={(val) => editRegs((l) => l.map((it, x) => (x === i ? { ...it, state: val } : it)))} />
              <Text label="Status label" value={r.status} placeholder="Operational Hub"
                onChange={(val) => editRegs((l) => l.map((it, x) => (x === i ? { ...it, status: val } : it)))} />
            </div>
            {/* Stored as an array, typed as a comma-separated line — easier than a
                row-per-city UI for something this short. */}
            <Text label="Cities (comma separated)"
              value={Array.isArray(r.cities) ? r.cities.join(', ') : r.cities}
              placeholder="New Delhi, Gurugram, Noida"
              onChange={(val) => editRegs((l) => l.map((it, x) => (x === i
                ? { ...it, cities: val.split(',').map((c) => c.trim()).filter(Boolean) }
                : it)))} />
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700 cursor-pointer">
              <input type="checkbox" checked={!!r.isPrimary}
                onChange={(e) => editRegs((l) => l.map((it, x) => (x === i ? { ...it, isPrimary: e.target.checked } : it)))}
                className="w-4 h-4 rounded border-gray-300" />
              Highlight as the headquarters region
            </label>
          </div>
        ))}
      </Card>
    </div>
  );
};

export default AboutPageEditor;
