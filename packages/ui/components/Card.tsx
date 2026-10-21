import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  const baseClasses = 'rounded-xl bg-white p-6 shadow-lg';
  const hoverClasses = hover ? 'hover:shadow-xl transition-shadow' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;
  
  return <div className={classes}>{children}</div>;
}
