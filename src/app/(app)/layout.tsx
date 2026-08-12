"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AppShell } from "@/components/shared/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { SkeletonGrid, SkeletonList } from "@/components/shared/skeletons";
import { useAuth } from "@/features/auth/context/auth-provider";

function ShellSkeleton() {
  return (
    <div className="space-y-6" aria-hidden="true">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-80" />
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <SkeletonList count={5} />
      <SkeletonGrid count={4} className="gap-5" />
    </div>
  );
}

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, isAuthenticated, router, pathname]);

  if (isLoading) {
    return (
      <AppShell>
        <div
          role="status"
          aria-label="Loading…"
          className="min-h-[60vh]"
        >
          <span className="sr-only">Loading…</span>
          <ShellSkeleton />
        </div>
      </AppShell>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <AppShell>{children}</AppShell>;
}