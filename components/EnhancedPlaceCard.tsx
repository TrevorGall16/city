'use client';

import { useState, useEffect } from 'react';
// FIX 1: Point to the correct 'lib' folder you confirmed
import { createClient } from '@/lib/supabase/client'; 
// FIX 2: Use curly brackets { Toast } to match the new file
import { Toast } from '@/components/ui/Toast'; 
import Image from 'next/image';
import Link from 'next/link';

// Define the interface for your Place data
interface Place {
  id: string;
  name: string;
  description: string;
  image: string; // or image_url depending on your JSON
  category?: string;
  // add other fields your JSON has, like location, etc.
}

interface EnhancedPlaceCardProps {
  place: Place;
  citySlug: string;
}

export default function EnhancedPlaceCard({ place, citySlug }: EnhancedPlaceCardProps) {
  const supabase = createClient();
  const [isFavorite, setIsFavorite] = useState(false);
  // We rename the state variable to 'toastState' so it doesn't conflict with the component 'Toast'
  const [toastState, setToastState] = useState<{ message: string; type: 'info' | 'success' | 'error' } | null>(null);

  // Check initial Favorite Status
  useEffect(() => {
    const checkFav = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('place_id', place.id)
        .single();
      
      if (data) setIsFavorite(true);
    };
    checkFav();
  }, [place.id, supabase]);

  const toggleFavorite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from opening when clicking heart
    
    // 1. Check Auth
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setToastState({ message: 'Please log in to save favorites', type: 'info' });
      return;
    }

    // 2. Toggle DB
    if (isFavorite) {
      setIsFavorite(false); // Optimistic UI update
      await supabase.from('favorites').delete()
        .eq('user_id', user.id)
        .eq('place_id', place.id);
    } else {
      setIsFavorite(true); // Optimistic UI update
      await supabase.from('favorites').insert({
        user_id: user.id,
        place_id: place.id,
        city_slug: citySlug,
      });
    }
  };

  return (
    <>
      {/* Toast Notification */}
      {toastState && (
        <Toast 
          message={toastState.message} 
          type={toastState.type as any} 
          onClose={() => setToastState(null)} 
        />
      )}
      
      {/* Card UI */}
      <div className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-slate-200 dark:border-slate-800">
        
        {/* Image Area */}
        <div className="relative h-48 w-full overflow-hidden">
          <Image 
            src={place.image} 
            alt={place.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
          
          {/* Heart Button */}
          <button 
            onClick={toggleFavorite}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-900/90 hover:scale-110 transition-all shadow-sm"
          >
            <svg 
              className={`w-5 h-5 transition-colors ${isFavorite ? 'text-red-500 fill-red-500' : 'text-slate-400'}`}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 line-clamp-1">{place.name}</h3>
            {place.category && (
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                {place.category}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
            {place.description}
          </p>
        </div>
      </div>
    </>
  );
}