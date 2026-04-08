'use client';

import { useState, useRef } from 'react';
import {
  Plus, X, Upload, Check, Home, Building2, Landmark, Trees, Store,
  MapPin, DollarSign, Bed, Bath, Ruler, Calendar, FileText, Sparkles,
  Loader2, AlertCircle, CheckCircle, Video,
} from 'lucide-react';

type ListingType  = 'sale' | 'rent';
type PropertyType = 'house' | 'apartment' | 'condo' | 'townhouse' | 'lot' | 'commercial';

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

function formatNumberInput(raw: string): string {
  const digits = raw.replace(/[^0-9]/g, '');
  if (!digits) return '';
  return Number(digits).toLocaleString('en-PH');
}

function stripCommas(val: string): string { return val.replace(/,/g, ''); }

export default function ListPropertyPage() {
  const [formData, setFormData] = useState({
    title:         '',
    description:   '',
    propertyType:  'house' as PropertyType,
    listingType:   'sale'  as ListingType,
    price:         '',
    pricePerMonth: '',
    bedrooms:      '',
    bathrooms:     '',
    area:          '',
    yearBuilt:     '',
    address:       '',
    city:          '',
    state:         '',
    zipCode:       '',
    amenities:     [] as string[],
    features:      [] as string[],
    images:        [] as { file: File; preview: string }[],
    thumbnail:     null as { file: File; preview: string } | null,
    video:         null as { file: File; preview: string } | null,
  });

  const [activeSection,    setActiveSection]    = useState(0);
  const [otherAmenity,     setOtherAmenity]     = useState('');
  const [customAmenities,  setCustomAmenities]  = useState<string[]>([]);
  const [errors,           setErrors]           = useState<string[]>([]);
  const [loading,          setLoading]          = useState(false);
  const [success,          setSuccess]          = useState(false);
  const [apiError,         setApiError]         = useState<string | null>(null);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // ── Field helpers ────────────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ── Thumbnail ────────────────────────────────────────────────────────────────
  const handleThumbnailUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData(prev => ({ ...prev, thumbnail: { file, preview: reader.result as string } }));
    reader.readAsDataURL(file);
  };

  // ── Gallery images ───────────────────────────────────────────────────────────
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    Array.from(e.target.files).forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, { file, preview: reader.result as string }],
        }));
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) =>
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));

  // ── Video upload ─────────────────────────────────────────────────────────────
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () =>
      setFormData(prev => ({ ...prev, video: { file, preview: reader.result as string } }));
    reader.readAsDataURL(file);
  };

  // ── Amenities & Features ────────────────────────────────────────────────────
  const handleAmenityToggle = (amenity: string) =>
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));

  const handleFeatureToggle = (feature: string) =>
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature],
    }));

  const addCustomAmenity = () => {
    const trimmed = otherAmenity.trim();
    if (trimmed && !customAmenities.includes(trimmed) && !amenityOptions.find(a => a.name === trimmed)) {
      setCustomAmenities(prev => [...prev, trimmed]);
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, trimmed] }));
      setOtherAmenity('');
    }
  };

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = (): string[] => {
    const e: string[] = [];
    if (!formData.title.trim())       e.push('Property title is required.');
    if (!formData.description.trim()) e.push('Description is required.');
    if (!formData.yearBuilt.trim())   e.push('Year built is required.');
    if (!formData.address.trim())     e.push('Street address is required.');
    if (!formData.city.trim())        e.push('City / Municipality is required.');
    if (!formData.state.trim())       e.push('Province / Region is required.');
    if (!formData.zipCode.trim())     e.push('Postal code is required.');
    if (!formData.bedrooms.trim())    e.push('Number of bedrooms is required.');
    if (!formData.bathrooms.trim())   e.push('Number of bathrooms is required.');
    if (!formData.area.trim())        e.push('Floor area is required.');
    if (formData.listingType === 'sale' && !formData.price.trim())         e.push('Asking price is required.');
    if (formData.listingType === 'rent' && !formData.pricePerMonth.trim()) e.push('Monthly rent is required.');
    return e;
  };

  // ── Submit → POST /api/properties ────────────────────────────────────────────
  // FIX: Changed from form onSubmit handler to a plain async function called
  // directly by the Publish button's onClick. This prevents Enter key presses
  // in any input field from accidentally triggering a submit.
  const handleSubmit = async () => {
    const validationErrors = validate();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setErrors([]);
    setApiError(null);
    setLoading(true);

    try {
      const fd = new FormData();

      fd.append('title',         formData.title.trim());
      fd.append('description',   formData.description.trim());
      fd.append('listing_type',  formData.listingType);
      fd.append('property_type', formData.propertyType);
      fd.append('address',       formData.address.trim());
      fd.append('city',          formData.city.trim());
      fd.append('state',         formData.state.trim());
      fd.append('zip_code',      formData.zipCode.trim());
      fd.append('bedrooms',      formData.bedrooms);
      fd.append('bathrooms',     formData.bathrooms);
      fd.append('area',          formData.area);
      fd.append('year_built',    formData.yearBuilt);

      if (formData.listingType === 'sale') {
        fd.append('price',           stripCommas(formData.price));
        fd.append('price_per_month', '');
      } else {
        fd.append('price_per_month', stripCommas(formData.pricePerMonth));
        fd.append('price',           '');
      }

      formData.amenities.forEach(a => fd.append('amenities[]', a));
      formData.features.forEach(f => fd.append('features[]', f));

      if (formData.thumbnail) {
        fd.append('thumbnail', formData.thumbnail.file);
      }

      formData.images.slice(0, 10).forEach(img => fd.append('images[]', img.file));

      if (formData.video) {
        fd.append('video', formData.video.file);
      }

      const res  = await fetch('/api/properties', {
        method: 'POST',
        body:   fd,
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.errors) {
          const msgs = Object.values(data.errors as Record<string, string[]>).flat();
          setApiError(msgs.join(' '));
        } else {
          setApiError(data.message ?? data.error ?? 'Something went wrong. Please try again.');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      setFormData({
        title: '', description: '', propertyType: 'house', listingType: 'sale',
        price: '', pricePerMonth: '', bedrooms: '', bathrooms: '', area: '',
        yearBuilt: '', address: '', city: '', state: '', zipCode: '',
        amenities: [], features: [], images: [], thumbnail: null, video: null,
      });
      setCustomAmenities([]);
      setActiveSection(0);

    } catch {
      setApiError('Network error. Please check your connection and try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  // ── Static data ──────────────────────────────────────────────────────────────
  const propertyTypes: { value: PropertyType; label: string; icon: React.ReactNode }[] = [
    { value: 'house',      label: 'House',      icon: <Home      className="w-5 h-5" /> },
    { value: 'apartment',  label: 'Apartment',  icon: <Building2 className="w-5 h-5" /> },
    { value: 'condo',      label: 'Condo',      icon: <Landmark  className="w-5 h-5" /> },
    { value: 'townhouse',  label: 'Townhouse',  icon: <Home      className="w-5 h-5" /> },
    { value: 'lot',        label: 'Lot',        icon: <Trees     className="w-5 h-5" /> },
    { value: 'commercial', label: 'Commercial', icon: <Store     className="w-5 h-5" /> },
  ];

  const amenityOptions = [
    { name: 'Pool',             emoji: '🏊' }, { name: 'Gym',             emoji: '💪' },
    { name: 'Parking',          emoji: '🅿️' }, { name: 'Doorman',         emoji: '🚪' },
    { name: 'Rooftop Deck',     emoji: '🌆' }, { name: 'Pet Friendly',    emoji: '🐾' },
    { name: 'Security',         emoji: '🔒' }, { name: 'Garden',          emoji: '🌳' },
    { name: 'Balcony',          emoji: '🏠' }, { name: 'Washer/Dryer',    emoji: '🧺' },
    { name: 'Concierge',        emoji: '🛎️' }, { name: 'Storage',         emoji: '📦' },
    { name: 'Elevator',         emoji: '🛗' }, { name: 'CCTV',            emoji: '📹' },
    { name: 'Generator',        emoji: '⚡' }, { name: 'Solar Panels',    emoji: '☀️' },
    { name: 'Water Tank',       emoji: '💧' }, { name: 'Internet Ready',  emoji: '📶' },
    { name: 'Air Conditioning', emoji: '❄️' }, { name: 'Fireplace',       emoji: '🔥' },
    { name: 'Sauna',            emoji: '🧖' }, { name: 'Basketball Court',emoji: '🏀' },
    { name: 'Tennis Court',     emoji: '🎾' }, { name: 'Playground',      emoji: '🛝' },
    { name: 'Clubhouse',        emoji: '🏡' }, { name: 'Function Hall',   emoji: '🎪' },
    { name: 'Jogging Path',     emoji: '🏃' }, { name: 'Shuttle Service', emoji: '🚌' },
  ];

  const sections = ['Basic Info', 'Photos & Video', 'Location', 'Details', 'Amenities'];

  return (
    <div className="min-h-screen py-12 px-4" style={{ background: 'linear-gradient(145deg,#3d1818 0%,#4a1f1f 50%,#2d1212 100%)' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-orange-600/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-4" style={{background:'rgba(232,168,160,0.15)',border:'1px solid rgba(232,168,160,0.3)'}}>
              <Sparkles className="w-3.5 h-3.5" style={{color:'#e8a8a0'}} />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{color:'#e8a8a0'}}>New Listing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 tracking-tight">
              List Your{' '}
              <span className="text-transparent bg-clip-text" style={{backgroundImage:'linear-gradient(to right, #e8a8a0, #d4a5a0)'}}>
                Property
              </span>
            </h1>
            <p className="text-white/50 text-lg">
              Reach thousands of qualified buyers and renters across the Philippines
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-0 mb-10 overflow-x-auto pb-2">
          {sections.map((section, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <button
                type="button"
                onClick={() => setActiveSection(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeSection === i
                    ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/30'
                    : activeSection > i
                    ? 'bg-white/10 text-white/70'
                    : 'text-white/30'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  activeSection > i ? 'bg-green-500 text-white'
                  : activeSection === i ? 'bg-white/20' : 'bg-white/10'
                }`}>
                  {activeSection > i ? <Check className="w-3 h-3" /> : i + 1}
                </span>
                {section}
              </button>
              {i < sections.length - 1 && (
                <div className={`w-8 h-px mx-1 flex-shrink-0 ${activeSection > i ? 'bg-green-500/50' : 'bg-white/10'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Validation errors */}
        {errors.length > 0 && (
          <div className="mb-6 p-5 bg-orange-500/20 border border-orange-500/40 rounded-2xl">
            <p className="text-orange-300 font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Please fix the following before publishing:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => <li key={i} className="text-orange-300/80 text-sm">{err}</li>)}
            </ul>
          </div>
        )}

        {/* API error */}
        {apiError && (
          <div className="mb-6 p-4 bg-orange-500/20 border border-orange-500/40 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0" />
            <p className="text-orange-300 text-sm">{apiError}</p>
          </div>
        )}

        {/* Success banner */}
        {success && (
          <div className="mb-6 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
            <p className="text-green-300 font-medium">
              Property listed successfully! Our team will review it shortly.
            </p>
          </div>
        )}

        {/* FIX: Replaced <form onSubmit={handleSubmit}> with a plain <div>.
            Submit is now triggered only by the Publish button's onClick,
            so pressing Enter in any input field won't accidentally fire it. */}
        <div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

            {/* ── SECTION 0: Basic Info ── */}
            <div className={activeSection === 0 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                    <p className="text-white/40 text-sm">Tell us about your property</p>
                  </div>
                </div>

                {/* Listing Type Toggle */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Listing Type
                  </label>
                  <div className="inline-flex bg-black/20 rounded-2xl p-1.5 border border-white/10">
                    {(['sale', 'rent'] as ListingType[]).map(type => (
                      <button
                        key={type} type="button"
                        onClick={() => setFormData(p => ({ ...p, listingType: type }))}
                        className={`px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                          formData.listingType === type
                            ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/40'
                            : 'text-white/40 hover:text-white/70'
                        }`}
                      >
                        {type === 'sale' ? '🏠 For Sale' : '🔑 For Rent'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type Grid */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Property Type
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                    {propertyTypes.map(({ value, label, icon }) => (
                      <button
                        key={value} type="button"
                        onClick={() => setFormData(p => ({ ...p, propertyType: value }))}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200 ${
                          formData.propertyType === value
                            ? 'border-orange-500 bg-orange-600/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/40 hover:border-white/20 hover:text-white/70'
                        }`}
                      >
                        {icon}
                        <span className="text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Property Title</label>
                  <input
                    type="text" name="title" value={formData.title} onChange={handleChange}
                    placeholder="e.g., Modern Downtown Apartment with City Views"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all text-lg"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Describe your property in detail — highlights, nearby amenities, special features..."
                    rows={5}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>

                {/* Price */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    {formData.listingType === 'sale' ? 'Asking Price (PHP)' : 'Monthly Rent (PHP)'}
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                    <input
                      type="text" name={formData.listingType === 'sale' ? 'price' : 'pricePerMonth'}
                      value={formData.listingType === 'sale' ? formData.price : formData.pricePerMonth}
                      onChange={(e) => {
                        const formatted = formatNumberInput(e.target.value);
                        if (formData.listingType === 'sale') {
                          setFormData(p => ({ ...p, price: formatted }));
                        } else {
                          setFormData(p => ({ ...p, pricePerMonth: formatted }));
                        }
                      }}
                      placeholder="0"
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all text-lg"
                    />
                  </div>
                </div>

                {/* Bedrooms, Bathrooms, Area */}
                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Bedrooms</label>
                    <div className="relative">
                      <Bed className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <input
                        type="number" name="bedrooms" value={formData.bedrooms} onChange={handleChange}
                        placeholder="0" min="0"
                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Bathrooms</label>
                    <div className="relative">
                      <Bath className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <input
                        type="number" name="bathrooms" value={formData.bathrooms} onChange={handleChange}
                        placeholder="0" min="0"
                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Floor Area (m²)</label>
                    <div className="relative">
                      <Ruler className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                      <input
                        type="number" name="area" value={formData.area} onChange={handleChange}
                        placeholder="0" min="0"
                        className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Year Built</label>
                  <div className="relative">
                    <Calendar className="absolute left-5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                    <input
                      type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange}
                      placeholder="2024" min="1900" max={new Date().getFullYear()}
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 1: Photos ── */}
            <div className={activeSection === 1 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Photos & Media</h2>
                    <p className="text-white/40 text-sm">Upload images of your property</p>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                    Featured Thumbnail (Main Image)
                  </label>
                  <button
                    type="button"
                    onClick={() => thumbInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-orange-500/50 rounded-2xl p-8 text-center hover:border-orange-500 transition-all bg-orange-500/5"
                  >
                    {formData.thumbnail ? (
                      <div className="space-y-3">
                        <img src={formData.thumbnail.preview} alt="Thumbnail" className="w-40 h-40 object-cover rounded-lg mx-auto" />
                        <p className="text-orange-300 text-sm">{formData.thumbnail.file.name}</p>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData(p => ({ ...p, thumbnail: null }));
                          }}
                          className="mt-2 px-4 py-2 bg-orange-600/30 hover:bg-orange-600/50 rounded-lg text-orange-300 text-sm font-medium transition-all"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="w-8 h-8 text-orange-400 mx-auto" />
                        <p className="text-white font-medium">Click to upload or drag and drop</p>
                        <p className="text-white/40 text-sm">PNG, JPG, GIF up to 10MB</p>
                      </div>
                    )}
                  </button>
                  <input ref={thumbInputRef} type="file" accept="image/*" onChange={handleThumbnailUpload} className="hidden" />
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                    Additional Photos ({formData.images.length}/10)
                  </label>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-orange-500/5 transition-all"
                  >
                    <Plus className="w-6 h-6 text-white/40 mx-auto mb-2" />
                    <p className="text-white/60 font-medium">Add more photos</p>
                    <p className="text-white/40 text-sm">Up to 10 images total</p>
                  </button>
                  <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />

                  {formData.images.length > 0 && (
                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group">
                          <img src={img.preview} alt={`Gallery ${idx + 1}`} className="w-full h-32 object-cover rounded-lg" />
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-orange-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4 text-white" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Video Upload */}
                <div className="mt-12 pt-8 border-t border-white/10">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">
                    Property Video (Optional)
                  </label>
                  {formData.video ? (
                    <div className="relative rounded-2xl overflow-hidden bg-black aspect-video">
                      <video
                        src={formData.video.preview}
                        controls
                        className="w-full h-full object-contain"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, video: null }))}
                        className="absolute top-4 right-4 w-10 h-10 bg-orange-600 hover:bg-orange-700 rounded-full flex items-center justify-center transition-all"
                      >
                        <X className="w-5 h-5 text-white" />
                      </button>
                      <p className="absolute bottom-4 left-4 text-white text-sm font-medium truncate">
                        {formData.video.file.name}
                      </p>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-white/20 rounded-2xl p-8 text-center hover:border-orange-500 hover:bg-orange-500/5 transition-all"
                    >
                      <Video className="w-8 h-8 text-white/40 mx-auto mb-2" />
                      <p className="text-white font-medium">Click to upload or drag and drop</p>
                      <p className="text-white/40 text-sm">MP4, MOV, or WebM up to 100MB</p>
                    </button>
                  )}
                  <input
                    ref={videoInputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* ── SECTION 2: Location ── */}
            <div className={activeSection === 2 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Location</h2>
                    <p className="text-white/40 text-sm">Where is your property located?</p>
                  </div>
                </div>

                {/* Address */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Street Address</label>
                  <input
                    type="text" name="address" value={formData.address} onChange={handleChange}
                    placeholder="e.g., 123 Main Street, Apt 4B"
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                  />
                </div>

                {/* City, State, Zip */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">City / Municipality</label>
                    <input
                      type="text" name="city" value={formData.city} onChange={handleChange}
                      placeholder="e.g., Manila"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Province / Region</label>
                    <input
                      type="text" name="state" value={formData.state} onChange={handleChange}
                      placeholder="e.g., NCR"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Postal Code</label>
                    <input
                      type="text" name="zipCode" value={formData.zipCode} onChange={handleChange}
                      placeholder="e.g., 1000"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Details ── */}
            <div className={activeSection === 3 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Property Details</h2>
                    <p className="text-white/40 text-sm">Features and amenities</p>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-4">Features</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {FEATURE_OPTIONS.map(feature => (
                      <button
                        key={feature} type="button"
                        onClick={() => handleFeatureToggle(feature)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.features.includes(feature)
                            ? 'border-orange-500 bg-orange-600/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {feature}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: Amenities ── */}
            <div className={activeSection === 4 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Amenities</h2>
                    <p className="text-white/40 text-sm">What special amenities does your property have?</p>
                  </div>
                </div>

                {/* Preset Amenities */}
                <div className="mb-8">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {amenityOptions.map(({ name }) => (
                      <button
                        key={name} type="button"
                        onClick={() => handleAmenityToggle(name)}
                        className={`px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                          formData.amenities.includes(name)
                            ? 'border-orange-500 bg-orange-600/20 text-white'
                            : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
                        }`}
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amenity Input */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Add Custom Amenity</label>
                  <div className="flex gap-3">
                    <input
                      type="text" value={otherAmenity} onChange={(e) => setOtherAmenity(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomAmenity(); } }}
                      placeholder="e.g., Smart Home, Wine Cellar..."
                      className="flex-1 px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-all"
                    />
                    <button
                      type="button" onClick={addCustomAmenity}
                      className="px-6 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/30"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>

                  {customAmenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {customAmenities.map(amenity => (
                        <div key={amenity} className="px-4 py-2 bg-orange-600/20 border border-orange-500/50 rounded-lg text-orange-300 text-sm flex items-center gap-2">
                          {amenity}
                          <button
                            type="button"
                            onClick={() => {
                              setCustomAmenities(prev => prev.filter(a => a !== amenity));
                              setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== amenity) }));
                            }}
                            className="text-orange-300 hover:text-orange-400"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* Footer Actions */}
          <div className="mt-10 flex justify-between items-center gap-4 flex-wrap">
            <button
              type="button"
              onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
              disabled={activeSection === 0}
              className={`px-8 py-4 rounded-2xl font-bold transition-all ${
                activeSection === 0
                  ? 'text-white/30 cursor-not-allowed'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              ← Previous
            </button>

            {activeSection < sections.length - 1 ? (
              <button
                type="button"
                onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/30"
              >
                Next →
              </button>
            ) : (
              // FIX: type="button" + onClick={handleSubmit} instead of type="submit".
              // This is the only way to trigger the submit — no accidental Enter-key firing.
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-600/50 text-white font-bold rounded-2xl transition-all shadow-lg shadow-orange-600/30 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Publish Listing
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
