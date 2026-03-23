'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property/property-card';
import { PropertySearch } from '@/components/property/property-search';
import {
  Home, Building2, TreePine, Warehouse, ArrowUpDown, House,
  MapPin, ArrowRight,
  Grid3x3, LayoutList,
} from 'lucide-react';

interface PaginationMeta {
  current_page: number;
  last_page:    number;
  per_page:     number;
  total:        number;
}

const QUICK_FILTERS = [
  { label: 'All',        value: '',           icon: null },
  { label: 'For Sale',   value: 'sale',       icon: null },
  { label: 'For Rent',   value: 'rent',       icon: null },
  { label: 'House',      value: 'house',      icon: <Home      className="w-3.5 h-3.5" /> },
  { label: 'Condo',      value: 'condo',      icon: <Building2 className="w-3.5 h-3.5" /> },
  { label: 'Townhouse',  value: 'townhouse',  icon: <House     className="w-3.5 h-3.5" /> },
  { label: 'Land',       value: 'land',       icon: <TreePine  className="w-3.5 h-3.5" /> },
  { label: 'Commercial', value: 'commercial', icon: <Warehouse className="w-3.5 h-3.5" /> },
];

const SORT_OPTIONS = [
  { label: 'Newest',          value: 'newest'     },
  { label: 'Price: Low–High', value: 'price_asc'  },
  { label: 'Price: High–Low', value: 'price_desc' },
];

// ── Tiny 1×1 transparent placeholder (base64) used as blurDataURL fallback ──
const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

function formatPrice(amount: number): string {
  if (amount >= 1_000_000_000) return `₱${(amount / 1_000_000_000).toFixed(2)}B`;
  if (amount >= 1_000_000)     return `₱${(amount / 1_000_000).toFixed(2)}M`;
  if (amount >= 1_000)         return `₱${(amount / 1_000).toFixed(0)}K`;
  return `₱${amount.toLocaleString('en-PH')}`;
}

function normalizeListingType(raw: string): string {
  const v = raw.trim().toLowerCase();
  if (v === 'for sale' || v === 'sale' || v === 'buy') return 'sale';
  if (v === 'for rent' || v === 'rent')                return 'rent';
  return raw;
}

/**
 * Build a CDN thumbnail URL.
 * If the URL is a Cloudinary asset, we inject w/h/crop/format/quality transforms.
 * Otherwise the original URL is returned unchanged.
 */
function thumbUrl(url: string, w = 400, h = 300): string {
  if (!url) return url;
  if (url.includes('cloudinary.com')) {
    return url.replace(
      '/upload/',
      `/upload/w_${w},h_${h},c_fill,f_auto,q_auto:good/`,
    );
  }
  // Add similar transforms here for Imgix, Bunny, etc.
  return url;
}

// ── Stat Ticker ───────────────────────────────────────────────────────────────
function StatTicker({ total }: { total: number }) {
  return (
    <div
      className="overflow-hidden whitespace-nowrap border-y border-red-900/40 py-2.5"
      style={{ background: 'rgba(0,0,0,0.25)' }}
    >
      <div className="inline-flex animate-marquee gap-16 text-xs font-bold tracking-[0.2em] uppercase text-red-400/70">
        {[...Array(6)].map((_, i) => (
          <span key={i} className="flex items-center gap-8">
            <span>{total.toLocaleString()} Properties Listed</span>
            <span className="text-red-900">◆</span>
            <span>Across the Philippines</span>
            <span className="text-red-900">◆</span>
            <span>Alfima Realty Inc.</span>
            <span className="text-red-900">◆</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        .animate-marquee { animation: marquee 28s linear infinite; }
      `}</style>
    </div>
  );
}

// ── Hero Right Panel ──────────────────────────────────────────────────────────
function HeroPanel({ total, loading }: { total: number; loading: boolean }) {
  const stats = [
    { value: '12+',    label: 'Years in Business'   },
    { value: '500+',   label: 'Properties Sold'     },
    { value: '98%',    label: 'Client Satisfaction' },
    { value: loading ? '…' : total.toLocaleString(), label: 'Active Listings' },
  ];

  return (
    <div className="relative flex flex-col gap-4 select-none">
      <div
        className="absolute -top-8 -right-2 font-black pointer-events-none"
        style={{
          fontFamily: 'Georgia, serif',
          fontSize: '180px',
          color: 'transparent',
          WebkitTextStroke: '1px rgba(255,255,255,0.035)',
          lineHeight: 1,
          zIndex: 0,
        }}
      >
        №1
      </div>

      <p
        className="text-red-400/50 text-[10px] font-bold tracking-[0.35em] uppercase relative z-10"
        style={{ fontFamily: 'monospace' }}
      >
        Why choose us
      </p>

      <div className="grid grid-cols-2 gap-3 relative z-10">
        {stats.map((s, i) => (
          <div
            key={i}
            className="rounded-2xl p-5 border border-red-900/30 flex flex-col gap-1.5"
            style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(8px)' }}
          >
            <span
              className="text-3xl font-black text-white leading-none"
              style={{ fontFamily: 'Georgia, serif' }}
            >
              {s.value}
            </span>
            <span
              className="text-white/35 text-xs leading-tight"
              style={{ fontFamily: 'monospace' }}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 relative z-10">
        <div className="h-px flex-1" style={{ background: 'rgba(255,80,60,0.2)' }} />
        <span
          className="text-white/20 text-[10px] tracking-widest uppercase"
          style={{ fontFamily: 'monospace' }}
        >
          Trusted · Proven · Local
        </span>
        <div className="h-px flex-1" style={{ background: 'rgba(255,80,60,0.2)' }} />
      </div>

      <div className="flex flex-wrap gap-2 relative z-10">
        {['Metro Manila', 'Cebu', 'Davao', 'Cavite', 'Laguna', 'Batangas'].map(city => (
          <span
            key={city}
            className="px-3 py-1 rounded-full text-xs font-semibold border border-red-900/30 text-white/35"
            style={{ background: 'rgba(0,0,0,0.2)', fontFamily: 'monospace' }}
          >
            {city}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Filtered preview row ──────────────────────────────────────────────────────
interface PreviewProperty {
  id: number | string;
  title: string;
  listing_type?: string;
  listingType?: string;
  price?: number;
  price_per_month?: number;
  pricePerMonth?: number;
  city?: string;
  state?: string;
  images?: { url: string }[];
  thumbnail?: string;
  blur_hash?: string;
}

function PreviewRow({
  p,
  idx,
  isLast,
}: {
  p: PreviewProperty;
  idx: number;
  isLast: boolean;
}) {
  const isRent = (p.listing_type ?? p.listingType ?? '').toLowerCase().includes('rent');
  const rawPrice = Number(
    isRent
      ? (p.price_per_month ?? p.pricePerMonth ?? p.price ?? 0)
      : (p.price ?? 0),
  );
  const rawImageUrl = p.images?.[0]?.url ?? p.thumbnail ?? '';
  // Use a 96×96 crop for the tiny row thumbnail (2× for retina = 192px)
  const imageUrl = thumbUrl(rawImageUrl, 96, 96);
  const location = [p.city, p.state].filter(Boolean).join(', ');

  return (
    <Link
      href={`/properties/${p.id}`}
      className="flex items-center gap-3 px-4 py-3 group transition-all"
      style={{ borderBottom: !isLast ? '1px solid rgba(255,255,255,0.05)' : 'none' }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
    >
      {/* Thumbnail — 48×48, lazy, with blur placeholder */}
      <div className="relative w-12 h-12 rounded-lg shrink-0 overflow-hidden border border-white/10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={p.title}
            fill
            sizes="48px"
            loading="lazy"
            placeholder="blur"
            blurDataURL={p.blur_hash ?? BLUR_PLACEHOLDER}
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-white/10" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-sm leading-tight">
          {formatPrice(rawPrice)}
          {isRent ? (
            <span className="text-white/40 font-normal text-xs">/mo</span>
          ) : null}
        </p>
        <p className="text-white/70 text-xs line-clamp-1 mt-0.5">{p.title}</p>
        {location && (
          <p className="text-white/35 text-[10px] mt-0.5 flex items-center gap-1">
            <MapPin className="w-2.5 h-2.5 shrink-0 text-red-400/60" />
            {location}
          </p>
        )}
      </div>
      <ArrowRight className="w-3.5 h-3.5 text-white/20 group-hover:text-red-400 transition-colors shrink-0" />
    </Link>
  );
}

// ── Inner page ────────────────────────────────────────────────────────────────
function PropertiesPageInner() {
  const searchParams = useSearchParams();
  const [properties,    setProperties]    = useState<Property[]>([]);
  const [pagination,    setPagination]    = useState<PaginationMeta | null>(null);
  const [loading,       setLoading]       = useState(true);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [activeFilters, setActiveFilters] = useState<any>(null);
  const [quickFilter,   setQuickFilter]   = useState('');
  const [sortBy,        setSortBy]        = useState('newest');
  const [viewMode,      setViewMode]      = useState<'grid' | 'list'>('grid');

  const fetchProperties = async (
    filters?: any,
    page = 1,
    quick = quickFilter,
    sort = sortBy,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page',     String(page));
      params.append('per_page', '12');
      params.append('sort',     sort);

      if (filters) {
        if (filters.search)      params.append('search',      filters.search);
        if (filters.listingType) params.append('listingType', normalizeListingType(filters.listingType));
        if (filters.type)        params.append('type',        filters.type);
        if (filters.minPrice)    params.append('minPrice',    filters.minPrice);
        if (filters.maxPrice)    params.append('maxPrice',    filters.maxPrice);
        if (filters.bedrooms)    params.append('bedrooms',    filters.bedrooms);
        if (filters.city)        params.append('city',        filters.city);
      } else {
        const urlParams = new URLSearchParams(
          typeof window !== 'undefined' ? window.location.search : '',
        );
        urlParams.forEach((value, key) => {
          if (key === 'page' || key === 'per_page' || key === 'sort') return;
          params.append(key, key === 'listingType' ? normalizeListingType(value) : value);
        });
      }

      if (quick === 'sale')           params.set('listingType', 'sale');
      else if (quick === 'rent')      params.set('listingType', 'rent');
      else if (quick && quick !== '') params.set('type', quick);

      const response = await fetch(`/api/properties?${params}`);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      setProperties(data.data ?? []);
      setPagination({
        current_page: data.current_page,
        last_page:    data.last_page,
        per_page:     data.per_page,
        total:        data.total,
      });
    } catch (error) {
      console.error('Failed to fetch properties:', error);
      setProperties([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  };

  const searchParamsString = searchParams.toString();

  useEffect(() => {
    setCurrentPage(1);
    setActiveFilters(null);
    setQuickFilter('');
    setSortBy('newest');
    fetchProperties(null, 1, '', 'newest');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParamsString]);

  const isFiltered = !!(activeFilters || quickFilter);

  const handleSearch      = (f: any)    => { setActiveFilters(f); setCurrentPage(1); fetchProperties(f, 1, quickFilter, sortBy); };
  const handleQuickFilter = (v: string) => { setQuickFilter(v);   setCurrentPage(1); fetchProperties(activeFilters, 1, v, sortBy); };
  const handleSort        = (v: string) => { setSortBy(v);        setCurrentPage(1); fetchProperties(activeFilters, 1, quickFilter, v); };
  const handlePageChange  = (p: number) => {
    setCurrentPage(p);
    fetchProperties(activeFilters, p, quickFilter, sortBy);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full min-h-screen" style={{ background: '#150808', fontFamily: "'Georgia', serif" }}>

      {/* ── Hero ── */}
      <section
        className="relative pt-28 overflow-hidden"
        style={{ background: 'linear-gradient(160deg, #3d0a0a 0%, #6b1212 40%, #2a0606 100%)' }}
      >
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #fff 0px, #fff 1px, transparent 1px, transparent 12px)',
        }} />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #e74c3c 0%, transparent 70%)' }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 max-w-[40px]" style={{ background: 'rgba(255,120,100,0.4)' }} />
            <span
              className="text-red-300/60 text-[10px] font-bold tracking-[0.35em] uppercase"
              style={{ fontFamily: 'monospace' }}
            >
              Alfima Realty Inc. · Property Listings
            </span>
          </div>

          {/* Two-column: headline+search LEFT, panel RIGHT */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-start">

            {/* LEFT */}
            <div>
              <h1
                className="font-black leading-none mb-6 text-white"
                style={{
                  fontSize: 'clamp(3.5rem, 8vw, 7rem)',
                  letterSpacing: '-0.03em',
                  lineHeight: 0.9,
                }}
              >
                <span className="block">Find Your</span>
                <span
                  className="block"
                  style={{
                    WebkitTextStroke: '2px rgba(231,76,60,0.8)',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Next Home.
                </span>
              </h1>

              <div className="mb-6 max-w-xl">
                <PropertySearch onSearch={handleSearch} />
              </div>

              <div className="flex items-center gap-2 flex-wrap pb-8">
                {QUICK_FILTERS.map(f => (
                  <button
                    key={f.value}
                    onClick={() => handleQuickFilter(f.value)}
                    className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold tracking-wide border transition-all duration-200 ${
                      quickFilter === f.value
                        ? 'text-white border-red-500 shadow-lg shadow-red-900/40'
                        : 'border-white/15 text-white/60 hover:text-white hover:border-white/30'
                    }`}
                    style={
                      quickFilter === f.value
                        ? { background: 'linear-gradient(135deg, #c0392b, #96281b)' }
                        : { background: 'rgba(255,255,255,0.04)' }
                    }
                  >
                    {f.icon}{f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT */}
            <div className="hidden lg:block pb-0">
              {isFiltered ? (
                <div
                  className="rounded-2xl overflow-hidden flex flex-col"
                  style={{
                    minHeight: '340px',
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                  }}
                >
                  {/* Header */}
                  <div
                    className="flex items-center justify-between px-4 py-3.5"
                    style={{
                      background: 'rgba(255,255,255,0.07)',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-1.5 h-8 rounded-full"
                        style={{ background: 'linear-gradient(to bottom, #e74c3c, #96281b)' }}
                      />
                      <div>
                        <p
                          className="text-white/40 text-[9px] font-bold tracking-[0.3em] uppercase"
                          style={{ fontFamily: 'monospace' }}
                        >
                          Top results
                        </p>
                        <p
                          className="text-white font-black text-lg leading-tight"
                          style={{ fontFamily: 'Georgia, serif' }}
                        >
                          {loading ? '…' : (pagination?.total ?? properties.length).toLocaleString()}
                          <span className="text-white/40 text-xs font-normal ml-1">
                            {(pagination?.total ?? 0) === 1 ? 'property' : 'properties'}
                          </span>
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => { handleQuickFilter(''); handleSearch(null); }}
                      className="text-white/60 hover:text-white text-[10px] font-black tracking-widest uppercase transition-all px-3 py-1.5 rounded-lg hover:bg-white/10"
                      style={{ fontFamily: 'monospace' }}
                    >
                      × Clear
                    </button>
                  </div>

                  {/* Preview rows */}
                  <div className="flex flex-col flex-1">
                    {loading ? (
                      [...Array(4)].map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 px-4 py-3 animate-pulse"
                          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                        >
                          <div
                            className="w-12 h-12 rounded-lg shrink-0"
                            style={{ background: 'rgba(255,255,255,0.08)' }}
                          />
                          <div className="flex-1 flex flex-col gap-1.5">
                            <div className="h-3 rounded-md" style={{ background: 'rgba(255,255,255,0.1)', width: '55%' }} />
                            <div className="h-2.5 rounded-md" style={{ background: 'rgba(255,255,255,0.06)', width: '80%' }} />
                            <div className="h-2 rounded-md" style={{ background: 'rgba(255,255,255,0.04)', width: '40%' }} />
                          </div>
                        </div>
                      ))
                    ) : (
                      properties.slice(0, 4).map((p: any, idx) => (
                        <PreviewRow
                          key={p.id}
                          p={p}
                          idx={idx}
                          isLast={idx === Math.min(3, properties.length - 1)}
                        />
                      ))
                    )}

                    {!loading && (pagination?.total ?? 0) > 4 && (
                      <div className="px-4 py-3 mt-auto text-center">
                        <p className="text-white/30 text-[11px]" style={{ fontFamily: 'monospace' }}>
                          + {((pagination?.total ?? 0) - 4).toLocaleString()} more below ↓
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <HeroPanel total={pagination?.total ?? 0} loading={loading} />
              )}
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
          <svg viewBox="0 0 1440 48" preserveAspectRatio="none" className="w-full h-12" fill="#150808">
            <path d="M0,48 C480,0 960,48 1440,16 L1440,48 Z" />
          </svg>
        </div>
      </section>

      {/* ── Ticker ── */}
      <StatTicker total={pagination?.total ?? 0} />

      {/* ── Results ── */}
      <section className="py-10" style={{ background: '#150808' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: 'linear-gradient(to bottom, #e74c3c, #96281b)' }}
              />
              <p className="text-white/50 text-sm font-medium" style={{ fontFamily: 'monospace' }}>
                {loading ? (
                  <span className="text-white/20">Loading…</span>
                ) : (
                  <>
                    <span
                      className="text-red-400 font-black text-xl"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {(pagination?.total ?? properties.length).toLocaleString()}
                    </span>
                    <span className="ml-1.5">
                      {(pagination?.total ?? 0) === 1 ? 'property' : 'properties'}
                    </span>
                    {pagination && pagination.last_page > 1 && (
                      <span className="text-white/25 ml-2 text-xs">
                        · p.{pagination.current_page}/{pagination.last_page}
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Sort */}
              <div
                className="flex items-center gap-2 border border-red-900/40 rounded-xl px-3 py-2"
                style={{ background: 'rgba(80,10,10,0.4)' }}
              >
                <ArrowUpDown className="w-3.5 h-3.5 text-red-500/60" />
                <select
                  value={sortBy}
                  onChange={e => handleSort(e.target.value)}
                  className="bg-transparent text-white/70 text-xs font-bold focus:outline-none cursor-pointer"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value} style={{ background: '#2d0a0a' }}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* View toggle */}
              <div
                className="flex border border-red-900/40 rounded-xl overflow-hidden"
                style={{ background: 'rgba(80,10,10,0.4)' }}
              >
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${viewMode === 'grid' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                  style={viewMode === 'grid' ? { background: 'rgba(192,57,43,0.5)' } : {}}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${viewMode === 'list' ? 'text-white' : 'text-white/30 hover:text-white/60'}`}
                  style={viewMode === 'list' ? { background: 'rgba(192,57,43,0.5)' } : {}}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {/* Grid / List */}
          {loading ? (
            <div
              className={`grid gap-5 ${
                viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
              }`}
            >
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-72 rounded-2xl animate-pulse border border-red-900/20"
                  style={{ background: 'linear-gradient(135deg, #1e0808 0%, #110404 100%)' }}
                />
              ))}
            </div>
          ) : properties.length > 0 ? (
            <>
              <div
                className={`grid gap-5 mb-12 ${
                  viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'
                }`}
              >
                {properties.map((p, idx) => (
                  /**
                   * Pass `priority` to the first 3 cards (above-the-fold on most screens).
                   * PropertyCard must accept and forward this prop to next/image.
                   */
                  <PropertyCard key={p.id} property={p} priority={idx < 3} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-2 flex-wrap pt-4 border-t border-red-900/20">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-25 disabled:cursor-not-allowed transition border border-red-900/40 hover:border-red-700/60"
                    style={{ background: 'rgba(80,10,10,0.4)', fontFamily: 'monospace' }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: pagination.last_page }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === pagination.last_page || Math.abs(p - currentPage) <= 2)
                    .reduce<(number | 'ellipsis')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && p - (arr[idx - 1] as number) > 1) acc.push('ellipsis');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, idx) =>
                      p === 'ellipsis' ? (
                        <span key={`e-${idx}`} className="px-2 text-white/20" style={{ fontFamily: 'monospace' }}>
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => handlePageChange(p as number)}
                          className="w-9 h-9 rounded-xl text-sm font-bold transition border"
                          style={
                            currentPage === p
                              ? {
                                  background: 'linear-gradient(135deg,#c0392b,#96281b)',
                                  borderColor: 'rgba(192,57,43,0.5)',
                                  color: 'white',
                                  fontFamily: 'monospace',
                                }
                              : {
                                  background: 'rgba(80,10,10,0.35)',
                                  borderColor: 'rgba(180,30,30,0.25)',
                                  color: 'rgba(255,255,255,0.5)',
                                  fontFamily: 'monospace',
                                }
                          }
                        >
                          {p}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.last_page}
                    className="px-4 py-2 rounded-xl text-white text-sm font-semibold disabled:opacity-25 disabled:cursor-not-allowed transition border border-red-900/40 hover:border-red-700/60"
                    style={{ background: 'rgba(80,10,10,0.4)', fontFamily: 'monospace' }}
                  >
                    Next →
                  </button>
                </div>
              )}
            </>
          ) : (
            <div
              className="rounded-2xl p-16 text-center border border-red-900/30"
              style={{ background: 'linear-gradient(135deg, #1e0808 0%, #110404 100%)' }}
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{
                  background: 'rgba(192,57,43,0.12)',
                  border: '1px solid rgba(192,57,43,0.25)',
                }}
              >
                <Home className="w-8 h-8 text-red-500/50" />
              </div>
              <p className="text-2xl text-white font-black mb-2" style={{ fontFamily: 'Georgia, serif' }}>
                No properties found
              </p>
              <p className="text-white/30 text-sm mb-6">
                Try adjusting your filters or clearing the active filter
              </p>
              {quickFilter && (
                <button
                  onClick={() => handleQuickFilter('')}
                  className="inline-flex items-center gap-2 text-white font-bold px-6 py-2.5 rounded-full border border-red-600/40 hover:border-red-400 transition text-sm"
                  style={{ background: 'linear-gradient(135deg,#c0392b,#96281b)' }}
                >
                  Clear Filter
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div
          className="w-full min-h-screen flex items-center justify-center"
          style={{ background: '#150808' }}
        >
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 rounded-full border-2 border-red-600 border-t-transparent animate-spin" />
            <p
              className="text-white/30 text-xs tracking-widest uppercase"
              style={{ fontFamily: 'monospace' }}
            >
              Loading properties
            </p>
          </div>
        </div>
      }
    >
      <PropertiesPageInner />
    </Suspense>
  );
}