'use client'

import './globals.css'
import { useState, useEffect } from 'react'
import type { ReactNode } from 'react'

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>(
    typeof window !== 'undefined' && (localStorage.getItem('theme') as 'light' | 'dark')
      ? (localStorage.getItem('theme') as 'light' | 'dark')
      : 'light'
  )

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        {/* Theme toggle button fixed on top-right */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:scale-105 transition-transform duration-200
                     sm:p-3 sm:top-6 sm:right-6"
        >
          {theme === 'light' ? (
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" />
            </svg>
          ) : (
            <svg className="w-6 h-6 sm:w-7 sm:h-7 text-gray-200" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" />
            </svg>
          )}
        </button>

        {children}
      </body>
    </html>
  )
}
