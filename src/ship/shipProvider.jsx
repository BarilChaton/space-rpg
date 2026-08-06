import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/authContext'
import { getShip } from '../services/shipService'
import { shipContext } from './shipContext'

function ShipProvider({ children }) {
  const { user, loading: authLoading } = useAuth()

  const [shipState, setShipState] = useState({
    userId: null,
    ship: null,
    error: ''
  })

  const ship = user && shipState.userId === user.id ? shipState.ship : null
  const error = user && shipState.userId === user.id ? shipState.error : ''
  const loading = authLoading || Boolean(user && shipState.userId !== user.id)

  const refreshShip = useCallback(async () => {
    if (!user) return null

    try {
      const shipData = await getShip()

      setShipState({
        userId: user.id,
        ship: shipData,
        error: ''
      })

      return shipData
    } catch (shipError) {
      console.error('Unable to load ship:', shipError)

      setShipState({
        userId: user.id,
        ship: null,
        error: 'Unable to load ship.'
      })

      return null
    }
  }, [user])

  useEffect(() => {
    if (authLoading || !user) return

    let cancelled = false

    async function loadShip() {
      try {
        const shipData = await getShip()

        if (cancelled) return

        setShipState({
          userId: user.id,
          ship: shipData,
          error: ''
        })
      } catch (shipError) {
        if (cancelled) return

        console.error('Unable to load ship:', shipError)

        setShipState({
          userId: user.id,
          ship: null,
          error: 'Unable to load ship.'
        })
      }
    }

    void loadShip()

    return () => {
      cancelled = true
    }
  }, [authLoading, user])

  const setShip = useCallback(
    (nextShip) => {
      if (!user) return

      setShipState({
        userId: user.id,
        ship: nextShip,
        error: ''
      })
    },
    [user]
  )

  const value = useMemo(
    () => ({
      ship,
      setShip,
      loading,
      error,
      hasShip: Boolean(ship),
      refreshShip
    }),
    [ship, setShip, loading, error, refreshShip]
  )

  return <shipContext.Provider value={value}>{children}</shipContext.Provider>
}

export default ShipProvider
