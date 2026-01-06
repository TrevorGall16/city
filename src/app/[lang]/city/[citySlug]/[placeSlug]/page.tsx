/**
 * 🛰️ MASTER AI: PLACE PAGE (V3.1 - CRASH FIX)
 * ✅ Fixed React Error #31: Prevents object rendering in description.
 * ✅ Fixed Data Access: Checks both 'place' and 'desc' for metadata (price, vibe).
 * ✅ Safety: Added null checks for all dynamic text fields.
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import { getDict } from '@/data/dictionaries'
import { getCityFont } from '@/lib/fonts/cityFonts'
import { Clock, DollarSign, Zap, Star, MapPin, ArrowLeft } from 'lucide-react'
import { CommentThread } from '@/components/features/CommentThread'

interface PageProps {
  params: Promise<{ lang: string; citySlug: string; placeSlug: string }>
}

async function getPlaceData(citySlug: string, placeSlug: string, lang: string) {
  try {
    // 🎯 Fallback logic: If localized file missing, try English
    const fileName = lang === 'en' ? `${citySlug}.json` : `${citySlug}-${lang}.json`;
    const filePath = path.join(process.cwd(), 'src/data/cities', fileName);
    
    let fileContent;
    try {
      fileContent = await fs.readFile(filePath, 'utf8');
    } catch (e) {
      // If FR file missing, fallback to EN
      const fallbackPath = path.join(process.cwd(), 'src/data/cities', `${citySlug}.json`);
      fileContent = await fs.readFile(fallbackPath, 'utf8');
    }

    const city = JSON.parse(fileContent);
    const allPlaces = [...(city.must_see?.flatMap((g: any) => g.items) || []), ...(city.must_eat || [])];
    const place = allPlaces.find((p: any) => p.slug === placeSlug);
    return place ? { place, cityName: city.name } : null;
  } catch { return null; }
}

export default async function PlacePage({ params }: PageProps) {
  const { lang, citySlug, placeSlug } = await params;
  const data = await getPlaceData(citySlug, placeSlug, lang);
  const dict = await getDict(lang);
  
  if (!data) notFound();

  const { place } = data;
  const cityFontClass = getCityFont(citySlug);
  const desc = place.description;

  // 🛡️ MASTER AI CRASH PROTECTION
  // Determine the display text safely. Never return an object.
  const shortDesc = typeof desc === 'object' 
    ? (desc.short || desc.intro || '') // If object, get string or empty
    : (desc || ''); // If string, use it. If null, empty.

  const historyText = typeof desc === 'object' ? desc.history : null;
  const insiderTip = typeof desc === 'object' ? desc.insider_tip : null;

  // 🛡️ DATA FALLBACKS
  // Check 'place' first, then 'desc' (some data structures vary)
  const price = place.price_level || (typeof desc === 'object' ? desc.price_level : null);
  const vibe = place.vibe || (typeof desc === 'object' ? desc.vibe : null);
  const duration = place.duration || (typeof desc === 'object' ? desc.duration : null);
  const goodFor = place.good_for?.[0] || (typeof desc === 'object' ? desc.good_for?.[0] : null);

  // 🎯 SEO: JSON-LD Structured Data for Google
  const isRestaurant = place.category === 'food' || place.category === 'restaurant';
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': isRestaurant ? 'Restaurant' : 'TouristAttraction',
    name: place.name_en,
    alternateName: place.name_local !== place.name_en ? place.name_local : undefined,
    description: shortDesc,
    image: place.image,
    url: `https://citybasic.com/${lang}/city/${citySlug}/${placeSlug}`,
    ...(isRestaurant
      ? {
          servesCuisine: data.cityName,
          priceRange: price || undefined,
        }
      : {
          touristType: goodFor || undefined,
        }),
    ...(place.geo?.lat && place.geo?.lng
      ? {
          geo: {
            '@type': 'GeoCoordinates',
            latitude: place.geo.lat,
            longitude: place.geo.lng,
          },
          hasMap: `https://www.google.com/maps?q=${place.geo.lat},${place.geo.lng}`,
        }
      : {}),
    containedInPlace: {
      '@type': 'City',
      name: data.cityName,
    },
  }

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 ${cityFontClass}`}>
      {/* 🎯 SEO: Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* Sleek Breadcrumb */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/city/${citySlug}`} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> {dict.view_guide || 'Back'}
          </Link>
          <div className="flex items-center gap-2 text-slate-400">
            <MapPin className="w-3 h-3" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">{data.cityName}</span>
          </div>
        </div>
      </nav>

      <article className="max-w-5xl mx-auto px-6 mt-8">
        {/* Cinematic Wide Image */}
        <div className="relative aspect-[21/9] rounded-[3rem] overflow-hidden shadow-2xl mb-12 group border-4 border-white dark:border-slate-800">
          <Image 
            src={place.image || '/images/placeholder.jpg'} 
            alt={place.name_en || 'Place Image'} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            priority 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

        {/* Refined Header */}
        <header className="mb-12">
          <div className="flex flex-col gap-2">
            {/* Local name check: Ensure it's a string and different from EN */}
            {typeof place.name_local === 'string' && place.name_local !== place.name_en && (
              <span className="text-2xl font-black uppercase tracking-[0.3em] text-indigo-500 mb-2">
                {place.name_local}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-6">
              {place.name_en}
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-slate-600 dark:text-slate-400 font-light max-w-4xl leading-relaxed italic">
            "{shortDesc}"
          </p>
        </header>

        {/* ✅ HIGH SATURATION TILES WITH LOCALIZED LABELS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-500/10 dark:bg-emerald-500/20', label: dict.logistics || 'Cost', val: price },
            { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500/10 dark:bg-amber-500/20', label: 'Vibe', val: vibe },
            { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/10 dark:bg-blue-500/20', label: 'Duration', val: duration },
            { icon: Star, color: 'text-purple-600', bg: 'bg-purple-500/10 dark:bg-purple-500/20', label: 'Best For', val: goodFor }
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-6 rounded-[2rem] border border-white/50 dark:border-white/10 flex flex-col items-center text-center shadow-sm backdrop-blur-sm`}>
              <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-1">{item.label}</p>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{item.val || 'Standard'}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {historyText && (
            <div className="prose prose-lg prose-slate dark:prose-invert max-w-none mb-16">
              <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-1 bg-indigo-500 rounded-full" /> {dict.the_backstory || "The Backstory"}
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">{historyText}</p>
            </div>
          )}

          {insiderTip && (
            <div className="bg-indigo-600 p-10 md:p-12 rounded-[2rem] text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-12 opacity-10">
                <Star className="w-32 h-32" />
              </div>
              <h3 className="relative flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-200 mb-6">
                <Star className="w-5 h-5 fill-current" /> {dict.local_secret || "Local Secret"}
              </h3>
              <p className="relative text-2xl md:text-3xl font-bold leading-tight">"{insiderTip}"</p>
            </div>
          )}

          <div className="mt-20 pt-16 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-2xl font-black uppercase mb-8 text-slate-900 dark:text-white">{dict.discussion_tips || "Discussion & Tips"}</h3>
            <CommentThread citySlug={citySlug} placeSlug={placeSlug} dict={dict} />
          </div>
        </div>
      </article>
    </main>
  );
}