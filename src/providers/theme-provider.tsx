import { createContext, useContext, useEffect } from 'react'
import type { ReactNode} from 'react';
import { useAppStore } from '@/stores/app-store'

interface IThemeProviderState {
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: 'light' | 'dark' | 'system') => void
}

const initialState: IThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<IThemeProviderState>(initialState)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { theme, setTheme } = useAppStore()

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('dark', 'light')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme,
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
