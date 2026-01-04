'use client'

import { useEffect, useRef } from 'react'

interface AdsterraNativeProps {
  placementId: string
  scriptSrc: string
}

export default function AdsterraNative({ placementId, scriptSrc }: AdsterraNativeProps) {
  const nativeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!nativeRef.current || nativeRef.current.querySelector('script')) return

    const script = document.createElement('script')
    script.async = true
    script.setAttribute('data-cfasync', 'false')
    script.src = scriptSrc
    
    // Create the container div required by some native ad scripts
    const container = document.createElement('div')
    container.id = placementId
    
    nativeRef.current.appendChild(container)
    nativeRef.current.appendChild(script)
  }, [placementId, scriptSrc])

  return <div ref={nativeRef} className="w-full my-6" />
}