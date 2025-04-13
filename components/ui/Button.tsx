import React from 'react';

export type ButtonProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isFullWidth?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
};

const Button = ({
  variant = 'primary',
  size = 'md',
  isFullWidth = false,
  isDisabled = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = 'button',
}: ButtonProps) => {
  // Base styles always applied
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Variant-specific styles
  const variantStyles = {
    primary: 'bg-primary-600 hover:bg-primary-700 focus:ring-primary-500 text-white',
    secondary: 'bg-secondary-600 hover:bg-secondary-700 focus:ring-secondary-500 text-white',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    text: 'text-primary-600 hover:text-primary-700 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  // Size-specific styles
  const sizeStyles = {
    sm: 'py-1 px-3 text-sm',
    md: 'py-2 px-4 text-base',
    lg: 'py-3 px-6 text-lg',
  };
  
  // State-specific styles
  const stateStyles = {
    disabled: 'opacity-50 cursor-not-allowed',
    fullWidth: 'w-full',
  };
  
  // Combine all the styles
  const className = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${isDisabled ? stateStyles.disabled : ''}
    ${isFullWidth ? stateStyles.fullWidth : ''}
  `;
  
  return (
    <button
      type={type}
      className={className}
      onClick={onClick}
      disabled={isDisabled || isLoading}
      aria-disabled={isDisabled || isLoading}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      
      {!isLoading && leftIcon && <span className="mr-2">{leftIcon}</span>}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button; 