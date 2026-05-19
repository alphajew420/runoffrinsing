"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

type Props = {
  beforeSrc: string
  afterSrc: string
  alt: string
  caption?: string
  aspect?: string
  initial?: number
  className?: string
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  alt,
  caption,
  aspect = "16 / 10",
  initial = 50,
  className,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState(initial)
  const draggingRef = useRef(false)

  const moveToClientX = useCallback((clientX: number) => {
    const node = containerRef.current
    if (!node) return
    const rect = node.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100))
    setPosition(pct)
  }, [])

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!draggingRef.current) return
      e.preventDefault()
      moveToClientX(e.clientX)
    }
    const onUp = () => {
      draggingRef.current = false
      document.body.style.userSelect = ""
    }
    window.addEventListener("pointermove", onMove)
    window.addEventListener("pointerup", onUp)
    window.addEventListener("pointercancel", onUp)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerup", onUp)
      window.removeEventListener("pointercancel", onUp)
    }
  }, [moveToClientX])

  const onPointerDown = (e: React.PointerEvent) => {
    draggingRef.current = true
    document.body.style.userSelect = "none"
    moveToClientX(e.clientX)
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 4))
    else if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 4))
    else if (e.key === "Home") setPosition(0)
    else if (e.key === "End") setPosition(100)
  }

  return (
    <figure className={cn("group", className)}>
      <div
        ref={containerRef}
        onPointerDown={onPointerDown}
        className="relative w-full select-none overflow-hidden rounded-sm bg-ink shadow-[0_30px_80px_-30px_rgba(10,36,71,0.45)] ring-1 ring-ink/10"
        style={{ aspectRatio: aspect, touchAction: "none" }}
      >
        {/* AFTER underneath (cleaned) */}
        <img
          src={afterSrc}
          alt={`${alt} — after`}
          className="absolute inset-0 h-full w-full object-cover"
          draggable={false}
        />

        {/* BEFORE on top, clipped to show only left portion */}
        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          <img
            src={beforeSrc}
            alt={`${alt} — before`}
            className="absolute inset-0 h-full w-full object-cover"
            draggable={false}
          />
        </div>

        {/* corner pills */}
        <span className="pointer-events-none absolute left-3 top-3 rounded-sm bg-ink/85 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground backdrop-blur-sm">
          Before
        </span>
        <span className="pointer-events-none absolute right-3 top-3 rounded-sm bg-background/90 px-2.5 py-1 font-display text-[10px] font-bold uppercase tracking-[0.18em] text-primary backdrop-blur-sm">
          After
        </span>

        {/* divider + handle */}
        <div
          className="pointer-events-none absolute inset-y-0 w-px bg-background/95 shadow-[0_0_18px_rgba(255,255,255,0.45)]"
          style={{ left: `${position}%` }}
        />
        <button
          type="button"
          aria-label="Drag to compare before and after"
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="slider"
          onKeyDown={onKeyDown}
          onPointerDown={(e) => {
            e.stopPropagation()
            draggingRef.current = true
            document.body.style.userSelect = "none"
            moveToClientX(e.clientX)
          }}
          className="absolute top-1/2 z-10 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-grab items-center justify-center rounded-full bg-background text-primary shadow-lg ring-2 ring-background/80 transition-transform active:cursor-grabbing active:scale-95"
          style={{ left: `${position}%` }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="15 18 9 12 15 6" />
            <polyline points="9 18 15 12 9 6" transform="translate(6 0)" />
          </svg>
        </button>
      </div>
      {caption ? (
        <figcaption className="mt-3 font-sans text-sm text-muted-foreground">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  )
}
