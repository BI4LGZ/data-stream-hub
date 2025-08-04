import React from "react";

const variants = {
  primary: "bg-primary text-white hover:bg-primary/90",
  destructive: "bg-red-500 text-white hover:bg-red-500/90",
  outline: "border border-primary/50 text-primary hover:bg-primary/10",
  ghost: "hover:bg-primary/10 hover:text-primary",
};

const sizes = {
  sm: "h-9 px-3 rounded-md",
  md: "h-10 py-2 px-4 rounded-lg",
  icon: "h-10 w-10 rounded-full",
};

export const Button = React.forwardRef(
  (
    { className, variant = "primary", size = "md", asChild = false, ...props },
    ref
  ) => {
    const Comp = asChild ? "span" : "button";
    return (
      <Comp
        className={`inline-flex items-center justify-center text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
