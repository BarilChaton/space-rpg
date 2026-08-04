import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { signInWithGoogle, signOut } from '../../auth/authService'

const primaryButtonClass =
  'rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-cyan-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 landscape:py-3'

const secondaryButtonClass =
  'rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 landscape:py-3'

const MenuButtons = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const [authLoading, setAuthLoading] = useState(false)
  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSignIn() {
    try {
      setAuthLoading(true)
      setError('')
      await signInWithGoogle()
    } catch (signInError) {
      console.error(signInError)
      setError('Unable to sign in with Google.')
      setAuthLoading(false)
    }
  }

  async function handleSignOut() {
    try {
      setAuthLoading(true)
      setError('')
      await signOut()
    } catch (signOutError) {
      console.error(signOutError)
      setError('Unable to sign out.')
    } finally {
      setAuthLoading(false)
    }
  }

  if (loading) {
    return (
      <nav className="flex w-full flex-col gap-4 landscape:max-w-xs landscape:gap-2">
        <button className={secondaryButtonClass} disabled>
          Checking account...
        </button>
      </nav>
    )
  }

  return (
    <>
      <nav className="flex w-full flex-col gap-4 landscape:max-w-xs landscape:gap-2">
        {isAuthenticated ? (
          <>
            <button className={primaryButtonClass} onClick={() => navigate('/commander/new')}>
              Create Commander
            </button>
            <button className={secondaryButtonClass}>Settings</button>
            <button className={secondaryButtonClass} disabled={authLoading} onClick={handleSignOut}>
              {authLoading ? 'Signing Out...' : 'Sign Out'}
            </button>
          </>
        ) : (
          <>
            <button className={primaryButtonClass} disabled={authLoading} onClick={handleSignIn}>
              {authLoading ? 'Opening Google...' : 'Sign In with Google'}
            </button>

            <button className={secondaryButtonClass}>Settings</button>
          </>
        )}
      </nav>

      {user && <p className="mt-4 truncate text-sm text-white/50">Signed in as {user.email}</p>}
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </>
  )
}

export default MenuButtons
