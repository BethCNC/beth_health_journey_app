import React from 'react';

export type CardProps = {
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'outlined' | 'elevated' | 'subtle';
  className?: string;
};

const Card = ({ 
  title, 
  children, 
  variant = 'default',
  className = ''
}: CardProps) => {
  const baseStyles = 'rounded-xl p-6 transition-all duration-200';
  
  const variantStyles = {
    default: 'bg-white border border-gray-200 shadow-sm hover:shadow-md',
    outlined: 'bg-transparent border-2 border-primary-200 hover:border-primary-300',
    elevated: 'bg-white shadow-lg hover:shadow-xl border-0',
    subtle: 'bg-gray-50 border border-gray-100 hover:bg-white hover:shadow-sm',
  };
  
  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${className}`}>
      {title && (
        <h3 className="font-sans font-semibold text-lg text-gray-900 mb-4">
          {title}
        </h3>
      )}
      <div className="text-gray-700">
        {children}
      </div>
    </div>
  );
};

export default Card;