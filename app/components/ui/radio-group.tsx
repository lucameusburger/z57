"use client";

import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/**
 * A diamond: the site has no round corners, and a square would read as a
 * checkbox, which lets a person pick several.
 */
function RadioGroupItem({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "form-focus form-invalid mx-0.5 flex h-5 w-5 flex-none rotate-45 items-center justify-center border border-foreground bg-background disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <RadioGroupPrimitive.Indicator className="block h-2.5 w-2.5 bg-foreground" />
    </RadioGroupPrimitive.Item>
  );
}

/** A radio that carries its own text, for scales and ratings. */
function RadioGroupTile({
  className,
  children,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-tile"
      className={cn(
        "form-focus form-invalid flex h-11 min-w-11 items-center justify-center border border-foreground bg-background px-3 transition-colors hover:bg-lime data-[state=checked]:bg-foreground data-[state=checked]:text-background disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem, RadioGroupTile };
