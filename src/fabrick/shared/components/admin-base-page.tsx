"use client";

import type { ReactNode } from "react";

import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AdminBasePageProps {
  title: string;
  description?: string;
  badge?: string;
  backHref?: string;
  backLabel?: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
}

export function AdminBasePage({
  title,
  description,
  badge,
  backHref,
  backLabel = "Volver",
  actions,
  children,
  className,
  fullWidth = false,
}: AdminBasePageProps) {
  return (
    <main
      className={cn(
        "mx-auto flex w-full flex-col gap-6 p-4 md:gap-8 md:p-6",
        !fullWidth && "max-w-7xl",
        className,
      )}
    >
      <section className="flex flex-col justify-between gap-4 rounded-2xl border bg-background p-4 shadow-sm md:flex-row md:items-center md:p-6">
        <div className="flex flex-col gap-1.5">
          {backHref && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="w-fit gap-1 px-0 text-muted-foreground hover:text-foreground"
            >
              <Link href={backHref}>
                <ChevronLeft className="h-4 w-4" />
                {backLabel}
              </Link>
            </Button>
          )}
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-semibold text-2xl tracking-tight md:text-3xl">{title}</h1>
            {badge && (
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 font-medium text-primary text-xs">
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="max-w-xl text-muted-foreground text-sm md:text-base">{description}</p>
          )}
        </div>
        {actions && (
          <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
        )}
      </section>
      {children}
    </main>
  );
}
