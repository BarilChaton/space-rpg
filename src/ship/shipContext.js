import { createContext, useContext } from 'react'

export const shipContext = createContext(null)

export function useShip() {
  const context = useContext(shipContext)

  if (!context) {
    throw new Error('useShip must be used inside shipProvider')
  }

  return context
}