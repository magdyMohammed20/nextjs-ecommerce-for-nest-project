"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Modern hero section with an abstract SVG "image" background and a soft
 * overlay so foreground content stays legible in light and dark mode.
 */
export function PageHero({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden", className)}>
      {/* Background image (inline SVG) */}
      <div className="absolute inset-0" aria-hidden="true">
        <svg
          className="h-full w-full"
          viewBox="0 0 1600 720"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <linearGradient id="ph-base" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#1e1b4b" />
              <stop offset="45%" stopColor="#3730a3" />
              <stop offset="75%" stopColor="#0e7490" />
              <stop offset="100%" stopColor="#0ea5e9" />
            </linearGradient>
            <radialGradient id="ph-glow1" cx="0.2" cy="0.15" r="0.55">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ph-glow2" cx="0.85" cy="0.25" r="0.5">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="ph-glow3" cx="0.5" cy="1.05" r="0.7">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1600" height="720" fill="url(#ph-base)" />
          <rect width="1600" height="720" fill="url(#ph-glow1)" />
          <rect width="1600" height="720" fill="url(#ph-glow2)" />
          <rect width="1600" height="720" fill="url(#ph-glow3)" />
          {/* Abstract translucent shapes */}
          <g fill="#ffffff" opacity="0.06">
            <circle cx="200" cy="140" r="190" />
            <circle cx="1400" cy="120" r="230" />
            <circle cx="1150" cy="560" r="260" />
            <rect x="0" y="640" width="1600" height="80" />
          </g>
          <g stroke="#ffffff" strokeOpacity="0.08" fill="none">
            <path d="M0 560 C 350 500, 700 640, 1100 560 S 1500 440, 1600 480 L1600 720 L0 720 Z" />
          </g>
        </svg>
      </div>

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/45"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative">{children}</div>
    </section>
  );
}