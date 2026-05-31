import * as React from "react";
import { cn } from "@/lib/utils";

function Empty({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty"
      className={cn(
        "flex flex-col items-center justify-center gap-4 py-12 text-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function EmptyIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-icon"
      className={cn(
        "text-muted-foreground/60 flex size-12 items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function EmptyTitle({
  className,
  ...props
}: React.ComponentProps<"h3">) {
  return (
    <h3
      data-slot="empty-title"
      className={cn(
        "text-foreground text-base font-semibold",
        className
      )}
      {...props}
    />
  );
}

function EmptyDescription({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="empty-description"
      className={cn(
        "text-muted-foreground max-w-sm text-sm",
        className
      )}
      {...props}
    />
  );
}

function EmptyAction({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="empty-action"
      className={cn("flex items-center gap-2", className)}
      {...props}
    />
  );
}

export { Empty, EmptyAction, EmptyDescription, EmptyIcon, EmptyTitle };
