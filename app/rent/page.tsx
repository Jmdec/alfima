'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property/property-card';
import { PropertySearch } from '@/components/property/property-search';

export default function RentPage() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProperties = async (filters?: any) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ listingType: 'rent' });
      if (filters) {
        if (filters.search) params.append('search', filters.search);
        if (filters.type) params.append('type', filters.type);
        if (filters.minPrice) params.append('minPrice', filters.minPrice);
        if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
        if (filters.bedrooms) params.append('bedrooms', filters.bedrooms);
        if (filters.city) params.append('city', filters.city);
      } else {
        searchParams.forEach((value, key) => {
          if (key !== 'listingType') params.append(key, value);
        });
      }

      const response = await fetch(`/api/properties?${params}`);
      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error('Failed to fetch properties:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [searchParams]);

  const handleSearch = (filters: any) => {
    fetchProperties(filters);
  };

  return (
    <div className="w-full min-h-screen">
      {/* Hero Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-green-900/60 via-green-800/40 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute top-10 right-10 w-96 h-96 bg-lime-400/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-emerald-400/15 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-4 text-balance">Properties for Rent</h1>
            <p className="text-green-100 text-xl max-w-2xl">
              Find your perfect rental property with flexible lease terms and excellent amenities
            </p>
          </div>

          {/* Search */}
          <PropertySearch onSearch={handleSearch} />
        </div>
      </section>

      {/* Results Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-green-900/40 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 h-96 rounded-2xl animate-pulse"></div>
              ))}
            </div>
          ) : (
            <>
              <div className="mb-12">
                <p className="text-green-100 text-lg font-medium">
                  Found <span className="text-lime-300 font-bold">{properties.length}</span> properties
                </p>
              </div>
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {properties.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-16 text-center hover:bg-white/15 transition">
                  <p className="text-2xl text-white font-semibold mb-4">No properties found</p>
                  <p className="text-green-100 text-lg">Try adjusting your search filters to find what you're looking for</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}
