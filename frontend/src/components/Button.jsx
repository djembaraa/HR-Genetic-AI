import React from 'react';

export const Button = ({ children, variant = 'primary', style, ...props }) => {
  const className = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  return (
    <button className={className} style={style} {...props}>
      {children}
    </button>
  );
};
