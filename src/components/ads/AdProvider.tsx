'use client'

import Script from 'next/script'

export function AdProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Script
        id="adsense-init"
        async
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8732422930809097"
        crossOrigin="anonymous"
        strategy="afterInteractive"
      />
      {children}
    </>
  )
}