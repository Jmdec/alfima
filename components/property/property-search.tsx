'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PropertySearchProps {
  onSearch: (filters: {
    search?: string;
    type?: string;
    listingType?: string;
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    city?: string;
  }) => void;
}

export function PropertySearch({ onSearch }: PropertySearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [search, setSearch] = useState('');
  const [listingType, setListingType] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [bedrooms, setBedrooms] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const handleSearch = () => {
    onSearch({
      search: search || undefined,
      listingType: listingType || undefined,
      type: type || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      bedrooms: bedrooms ? parseInt(bedrooms) : undefined,
      city: city || undefined,
    });
  };

  const handleReset = () => {
    setSearch('');
    setListingType('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setCity('');
    onSearch({});
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 mb-8">
      {/* Main Search Bar */}
      <div className="flex gap-2 flex-col sm:flex-row">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-300" />
          <input
            type="text"
            placeholder="Search by address, city, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 transition text-sm text-white placeholder-green-300"
          />
        </div>
        <Button
          onClick={handleSearch}
          className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-green-950 font-bold whitespace-nowrap"
        >
          Search
        </Button>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-3 border border-green-700 rounded-lg hover:bg-green-900/50 transition flex items-center gap-2 justify-center sm:w-auto text-white"
        >
          <SlidersHorizontal className="w-5 h-5" />
          <span className="hidden sm:inline text-sm font-medium">Filters</span>
        </button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-green-700 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-down">
          {/* Listing Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Type</label>
            <select
              value={listingType}
              onChange={(e) => setListingType(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white"
            >
              <option value="">All Types</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          {/* Property Type */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Property Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white"
            >
              <option value="">All Types</option>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Land</option>
            </select>
          </div>

          {/* Min Price */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Min Price</label>
            <input
              type="number"
              placeholder="₱0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white placeholder-green-300"
            />
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Max Price</label>
            <input
              type="number"
              placeholder="₱1,000,000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white placeholder-green-300"
            />
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">Bedrooms</label>
            <select
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white"
            >
              <option value="">Any</option>
              <option value="0">Studio</option>
              <option value="1">1+</option>
              <option value="2">2+</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="5">5+</option>
            </select>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white">City</label>
            <input
              type="text"
              placeholder="Enter city..."
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full px-3 py-2 bg-green-950 border border-green-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-lime-400 text-sm text-white placeholder-green-300"
            />
          </div>

          {/* Actions */}
          <div className="sm:col-span-2 lg:col-span-4 flex gap-2 justify-end">
            <Button
              onClick={handleReset}
              variant="outline"
              className="border border-green-700 hover:bg-green-900/50 text-white"
            >
              Reset
            </Button>
            <Button
              onClick={handleSearch}
              className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-green-950 font-bold"
            >
              Apply Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
