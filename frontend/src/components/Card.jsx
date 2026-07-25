import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Card = ({ 
  children, 
  className, 
  padding = 'normal',
  hoverable = false,
  glass = false,
  ...props 
}) => {
  const baseStyles = 'bg-background rounded-2xl border border-border transition-all duration-300';
  const paddings = {
    none: '',
    small: 'p-4',
    normal: 'p-6',
    spacious: 'p-8',
  };
  
  const hoverStyles = hoverable ? 'hover:shadow-card-hover hover:border-border-hover hover:-translate-y-1' : 'shadow-card';
  const glassStyles = glass ? 'glass' : '';

  const Component = hoverable ? motion.div : 'div';
  const motionProps = hoverable ? { whileHover: { y: -2 } } : {};

  return (
    <Component 
      className={cn(baseStyles, paddings[padding], hoverStyles, glassStyles, className)} 
      {...motionProps}
      {...props}
    >
      {children}
    </Component>
  );
};
