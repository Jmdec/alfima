import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property/property-card';
import { Button } from '@/components/ui/button';

interface FeaturedPropertiesProps {
  properties: Property[];
  loading: boolean;
}

export function FeaturedProperties({ properties, loading }: FeaturedPropertiesProps) {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-green-900/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Featured Properties</h2>
          <p className="text-green-100 text-xl">Explore our handpicked selection of premium listings</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md h-96 rounded-2xl animate-pulse border border-white/20" />
            ))}
          </div>
        ) : (
          // ✅ items-stretch ensures all cards in a row grow to the same height
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 items-stretch">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}

        <div className="text-center">
          <Link href="/properties">
            <Button className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-green-950 font-bold gap-2 text-lg px-8 py-6">
              View All Properties <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}