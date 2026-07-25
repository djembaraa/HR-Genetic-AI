import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  as = 'button',
  ...props 
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-xl';
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm',
    secondary: 'bg-background text-primary border border-border hover:bg-background-secondary focus:ring-border shadow-sm',
    accent: 'bg-accent text-white hover:bg-accent-hover focus:ring-accent shadow-sm',
    ghost: 'bg-transparent text-text-secondary hover:bg-background-secondary hover:text-primary focus:ring-border',
    danger: 'bg-error text-white hover:bg-red-700 focus:ring-error shadow-sm',
  };

  const sizes = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-6 py-3',
    icon: 'p-2',
  };

  const Component = as === 'button' ? motion.button : motion.a;

  return (
    <Component
      ref={ref}
      whileTap={{ scale: 0.97 }}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </Component>
  );
});
Button.displayName = 'Button';
