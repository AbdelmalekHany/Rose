'use client'

import { createContext, useContext, useEffect, useMemo } from 'react'
import type { SeasonalTheme } from '@/lib/seasonal'
import { seasonalTheme as defaultTheme } from '@/config/seasonalTheme'

type SeasonalThemeProviderProps = {
  value?: SeasonalTheme
  children: React.ReactNode
}

const SeasonalThemeContext = createContext<SeasonalTheme>(defaultTheme)

export function SeasonalThemeProvider({ value, children }: SeasonalThemeProviderProps) {
  const memoTheme = useMemo(() => value ?? defaultTheme, [value])

  useEffect(() => {
    const root = document.documentElement

    root.style.setProperty('--seasonal-accent', memoTheme.accent)
    root.style.setProperty('--seasonal-accent-light', memoTheme.accentLight)
    root.style.setProperty('--seasonal-accent-dark', memoTheme.accentDark)
  }, [memoTheme])

  return (
    <SeasonalThemeContext.Provider value={memoTheme}>
      {children}
    </SeasonalThemeContext.Provider>
  )
}

export function useSeasonalTheme() {
  return useContext(SeasonalThemeContext)
}

