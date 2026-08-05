"use client";

import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface PriceRangeSliderProps {
  min: number;
  max: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
  className?: string;
}

export function PriceRangeSlider({
  min,
  max,
  value,
  onChange,
  className,
}: PriceRangeSliderProps) {
  const range = max - min;
  const [active, setActive] = useState<0 | 1 | null>(null);

  const pct = (v: number) => ((v - min) / range) * 100;

  function updateValue(index: 0 | 1, clientX: number, element: HTMLElement) {
    const rect = element.parentElement?.getBoundingClientRect();
    if (!rect) return;
    const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    const snapped = Math.min(max, Math.max(min, Math.round(min + ratio * range)));
    const [lo, hi] = value;
    onChange(
      index === 0 ? [Math.min(snapped, hi), hi] : [lo, Math.max(snapped, lo)],
    );
  }

  function handlePointerDown(index: 0 | 1) {
    return (e: PointerEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setActive(index);
      updateValue(index, e.clientX, e.currentTarget);
    };
  }

  function handlePointerMove(index: 0 | 1) {
    return (e: PointerEvent<HTMLButtonElement>) => {
      if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
      updateValue(index, e.clientX, e.currentTarget);
    };
  }

  function handlePointerUp() {
    setActive(null);
  }

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="relative flex h-5 w-full items-center">
        <div className="absolute h-1.5 w-full rounded-full bg-muted" />
        <div
          className="absolute h-1.5 rounded-full bg-primary"
          style={{ left: `${pct(value[0])}%`, right: `${100 - pct(value[1])}%` }}
        />
        <button
          type="button"
          aria-label="Minimum price"
          onPointerDown={handlePointerDown(0)}
          onPointerMove={handlePointerMove(0)}
          onPointerUp={handlePointerUp}
          onLostPointerCapture={() => setActive(null)}
          className={cn(
            "absolute h-4 w-4 -translate-x-1/2 cursor-grab touch-none rounded-full border-2 border-background bg-primary shadow transition-transform active:cursor-grabbing active:scale-110",
            active === 0 ? "z-30" : "z-10",
          )}
          style={{ left: `${pct(value[0])}%` }}
        />
        <button
          type="button"
          aria-label="Maximum price"
          onPointerDown={handlePointerDown(1)}
          onPointerMove={handlePointerMove(1)}
          onPointerUp={handlePointerUp}
          onLostPointerCapture={() => setActive(null)}
          className={cn(
            "absolute h-4 w-4 -translate-x-1/2 cursor-grab touch-none rounded-full border-2 border-background bg-primary shadow transition-transform active:cursor-grabbing active:scale-110",
            active === 1 ? "z-30" : "z-20",
          )}
          style={{ left: `${pct(value[1])}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="rounded-md border bg-background px-1.5 py-0.5 tabular-nums">
          ${value[0]}
        </span>
        <span className="rounded-md border bg-background px-1.5 py-0.5 tabular-nums">
          ${value[1]}
        </span>
      </div>
    </div>
  );
}
