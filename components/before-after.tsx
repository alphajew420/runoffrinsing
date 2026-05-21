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
          aria-label="Drag the sponge to compare before and after"
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
          className="absolute top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-grab rounded-[10px] outline-none focus-visible:ring-4 focus-visible:ring-accent/70 transition-transform active:cursor-grabbing active:scale-95"
          style={{ left: `${position}%` }}
        >
          <Sponge />
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

function Sponge() {
  return (
    <svg
      width="46"
      height="56"
      viewBox="0 0 46 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="drop-shadow-[0_8px_18px_rgba(10,36,71,0.45)]"
    >
      {/* yellow sponge body */}
      <rect x="2" y="14" width="42" height="38" rx="6" fill="#FFD64C" />
      {/* slight bottom shadow on the body */}
      <rect x="2" y="44" width="42" height="8" rx="6" fill="#E6B82E" opacity="0.55" />
      {/* green scrubber strip on top */}
      <rect x="2" y="4" width="42" height="14" rx="6" fill="#1F9D6B" />
      <rect x="2" y="14" width="42" height="4" fill="#1F9D6B" />
      {/* speckles in the scrubber */}
      <circle cx="9" cy="11" r="1.1" fill="#0F6F4B" />
      <circle cx="18" cy="9" r="0.9" fill="#0F6F4B" />
      <circle cx="27" cy="12" r="1.1" fill="#0F6F4B" />
      <circle cx="36" cy="9" r="0.9" fill="#0F6F4B" />
      <circle cx="14" cy="14" r="0.7" fill="#0F6F4B" />
      <circle cx="32" cy="14" r="0.7" fill="#0F6F4B" />
      {/* sponge pores */}
      <circle cx="11" cy="26" r="1.6" fill="#E6B82E" />
      <circle cx="22" cy="22" r="1.2" fill="#E6B82E" />
      <circle cx="34" cy="28" r="1.8" fill="#E6B82E" />
      <circle cx="16" cy="35" r="1" fill="#E6B82E" />
      <circle cx="28" cy="38" r="1.4" fill="#E6B82E" />
      <circle cx="38" cy="40" r="1" fill="#E6B82E" />
      <circle cx="8" cy="42" r="1.2" fill="#E6B82E" />
      <circle cx="22" cy="46" r="1" fill="#E6B82E" />
      {/* highlight */}
      <path
        d="M5 22 Q5 16 11 16 L18 16"
        stroke="#FFE89B"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* outer outline */}
      <rect
        x="2"
        y="4"
        width="42"
        height="48"
        rx="6"
        stroke="#0a2447"
        strokeOpacity="0.18"
        strokeWidth="1"
      />
    </svg>
  )
}
