import { createContext, useContext } from 'react'

export const BackgroundContext = createContext(null)

export function useBackground() {
  const context = useContext(BackgroundContext)

  if (!context) throw new Error('useBackground must be used inside BackgroundProvider')

  return context
}