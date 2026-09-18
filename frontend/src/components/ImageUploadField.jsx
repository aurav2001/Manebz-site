import React, { useRef, useState } from 'react';
import { Upload, Link as LinkIcon, X, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import api from '../api/client';

const MAX_EDGE = 1400;   // A testimonial or cover image never needs more than this.
const JPEG_QUALITY = 0.82;

/**
 * Shrinks the picture in the browser before it is sent.
 *
 * A phone photo is often 4-6 MB, which would bloat the server folder and slow every page
 * that shows it. Re-drawing it onto a canvas at a sane size turns that into ~100-250 KB
 * with no visible loss at the sizes these images are displayed.
 *
 * PNGs with transparency are kept as PNG; everything else becomes JPEG.
 */
const shrinkToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a readable image'));
      img.onload = () => {
        const scale = Math.min(1, MAX_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        ctx.imageSmoothingQuality = 'high';

        const keepAlpha = file.type === 'image/png';
        if (!keepAlpha) {
          // JPEG has no alpha; without this, transparent areas render black.
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, w, h);
        }
        ctx.drawImage(img, 0, 0, w, h);

        resolve(
          keepAlpha
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', JPEG_QUALITY)
        );
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });

const ImageUploadField = ({ value, onChange, label = 'Image', hint }) => {
  const inputRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [showUrl, setShowUrl] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setError('');

    if (!file.type.startsWith('image/')) {
      setError('Please choose an image file (JPG, PNG, WEBP or GIF).');
      return;
    }

    setBusy(true);
    try {
      // GIFs would lose their animation on a canvas, so they go up untouched.
      const dataUrl =
        file.type === 'image/gif'
          ? await new Promise((res, rej) => {
              const r = new FileReader();
              r.onload = () => res(r.result);
              r.onerror = () => rej(new Error('Could not read that file'));
              r.readAsDataURL(file);
            })
          : await shrinkToDataUrl(file);

      const result = await api.uploads.create(dataUrl);
      onChange(result.url);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="block font-bold text-gray-800 uppercase">
          {label} <span className="text-gray-400 normal-case font-medium">(optional)</span>
        </label>
        <button
          type="button"
          onClick={() => setShowUrl((s) => !s)}
          className="text-[11px] font-bold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1 cursor-pointer"
        >
          <LinkIcon className="w-3 h-3" />
          {showUrl ? 'Hide URL box' : 'Paste a URL instead'}
        </button>
      </div>

      {value ? (
        <div className="flex items-center gap-4 p-3 rounded-2xl border border-gray-200 bg-gray-50">
          <img
            src={value}
            alt="Selected"
            className="w-24 h-24 rounded-xl object-cover border border-gray-200 bg-white shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-gray-800 mb-1">Image attached</p>
            <p className="text-[11px] text-gray-500 truncate">{value}</p>
            <div className="flex items-center gap-3 mt-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                disabled={busy}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer disabled:opacity-50"
              >
                Replace
              </button>
              <button
                type="button"
                onClick={() => { onChange(''); setError(''); }}
                className="text-xs font-bold text-red-600 hover:text-red-700 cursor-pointer inline-flex items-center gap-1"
              >
                <X className="w-3 h-3" /> Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
          className={`rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors
                      ${dragging ? 'border-sky-500 bg-sky-50' : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'}
                      ${busy ? 'opacity-60 pointer-events-none' : ''}`}
        >
          {busy ? (
            <div className="flex flex-col items-center gap-2 text-sky-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-xs font-bold">Uploading…</span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-500">
              <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-gray-700">
                Click to choose an image, or drag one here
              </span>
              <span className="text-[11px] text-gray-400">
                JPG, PNG, WEBP or GIF — resized automatically before upload
              </span>
            </div>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {showUrl && (
        <input
          type="url"
          placeholder="https://images.unsplash.com/photo-..."
          value={value?.startsWith('data:') ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="mt-3 w-full px-4 py-3 rounded-xl border border-gray-300 font-medium text-sm"
        />
      )}

      {error && (
        <p className="mt-2 text-xs font-semibold text-red-600 flex items-start gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
          <span>{error}</span>
        </p>
      )}

      {!error && hint && (
        <p className="mt-2 text-[11px] text-gray-500 flex items-start gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 shrink-0 mt-px text-gray-400" />
          <span>{hint}</span>
        </p>
      )}
    </div>
  );
};

export default ImageUploadField;
