import React from 'react';
import { Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  icon: Icon, 
  loading = false,
  className,
  ...props 
}, ref) => {
  const baseStyles = "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-hover",
    secondary: "bg-white text-primary border border-border hover:bg-background-secondary",
    accent: "bg-accent text-white hover:bg-accent-hover",
    ghost: "bg-transparent text-text-secondary hover:bg-background-secondary hover:text-primary",
    danger: "bg-error text-white hover:bg-error/90",
  };
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base",
  };

  return (
    <button 
      ref={ref}
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      disabled={loading}
      {...props}
    >
      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {!loading && Icon && <Icon className="mr-2 h-4 w-4" />}
      {children}
    </button>
  );
});
Button.displayName = "Button";
