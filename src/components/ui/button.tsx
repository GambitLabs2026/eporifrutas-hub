// button · botão premium · Eporifrutas Ops Hub
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

const variants = {
  primary: 'text-white shadow-sm hover:brightness-[1.06] active:brightness-95',
  secondary: 'bg-white text-[var(--ink)] border border-[var(--line-strong)] hover:bg-[var(--surface-alt)]',
  ghost: 'text-[var(--sub)] hover:bg-[var(--surface-alt)]',
  danger: 'text-white shadow-sm hover:brightness-[1.06] active:brightness-95',
}

const bg = {
  primary: { background: 'linear-gradient(180deg,#22995A,#1B8A4B)' },
  secondary: {},
  ghost: {},
  danger: { background: 'linear-gradient(180deg,#DD533A,#D4462A)' },
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-[13px] rounded-lg',
  lg: 'px-5 py-2.5 text-sm rounded-[10px]',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', style, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 font-semibold transition-all ring-focus disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.985]',
        variants[variant],
        sizes[size],
        className,
      )}
      style={{ ...bg[variant], ...style }}
      {...props}
    />
  ),
)

Button.displayName = 'Button'
