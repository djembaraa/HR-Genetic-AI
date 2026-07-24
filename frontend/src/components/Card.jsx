import React from 'react';

export const Card = ({ children, style, className = '' }) => {
  return (
    <div className={`glass-container ${className}`} style={style}>
      {children}
    </div>
  );
};
