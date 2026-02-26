'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from '@phosphor-icons/react'

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
      className="relative will-change-transform h-full"
    >
      {/*
        KEY FIX: NO 'block' class here — it overrides 'flex' and breaks layout.
        Link is a flex column. Background decorations are z-0. Content is z-10.
      */}
      <Link
        href={href}
        className="
          group relative flex flex-col overflow-hidden
          min-h-[220px] h-full p-8 rounded-[2rem]
          bg-zinc-950
          border border-zinc-800 border-t-white/[0.06]
          shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.04)]
          hover:shadow-[0_20px_48px_-10px_rgba(0,0,0,0.5)]
          transition-shadow duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          active:scale-[0.98]
        "
      >
        {/* ── z-0: Background decoration — pointer-events-none so they never intercept clicks ── */}
        <div
          className={`absolute top-0 right-0 w-20 h-20 ${accentClass} opacity-40 rounded-bl-[2rem] z-0 pointer-events-none`}
        />
        <span className="absolute top-3 right-5 text-5xl font-black text-white/[0.04] font-mono select-none leading-none z-0 pointer-events-none">
          {dayNumber}
        </span>

        {/* ── z-10: All foreground content in one wrapper — always above decorations ── */}
        <div className="relative z-10 flex flex-col flex-1">
          {/* Title + description */}
          <div>
            <h3 className="text-base font-semibold tracking-tight text-white">
              {dayLabel}
            </h3>
            <p className="mt-2 text-sm text-zinc-400 leading-snug font-normal">
              {dayDesc}
            </p>
          </div>

          {/* CTA row — pushed to bottom via mt-auto */}
          <div className="mt-auto pt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-600 group-hover:text-zinc-200 transition-colors duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]">
            <span>{checkLabel}</span>
            <ArrowRight
              size={11}
              weight="bold"
              className="transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1"
            />
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
