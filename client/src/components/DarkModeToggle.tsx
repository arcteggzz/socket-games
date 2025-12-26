import { useEffect, useState } from 'react'

function setHtmlDark(dark: boolean) {
  const root = document.documentElement
  if (dark) root.classList.add('dark')
  else root.classList.remove('dark')
}

export default function DarkModeToggle() {
  const [dark, setDark] = useState(
    typeof localStorage !== 'undefined' ? localStorage.getItem('theme') === 'dark' : false,
  )
  useEffect(() => {
    setHtmlDark(dark)
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', dark ? 'dark' : 'light')
    }
  }, [dark])
  return (
    <button
      onClick={() => setDark((v) => !v)}
      className="w-10 h-10 grid place-items-center rounded-md border border-neutral-300 dark:border-neutral-700"
      aria-label="Toggle dark mode"
      title="Toggle dark mode"
    >
      {dark ? (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M21.64 13.29A9 9 0 1 1 10.71 2.36a7 7 0 1 0 10.93 10.93z" />
        </svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5 fill-current">
          <path d="M6.76 4.84l-1.8-1.79L3.17 4.84l1.8 1.79 1.79-1.79zm10.48 0l1.79-1.79 1.79 1.79-1.79 1.79-1.79-1.79zM12 5a7 7 0 100 14 7 7 0 000-14zm0-3h-1v3h1V2zm0 19h-1v3h1v-3zM2 11H-1v1h3v-1zm23 0h-3v1h3v-1zM6.76 19.16l-1.8 1.79 1.79 1.79 1.8-1.79-1.79-1.79zm10.48 0l1.79 1.79 1.79-1.79-1.79-1.79-1.79 1.79z" />
        </svg>
      )}
    </button>
  )
}
