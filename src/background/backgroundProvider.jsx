import { useCallback, useMemo, useState } from 'react'

import { BackgroundContext } from './backgroundContext'

const initialState = {
  mode: 'location',
  transition: 'idle',
  currentSystemId: 'sol',
  currentLocationId: 'gateway',
  destinationSystemId: null,
  destinationLocationId: null,
  interfaceVisible: true
}

function BackgroundProvider({ children }) {
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

  const startTravel = useCallback(({ systemId, locationId }) => {
    setBackgroundState((current) => ({
      ...current,
      mode: 'travel',
      transition: 'traveling',
      destinationSystemId: systemId,
      destinationLocationId: locationId,
      interfaceVisible: false
    }))
  }, [])

  const completeTravel = useCallback(() => {
    setBackgroundState((current) => {
      if (!current.destinationSystemId || !current.destinationLocationId) return current

      return {
        ...current,
        mode: 'location',
        transition: 'idle',
        currentSystemId: current.destinationSystemId,
        currentLocationId: current.destinationLocationId,
        destinationSystemId: null,
        destinationLocationId: null,
        interfaceVisible: true
      }
    })
  }, [])

  const cancelTravel = useCallback(() => {
    setBackgroundState((current) => ({
      ...current,
      mode: 'location',
      transition: 'idle',
      destinationSystemId: null,
      destinationLocationId: null,
      interfaceVisible: true
    }))
  }, [])

  const value = useMemo(
    () => ({
      ...backgroundState,
      updateBackground,
      setBackgroundMode,
      setInterfaceVisible,
      startTravel,
      completeTravel,
      cancelTravel
    }),
    [backgroundState, updateBackground, setBackgroundMode, setInterfaceVisible, startTravel, completeTravel, cancelTravel]
  )

  return <BackgroundContext.Provider value={value}>{children}</BackgroundContext.Provider>
}

export default BackgroundProvider
