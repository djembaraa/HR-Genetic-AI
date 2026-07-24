import React from 'react';

export const Card = ({ children, style, className = '' }) => {
  return (
    <div className={`minimalist-card ${className}`} style={style}>
      {children}
    </div>
  );
};
