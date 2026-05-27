import {type InputHTMLAttributes, forwardRef } from 'react';
import './input.css';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

// Usamos forwardRef caso você precise usar React Hook Form no futuro
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = '', ...rest }, ref) => {
    return (
      <div className="input-container">
        <label className="input-label">{label}</label>
        <input 
          ref={ref}
          className={`input-field ${className}`} 
          {...rest} 
        />
      </div>
    );
  }
);

Input.displayName = 'Input';