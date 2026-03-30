'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Property } from '@/lib/types';
import { Heart, MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { useFavorites } from '@/lib/store';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
  priority?: boolean; // pass true for above-the-fold cards (first 3 on listing page)
}

const BLUR_PLACEHOLDER =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

const FALLBACK_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23e2e8f0'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='16' fill='%2394a3b8'%3ENo Image%3C/text%3E%3C/svg%3E";
const API_BASE = (process.env.NEXT_PUBLIC_API_IMG ?? 'http://localhost:8000').replace(/\/$/, '');

/**
 * Guarantees an absolute URL.
 * - Already absolute (http/https) → returned as-is
 * - Relative path ("agents/avatars/abc.jpg" or "/agents/avatars/abc.jpg")
 *   → prepended with NEXT_PUBLIC_API_IMG
 * - null / undefined / empty → FALLBACK_IMG
 */
function toAbsoluteUrl(url: string | null | undefined): string {
  if (!url) return FALLBACK_IMG;
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  
  // Clean up the URL path
  const cleanPath = url.replace(/^\//, '');
  const absoluteUrl = `${API_BASE}/${cleanPath}`;
  
  console.log("[v0] Image URL:", absoluteUrl);
  return absoluteUrl;
}

// ── Price formatter ───────────────────────────────────────────────────────────
function formatPrice(amount: number): string {
  if (amount >= 1_000_000_000) {
    const val = amount / 1_000_000_000;
    return `₱${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}B`;
  }
  if (amount >= 1_000_000) {
    const val = amount / 1_000_000;
    return `₱${val % 1 === 0 ? val.toFixed(0) : val.toFixed(2)}M`;
  }
  if (amount >= 1_000) {
    const val = amount / 1_000;
    return `₱${val % 1 === 0 ? val.toFixed(0) : val.toFixed(1)}K`;
  }
  return `₱${amount.toLocaleString('en-PH')}`;
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorited = isFavorited(property.id);

  // Property hero image — always absolute
  // Use thumbnail first (the one set in admin), fall back to first gallery image
  const rawImageUrl = imageError
    ? FALLBACK_IMG
    : toAbsoluteUrl(property.thumbnail ?? property.images?.[0]?.url);

  // Agent avatar — always absolute
  const agentAvatarUrl = toAbsoluteUrl(property.agent?.avatar);

  const listingType = property.listing_type ?? property.listingType;
  const isRent = listingType === 'rent';

  const rawPrice = Number(
    isRent
      ? (property.price_per_month ?? property.pricePerMonth ?? property.price ?? 0)
      : (property.price ?? property.price_per_month ?? property.pricePerMonth ?? 0),
  );

  const priceDisplay = isRent ? `${formatPrice(rawPrice)}/mo` : formatPrice(rawPrice);
  const fullPrice    = isRent
    ? `₱${rawPrice.toLocaleString('en-PH')}/mo`
    : `₱${rawPrice.toLocaleString('en-PH')}`;

  return (
    <Link href={`/properties/${property.id}`} className="h-full">
      <div className="flex flex-col h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer hover:bg-white/15">

        {/* ── Property image ── */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden bg-muted">
          <Image
            src={rawImageUrl}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL={BLUR_PLACEHOLDER}
            className="object-cover group-hover:scale-110 transition duration-300"
            onError={(error) => {
              console.log("[v0] Image load failed:", rawImageUrl, error);
              setImageError(true);
            }}
            unoptimized={rawImageUrl.includes('localhost') || rawImageUrl.includes('data:image')}
          />

          {/* Listing type badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-xs font-bold z-10">
            {isRent ? 'For Rent' : 'For Sale'}
          </div>

          {/* Favorite button */}
          <button
            onClick={e => { e.preventDefault(); toggleFavorite(property.id); }}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur hover:bg-white/20 p-2 rounded-full transition z-10"
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-accent stroke-accent' : 'stroke-white'}`} />
          </button>
        </div>

        {/* ── Card body ── */}
        <div className="flex flex-col flex-1 p-4">

          {/* Price */}
          <div className="mb-2">
            <p className="text-xl font-bold text-primary" title={fullPrice}>
              {priceDisplay}
            </p>
            {rawPrice >= 1_000 && (
              <p className="text-[11px] text-muted-foreground/70 -mt-0.5">{fullPrice}</p>
            )}
          </div>

          {/* Title */}
          <h3 className="font-semibold text-base mb-2 line-clamp-2 group-hover:text-primary transition">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-start gap-1 text-sm text-muted-foreground mb-3">
            <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <p className="line-clamp-1">
              {[property.address, property.city, property.state].filter(Boolean).join(', ')}
            </p>
          </div>

          {/* Features */}
          <div className="flex gap-4 mb-4 text-xs text-muted-foreground border-t border-border pt-3">
            {(property.bedrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Bed className="w-4 h-4" />
                <span>{property.bedrooms} Bed</span>
              </div>
            )}
            {(property.bathrooms ?? 0) > 0 && (
              <div className="flex items-center gap-1">
                <Bath className="w-4 h-4" />
                <span>{property.bathrooms} Bath</span>
              </div>
            )}
            {property.area && (
              <div className="flex items-center gap-1">
                <Ruler className="w-4 h-4" />
                <span>{property.area} sqm</span>
              </div>
            )}
          </div>

          {/* ── Agent avatar — plain <img>, no next/image optimization needed at 32px ── */}
          {property.agent && (
            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={agentAvatarUrl}
                alt={property.agent.name}
                width={32}
                height={32}
                className="rounded-full object-cover flex-shrink-0 ring-1 ring-white/20 w-8 h-8"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(property.agent!.name)}&size=32&background=random`; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground line-clamp-1">
                  Agent: {property.agent.name}
                </p>
              </div>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
}
