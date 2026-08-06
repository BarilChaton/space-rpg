import { useCallback, useMemo, useState } from 'react'
import { BackgroundContext } from './backgroundContext'

const initialState = {
  mode: 'earth',
  transition: 'idle',
  currentSystemId: 'sol',
  currentLocationId: 'gateway',
  destinationSystemId: null,
  destinationLocationId: null,
  interfaceVisible: true
}

const BackgroundProvider = ({ children }) => {
  const [backgroundState, setBackgroundState] = useState(initialState)

  const updateBackground = useCallback((values) => {
    setBackgroundState((current) => ({
      ...current,
      ...values
    }))
  }, [])

  const setBackgroundMode = useCallback((mode) => {
    setBackgroundState((current) => ({
      ...current,
      mode
    }))
  }, [])

  const setInterfaceVisible = useCallback((interfaceVisible) => {
    setBackgroundState((current) => ({
      ...current,
      interfaceVisible
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...backgroundState,
      updateBackground,
      setBackgroundMode,
      setInterfaceVisible
    }),
    [backgroundState, updateBackground, setBackgroundMode, setInterfaceVisible]
  )

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>
}

export default BackgroundProvider
