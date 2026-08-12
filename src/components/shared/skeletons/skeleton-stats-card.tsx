import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonStatsCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-xl border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="min-w-0 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-7 w-20" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-9 w-9 rounded-lg" />
    </div>
  );
}

export function SkeletonStatsGrid({
  count = 4,
  className,
}: {
  count?: number;
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-4", className)}
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonStatsCard key={i} />
      ))}
    </div>
  );
}