import * as React from "react";

import { cn } from "@/lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn("form-control min-h-11 w-full px-3 py-2", className)}
      {...props}
    />
  );
}

export { Input };
