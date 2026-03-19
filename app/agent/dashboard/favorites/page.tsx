'use client';

import { useEffect, useState } from 'react';
import { Property } from '@/lib/types';
import { PropertyCard } from '@/components/property/property-card';
import { useFavorites, useAuth } from '@/lib/store';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function FavoritesPage() {
  const { user, initialized } = useAuth();
  const { favorites } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (initialized && !user) router.push('/login');
  }, [user, initialized, router]);

  useEffect(() => {
    if (!user) return;
    if (favorites.length === 0) { setLoading(false); setProperties([]); return; }

    const fetchProperties = async () => {
      try {
        // Fetch only the favorited IDs as a comma-separated query param
        const ids = favorites.join(',');
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?ids=${ids}`);
        const data = await res.json();
        setProperties(data.data ?? []);
      } catch (error) {
        console.error('Failed to fetch favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [favorites, user]);

  if (!initialized || !user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Saved Properties</h1>
        <p className="text-muted-foreground">
          {favorites.length} {favorites.length === 1 ? 'property' : 'properties'} saved
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass h-96 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-xl p-12 text-center">
          <p className="text-lg text-muted-foreground mb-4">No saved properties yet</p>
          <p className="text-sm text-muted-foreground mb-6">
            Start exploring properties and save your favorites
          </p>
          <Link href="/properties">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2">
              Browse Properties <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}