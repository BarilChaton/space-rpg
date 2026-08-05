import { App } from '@capacitor/app'
import { Browser } from '@capacitor/browser'
import { Capacitor } from '@capacitor/core'
import { supabase } from '../services/supabase'

const nativeRedirectUrl = 'com.cradlesectorrpg.app://auth/callback'

export async function signInWithGoogle() {
  const isNative = Capacitor.isNativePlatform()
  const redirectTo = isNative ? nativeRedirectUrl : window.location.origin

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      skipBrowserRedirect: isNative
    }
  })

  if (error) throw error

  if (isNative && data.url) {
    await Browser.open({ url: data.url })
  }

  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()

  if (error) throw error
}