import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function SkeletonHero({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col items-center gap-4 py-16 text-center", className)}
    >
      <Skeleton className="h-14 w-14 rounded-2xl" />
      <Skeleton className="h-8 w-1/2 max-w-sm" />
      <Skeleton className="h-4 w-full max-w-md" />
      <div className="flex gap-3">
        <Skeleton className="h-10 w-32 rounded-full" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}