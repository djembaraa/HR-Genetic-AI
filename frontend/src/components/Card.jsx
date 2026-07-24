import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = React.forwardRef(({ 
  children, 
  padding = 'default',
  className,
  ...props 
}, ref) => {
  const paddings = {
    none: "",
    compact: "p-4",
    default: "p-6",
    spacious: "p-8"
  };

  return (
    <div 
      ref={ref}
      className={cn(
        "bg-white border border-border rounded-xl shadow-sm hover:shadow-card-hover transition-shadow duration-200", 
        paddings[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
Card.displayName = "Card";
