'use client';

import Link from 'next/link';
import { Property } from '@/lib/types';
import { Heart, MapPin, Bed, Bath, Ruler } from 'lucide-react';
import { useFavorites } from '@/lib/store';
import { useState } from 'react';

interface PropertyCardProps {
  property: Property;
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

export function PropertyCard({ property }: PropertyCardProps) {
  const { isFavorited, toggleFavorite } = useFavorites();
  const [imageError, setImageError] = useState(false);
  const favorited = isFavorited(property.id);

  const imageUrl = imageError
    ? 'https://via.placeholder.com/400x300?text=No+Image'
    : (property.images?.[0]?.url ?? property.thumbnail ?? 'https://via.placeholder.com/400x300?text=No+Image');

  const listingType = property.listing_type ?? property.listingType;
  const isRent = listingType === 'rent';

  const rawPrice = Number(
    isRent
      ? (property.price_per_month ?? property.pricePerMonth ?? property.price ?? 0)
      : (property.price ?? property.price_per_month ?? property.pricePerMonth ?? 0)
  );

  const priceDisplay = isRent
    ? `${formatPrice(rawPrice)}/mo`
    : formatPrice(rawPrice);

  const fullPrice = isRent
    ? `₱${rawPrice.toLocaleString('en-PH')}/mo`
    : `₱${rawPrice.toLocaleString('en-PH')}`;

  return (
    <Link href={`/properties/${property.id}`} className="h-full">
      {/* ✅ flex flex-col + h-full ensures card stretches to fill the grid row */}
      <div className="flex flex-col h-full bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer hover:bg-white/15">

        {/* Image */}
        <div className="relative h-48 flex-shrink-0 overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={property.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
          />

          {/* Listing type badge */}
          <div className="absolute top-4 left-4 bg-gradient-to-r from-red-600 to-red-700 text-white px-4 py-2 rounded-full text-xs font-bold">
            {isRent ? 'For Rent' : 'For Sale'}
          </div>

          {/* Favorite button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleFavorite(property.id);
            }}
            className="absolute top-4 right-4 bg-white/10 backdrop-blur hover:bg-white/20 p-2 rounded-full transition"
          >
            <Heart className={`w-5 h-5 ${favorited ? 'fill-accent stroke-accent' : 'stroke-white'}`} />
          </button>
        </div>

        {/* ✅ flex-1 makes this content area grow to fill remaining card height */}
        <div className="flex flex-col flex-1 p-4">

          {/* Price */}
          <div className="mb-2">
            <p className="text-xl font-bold text-primary" title={fullPrice}>
              {priceDisplay}
            </p>
            {rawPrice >= 1_000 && (
              <p className="text-[11px] text-muted-foreground/70 -mt-0.5">
                {fullPrice}
              </p>
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

          {/* ✅ mt-auto pushes agent info to the bottom of the card */}
          {property.agent && (
            <div className="mt-auto flex items-center gap-2 pt-3 border-t border-border">
              <img
                src={property.agent.avatar ?? 'https://via.placeholder.com/32'}
                alt={property.agent.name}
                className="w-8 h-8 rounded-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32'; }}
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground line-clamp-1">Agent: {property.agent.name}</p>
              </div>
            </div>
          )}

        </div>
      </div>
    </Link>
  );
}