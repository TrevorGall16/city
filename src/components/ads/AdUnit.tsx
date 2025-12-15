'use client'

import { useEffect, useRef } from 'react'

// Define the 3 types of ads we created
type AdType = 'banner' | 'sidebar' | 'grid'

interface AdUnitProps {
  type: AdType
  className?: string
}

const AD_CONFIG = {
  // 1. Horizontal Banner (Header/Footer)
  banner: {
    slot: '6494579904',
    format: 'auto',
    style: { display: 'block', minHeight: '100px' } 
  },
  // 2. Vertical Sidebar (Desktop Sticky)
  sidebar: {
    slot: '3868416566',
    format: 'auto',
    style: { display: 'block', minHeight: '600px' }
  },
  // 3. Square Grid (Mobile List)
  grid: {
    slot: '9017813222',
    format: 'auto',
    style: { display: 'block', minHeight: '250px' }
  }
}

export function AdUnit({ type, className = '' }: AdUnitProps) {
  const adRef = useRef<HTMLModElement>(null)
  
  // ✅ SAFETY SHIELD: If type is wrong/missing, fallback or return null
  const config = AD_CONFIG[type]
  if (!config) {
    console.warn(`AdUnit Error: Invalid type "${type}" passed. Expected: banner, sidebar, or grid.`)
    return null 
  }

  useEffect(() => {
    try {
      // @ts-ignore
      if (typeof window !== 'undefined' && window.adsbygoogle) {
        // @ts-ignore
        if (adRef.current && adRef.current.innerHTML === '') {
           // @ts-ignore
           (window.adsbygoogle = window.adsbygoogle || []).push({})
        }
      }
    } catch (err) {
      console.error('AdSense error:', err)
    }
  }, [config]) // Added config to dependency

  return (
    <div className={`ad-container overflow-hidden my-4 ${className}`}>
      <div className="text-[10px] text-slate-300 text-center uppercase tracking-widest mb-1 select-none">
        Advertisement
      </div>
      
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={config.style}
        data-ad-client="ca-pub-8732422930809097"
        data-ad-slot={config.slot}
        data-ad-format={config.format}
        data-full-width-responsive="true"
      />
    </div>
  )
}