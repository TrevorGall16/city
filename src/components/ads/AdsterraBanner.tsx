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

    const conf = document.createElement('script')
    const script = document.createElement('script')

    conf.type = 'text/javascript'
    conf.innerHTML = `
      atOptions = {
        'key' : '${pKey}',
        'format' : 'iframe',
        'height' : ${height},
        'width' : ${width},
        'params' : {}
      };
    `

    script.type = 'text/javascript'
    script.src = `//www.highperformanceformat.com/${pKey}/invoke.js`

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