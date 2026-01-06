'use client'

import { useEffect, useRef } from 'react'

interface AdsterraBannerProps {
  height: number
  width: number
  pKey: string
}

export default function AdsterraBanner({ height, width, pKey }: AdsterraBannerProps) {
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!bannerRef.current || bannerRef.current.firstChild) return

    // 🔒 SECURITY: Sanitize inputs to prevent XSS
    // Validate pKey is alphanumeric (Adsterra keys are typically alphanumeric)
    const sanitizedKey = String(pKey).replace(/[^a-zA-Z0-9]/g, '')

    // Ensure width and height are safe integers
    const sanitizedHeight = Math.abs(parseInt(String(height), 10)) || 0
    const sanitizedWidth = Math.abs(parseInt(String(width), 10)) || 0

    // If sanitization removed content, bail out (invalid props)
    if (!sanitizedKey || sanitizedHeight === 0 || sanitizedWidth === 0) {
      console.warn('AdsterraBanner: Invalid props detected and sanitized')
      return
    }

    const conf = document.createElement('script')
    const script = document.createElement('script')

    conf.type = 'text/javascript'

    // 🔒 SECURITY: Use textContent instead of innerHTML to prevent XSS
    // Build safe configuration object using JSON.stringify
    const atOptions = {
      key: sanitizedKey,
      format: 'iframe',
      height: sanitizedHeight,
      width: sanitizedWidth,
      params: {}
    }

    conf.textContent = `atOptions = ${JSON.stringify(atOptions)};`

    script.type = 'text/javascript'
    // 🔒 SECURITY: Use sanitized key in URL
    script.src = `//www.highperformanceformat.com/${encodeURIComponent(sanitizedKey)}/invoke.js`

    bannerRef.current.append(conf)
    bannerRef.current.append(script)
  }, [pKey, height, width])

  return (
    <div 
      ref={bannerRef} 
      className="flex justify-center items-center my-4 overflow-hidden"
      style={{ minHeight: height }} 
    />
  )
}