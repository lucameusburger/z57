"use client";

import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";

import { cn } from "@/lib/utils";

function Switch({
  className,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        "form-focus form-invalid flex h-7 w-12 flex-none items-center border border-foreground bg-background p-0.5 transition-colors data-[state=checked]:bg-lime disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb className="block h-[1.375rem] w-[1.375rem] bg-foreground transition-transform data-[state=checked]:translate-x-5 motion-reduce:transition-none" />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
