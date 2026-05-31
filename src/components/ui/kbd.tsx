import { cn } from "@/lib/utils";

function Kbd({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        "bg-muted border-border text-muted-foreground inline-flex h-5 select-none items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export { Kbd };
