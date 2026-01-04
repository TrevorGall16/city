"use client";

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useRouter } from 'next/navigation';

const REGIONS: Record<string, { color: string; center: [number, number]; zoom: number }> = {
  'Europe': { color: '#3b82f6', center: [50, 10], zoom: 4 },
  'Asia': { color: '#ef4444', center: [30, 100], zoom: 3 },
  'North America': { color: '#10b981', center: [40, -100], zoom: 3 },
  'South America': { color: '#f59e0b', center: [-20, -60], zoom: 3 },
  'Middle East': { color: '#8b5cf6', center: [25, 45], zoom: 4 },
  'Africa': { color: '#ec4899', center: [0, 20], zoom: 3 },
  'Oceania': { color: '#06b6d4', center: [-25, 135], zoom: 4 },
  'Other': { color: '#64748b', center: [25, 0], zoom: 2 }
};

export function InteractiveWorldMap({ cities, lang }: { cities: any[], lang: string }) {
  const router = useRouter();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const flyToRegion = (regionName: string) => {
    if (mapInstanceRef.current && REGIONS[regionName]) {
      const { center, zoom } = REGIONS[regionName];
      mapInstanceRef.current.flyTo(center, zoom, { duration: 1.5 });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [25, 0], zoom: 2, minZoom: 2, scrollWheelZoom: true, zoomControl: false
    });

    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png').addTo(map);

    cities.forEach((city) => {
      if (!city.lat || !city.lng || (city.lat === 0 && city.lng === 0)) return;

      // ✅ Master AI Matcher: Finds "North America" even if JSON has different casing
      const regionKey = Object.keys(REGIONS).find(k => 
        city.region && city.region.toLowerCase().trim() === k.toLowerCase().trim()
      ) || 'Other';
      
      const markerColor = REGIONS[regionKey].color;

      const marker = L.circleMarker([city.lat, city.lng], {
        radius: 8,
        fillColor: markerColor,
        color: "#ffffff",
        weight: 2,
        opacity: 1,
        fillOpacity: 1,
      }).addTo(map);

      marker.bindTooltip(`<b>${city.name}</b>`, { direction: 'top', offset: [0, -8] });
      marker.on('click', () => router.push(`/${lang}/city/${city.slug}`));
    });

    mapInstanceRef.current = map;
    return () => { if (mapInstanceRef.current) mapInstanceRef.current.remove(); mapInstanceRef.current = null; };
  }, [cities, lang, router]);

  return (
    <div className="w-full space-y-6">
      <div className="w-full h-[500px] rounded-[2rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl relative z-0">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      <div className="flex flex-wrap justify-center gap-4 px-6 py-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
        {Object.entries(REGIONS).map(([name, data]) => (
          <button key={name} onClick={() => flyToRegion(name)} className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
            <span className="w-3.5 h-3.5 rounded-full ring-2 ring-white dark:ring-slate-800" style={{ backgroundColor: data.color }} />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 transition-colors">
              {name}
            </span>
          </button>
        ))}
      </div>

      <style jsx global>{`
        .leaflet-container { background: #f1f5f9 !important; border-radius: 2rem; }
        :global(.dark) .leaflet-tile-pane { filter: invert(1) hue-rotate(180deg) brightness(0.8) contrast(0.9); }
      `}</style>
    </div>
  );
}