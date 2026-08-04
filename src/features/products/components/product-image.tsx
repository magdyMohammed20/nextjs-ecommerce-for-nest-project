"use client";

import { useState } from "react";
import { Package } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getProductImageUrl } from "../lib/product-image";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function ProductImage({ src, alt, className }: ProductImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const url = getProductImageUrl(src);

  if (!url || hasError) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/15 via-primary/5 to-muted",
          className,
        )}
      >
        <Package className="h-1/4 w-1/4 max-h-14 max-w-14 text-primary/40" />
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-muted", className)}>
      {isLoading && <Skeleton className="absolute inset-0 h-full w-full rounded-none" />}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={alt}
        className={cn(
          "h-full w-full object-cover transition-opacity duration-300",
          isLoading ? "opacity-0" : "opacity-100",
        )}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
      />
    </div>
  );
}
