"use client"

import { useMemo } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/lib/utils"

const fieldVariants = cva("flex w-full", {
  variants: {
    orientation: {
      vertical: "flex-col gap-1.5",
      horizontal: "flex-row items-center gap-3",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

type FieldContextValue = {
  id: string
  orientation: "vertical" | "horizontal"
  required?: boolean
  invalid?: boolean
  disabled?: boolean
}

const FieldContext = React.createContext<FieldContextValue>({
  id: "",
  orientation: "vertical",
})

function useField() {
  return React.useContext(FieldContext)
}

function Field({
  className,
  orientation = "vertical",
  required,
  invalid,
  disabled,
  id: idProp,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof fieldVariants> & {
    required?: boolean
    invalid?: boolean
    disabled?: boolean
  }) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId

  const contextValue = useMemo(
    () => ({ id, orientation: orientation ?? "vertical", required, invalid, disabled }),
    [id, orientation, required, invalid, disabled]
  )

  return (
    <FieldContext.Provider value={contextValue}>
      <div
        data-slot="field"
        className={cn(fieldVariants({ orientation }), className)}
        {...props}
      >
        {children}
      </div>
    </FieldContext.Provider>
  )
}

function FieldLabel({ className, children, ...props }: React.ComponentProps<"label">) {
  const { id, required, invalid, disabled } = useField()

  return (
    <label
      data-slot="field-label"
      htmlFor={id}
      data-invalid={invalid}
      data-disabled={disabled}
      className={cn(
        "flex items-center gap-2 text-sm font-medium leading-none select-none",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-70",
        "data-[invalid=true]:text-destructive",
        className
      )}
      {...props}
    >
      {children}
      {required && (
        <span aria-hidden="true" className="text-destructive">
          *
        </span>
      )}
    </label>
  )
}

function FieldControl({ children }: { children: React.ReactElement }) {
  const { id, required, invalid, disabled } = useField()

  return React.cloneElement(children, {
    id,
    required,
    disabled,
    "aria-invalid": invalid,
    ...children.props,
  })
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  const { id, invalid, disabled } = useField()

  return (
    <p
      data-slot="field-description"
      id={`${id}-description`}
      data-invalid={invalid}
      data-disabled={disabled}
      className={cn(
        "text-muted-foreground text-xs",
        "data-[disabled=true]:opacity-70",
        className
      )}
      {...props}
    />
  )
}

function FieldError({ className, children, ...props }: React.ComponentProps<"p">) {
  const { id, invalid } = useField()

  if (!invalid) return null

  return (
    <p
      data-slot="field-error"
      id={`${id}-error`}
      role="alert"
      aria-live="polite"
      className={cn("text-destructive text-xs font-medium", className)}
      {...props}
    >
      {children}
    </p>
  )
}

export { Field, FieldControl, FieldDescription, FieldError, FieldLabel, useField }
