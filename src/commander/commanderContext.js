import { createContext, useContext } from 'react'

export const CommanderContext = createContext(null)

export function useCommander() {
  const context = useContext(CommanderContext)

  if (!context) throw new Error('useCommander must be used inside CommanderProvider')

  return context
}