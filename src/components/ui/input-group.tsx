import * as React from "react";

import { cn } from "@/lib/utils";

const InputGroupContext = React.createContext<{ hasPrefix: boolean; hasSuffix: boolean }>({
  hasPrefix: false,
  hasSuffix: false,
});

function InputGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const childArray = React.Children.toArray(children);
  const hasPrefix = childArray.some(
    (child) => React.isValidElement(child) && child.type === InputPrefix
  );
  const hasSuffix = childArray.some(
    (child) => React.isValidElement(child) && child.type === InputSuffix
  );

  return (
    <InputGroupContext.Provider value={{ hasPrefix, hasSuffix }}>
      <div
        data-slot="input-group"
        className={cn("relative flex items-center", className)}
        {...props}
      >
        {children}
      </div>
    </InputGroupContext.Provider>
  );
}

function InputGroupInput({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  const { hasPrefix, hasSuffix } = React.useContext(InputGroupContext);

  return (
    <div
      data-slot="input-group-input"
      className={cn(
        "flex-1 [&>input]:w-full",
        hasPrefix && "[&>input]:rounded-l-none [&>input]:border-l-0",
        hasSuffix && "[&>input]:rounded-r-none [&>input]:border-r-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function InputPrefix({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-prefix"
      className={cn(
        "border-input bg-muted text-muted-foreground flex h-9 items-center rounded-l-md border border-r-0 px-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function InputSuffix({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-suffix"
      className={cn(
        "border-input bg-muted text-muted-foreground flex h-9 items-center rounded-r-md border border-l-0 px-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function InputGroupAddon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group-addon"
      className={cn(
        "border-input text-muted-foreground pointer-events-none absolute flex h-9 items-center px-3 text-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function InputGroupInlineAddon({
  className,
  side = "left",
  children,
  ...props
}: React.ComponentProps<"div"> & { side?: "left" | "right" }) {
  return (
    <div
      data-slot="input-group-inline-addon"
      className={cn(
        "text-muted-foreground pointer-events-none absolute flex h-9 items-center px-3 text-sm",
        side === "left" ? "left-0" : "right-0",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { InputGroup, InputGroupAddon, InputGroupInlineAddon, InputGroupInput, InputPrefix, InputSuffix };
