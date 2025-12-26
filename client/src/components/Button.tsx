import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost'
}

export default function Button({ variant = 'primary', className = '', ...rest }: Props) {
  const base =
    'px-4 py-2 rounded-md transition text-sm disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-primary text-white hover:opacity-90',
    ghost:
      'bg-transparent border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...rest} />
}
