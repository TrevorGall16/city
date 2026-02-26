'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'

// Grain SVG filter rendered as a data URI — pure CSS, no external dependency.
// Kept as a constant outside the component so it's created once, never re-allocated.
const GRAIN_SVG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23grain)'/%3E%3C/svg%3E")`

interface MagneticItineraryButtonProps {
  href: string
  dayNumber: string
  dayLabel: string
  dayDesc: string
  accentClass: string
  checkLabel: string
}

export function MagneticItineraryButton({
  href,
  dayNumber,
  dayLabel,
  dayDesc,
  accentClass,
  checkLabel,
}: MagneticItineraryButtonProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const x = useSpring(rawX, { stiffness: 150, damping: 15, mass: 0.1 })
  const y = useSpring(rawY, { stiffness: 150, damping: 15, mass: 0.1 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    rawX.set((e.clientX - rect.left - rect.width / 2) * 0.25)
    rawY.set((e.clientY - rect.top - rect.height / 2) * 0.25)
  }

  const handleMouseLeave = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative will-change-transform"
    >
      <Link
        href={href}
        className="
          group relative block overflow-hidden rounded-[2rem]
          bg-zinc-900/90 backdrop-blur-md
          border border-white/10
          shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
          hover:bg-zinc-800/80 hover:border-white/15
          hover:shadow-[0_28px_56px_-12px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.12)]
          transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          active:scale-[0.98]
        "
      >

        {/* ── LAYER z-20: all foreground text content ─────────────────────── */}
        <div className="relative z-20 min-h-[220px] p-8 flex flex-col">
          <div>
            <h3 className="text-base font-bold tracking-tight text-white">
              {dayLabel}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-relaxed font-normal">
              {dayDesc}
            </p>
          </div>

          <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-500 group-hover:text-zinc-200 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span>{checkLabel}</span>
            <ArrowRight
              size={11}
              weight="bold"
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            />
          </div>
        </div>

        {/* ── LAYER z-0: background decoration + grain ──────────────────────── */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-[2rem]">

          {/* Accent colour block — top-right corner */}
          <div
            className={`absolute top-0 right-0 w-24 h-24 ${accentClass} opacity-30 rounded-bl-[2.5rem]`}
          />

          {/* Day number watermark */}
          <span className="absolute top-3 right-5 text-5xl font-black text-white/[0.05] font-mono select-none leading-none">
            {dayNumber}
          </span>

          {/* Grain texture — Section 5: absolute, pointer-events-none, never on a scrolling container */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay rounded-[2rem]"
            style={{ backgroundImage: GRAIN_SVG }}
            aria-hidden="true"
          />

        </div>

      </Link>
    </motion.div>
  )
}
