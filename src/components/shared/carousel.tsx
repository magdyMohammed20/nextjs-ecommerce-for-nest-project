"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Carousel({ children, className }: { children: ReactNode; className?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const update = () => {
      setCanScrollLeft(track.scrollLeft > 4);
      setCanScrollRight(track.scrollLeft + track.clientWidth < track.scrollWidth - 4);
    };

    update();
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      track.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [children]);

  function scroll(dir: number) {
    const track = trackRef.current;
    if (!track) return;
    const amount = Math.max(track.clientWidth * 0.7, 240);
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  const arrowClass =
    "h-10 w-10 rounded-full border shadow-sm transition-colors " +
    "hover:border-primary hover:bg-primary hover:text-primary-foreground " +
    "disabled:pointer-events-none disabled:opacity-40";

  return (
    <div className={cn(className)}>
      <div className="mb-4 flex items-center justify-end gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label="Previous"
          disabled={!canScrollLeft}
          onClick={() => scroll(-1)}
          className={arrowClass}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          aria-label="Next"
          disabled={!canScrollRight}
          onClick={() => scroll(1)}
          className={arrowClass}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
