import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonListRow({
  height = "h-14",
  className,
}: {
  height?: string;
  className?: string;
}) {
  return <Skeleton className={cn("h-14 w-full", height, className)} />;
}