'use client';

import { useState, useRef } from 'react';
import {
  Plus, X, Upload, Check, Home, Building2, Landmark, Trees, Store,
  MapPin, DollarSign, Bed, Bath, Ruler, Calendar, FileText, Sparkles,
  Loader2, AlertCircle, CheckCircle,
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
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

      // Core fields — names match Laravel's validation rules exactly
      fd.append('title',         formData.title.trim());
      fd.append('description',   formData.description.trim());
      fd.append('listing_type',  formData.listingType);   // 'sale' | 'rent'
      fd.append('property_type', formData.propertyType);
      fd.append('address',       formData.address.trim());
      fd.append('city',          formData.city.trim());
      fd.append('state',         formData.state.trim());
      fd.append('zip_code',      formData.zipCode.trim());
      fd.append('bedrooms',      formData.bedrooms);
      fd.append('bathrooms',     formData.bathrooms);
      fd.append('area',          formData.area);
      fd.append('year_built',    formData.yearBuilt);

      // Price — only send the relevant field; leave the other blank
      if (formData.listingType === 'sale') {
        fd.append('price',           stripCommas(formData.price));
        fd.append('price_per_month', '');
      } else {
        fd.append('price_per_month', stripCommas(formData.pricePerMonth));
        fd.append('price',           '');
      }

      // Amenities & Features arrays
      formData.amenities.forEach(a => fd.append('amenities[]', a));
      formData.features.forEach(f => fd.append('features[]', f));

      // Thumbnail (optional)
      if (formData.thumbnail) {
        fd.append('thumbnail', formData.thumbnail.file);
      }

      // Gallery images array (optional, up to 10)
      formData.images.slice(0, 10).forEach(img => fd.append('images[]', img.file));

      // POST to the Next.js API route which proxies to Laravel
      // Note: do NOT set Content-Type manually — browser sets multipart boundary automatically
      const res  = await fetch('/api/properties', {
        method: 'POST',
        body:   fd,
      });

      const data = await res.json();

      if (!res.ok) {
        // Laravel returns validation errors as { errors: { field: ['message', ...] } }
        if (data.errors) {
          const msgs = Object.values(data.errors as Record<string, string[]>).flat();
          setApiError(msgs.join(' '));
        } else {
          setApiError(data.message ?? data.error ?? 'Something went wrong. Please try again.');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // ── Success ──────────────────────────────────────────────────────────────
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reset form back to defaults
      setFormData({
        title: '', description: '', propertyType: 'house', listingType: 'sale',
        price: '', pricePerMonth: '', bedrooms: '', bathrooms: '', area: '',
        yearBuilt: '', address: '', city: '', state: '', zipCode: '',
        amenities: [], features: [], images: [], thumbnail: null,
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

  const sections = ['Basic Info', 'Photos', 'Location', 'Details', 'Amenities'];

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-12 relative">
          <div className="absolute -top-4 -left-4 w-32 h-32 bg-red-600/10 rounded-full blur-3xl" />
          <div className="relative">
            <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 rounded-full px-4 py-1.5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-300 text-xs font-semibold tracking-widest uppercase">New Listing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-3 tracking-tight">
              List Your{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-red-600">
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
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30'
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
          <div className="mb-6 p-5 bg-red-500/20 border border-red-500/40 rounded-2xl">
            <p className="text-red-300 font-bold mb-2 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              Please fix the following before publishing:
            </p>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((err, i) => <li key={i} className="text-red-300/80 text-sm">{err}</li>)}
            </ul>
          </div>
        )}

        {/* API error */}
        {apiError && (
          <div className="mb-6 p-4 bg-red-500/20 border border-red-500/40 rounded-2xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <p className="text-red-300 text-sm">{apiError}</p>
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

        <form onSubmit={handleSubmit} noValidate>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden">

            {/* ── SECTION 0: Basic Info ── */}
            <div className={activeSection === 0 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <FileText className="w-5 h-5 text-red-400" />
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
                            ? 'bg-red-600 text-white shadow-lg shadow-red-600/40'
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
                            ? 'border-red-500 bg-red-600/20 text-white'
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
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all text-lg"
                  />
                </div>

                {/* Description */}
                <div className="mb-6">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Description</label>
                  <textarea
                    name="description" value={formData.description} onChange={handleChange}
                    placeholder="Describe your property in detail — highlights, nearby amenities, special features..."
                    rows={5}
                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all resize-none"
                  />
                </div>

                {/* Year Built */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Year Built</label>
                  <div className="relative max-w-xs">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="number" name="yearBuilt" value={formData.yearBuilt} onChange={handleChange}
                      placeholder="2020"
                      className="w-full pl-11 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 1: Photos ── */}
            <div className={activeSection === 1 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <Upload className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Property Photos</h2>
                    <p className="text-white/40 text-sm">Great photos attract more buyers</p>
                  </div>
                </div>

                {/* Thumbnail */}
                <div className="mb-8">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Cover / Thumbnail Photo
                  </label>
                  <div
                    onClick={() => thumbInputRef.current?.click()}
                    className="relative w-full max-w-sm aspect-video rounded-2xl overflow-hidden border-2 border-dashed border-red-500/30 hover:border-red-500/60 cursor-pointer transition-all group bg-white/5"
                  >
                    {formData.thumbnail ? (
                      <>
                        <img src={formData.thumbnail.preview} alt="Thumbnail" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center gap-1">
                          <Upload className="w-5 h-5 text-white" />
                          <span className="text-white text-xs font-medium">Change</span>
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                        <Upload className="w-7 h-7 text-white/20 group-hover:text-red-400 transition" />
                        <p className="text-white/40 text-sm font-medium">Click to upload cover photo</p>
                      </div>
                    )}
                  </div>
                  <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={handleThumbnailUpload} />
                </div>

                {/* Gallery */}
                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    Gallery Photos (up to 10)
                  </label>
                  <button
                    type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full mb-8 border-2 border-dashed border-red-500/30 rounded-3xl p-12 text-center hover:border-red-500/60 hover:bg-red-500/5 transition-all group"
                  >
                    <div className="w-16 h-16 bg-red-600/20 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Upload className="w-7 h-7 text-red-400" />
                    </div>
                    <p className="text-white font-bold text-lg mb-1">Drop photos here or click to browse</p>
                    <p className="text-white/30 text-sm">PNG, JPG, WEBP up to 5MB each · Multiple files supported</p>
                    <input ref={fileInputRef} type="file" multiple accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </button>

                  {formData.images.length > 0 && (
                    <div>
                      <p className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-4">
                        {formData.images.length} photo{formData.images.length > 1 ? 's' : ''} selected
                      </p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group aspect-square">
                            <img src={img.preview} alt="" className="w-full h-full object-cover rounded-2xl" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-2xl" />
                            <button
                              type="button" onClick={() => removeImage(index)}
                              className="absolute top-2 right-2 w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition hover:bg-red-700"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ── SECTION 2: Location ── */}
            <div className={activeSection === 2 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Location</h2>
                    <p className="text-white/40 text-sm">Where is the property located?</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Street Address</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                      <input
                        type="text" name="address" value={formData.address} onChange={handleChange}
                        placeholder="123 Rizal Street, Barangay San Antonio"
                        className="w-full pl-11 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {[
                      { label: 'City / Municipality', name: 'city',    placeholder: 'Makati City' },
                      { label: 'Province / Region',   name: 'state',   placeholder: 'Metro Manila' },
                      { label: 'Postal Code',         name: 'zipCode', placeholder: '1200' },
                    ].map(field => (
                      <div key={field.name}>
                        <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">{field.label}</label>
                        <input
                          type="text" name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange}
                          placeholder={field.placeholder}
                          className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ── SECTION 3: Details ── */}
            <div className={activeSection === 3 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <Ruler className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Property Details</h2>
                    <p className="text-white/40 text-sm">Size, rooms, and pricing</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
                  {[
                    { label: 'Bedrooms',        name: 'bedrooms',  icon: <Bed   className="w-4 h-4" />, placeholder: '3' },
                    { label: 'Bathrooms',       name: 'bathrooms', icon: <Bath  className="w-4 h-4" />, placeholder: '2' },
                    { label: 'Floor Area (m²)', name: 'area',      icon: <Ruler className="w-4 h-4" />, placeholder: '120' },
                  ].map(field => (
                    <div key={field.name}>
                      <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">{field.label}</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30">{field.icon}</div>
                        <input
                          type="number" name={field.name}
                          value={(formData as any)[field.name]}
                          onChange={handleChange} placeholder={field.placeholder}
                          className="w-full pl-11 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">
                    {formData.listingType === 'sale' ? 'Asking Price (₱ PHP)' : 'Monthly Rent (₱ PHP)'}
                  </label>
                  <div className="relative max-w-sm">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                    <input
                      type="number"
                      name={formData.listingType === 'sale' ? 'price' : 'pricePerMonth'}
                      value={formData.listingType === 'sale' ? formData.price : formData.pricePerMonth}
                      onChange={handleChange}
                      placeholder={formData.listingType === 'sale' ? '5000000' : '25000'}
                      className="w-full pl-11 pr-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/20 focus:outline-none focus:border-red-500/50 transition-all text-lg font-semibold"
                    />
                  </div>
                  <p className="text-white/30 text-xs mt-2">
                    {formData.listingType === 'sale'
                      ? 'Enter the total sale price in Philippine Peso'
                      : 'Enter the monthly rental rate in Philippine Peso'}
                  </p>
                </div>
              </div>
            </div>

            {/* ── SECTION 4: Amenities & Features ── */}
            <div className={activeSection === 4 ? 'block' : 'hidden'}>
              <div className="p-8 sm:p-12">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 bg-red-600/20 rounded-xl flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Amenities & Features</h2>
                    <p className="text-white/40 text-sm">What does the property offer?</p>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-10">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Amenities</label>
                  <div className="flex flex-wrap gap-2">
                    {AMENITY_OPTIONS.map(amenity => {
                      const selected = formData.amenities.includes(amenity);
                      return (
                        <button
                          key={amenity} type="button" onClick={() => handleAmenityToggle(amenity)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selected
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                          }`}
                        >
                          {amenity}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Features */}
                <div className="mb-10">
                  <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest mb-3">Features</label>
                  <div className="flex flex-wrap gap-2">
                    {FEATURE_OPTIONS.map(feature => {
                      const selected = formData.features.includes(feature);
                      return (
                        <button
                          key={feature} type="button" onClick={() => handleFeatureToggle(feature)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            selected
                              ? 'bg-red-600 border-red-600 text-white'
                              : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white/80'
                          }`}
                        >
                          {feature}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Summary card */}
                <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8">
                  <p className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">Listing Summary</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    {[
                      { label: 'Type',      value: formData.propertyType },
                      { label: 'Listing',   value: formData.listingType === 'sale' ? 'For Sale' : 'For Rent' },
                      { label: 'Photos',    value: `${formData.images.length} selected` },
                      { label: 'Amenities', value: `${formData.amenities.length} selected` },
                    ].map(item => (
                      <div key={item.label}>
                        <p className="text-white/30 text-xs mb-1">{item.label}</p>
                        <p className="text-white font-bold capitalize">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4 flex-wrap">
                  <button
                    type="submit" disabled={loading}
                    className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-lg px-10 py-4 rounded-2xl shadow-xl shadow-red-600/30 transition-all hover:scale-105"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                    {loading ? 'Publishing...' : 'Publish Listing'}
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="px-8 sm:px-12 py-6 bg-white/5 border-t border-white/10 flex justify-between items-center">
              <button
                type="button"
                onClick={() => setActiveSection(p => Math.max(0, p - 1))}
                disabled={activeSection === 0}
                className="px-6 py-2.5 rounded-xl border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition disabled:opacity-30 disabled:cursor-not-allowed text-sm font-medium"
              >
                ← Previous
              </button>
              <span className="text-white/20 text-xs">{activeSection + 1} of {sections.length}</span>
              {activeSection < sections.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveSection(p => Math.min(sections.length - 1, p + 1))}
                  className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white transition text-sm font-bold shadow-lg shadow-red-600/30"
                >
                  Next →
                </button>
              ) : (
                <div className="w-24" />
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
