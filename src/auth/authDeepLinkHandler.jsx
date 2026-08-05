import { useEffect } from 'react'
import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import { supabase } from '../services/supabase'

function AuthDeepLinkHandler() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return

    let listener

    async function setupListener() {
      listener = await App.addListener('appUrlOpen', async ({ url }) => {
        if (!url.startsWith('com.cradlesectorrpg.app://auth/callback')) return

        try {
          const hashIndex = url.indexOf('#')
          const queryIndex = url.indexOf('?')
          const parameterString = hashIndex >= 0 ? url.slice(hashIndex + 1) : queryIndex >= 0 ? url.slice(queryIndex + 1) : ''

          const params = new URLSearchParams(parameterString)
          const accessToken = params.get('access_token')
          const refreshToken = params.get('refresh_token')
          const errorDescription = params.get('error_description')

          if (errorDescription) throw new Error(errorDescription)
          if (!accessToken || !refreshToken) throw new Error('Authentication tokens were not returned.')

          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })

          if (error) throw error

          await Browser.close()
        } catch (error) {
          console.error('Failed to complete Google sign-in:', error)
          await Browser.close()
        }
      })
    }

    setupListener()

    return () => {
      listener?.remove()
    }
  }, [])

  return null
}

export default AuthDeepLinkHandler
