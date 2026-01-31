'use client'

import { useEffect, useRef } from 'react'

interface AdsterraSmartFrameProps {
  height: number
  width: number
  pKey: string
  domain?: string
}

export default function AdsterraSmartFrame({ 
  height, 
  width, 
  pKey,
  domain = 'www.repelaffinityworlds.com' 
}: AdsterraSmartFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // ⚡ FIX: Use useRef instead of useState to track status silently.
  // This prevents the "Maximum update depth" infinite loop.
  const isLoaded = useRef(false)

  useEffect(() => {
    const container = containerRef.current
    // Check .current instead of state
    if (!container || isLoaded.current) return

    // 1. Create iframe
    const iframe = document.createElement('iframe')
    iframe.style.border = '0'
    iframe.style.width = `${width}px`
    iframe.style.height = `${height}px`
    iframe.style.overflow = 'hidden'
    iframe.scrolling = 'no'
    
    // 2. HTML Content
    const htmlContent = `
      <html>
        <head>
          <style>body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; }</style>
        </head>
        <body>
          <script type="text/javascript">
            atOptions = {
              'key' : '${pKey}',
              'format' : 'iframe',
              'height' : ${height},
              'width' : ${width},
              'params' : {}
            };
          </script>
          <script type="text/javascript" src="//${domain}/${pKey}/invoke.js"></script>
        </body>
      </html>
    `

    // 3. Append & Write
    container.appendChild(iframe)
    
    const doc = iframe.contentWindow?.document || iframe.contentDocument
    if (doc) {
      doc.open()
      doc.write(htmlContent)
      doc.close()
      // Mark as loaded without triggering re-render
      isLoaded.current = true
    }

    // Cleanup
    return () => {
      if (container) container.innerHTML = ''
      isLoaded.current = false
    }
  }, [height, width, pKey, domain]) // ✅ isLoaded is no longer a dependency

  return (
    <div 
      ref={containerRef} 
      className="flex justify-center items-center overflow-hidden"
      style={{ minHeight: height, minWidth: width }} 
    />
  )
}