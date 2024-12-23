import React, { ReactNode } from 'react';

interface CardProps {
  className?: string; // Optional className prop for custom styles
  children: ReactNode; // Children must be valid React elements
}

const Card: React.FC<CardProps> = ({ className = '', children }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md border ${className}`}>
      {children}
    </div>
  );
};

interface CardContentProps {
  className?: string; // Optional className prop for custom styles
  children: ReactNode; // Children must be valid React elements
}

const CardContent: React.FC<CardContentProps> = ({ className = '', children }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };
