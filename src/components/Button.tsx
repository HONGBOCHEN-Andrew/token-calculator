import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "~/utils/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-accent-100 dark:data-[state=open]:bg-accent-800",
  {
    variants: {
      variant: {
        default:
          "bg-primary-600 text-white hover:bg-primary-700 hover:scale-105 active:scale-95 dark:bg-primary-500 dark:hover:bg-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400",
        destructive:
          "bg-red-500 text-white hover:bg-red-600 hover:scale-105 active:scale-95 focus:ring-red-500 dark:focus:ring-red-400",
        outline:
          "bg-transparent border-2 border-primary-200 hover:bg-primary-50 hover:border-primary-300 dark:border-primary-700 dark:text-primary-100 dark:hover:bg-primary-900/50 dark:hover:border-primary-600 focus:ring-primary-500 dark:focus:ring-primary-400",
        subtle:
          "bg-primary-100 text-primary-900 hover:bg-primary-200 dark:bg-primary-800 dark:text-primary-100 hover:scale-105 active:scale-95 focus:ring-primary-500 dark:focus:ring-primary-400",
        ghost:
          "bg-transparent hover:bg-primary-100 dark:hover:bg-primary-800 dark:text-primary-100 hover:scale-105 active:scale-95 data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent focus:ring-primary-500 dark:focus:ring-primary-400",
        link: "bg-transparent text-primary-600 underline-offset-4 hover:underline hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 focus:ring-primary-500 dark:focus:ring-primary-400",
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> { }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
