import type { ReactNode } from 'react'

type Props = {
  children: ReactNode
  onClick?: () => void
}

export default function Card({ children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className="rounded-xl shadow-soft border border-neutral-200 dark:border-neutral-800 p-4 cursor-pointer bg-white dark:bg-neutral-900"
    >
      {children}
    </div>
  )
}
