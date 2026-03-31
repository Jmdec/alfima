'use client';

import { useEffect, useState, useRef } from 'react';
import {
  Plus, Search, Edit2, Trash2, Eye, X, Upload,
  Home, Building2, MapPin, DollarSign, Bed, Bath, Square,
  ChevronLeft, ChevronRight, CheckCircle, AlertCircle, Loader2,
  Calendar, ImageIcon, Tag as TagIcon, TriangleAlert,
} from 'lucide-react';

// ── Types ─────────────────────────────────────────────────────────────────────
interface PropertyAmenity {
  id: number;
  name: string;
}

interface PropertyFeatures {
  id: number;
  name: string;
}

interface PropertyImage {
  id: number;
  url: string;
  sort_order: number;
}

interface Property {
  id: number;
  title: string;
  description: string;
  listing_type: 'sale' | 'rent';
  property_type: string;
  status: 'active' | 'sold' | 'rented' | 'inactive';
  price: number | null;
  price_per_month: number | null;
  address: string;
  city: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area: string | null;
  thumbnail: string | null;
  images?: PropertyImage[];
  created_at: string;
  amenities?: Array<PropertyAmenity | string>;
  features?: Array<PropertyFeatures | string>;
}

interface PaginatedResponse {
  data: Property[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

type ModalMode = 'create' | 'edit' | 'view' | null;
interface Toast { id: number; type: 'success' | 'error'; message: string; }

const ACCEPT_ALL_IMAGES = 'image/*,.avif,.heic,.heif,.jxl,.tiff,.tif,.bmp,.ico,.svg,.webp';

const AMENITY_OPTIONS = [
  'Swimming Pool', 'Gym / Fitness Center', 'Parking Slot', 'Security / CCTV',
  'Elevator', 'Clubhouse', 'Basketball Court', 'Tennis Court',
  'Jogging Path', "Children's Playground", 'Function Hall', 'Laundry Area',
  'Generator / Backup Power', 'Solar Panels', 'Rooftop Deck', 'Landscaped Garden',
];

const FEATURE_OPTIONS = [
  'Fully Furnished', 'Semi-Furnished', 'Unfurnished', 'With Balcony',
  'With Terrace', 'Corner Unit', 'High Floor Unit', 'With Storage Room',
  "With Maid's Room", 'Pet Friendly', 'Air Conditioned', 'Smart Home System',
  'Open Kitchen', 'Island Kitchen', 'Walk-in Closet', 'Separate Dining Area',
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatNumberInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-PH');
}
function stripCommas(val: string): string { return val.replace(/,/g, ''); }

/**
 * FIX: Normalize a string for comparison — lowercase + collapse whitespace.
 * This ensures API-returned names like "gym / fitness center" match
 * the option label "Gym / Fitness Center".
 */
function normalizeLabel(s?: string | null): string {
  if (typeof s !== 'string') return '';
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

/**
 * FIX: Given a list of raw names from the API and the canonical option list,
 * return only the canonical option strings that match (case-insensitively).
 * This prevents phantom selected states from slight casing/spacing differences.
 */
function matchToOptions(apiNames: Array<string | undefined | null>, options: string[]): string[] {
  const normalizedApiNames = apiNames
    .map(normalizeLabel)
    .filter(v => v.length > 0);
  return options.filter(opt => normalizedApiNames.includes(normalizeLabel(opt)));
}

// ── Confirm Dialog ────────────────────────────────────────────────────────────

function ConfirmDialog({
  title, description, confirmLabel = 'Delete', onConfirm, onCancel, loading,
}: {
  title: string; description: string; confirmLabel?: string;
  onConfirm: () => void; onCancel: () => void; loading?: boolean;
}) {
  return (
    <>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]" onClick={onCancel} />
      <div className="fixed inset-0 z-[160] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4"
          style={{ animation: 'modalIn 0.25s cubic-bezier(0.34,1.56,0.64,1)' }}>
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
              <TriangleAlert className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-slate-800 font-bold text-base">{title}</h3>
              <p className="text-slate-500 text-sm mt-1 leading-relaxed">{description}</p>
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-1">
            <button onClick={onCancel} disabled={loading}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-semibold transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={onConfirm} disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50 flex items-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {loading ? 'Deleting...' : confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function ToastList({ toasts, remove }: { toasts: Toast[]; remove: (id: number) => void }) {
  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id}
          className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-medium
            ${t.type === 'success' ? 'bg-emerald-950 border-emerald-700/40 text-emerald-300' : 'bg-red-950 border-red-700/40 text-red-300'}`}
          style={{ animation: 'toastIn 0.3s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {t.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {t.message}
          <button onClick={() => remove(t.id)} className="ml-1 opacity-50 hover:opacity-100"><X className="w-3 h-3" /></button>
        </div>
      ))}
    </div>
  );
}

// ── Tag Checkbox Group ────────────────────────────────────────────────────────

function TagCheckboxGroup({ options, selected, onChange, accentColor = 'red' }: {
  options: string[];
  selected: string[];
  onChange: (vals: string[]) => void;
  accentColor?: 'red' | 'blue';
}) {
  // FIX: Build a normalized lookup set once per render for O(1) matching
  const selectedNormalized = new Set(selected.map(normalizeLabel));

  const toggle = (opt: string) => {
    const key = normalizeLabel(opt);
    if (selectedNormalized.has(key)) {
      // Remove by normalized comparison so stale casing is never an issue
      onChange(selected.filter(s => normalizeLabel(s) !== key));
    } else {
      // Always store the canonical option label
      onChange([...selected, opt]);
    }
  };

  const on = accentColor === 'blue'
    ? 'bg-blue-600 border-blue-600 text-white'
    : 'bg-red-600 border-red-600 text-white';
  const off = 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400';

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        // FIX: Use normalized comparison so API names that differ in case/spacing still highlight
        const isActive = selectedNormalized.has(normalizeLabel(opt));
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${isActive ? on : off}`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Property Form Modal ───────────────────────────────────────────────────────

function PropertyFormModal({
  initial, mode, onClose, onSaved,
}: {
  initial?: Property | null; mode: 'create' | 'edit'; onClose: () => void; onSaved: (msg: string) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Thumbnail
  const [thumbPreview, setThumbPreview] = useState<string | null>(initial?.thumbnail ?? null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);
  const thumbRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);

  // New files to upload
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  // Existing saved gallery images (edit mode)
  const [existingImages, setExistingImages] = useState<{ id: number; url: string }[]>(
    initial?.images?.map(img => ({ id: img.id, url: img.url })) ?? []
  );
  const [deletingImageId, setDeletingImageId] = useState<number | null>(null);

  const totalGalleryCount = existingImages.length + galleryFiles.length;

  // Price display (comma formatted)
  const [priceDisplay, setPriceDisplay] = useState(
    initial?.price ? Number(initial.price).toLocaleString('en-PH') : ''
  );
  const [rentDisplay, setRentDisplay] = useState(
    initial?.price_per_month ? Number(initial.price_per_month).toLocaleString('en-PH') : ''
  );

  // Area range
  const [areaMin, setAreaMin] = useState('');
  const [areaMax, setAreaMax] = useState('');

  useEffect(() => {
    if (initial?.area) {
      const match = String(initial.area).match(/^(\d+)\s*sqm?\s*[-–]\s*(\d+)\s*sqm?$/i);
      if (match) { setAreaMin(match[1]); setAreaMax(match[2]); }
      else { setAreaMin(String(initial.area).replace(/[^0-9]/g, '')); }
    }
  }, []);

  // FIX: Start as empty arrays — populated after full property fetch in edit mode
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [fetchingFull, setFetchingFull] = useState(mode === 'edit');

  const [form, setForm] = useState({
    title: initial?.title ?? '',
    listing_type: initial?.listing_type ?? 'sale',
    property_type: initial?.property_type ?? 'house',
    status: initial?.status ?? 'active',
    address: initial?.address ?? '',
    city: initial?.city ?? '',
    bedrooms: String(initial?.bedrooms ?? ''),
    bathrooms: String(initial?.bathrooms ?? ''),
    description: initial?.description ?? '',
  });

  // FIX: Fetch full property and normalize names against canonical option lists
  useEffect(() => {
    if (mode !== 'edit' || !initial?.id) return;

    const normalizeAmenities = (items?: Array<PropertyAmenity | string>): string[] => {
      const raw = (items ?? []).map((item) => (typeof item === 'string' ? item : item?.name ?? '')).filter(Boolean as any);
      return matchToOptions(raw, AMENITY_OPTIONS);
    };
    const normalizeFeatures = (items?: Array<PropertyFeatures | string>): string[] => {
      const raw = (items ?? []).map((item) => (typeof item === 'string' ? item : item?.name ?? '')).filter(Boolean as any);
      return matchToOptions(raw, FEATURE_OPTIONS);
    };

    setSelectedAmenities(normalizeAmenities(initial?.amenities));
    setSelectedFeatures(normalizeFeatures(initial?.features));

    setFetchingFull(true);
    (async () => {
      try {
        const res = await fetch(`/api/properties/${initial.id}`);
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error ?? `Failed to load property details (${res.status})`);
        }

        const full: Property = await res.json();

        const rawAmenityNames = (full.amenities ?? []).map((a) => {
          if (typeof a === 'string') return a;
          return a?.name ?? '';
        }).filter(Boolean as any);

        const rawFeatureNames = (full.features ?? []).map((f) => {
          if (typeof f === 'string') return f;
          return f?.name ?? '';
        }).filter(Boolean as any);

        // FIX: matchToOptions normalizes both sides so "gym / fitness center"
        // from the API correctly highlights "Gym / Fitness Center" in the UI
        setSelectedAmenities(matchToOptions(rawAmenityNames, AMENITY_OPTIONS));
        setSelectedFeatures(matchToOptions(rawFeatureNames, FEATURE_OPTIONS));

        setForm(prev => ({ ...prev, description: full.description ?? '' }));
        setExistingImages((full.images ?? []).map(img => ({ id: img.id, url: img.url })));
      } catch (err) {
        console.error('Property fetch error:', err);
        setError('Failed to load property details.');
      } finally {
        setFetchingFull(false);
      }
    })();
  }, [mode, initial?.id, initial?.amenities, initial?.features]);

  const setF = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));
  const buildArea = () => {
    if (areaMin && areaMax) return `${areaMin}sqm - ${areaMax}sqm`;
    if (areaMin) return `${areaMin}sqm`;
    return '';
  };

  // Delete a single existing gallery image immediately via API
  const handleDeleteExistingImage = async (imageId: number) => {
    if (!initial?.id) return;
    setDeletingImageId(imageId);
    try {
      const res = await fetch(`/api/properties/${initial.id}/images/${imageId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setExistingImages(prev => prev.filter(img => img.id !== imageId));
    } catch {
      setError('Failed to delete image. Please try again.');
    } finally {
      setDeletingImageId(null);
    }
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.address.trim() || !form.city.trim()) {
      setError('Title, address and city are required.'); return;
    }

    if (form.listing_type === 'sale' && !priceDisplay) { setError('Sale price is required.'); return; }
    if (form.listing_type === 'rent' && !rentDisplay) { setError('Monthly rent is required.'); return; }

    setLoading(true); setError(null);
    const fd = new FormData();

    (['title', 'listing_type', 'property_type', 'status', 'address', 'city', 'bedrooms', 'bathrooms', 'description'] as const)
      .forEach(k => { if (form[k] !== '') fd.append(k, form[k]); });

    if (form.listing_type === 'sale') {
      fd.append('price', stripCommas(priceDisplay));
      fd.append('price_per_month', '');
    } else {
      fd.append('price_per_month', stripCommas(rentDisplay));
      fd.append('price', '');
    }

    const area = buildArea(); if (area) fd.append('area', area);
    selectedAmenities.forEach(a => fd.append('amenities[]', a));
    selectedFeatures.forEach(f => fd.append('features[]', f));
    if (thumbFile) fd.append('thumbnail', thumbFile);
    galleryFiles.forEach(f => fd.append('images[]', f));
    if (mode === 'edit') fd.append('_method', 'PUT');

    try {
      const url = mode === 'create' ? '/api/properties' : `/api/properties/${initial!.id}`;
      const res = await fetch(url, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) { setError(data.message ?? data.error ?? 'Something went wrong.'); return; }
      onSaved(mode === 'create' ? 'Property created!' : 'Property updated!');
      onClose();
    } catch { setError('Network error. Please try again.'); }
    finally { setLoading(false); }
  };

  const inp = 'w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all';
  const sel = `${inp} appearance-none cursor-pointer`;
  const lbl = 'block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2';
  const propertyTypes = ['house', 'condo', 'townhouse', 'lot', 'commercial', 'warehouse'];
  const isSale = form.listing_type === 'sale';
  const pricePreview = isSale
    ? (priceDisplay ? `₱${priceDisplay}` : '')
    : (rentDisplay ? `₱${rentDisplay}/mo` : '');

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 lg:p-8">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
          style={{ animation: 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>

          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 flex-shrink-0">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                {mode === 'create' ? 'Add New Property' : 'Edit Property'}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {mode === 'create' ? 'Fill in the details to list a new property.' : 'Update the property information below.'}
              </p>
            </div>
            <button onClick={onClose}
              className="w-9 h-9 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto relative">
            {fetchingFull && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center gap-3">
                <Loader2 className="w-6 h-6 text-red-500 animate-spin" />
                <span className="text-sm text-slate-500 font-medium">Loading details...</span>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-3 min-h-full">

              {/* ── Left column ── */}
              <div className="bg-slate-50 p-6 flex flex-col gap-5 border-r border-slate-100">

                {/* Listing type */}
                <div>
                  <label className={lbl}>Listing Type *</label>
                  <div className="flex gap-2">
                    {(['sale', 'rent'] as const).map((t) => (
                      <button key={t} type="button" onClick={() => setF('listing_type', t)}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border ${form.listing_type === t
                          ? t === 'sale' ? 'bg-red-600 border-red-600 text-white shadow-md shadow-red-200' : 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-400'
                          }`}>
                        {t === 'sale' ? '🏷 For Sale' : '🔑 For Rent'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  {isSale ? (
                    <>
                      <label className={lbl}>Selling Price ₱ *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">₱</span>
                        <input type="text" inputMode="numeric" className={`${inp} pl-7`}
                          value={priceDisplay} onChange={(e) => setPriceDisplay(formatNumberInput(e.target.value))}
                          placeholder="4,500,000" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">One-time selling price</p>
                    </>
                  ) : (
                    <>
                      <label className={lbl}>Monthly Rent ₱ *</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold select-none">₱</span>
                        <input type="text" inputMode="numeric" className={`${inp} pl-7`}
                          value={rentDisplay} onChange={(e) => setRentDisplay(formatNumberInput(e.target.value))}
                          placeholder="25,000" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">Price per month</p>
                    </>
                  )}
                </div>

                {/* Thumbnail */}
                <div>
                  <label className={lbl}>Thumbnail</label>
                  <div onClick={() => thumbRef.current?.click()}
                    className="relative w-full aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-slate-300 hover:border-red-400 cursor-pointer transition-colors group bg-white">
                    {thumbPreview ? (
                      <>
                        <img src={thumbPreview} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                          <Upload className="w-5 h-5 text-white" />
                          <span className="text-white text-xs font-medium">Change</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <ImageIcon className="w-7 h-7 text-slate-300 group-hover:text-red-400 transition-colors" />
                        <p className="text-xs text-slate-400 font-medium">Click to upload</p>
                        <p className="text-[10px] text-slate-300">Any image format</p>
                      </div>
                    )}
                  </div>
                  <input ref={thumbRef} type="file" accept={ACCEPT_ALL_IMAGES} className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0]; if (!file) return;
                      setThumbFile(file); setThumbPreview(URL.createObjectURL(file));
                    }} />
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={`${lbl} mb-0`}>Gallery ({totalGalleryCount}/10)</label>
                    {galleryFiles.length > 0 && (
                      <button type="button" onClick={() => setGalleryFiles([])}
                        className="text-[10px] text-red-400 hover:text-red-600 font-medium">
                        Clear new
                      </button>
                    )}
                  </div>

                  {/* Existing saved images */}
                  {existingImages.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {existingImages.map((img) => (
                        <div key={img.id} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                          <img src={img.url} alt="" className="w-full h-full object-cover" />
                          <div className="absolute top-1 left-1 bg-emerald-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
                            SAVED
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteExistingImage(img.id)}
                            disabled={deletingImageId === img.id}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-60"
                          >
                            {deletingImageId === img.id
                              ? <Loader2 className="w-3 h-3 animate-spin" />
                              : <X className="w-3 h-3" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Upload area — only show if under limit */}
                  {totalGalleryCount < 10 && (
                    <div onClick={() => galleryRef.current?.click()}
                      className="w-full p-4 rounded-2xl border-2 border-dashed border-slate-300 hover:border-red-400 cursor-pointer transition-colors bg-white text-center group">
                      <Upload className="w-5 h-5 text-slate-300 group-hover:text-red-400 mx-auto mb-1 transition-colors" />
                      <p className="text-xs text-slate-400 font-medium">
                        {totalGalleryCount === 0 ? 'Add gallery images' : 'Add more images'}
                      </p>
                      <p className="text-[10px] text-slate-300">All formats supported</p>
                    </div>
                  )}
                  <input ref={galleryRef} type="file" accept={ACCEPT_ALL_IMAGES} multiple className="hidden"
                    onChange={(e) => {
                      const files = Array.from(e.target.files ?? []);
                      const remaining = 10 - existingImages.length;
                      setGalleryFiles(prev => [...prev, ...files].slice(0, remaining));
                      e.target.value = '';
                    }} />

                  {/* New file previews */}
                  {galleryFiles.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {galleryFiles.map((f, i) => {
                        const url = URL.createObjectURL(f);
                        return (
                          <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-blue-200 bg-slate-100">
                            <img src={url} alt={f.name} className="w-full h-full object-cover" onLoad={() => URL.revokeObjectURL(url)} />
                            <div className="absolute top-1 left-1 bg-blue-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full leading-tight">
                              NEW
                            </div>
                            <button type="button" onClick={() => setGalleryFiles(p => p.filter((_, idx) => idx !== i))}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Status (edit only) */}
                {mode === 'edit' && (
                  <div>
                    <label className={lbl}>Status</label>
                    <select className={sel} value={form.status} onChange={(e) => setF('status', e.target.value)}>
                      {['active', 'sold', 'rented', 'inactive'].map((s) => (
                        <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* ── Right column ── */}
              <div className="col-span-2 p-6 space-y-5">

                {/* Title */}
                <div>
                  <label className={lbl}>Property Title *</label>
                  <input className={inp} value={form.title} onChange={(e) => setF('title', e.target.value)}
                    placeholder="e.g. Modern 3BR Condo in BGC" />
                </div>

                {/* Property Type */}
                <div>
                  <label className={lbl}>Property Type *</label>
                  <div className="grid grid-cols-3 gap-2">
                    {propertyTypes.map((t) => (
                      <button key={t} type="button" onClick={() => setF('property_type', t)}
                        className={`py-2.5 px-3 rounded-xl text-sm font-medium capitalize transition-all border ${form.property_type === t
                          ? 'bg-slate-800 border-slate-800 text-white'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-400'
                          }`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Address + City */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={lbl}>Address *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input className={`${inp} pl-9`} value={form.address}
                        onChange={(e) => setF('address', e.target.value)} placeholder="123 Rizal St." />
                    </div>
                  </div>
                  <div>
                    <label className={lbl}>City *</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input className={`${inp} pl-9`} value={form.city}
                        onChange={(e) => setF('city', e.target.value)} placeholder="Makati" />
                    </div>
                  </div>
                </div>

                {/* Beds / Baths / Area */}
                <div>
                  <div className="grid grid-cols-4 gap-3">
                    <div>
                      <label className={lbl}>Bedrooms</label>
                      <div className="relative">
                        <Bed className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="number" className={`${inp} pl-9`} value={form.bedrooms}
                          onChange={(e) => setF('bedrooms', e.target.value)} placeholder="0" min={0} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Bathrooms</label>
                      <div className="relative">
                        <Bath className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="number" className={`${inp} pl-9`} value={form.bathrooms}
                          onChange={(e) => setF('bathrooms', e.target.value)} placeholder="0" min={0} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Area Min (sqm)</label>
                      <div className="relative">
                        <Square className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input type="number" className={`${inp} pl-9`} value={areaMin}
                          onChange={(e) => setAreaMin(e.target.value)} placeholder="23" min={0} />
                      </div>
                    </div>
                    <div>
                      <label className={lbl}>Area Max (sqm)</label>
                      <input type="number" className={inp} value={areaMax}
                        onChange={(e) => setAreaMax(e.target.value)} placeholder="55 (opt.)" min={0} />
                    </div>
                  </div>
                  {(areaMin || areaMax) && (
                    <p className="text-xs text-slate-500 mt-2 flex items-center gap-1.5">
                      <Square className="w-3.5 h-3.5 text-slate-400" />
                      Saves as:&nbsp;<span className="font-semibold text-slate-700">{buildArea()}</span>
                    </p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className={lbl}>Description</label>
                  <textarea className={`${inp} resize-none`} rows={3} value={form.description}
                    onChange={(e) => setF('description', e.target.value)}
                    placeholder="Describe the property..." />
                </div>

                {/* Amenities */}
                <div>
                  <label className={lbl}>
                    Amenities
                    {selectedAmenities.length > 0 && (
                      <span className="ml-2 text-red-500 normal-case font-normal tracking-normal text-xs">
                        {selectedAmenities.length} selected
                      </span>
                    )}
                  </label>
                  <TagCheckboxGroup
                    options={AMENITY_OPTIONS}
                    selected={selectedAmenities}
                    onChange={setSelectedAmenities}
                    accentColor="red"
                  />
                  {selectedAmenities.length > 0 && (
                    <button type="button" onClick={() => setSelectedAmenities([])}
                      className="mt-2 text-[11px] text-slate-400 hover:text-red-500 transition-colors">
                      Clear selection
                    </button>
                  )}
                </div>

                {/* Features */}
                <div>
                  <label className={lbl}>
                    Features
                    {selectedFeatures.length > 0 && (
                      <span className="ml-2 text-blue-500 normal-case font-normal tracking-normal text-xs">
                        {selectedFeatures.length} selected
                      </span>
                    )}
                  </label>
                  <TagCheckboxGroup
                    options={FEATURE_OPTIONS}
                    selected={selectedFeatures}
                    onChange={setSelectedFeatures}
                    accentColor="blue"
                  />
                  {selectedFeatures.length > 0 && (
                    <button type="button" onClick={() => setSelectedFeatures([])}
                      className="mt-2 text-[11px] text-slate-400 hover:text-blue-500 transition-colors">
                      Clear selection
                    </button>
                  )}
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />{error}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-slate-100 bg-slate-50 flex-shrink-0">
            <div className="flex items-center gap-2 flex-wrap">
              <div className={`w-2.5 h-2.5 rounded-full ${isSale ? 'bg-red-500' : 'bg-blue-500'}`} />
              <span className="text-xs font-semibold text-slate-500">
                {isSale ? 'For Sale' : 'For Rent'}
                {pricePreview && ` — ${pricePreview}`}
                {buildArea() && ` · ${buildArea()}`}
              </span>
            </div>
            <div className="flex gap-3">
              <button onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 text-sm font-semibold transition-colors">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-red-200">
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? 'Saving...' : mode === 'create' ? '+ Create Property' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── View Modal ────────────────────────────────────────────────────────────────

function ViewModal({ property, onClose }: { property: Property; onClose: () => void }) {
  const price = property.listing_type === 'rent'
    ? (property.price_per_month ? `₱${Number(property.price_per_month).toLocaleString('en-PH')}/mo` : '—')
    : (property.price ? `₱${Number(property.price).toLocaleString('en-PH')}` : '—');

  const statusStyles: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    sold: 'bg-blue-100 text-blue-700 border-blue-200',
    rented: 'bg-purple-100 text-purple-700 border-purple-200',
    inactive: 'bg-slate-100 text-slate-500 border-slate-200',
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-[100]" onClick={onClose} />
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden"
          style={{ animation: 'modalIn 0.35s cubic-bezier(0.34,1.56,0.64,1)' }}>
          {property.thumbnail && (
            <div className="h-52 w-full relative">
              <img src={property.thumbnail} alt={property.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button onClick={onClose}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-colors">
                <X className="w-4 h-4 text-slate-700" />
              </button>
              <div className="absolute bottom-4 left-5 right-5">
                <h2 className="text-white font-bold text-xl leading-tight">{property.title}</h2>
              </div>
            </div>
          )}
          <div className="p-6">
            {!property.thumbnail && (
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-slate-800 font-bold text-xl">{property.title}</h2>
                <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 mb-5 flex-wrap">
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold capitalize ${statusStyles[property.status]}`}>{property.status}</span>
              <span className={`text-xs px-3 py-1 rounded-full border font-semibold ${property.listing_type === 'rent' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-red-50 text-red-600 border-red-200'
                }`}>
                {property.listing_type === 'rent' ? '🔑 For Rent' : '🏷 For Sale'}
              </span>
              <span className="text-xs px-3 py-1 rounded-full border border-slate-200 bg-slate-50 text-slate-600 font-semibold capitalize">{property.property_type}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: DollarSign, label: property.listing_type === 'rent' ? 'Monthly Rent' : 'Selling Price', value: price },
                { icon: MapPin, label: 'City', value: property.city },
                { icon: Bed, label: 'Bedrooms', value: property.bedrooms ?? '—' },
                { icon: Bath, label: 'Bathrooms', value: property.bathrooms ?? '—' },
                { icon: Square, label: 'Area', value: property.area ? String(property.area) : '—' },
                { icon: Calendar, label: 'Listed', value: new Date(property.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' }) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-1"><Icon className="w-3.5 h-3.5" />{label}</div>
                  <p className="text-slate-700 font-bold text-sm">{value}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 bg-slate-50 rounded-2xl p-3.5 border border-slate-100">
              <p className="text-xs text-slate-400 mb-1 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />Full Address</p>
              <p className="text-slate-700 font-semibold text-sm">{property.address}, {property.city}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function AdminPropertiesPage() {
  const [data, setData] = useState<PaginatedResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ listing_type: '', property_type: '' });
  const [modal, setModal] = useState<ModalMode>(null);
  const [selected, setSelected] = useState<Property | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = (type: Toast['type'], message: string) => {
    const id = Date.now();
    setToasts(p => [...p, { id, type, message }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), per_page: '12' });
      if (search) params.set('search', search);
      if (filters.listing_type) params.set('listing_type', filters.listing_type);
      if (filters.property_type) params.set('property_type', filters.property_type);
      const res = await fetch(`/api/admin/properties?${params}`);
      setData(await res.json());
    } catch { toast('error', 'Failed to load properties.'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchProperties(); }, [page, search, filters]);

  const handleDelete = async (id: number) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? data.message ?? 'Failed to delete');
      }
      toast('success', 'Property deleted.');
      fetchProperties();
    } catch (e: any) {
      toast('error', e.message ?? 'Failed to delete property.');
    } finally {
      setDeleting(null);
      setConfirmId(null);
    }
  };

  const statusStyles: Record<string, { dot: string; badge: string }> = {
    active: { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    sold: { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    rented: { dot: 'bg-purple-500', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    inactive: { dot: 'bg-slate-400', badge: 'bg-slate-50 text-slate-500 border-slate-200' },
  };

  return (
    <>
      <style>{`
        @keyframes toastIn { from { opacity:0; transform:translateX(20px); } to { opacity:1; transform:translateX(0); } }
        @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes fadeUp  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .row-hover:hover { background: #f8fafc; }
      `}</style>

      <ToastList toasts={toasts} remove={(id) => setToasts(p => p.filter(t => t.id !== id))} />

      <div className="bg-slate-50 min-h-screen">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-8 py-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Properties</h1>
              <p className="text-sm text-slate-400 mt-0.5">
                {data ? `${data.total} total listings` : 'Loading...'}
              </p>
            </div>
            <button onClick={() => { setSelected(null); setModal('create'); }}
              className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-lg shadow-red-200 active:scale-95">
              <Plus className="w-4 h-4" />Add Property
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-8 py-8">
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-red-400 focus:ring-2 focus:ring-red-100 transition-all shadow-sm"
                placeholder="Search by title, address, city..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              />
            </div>
            <select
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-600 focus:outline-none focus:border-red-400 shadow-sm appearance-none cursor-pointer"
              value={filters.listing_type}
              onChange={(e) => { setFilters(f => ({ ...f, listing_type: e.target.value })); setPage(1); }}>
              <option value="">All Listing Types</option>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
            <select
              className="bg-white border border-slate-200 rounded-2xl px-5 py-3 text-sm text-slate-600 focus:outline-none focus:border-red-400 shadow-sm appearance-none cursor-pointer"
              value={filters.property_type}
              onChange={(e) => { setFilters(f => ({ ...f, property_type: e.target.value })); setPage(1); }}>
              <option value="">All Property Types</option>
              {['house', 'condo', 'townhouse', 'lot', 'commercial', 'warehouse'].map(t => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Table */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-[2.5fr_1fr_1.2fr_1fr_1fr_120px] gap-4 px-6 py-4 border-b border-slate-100 bg-slate-50">
              {['Property', 'Category', 'Price', 'Location', 'Status', 'Actions'].map(h => (
                <span key={h} className="text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</span>
              ))}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                <p className="text-sm text-slate-400 font-medium">Loading properties...</p>
              </div>
            ) : !data?.data?.length ? (
              <div className="flex flex-col items-center justify-center py-24 gap-3">
                <div className="w-16 h-16 rounded-3xl bg-slate-100 flex items-center justify-center">
                  <Home className="w-7 h-7 text-slate-400" />
                </div>
                <p className="text-base font-semibold text-slate-600">No properties found</p>
                <p className="text-sm text-slate-400">Try adjusting your filters or add a new property.</p>
              </div>
            ) : (
              <div>
                {data.data.map((p, idx) => {
                  const price = p.listing_type === 'rent'
                    ? (p.price_per_month ? `₱${Number(p.price_per_month).toLocaleString('en-PH')}/mo` : '—')
                    : (p.price ? `₱${Number(p.price).toLocaleString('en-PH')}` : '—');
                  const ss = statusStyles[p.status] ?? statusStyles.inactive;

                  return (
                    <div key={p.id}
                      className={`row-hover grid grid-cols-[2.5fr_1fr_1.2fr_1fr_1fr_120px] gap-4 px-6 py-4 items-center transition-colors ${idx < data.data.length - 1 ? 'border-b border-slate-50' : ''}`}
                      style={{ animation: `fadeUp 0.3s ease ${idx * 0.04}s both` }}>

                      {/* Property */}
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                          {p.thumbnail
                            ? <img src={p.thumbnail} alt={p.title} className="w-full h-full object-cover" />
                            : <div className="w-full h-full flex items-center justify-center"><Home className="w-5 h-5 text-slate-400" /></div>}
                        </div>
                        <div className="min-w-0">
                          <p className="text-slate-800 text-sm font-bold truncate">{p.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${p.listing_type === 'rent' ? 'bg-blue-50 text-blue-600' : 'bg-red-50 text-red-600'
                              }`}>
                              {p.listing_type === 'rent' ? 'For Rent' : 'For Sale'}
                            </span>
                            <p className="text-slate-400 text-xs truncate">{p.address}</p>
                          </div>
                        </div>
                      </div>

                      {/* Category */}
                      <div className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-600 text-sm capitalize">{p.property_type}</span>
                      </div>

                      {/* Price */}
                      <p className="text-slate-800 text-sm font-bold">{price}</p>

                      {/* Location */}
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-slate-600 text-sm truncate">{p.city}</span>
                      </div>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ss.dot}`} />
                        <span className={`text-xs px-2.5 py-1 rounded-full border font-semibold capitalize ${ss.badge}`}>{p.status}</span>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setSelected(p); setModal('view'); }}
                          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-700 transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setSelected(p); setModal('edit'); }}
                          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 flex items-center justify-center text-slate-500 hover:text-blue-600 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setConfirmId(p.id)} disabled={deleting === p.id}
                          className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center justify-center text-slate-500 hover:text-red-500 transition-colors disabled:opacity-40" title="Delete">
                          {deleting === p.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {data && data.last_page > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-semibold text-slate-700">{((page - 1) * data.per_page) + 1}–{Math.min(page * data.per_page, data.total)}</span> of <span className="font-semibold text-slate-700">{data.total}</span>
                </p>
                <div className="flex gap-1.5">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  {Array.from({ length: data.last_page }, (_, i) => i + 1)
                    .filter(n => Math.abs(n - page) <= 2)
                    .map(n => (
                      <button key={n} onClick={() => setPage(n)}
                        className={`w-9 h-9 rounded-xl border text-sm font-bold transition-all shadow-sm ${n === page
                          ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                        {n}
                      </button>
                    ))}
                  <button onClick={() => setPage(p => Math.min(data.last_page, p + 1))} disabled={page === data.last_page}
                    className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-30 transition-colors shadow-sm">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {(modal === 'create' || modal === 'edit') && (
        <PropertyFormModal
          mode={modal}
          initial={selected}
          onClose={() => { setModal(null); setSelected(null); }}
          onSaved={(msg) => { toast('success', msg); fetchProperties(); }}
        />
      )}
      {modal === 'view' && selected && (
        <ViewModal property={selected} onClose={() => { setModal(null); setSelected(null); }} />
      )}

      {/* Delete confirm dialog */}
      {confirmId !== null && (
        <ConfirmDialog
          title="Delete Property"
          description="This will permanently remove the listing and all its images. This action cannot be undone."
          confirmLabel="Delete Property"
          loading={deleting === confirmId}
          onConfirm={() => handleDelete(confirmId)}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </>
  );
}