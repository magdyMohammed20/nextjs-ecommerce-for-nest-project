import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonCard({
  className,
  imageClassName,
}: {
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm",
        className,
      )}
    >
      <Skeleton
        className={cn(
          "aspect-[16/10] w-full rounded-none",
          imageClassName,
        )}
      />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-3/4" />
        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-8 w-8" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonGrid({
  count = 8,
  className,
  cardClassName,
  imageClassName,
}: {
  count?: number;
  className?: string;
  cardClassName?: string;
  imageClassName?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid gap-4 sm:grid-cols-2 xl:grid-cols-3", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} className={cardClassName} imageClassName={imageClassName} />
      ))}
    </div>
  );
}