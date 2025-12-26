import type { ReactNode } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export default function Modal({ open, onClose, children, title }: Props) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-neutral-900 rounded-xl shadow-soft w-[90%] max-w-screen p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-semibold">{title}</div>
          <button onClick={onClose} className="text-neutral-500">✕</button>
        </div>
        {children}
      </div>
    </div>
  )
}
