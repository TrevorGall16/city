'use client';

import { useEffect, useRef } from 'react';

type AdsterraBannerProps = {
  height: number;
  width: number;
  format?: string;
  pKey: string; // The 32-character key from Adsterra (e.g., 'a1b2c3d4e5...')
};

export default function AdsterraBanner({ height, width, format = 'iframe', pKey }: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bannerRef.current) return;

    // 1. Create the options object
    const conf = document.createElement('script');
    const script = document.createElement('script');
    
    // We strictly define the options locally to avoid global scope pollution issues if possible,
    // though Adsterra relies on window.atOptions. 
    // We execute this sequentially to minimize conflict.
    script.type = 'text/javascript';
    script.src = `//www.highperformanceformat.com/${pKey}/invoke.js`;
    
    // Adsterra expects 'atOptions' on the window. 
    // We wrap this logic to set it right before the script loads.
    const settings = {
      'key': pKey,
      'format': format,
      'height': height,
      'width': width,
      'params': {}
    };

    // Safe clear of previous content if re-rendering
    bannerRef.current.innerHTML = '';

    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.innerHTML = `atOptions = ${JSON.stringify(settings)}`;

    bannerRef.current.appendChild(s);
    bannerRef.current.appendChild(script);

  }, [pKey, height, width, format]);

  return (
    <div 
      ref={bannerRef} 
      className="flex justify-center my-4 overflow-hidden"
      style={{ minHeight: height, minWidth: width }}
    />
  );
}