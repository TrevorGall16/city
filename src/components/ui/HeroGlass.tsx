/**
 * 🛰️ MASTER AI: HERO GLASS GOLDEN MASTER (V6.0)
 * ✅ Style: 2026 Neomorphic depth with ultra-thin "Silk" borders.
 * ✅ Typography: High-saturation titles with organic drop shadows (no hard edges).
 * ✅ Animation: Subtle hover scaling and entrance fade-in.
 */

interface HeroGlassProps {
  title: string;
  subtitle: string;
  titleColor?: string;
  fontClass?: string; 
}

export function HeroGlass({ title, subtitle, titleColor, fontClass }: HeroGlassProps) {
  return (
    <div className="relative group max-w-6xl mx-auto text-center px-4 animate-in fade-in zoom-in duration-1000">
      
      {/* 🌌 DEPTH LAYER: Layered Silk & Blur */}
      <div className="absolute inset-0 -inset-x-8 md:-inset-x-12 z-0">
        {/* Main Glass Pane */}
        <div className="absolute inset-0 bg-slate-950/20 backdrop-blur-[12px] rounded-[4rem] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)]" />
        
        {/* Internal Glow for Neomorphic Edge */}
        <div className="absolute inset-0 rounded-[4rem] bg-gradient-to-br from-white/10 to-transparent opacity-50 pointer-events-none" />
        
        {/* Grainy Texture for Premium Paper Feel */}
        <div className="absolute inset-0 opacity-[0.08] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay rounded-[4rem]" />
      </div>

      {/* ✍️ CONTENT LAYER */}
      <div className="relative z-10 py-16 md:py-24">
        {/* Top Branding Mark */}
        <div className="mb-6 flex items-center justify-center gap-3">
          <div className="h-[1px] w-8 bg-white/30" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">
            CityBasic Guide
          </span>
          <div className="h-[1px] w-8 bg-white/30" />
        </div>

        {/* Cinematic Title */}
        <h1 className={`
          text-7xl md:text-[10rem] 
          mb-6 
          tracking-tighter 
          leading-[0.85] 
          font-black
          transition-transform duration-700 
          group-hover:scale-[1.02]
          drop-shadow-[0_20px_20px_rgba(0,0,0,0.25)]
          ${fontClass} 
          ${titleColor || 'text-white'}
        `}>
          {title}
        </h1>
        
        {/* Premium Divider */}
        <div className="relative w-32 h-[2px] mx-auto mb-10 overflow-hidden rounded-full bg-white/10">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
        </div>

        {/* Vibe Subtitle */}
        <p className="text-xl md:text-4xl text-white font-medium max-w-3xl mx-auto leading-tight tracking-tight drop-shadow-lg">
          <span className="opacity-60 text-2xl md:text-3xl font-serif italic mr-2">“</span>
          {subtitle}
          <span className="opacity-60 text-2xl md:text-3xl font-serif italic ml-2">”</span>
        </p>
      </div>
    </div>
  )
}