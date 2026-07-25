import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Input = React.forwardRef(({ className, label, error, icon: Icon, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-primary mb-1.5">
          {label}
        </label>
      )}
      <div className="relative relative flex items-center">
        {Icon && (
          <div className="absolute left-3 text-text-muted">
            <Icon size={18} />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            "w-full px-4 py-2 bg-background border border-border rounded-xl text-primary transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary placeholder:text-text-muted",
            Icon && "pl-10",
            error && "border-error focus:border-error focus:ring-error/10",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-sm text-error font-medium">{error}</p>}
    </div>
  );
});
Input.displayName = 'Input';
