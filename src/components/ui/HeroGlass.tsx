import React from 'react';

interface HeroGlassProps {
  title: string;
  subtitle: string;
  fontClass: string;          // For the City Name (e.g., Fancy Script)
  subtitleFontClass?: string; // For the Subtitle (e.g., Clean Sans-Serif)
}

export function HeroGlass({ title, subtitle, fontClass }: HeroGlassProps) {
  return (
    <div className="relative max-w-4xl mx-auto text-center p-8 md:p-12">
      
      {/* ✨ THE GLASS LAYER (Static & Safe) */}
      <div 
        className="absolute -inset-10 z-0"
        style={{
          /* 1. This ensures the blur works on Chrome/Safari/iOS */
          WebkitBackdropFilter: 'blur(40px)', 
          backdropFilter: 'blur(2px)',
          
          /* 2. This creates the FEATHER edge. 
             - 'black 40%' means the center is fully visible.
             - 'transparent 70%' means it fades out completely before the edge. 
          */
          WebkitMaskImage: 'radial-gradient(circle at center, black 20%, transparent 80%)',
          maskImage: 'radial-gradient(circle at center, black 40%, transparent 90%)'
        }}
      >
        {/* Dark Tint (Made slightly darker so you can SEE the glass body) */}
        <div className="absolute inset-0 bg-black/40" />
        
        {/* Noise Texture (Optional: adds grit) */}
        <div className="absolute inset-0 opacity-[0.3] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        
        {/* Border (Also feathered by the mask automatically) */}
        <div className="absolute inset-0 border border-white/60" />
      </div>

      {/* Content Layer (Z-10 ensures text sits ON TOP of the blur, not inside it) */}
      <div className="relative z-10 px-4">
 {/* Removed the extra highlight line here */}

        <h1 className={`text-5xl md:text-8xl drop-shadow-2xl mb-6 ${fontClass}`}>
          {title}
        </h1>
        
        <p className="text-lg md:text-2xl text-white/90 font-medium max-w-2xl mx-auto leading-relaxed drop-shadow-md">
          {subtitle}
        </p>
      </div>
    </div>
  )
}