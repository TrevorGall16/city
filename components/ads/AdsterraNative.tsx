'use client';

import { useEffect, useRef } from 'react';

type AdsterraNativeProps = {
  placementId: string; // The ID usually looks like 'container-123456'
  scriptSrc?: string; // Optional: if Adsterra gives you a specific script URL
};

export default function AdsterraNative({ placementId, scriptSrc = '//pl12345678.highperformanceformat.com/invoke.js' }: AdsterraNativeProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent double injection
    if (containerRef.current && containerRef.current.firstChild) return;

    const script = document.createElement('script');
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = scriptSrc;

    if (containerRef.current) {
      containerRef.current.appendChild(script);
    }
  }, [scriptSrc]);

  return (
    <div 
      id={placementId} 
      ref={containerRef}
      className="w-full my-6"
    />
  );
}