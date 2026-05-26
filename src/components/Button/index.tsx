import type { ReactNode } from 'react';
import '../../styles/button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export function Button({ children, variant = 'primary', className = '', ...rest }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} ${className}`} 
      {...rest}
    >
      {children}
    </button>
  );
}