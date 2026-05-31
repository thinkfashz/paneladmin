import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const itemVariants = cva(
  "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm text-sm outline-none transition-colors [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default:
          "focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        destructive:
          "text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20 focus:text-destructive data-[disabled]:pointer-events-none data-[disabled]:opacity-50 *:[svg]:!text-destructive",
      },
      size: {
        default: "px-2 py-1.5",
        sm: "px-2 py-1",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Item({
  className,
  variant,
  size,
  inset,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof itemVariants> & {
    inset?: boolean
  }) {
  return (
    <div
      data-slot="item"
      data-inset={inset}
      className={cn(
        itemVariants({ variant, size }),
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

function ItemShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-shortcut"
      className={cn("ml-auto text-xs tracking-widest opacity-60", className)}
      {...props}
    />
  )
}

function ItemIndicator({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="item-indicator"
      className={cn(
        "absolute left-2 flex size-3.5 items-center justify-center",
        className
      )}
      {...props}
    />
  )
}

function ItemSeparator({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="item-separator"
      className={cn("-mx-1 my-1 h-px bg-muted", className)}
      {...props}
    />
  )
}

function ItemLabel({
  className,
  inset,
  ...props
}: React.ComponentProps<"div"> & { inset?: boolean }) {
  return (
    <div
      data-slot="item-label"
      className={cn(
        "px-2 py-1.5 text-xs font-medium text-muted-foreground",
        inset && "pl-8",
        className
      )}
      {...props}
    />
  )
}

export { Item, ItemIndicator, ItemLabel, ItemSeparator, ItemShortcut, itemVariants }
