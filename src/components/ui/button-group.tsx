import * as React from "react";
import { cn } from "@/lib/utils";

function ButtonGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex items-center [&>*:not(:first-child):not(:last-child)]:rounded-none [&>*:first-child]:rounded-r-none [&>*:last-child]:rounded-l-none",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { ButtonGroup };
