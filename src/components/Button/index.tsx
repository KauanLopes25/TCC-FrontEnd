import type { ReactNode } from 'react';
import './button.css';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  isLoading?: boolean
}

export function Button({ children, variant = 'primary', className = '', isLoading= false,
  disabled, ...rest }: ButtonProps) {
  return (
    <button 
      className={`btn btn-${variant} ${className} ${isLoading ? 'btn-loading' : ''}`} 
      disabled={isLoading || disabled} // Se estiver carregando, bloqueia o botão automaticamente
      {...rest}
    >
      {/* Se estiver carregando, mostra o spinner. Se não, mostra o texto. */}
      {isLoading ? <div className="spinner"></div> : children}
    </button>
  );
}