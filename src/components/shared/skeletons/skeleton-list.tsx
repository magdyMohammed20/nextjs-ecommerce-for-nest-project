import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonList({
  count = 5,
  height = "h-14",
  className,
  rowClassName,
}: {
  count?: number;
  height?: string;
  className?: string;
  rowClassName?: string;
}) {
  return (
    <div aria-hidden="true" className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className={cn("h-14 w-full", height, rowClassName)} />
      ))}
    </div>
  );
}