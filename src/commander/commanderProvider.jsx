import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../auth/authContext'
import { getCommander } from '../services/commanderService'
import { CommanderContext } from './commanderContext'

const CommanderProvider = ({ children }) => {
  const { user, loading: authLoading } = useAuth()
  const [commander, setCommander] = useState(null)
  const [requestState, setRequestState] = useState({
    userId: null,
    loading: false,
    error: ''
  })

  const loading = authLoading || (Boolean(user) && requestState.userId !== user.id) || requestState.loading
  const error = requestState.userId === user?.id ? requestState.error : ''

  const refreshCommander = useCallback(async () => {
    if (!user) {
      setCommander(null)
      setRequestState({
        userId: null,
        loading: false,
        error: ''
      })
      return null
    }

    setRequestState({
      userId: user.id,
      loading: true,
      error: ''
    })

    try {
      const commanderData = await getCommander()

      setCommander(commanderData)
      setRequestState({
        userId: user.id,
        loading: false,
        error: ''
      })

      return commanderData
    } catch (commanderError) {
      console.error('Failed to load commander:', commanderError)

      setCommander(null)
      setRequestState({
        userId: user.id,
        loading: false,
        error: 'Unable to load commander.'
      })

      return null
    }
  }, [user])

  useEffect(() => {
    if (authLoading || !user) return

    let ignore = false

    async function loadCommander() {
      try {
        const commanderData = await getCommander()

        if (ignore) return

        setCommander(commanderData)
        setRequestState({
          userId: user.id,
          loading: false,
          error: ''
        })
      } catch (commanderError) {
        if (ignore) return

        console.error('Failed to load commander:', commanderError)

        setCommander(null)
        setRequestState({
          userId: user.id,
          loading: false,
          error: 'Unable to load commander.'
        })
      }
    }

    loadCommander()

    return () => {
      ignore = true
    }
  }, [authLoading, user])

  const value = useMemo(() => {
    return {
      commander,
      setCommander,
      loading,
      error,
      hasCommander: Boolean(commander),
      refreshCommander
    }
  }, [commander, loading, error, refreshCommander])

  return <CommanderContext.Provider value={value}>{children}</CommanderContext.Provider>
}

export default CommanderProvider
