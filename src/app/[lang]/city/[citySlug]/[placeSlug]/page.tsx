/**
 * Attraction Sub-Page - DESIGNER VERSION 3.0 (High Saturation)
 * ✅ Fixed ReferenceError: MapPin
 * ✅ Layout: Insider Tip moved under Backstory
 * ✅ Aesthetic: High-saturation color tiles
 */

import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { promises as fs } from 'fs'
import path from 'path'
import { getDict } from '@/data/dictionaries'
import { getCityFont } from '@/lib/fonts/cityFonts'
import { Clock, DollarSign, Zap, Star, MapPin, ArrowLeft } from 'lucide-react'
import { CommentThread } from '@/components/features/CommentThread' // ✅ Use your real component
interface PageProps {
  params: Promise<{ lang: string; citySlug: string; placeSlug: string }>
}

async function getPlaceData(citySlug: string, placeSlug: string, lang: string) {
  try {
    const fileName = lang === 'en' ? `${citySlug}.json` : `${citySlug}-${lang}.json`;
    const filePath = path.join(process.cwd(), 'src/data/cities', fileName);
    const fileContent = await fs.readFile(filePath, 'utf8');
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

  return (
    <main className={`min-h-screen bg-slate-50 dark:bg-slate-950 pb-24 ${cityFontClass}`}>
      {/* Sleek Breadcrumb */}
      <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href={`/${lang}/city/${citySlug}`} className="group flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-00">
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
          <Image src={place.image} alt={place.name_en} fill className="object-cover transition-transform duration-700 group-hover:scale-105" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </div>

{/* Refined Header */}
<header className="mb-12">
  <div className="flex flex-col gap-2">
    {/* Local name as a small, high-saturation label if it exists */}
    {place.name_local && place.name_local !== place.name_en && (
      <span className="text-2xl font-black uppercase tracking-[0.3em] text-indigo-500 mb-2">
        {place.name_local}
      </span>
    )}
    <h1 className="text-2xl md:text-5xl font-black text-slate-900 dark:text-white leading-[0.9] tracking-tighter mb-6">
      {place.name_en} {/* ✅ Primary title is now always readable */}
    </h1>
  </div>
  <p className="text-2xl md:text-2xl text-slate-600 dark:text-slate-400 font-light max-w-4xl leading-relaxed italic">
    "{typeof desc === 'object' ? desc.short : desc}"
  </p>
</header>
{/* ✅ HIGH SATURATION TILES WITH LOCALIZED LABELS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: DollarSign, color: 'text-emerald-600', bg: 'bg-green-500/35', label: dict.logistics || 'Cost', val: desc.price_level },
            { icon: Zap, color: 'text-amber-600', bg: 'bg-amber-500/35', label: 'Vibe', val: desc.vibe },
            { icon: Clock, color: 'text-blue-600', bg: 'bg-blue-500/35', label: 'Duration', val: desc.duration },
            { icon: Star, color: 'text-purple-600', bg: 'bg-purple-500/35', label: 'Best For', val: desc.good_for?.[0] }
          ].map((item, i) => (
            <div key={i} className={`${item.bg} p-8 rounded-[2.5rem] border-2 border-white flex flex-col items-center text-center shadow-sm`}>
              <item.icon className={`w-6 h-6 ${item.color} mb-3`} />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{item.label}</p>
              <p className="text-xl font-bold">{item.val || 'Standard'}</p>
            </div>
          ))}
        </div>

        <div className="max-w-3xl mx-auto">
          {desc.history && (
            <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
              <h2 className="text-2xl font-black uppercase tracking-tight text-indigo-400 mb-6 flex items-center gap-3">
                <div className="w-8 h-1 bg-indigo-500 rounded-full" /> {dict.the_backstory || "The Backstory"}
              </h2>
              <p className="text-xl text-slate-600 leading-relaxed">{desc.history}</p>
            </div>
          )}

          {desc.insider_tip && (
            <div className="bg-indigo-600 p-10 md:p-12 rounded-[1.5rem] text-white shadow-2xl relative overflow-hidden">
              <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-indigo-200 mb-6">
                <Star className="w-5 h-5 fill-current" /> {dict.local_secret || "Local Secret"}
              </h3>
              <p className="text-2xl md:text-3xl font-bold leading-tight">"{desc.insider_tip}"</p>
            </div>
          )}

          <div className="mt-20 pt-16 border-t border-slate-200">
            <h3 className="text-2xl font-black uppercase mb-8">{dict.discussion_tips || "Discussion & Tips"}</h3>
            <CommentThread citySlug={citySlug} placeSlug={placeSlug} dict={dict} />
          </div>
        </div>
      </article>
    </main>
  );
}