import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:opacity-90 shadow-emerald-glow transition-all",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500/20 dark:focus-visible:ring-red-500/40 dark:bg-red-600/90",
        outline:
          "border border-teal-200 dark:border-charcoal-700 bg-white/80 dark:bg-charcoal-800/90 text-charcoal-900 dark:text-mint-100 hover:bg-teal-50/80 dark:hover:bg-charcoal-700/80 transition-colors",
        secondary:
          "bg-mint-100 dark:bg-charcoal-800 text-charcoal-900 dark:text-mint-100 hover:bg-mint-200/80 dark:hover:bg-charcoal-700/80 transition-colors",
        ghost:
          "hover:bg-mint-100/60 dark:hover:bg-charcoal-800/60 text-charcoal-700 dark:text-mint-100 transition-colors",
        link: "text-emerald-600 dark:text-emerald-400 underline-offset-4 hover:underline hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-lg gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-lg px-6 has-[>svg]:px-4",
        icon: "size-9 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
