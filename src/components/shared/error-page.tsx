"use client";

import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/shared/logo";
import { cn } from "@/lib/utils";

interface ErrorPageProps {
  status: string;
  icon: LucideIcon;
  title: string;
  description: string;
  badgeClassName?: string;
  iconClassName?: string;
  children?: ReactNode;
  actions?: ReactNode;
}

export function ErrorPage({
  status,
  icon: Icon,
  title,
  description,
  badgeClassName,
  iconClassName,
  children,
  actions,
}: ErrorPageProps) {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-muted/40 px-4 py-16">
      <div className="absolute -top-40 left-1/2 h-80 w-[40rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute -bottom-40 left-1/4 h-80 w-96 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex flex-col items-center text-center">
        <Logo showText={false} className="mb-8" />

        <div className={cn("rounded-full p-5", badgeClassName)}>
          <Icon className={cn("h-10 w-10", iconClassName)} />
        </div>

        <p className="mt-8 text-sm font-semibold uppercase tracking-widest text-primary">
          {status}
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>

        {children}

        {actions && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
