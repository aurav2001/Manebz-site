import React, { useState, useEffect } from 'react';
import {
  Save, Plus, Trash2, ArrowUp, ArrowDown, RotateCcw, Image as ImageIcon,
  Layers, ListOrdered, ShieldCheck, Type, X
} from 'lucide-react';
import ImageUploadField from '../ImageUploadField';
import { defaultHomeContent } from '../../data/homeContent';

const Field = ({ label, value, onChange, textarea, placeholder }) => (
  <div>
    <label className="block font-bold text-gray-800 uppercase mb-1.5 text-[11px] tracking-wide">
      {label}
    </label>
    {textarea ? (
      <textarea
        rows={3}
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm resize-y"
      />
    ) : (
      <input
        type="text"
        value={value ?? ''}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm"
      />
    )}
  </div>
);

const Card = ({ icon: Icon, title, desc, children }) => (
  <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-6 sm:px-8 py-5 border-b border-gray-100 flex items-start gap-3.5">
      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-extrabold text-gray-900">{title}</h3>
        {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
      </div>
    </div>
    <div className="p-6 sm:p-8 space-y-5">{children}</div>
  </div>
);

const RowControls = ({ onUp, onDown, onRemove, isFirst, isLast, canRemove }) => (
  <div className="flex items-center gap-1.5 shrink-0">
    <button type="button" onClick={onUp} disabled={isFirst}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      aria-label="Move up">
      <ArrowUp className="w-3.5 h-3.5" />
    </button>
    <button type="button" onClick={onDown} disabled={isLast}
      className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      aria-label="Move down">
      <ArrowDown className="w-3.5 h-3.5" />
    </button>
    <button type="button" onClick={onRemove} disabled={!canRemove}
      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
      aria-label="Remove">
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  </div>
);

/**
 * Edits the home page copy. Changes are held locally until Save, so a half-typed
 * heading never reaches the live site.
 */
const HomePageEditor = ({ homeContent, onSave, onReset, showToast }) => {
  const [draft, setDraft] = useState(homeContent);
  const [dirty, setDirty] = useState(false);

  // Pick up content that arrived from the backend after this component mounted,
  // but never clobber edits already in progress.
  useEffect(() => {
    if (!dirty) setDraft(homeContent);
  }, [homeContent, dirty]);

  const patch = (section, changes) => {
    setDirty(true);
    setDraft((d) => ({ ...d, [section]: { ...d[section], ...changes } }));
  };

  const patchList = (section, listKey, updater) => {
    setDirty(true);
    setDraft((d) => ({
      ...d,
      [section]: { ...d[section], [listKey]: updater(d[section][listKey] || []) },
    }));
  };

  const move = (list, i, dir) => {
    const next = [...list];
    const j = i + dir;
    if (j < 0 || j >= next.length) return next;
    [next[i], next[j]] = [next[j], next[i]];
    return next;
  };

  const handleSave = () => {
    onSave(draft);
    setDirty(false);
    showToast?.('Home page content saved!');
  };

  const handleReset = () => {
    if (!window.confirm('Reset the whole home page back to the original text and images?')) return;
    onReset();
    setDraft(defaultHomeContent);
    setDirty(false);
    showToast?.('Home page reset to defaults.');
  };

  const slides = draft.hero?.slides || [];
  const steps = draft.workflow?.steps || [];
  const chips = draft.qaBanner?.chips || [];

  return (
    <div className="space-y-6">

      {/* Sticky save bar */}
      <div className="sticky top-0 z-20 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 bg-slate-50/95 backdrop-blur border-b border-slate-200 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-black text-gray-900 truncate">Home Page Content</h2>
          <p className="text-xs text-gray-500">
            {dirty ? 'You have unsaved changes' : 'Everything is saved'}
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <button type="button" onClick={handleReset}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-gray-300 hover:border-red-400 hover:text-red-600 text-gray-700 text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer">
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button type="button" onClick={handleSave} disabled={!dirty}
            className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold inline-flex items-center gap-2 shadow-md cursor-pointer">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      {/* HERO */}
      <Card icon={ImageIcon} title="Hero Banner"
        desc="The big rotating banner at the top of the home page.">
        <Field label="Small badge above the heading" value={draft.hero?.eyebrow}
          onChange={(v) => patch('hero', { eyebrow: v })} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Heading — first line" value={draft.hero?.headingLine1}
            onChange={(v) => patch('hero', { headingLine1: v })} />
          <Field label="Heading — coloured part" value={draft.hero?.headingHighlight}
            onChange={(v) => patch('hero', { headingHighlight: v })} />
        </div>
        <Field label="Paragraph under the heading" textarea value={draft.hero?.subtext}
          onChange={(v) => patch('hero', { subtext: v })} />

        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-800">
              Rotating slides ({slides.length})
            </span>
            <button type="button"
              onClick={() => patchList('hero', 'slides', (l) => [...l, {
                id: `slide-${Date.now()}`, image: '', title: '', tagline: '', badge: '',
              }])}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add slide
            </button>
          </div>

          <div className="space-y-4">
            {slides.map((s, i) => (
              <div key={s.id || i} className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/60 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                    Slide {i + 1}
                  </span>
                  <RowControls
                    isFirst={i === 0}
                    isLast={i === slides.length - 1}
                    canRemove={slides.length > 1}
                    onUp={() => patchList('hero', 'slides', (l) => move(l, i, -1))}
                    onDown={() => patchList('hero', 'slides', (l) => move(l, i, 1))}
                    onRemove={() => patchList('hero', 'slides', (l) => l.filter((_, x) => x !== i))}
                  />
                </div>

                <ImageUploadField
                  label="Background image"
                  value={s.image}
                  onChange={(url) => patchList('hero', 'slides', (l) =>
                    l.map((it, x) => (x === i ? { ...it, image: url } : it)))}
                  hint="Wide landscape photos work best here."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Slide title" value={s.title}
                    onChange={(v) => patchList('hero', 'slides', (l) =>
                      l.map((it, x) => (x === i ? { ...it, title: v } : it)))} />
                  <Field label="Badge (red pill)" value={s.badge}
                    onChange={(v) => patchList('hero', 'slides', (l) =>
                      l.map((it, x) => (x === i ? { ...it, badge: v } : it)))} />
                </div>
                <Field label="Tagline (shown before the paragraph)" value={s.tagline}
                  onChange={(v) => patchList('hero', 'slides', (l) =>
                    l.map((it, x) => (x === i ? { ...it, tagline: v } : it)))} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* SERVICES INTRO */}
      <Card icon={Layers} title="Services Section Heading"
        desc="The text above the 5 service cards. The cards themselves are edited in Services.">
        <Field label="Small badge" value={draft.servicesIntro?.eyebrow}
          onChange={(v) => patch('servicesIntro', { eyebrow: v })} />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Field label="Heading start" value={draft.servicesIntro?.headingBefore}
            onChange={(v) => patch('servicesIntro', { headingBefore: v })} />
          <Field label="Coloured middle" value={draft.servicesIntro?.headingHighlight}
            onChange={(v) => patch('servicesIntro', { headingHighlight: v })} />
          <Field label="Heading end" value={draft.servicesIntro?.headingAfter}
            onChange={(v) => patch('servicesIntro', { headingAfter: v })} />
        </div>
        <Field label="Paragraph" textarea value={draft.servicesIntro?.subtext}
          onChange={(v) => patch('servicesIntro', { subtext: v })} />
      </Card>

      {/* WORKFLOW */}
      <Card icon={ListOrdered} title="How We Operate"
        desc="The numbered step cards. Icons are applied automatically by position.">
        <Field label="Small badge" value={draft.workflow?.eyebrow}
          onChange={(v) => patch('workflow', { eyebrow: v })} />
        <Field label="Heading" value={draft.workflow?.heading}
          onChange={(v) => patch('workflow', { heading: v })} />
        <Field label="Paragraph" textarea value={draft.workflow?.subtext}
          onChange={(v) => patch('workflow', { subtext: v })} />

        <div className="pt-2">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-800">
              Steps ({steps.length})
            </span>
            <button type="button"
              onClick={() => patchList('workflow', 'steps', (l) => [...l, {
                id: `step-${Date.now()}`,
                step: `Step ${String(l.length + 1).padStart(2, '0')}`,
                title: '', desc: '',
              }])}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add step
            </button>
          </div>

          <div className="space-y-4">
            {steps.map((s, i) => (
              <div key={s.id || i} className="rounded-2xl border border-gray-200 p-4 sm:p-5 bg-gray-50/60 space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[11px] font-extrabold uppercase tracking-wide text-gray-500">
                    Step {i + 1}
                  </span>
                  <RowControls
                    isFirst={i === 0}
                    isLast={i === steps.length - 1}
                    canRemove={steps.length > 1}
                    onUp={() => patchList('workflow', 'steps', (l) => move(l, i, -1))}
                    onDown={() => patchList('workflow', 'steps', (l) => move(l, i, 1))}
                    onRemove={() => patchList('workflow', 'steps', (l) => l.filter((_, x) => x !== i))}
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Label" placeholder="Step 01" value={s.step}
                    onChange={(v) => patchList('workflow', 'steps', (l) =>
                      l.map((it, x) => (x === i ? { ...it, step: v } : it)))} />
                  <div className="sm:col-span-2">
                    <Field label="Title" value={s.title}
                      onChange={(v) => patchList('workflow', 'steps', (l) =>
                        l.map((it, x) => (x === i ? { ...it, title: v } : it)))} />
                  </div>
                </div>
                <Field label="Description" textarea value={s.desc}
                  onChange={(v) => patchList('workflow', 'steps', (l) =>
                    l.map((it, x) => (x === i ? { ...it, desc: v } : it)))} />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* QA BANNER */}
      <Card icon={ShieldCheck} title="Compliance Banner"
        desc="The dark blue banner near the bottom of the home page.">
        <Field label="Small badge" value={draft.qaBanner?.eyebrow}
          onChange={(v) => patch('qaBanner', { eyebrow: v })} />
        <Field label="Heading" textarea value={draft.qaBanner?.heading}
          onChange={(v) => patch('qaBanner', { heading: v })} />
        <Field label="Paragraph" textarea value={draft.qaBanner?.text}
          onChange={(v) => patch('qaBanner', { text: v })} />

        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-800">
              Tick chips ({chips.length})
            </span>
            <button type="button"
              onClick={() => patchList('qaBanner', 'chips', (l) => [...l, 'New item'])}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer">
              <Plus className="w-3.5 h-3.5" /> Add chip
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <div key={i} className="inline-flex items-center gap-1 bg-gray-50 border border-gray-300 rounded-lg pl-2 pr-1 py-1">
                <input
                  type="text"
                  value={c}
                  onChange={(e) => patchList('qaBanner', 'chips', (l) =>
                    l.map((it, x) => (x === i ? e.target.value : it)))}
                  className="bg-transparent text-xs font-semibold text-gray-800 outline-none"
                  size={Math.max(8, String(c).length)}
                />
                <button type="button"
                  onClick={() => patchList('qaBanner', 'chips', (l) => l.filter((_, x) => x !== i))}
                  className="p-1 text-gray-400 hover:text-red-600 cursor-pointer" aria-label="Remove chip">
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <p className="text-xs text-gray-500 flex items-start gap-2 px-1 pb-4">
        <Type className="w-3.5 h-3.5 shrink-0 mt-px text-gray-400" />
        <span>
          Stats, service cards, testimonials and blog posts on the home page are edited in
          their own sections — this page covers the headings, banner copy and hero slides.
        </span>
      </p>
    </div>
  );
};

export default HomePageEditor;
