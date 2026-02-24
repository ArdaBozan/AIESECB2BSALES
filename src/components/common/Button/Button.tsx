'use client';

import React, { ReactNode, ButtonHTMLAttributes } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  children: ReactNode;
}

export default function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' && `btn--${size}`,
    fullWidth && 'btn--full',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {icon && iconPosition === 'left' && <span className="btn__icon">{icon}</span>}
      {children}
      {icon && iconPosition === 'right' && <span className="btn__icon">{icon}</span>}
    </button>
  );
}
