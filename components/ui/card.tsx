import React from 'react';

const Card = ({ className, children }) => {
  return (
    <div className={`p-4 rounded-lg shadow-md border ${className}`}>
      {children}
    </div>
  );
};

const CardContent = ({ className, children }) => {
  return (
    <div className={`flex flex-col ${className}`}>
      {children}
    </div>
  );
};

export { Card, CardContent };
