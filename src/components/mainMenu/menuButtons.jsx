import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../auth/authContext'
import { signInWithGoogle, signOut } from '../../auth/authService'
import { useCommander } from '../../commander/commanderContext'

const primaryButtonClass =
  'rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-cyan-500/25 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 landscape:py-2.5 landscape:text-base'

const secondaryButtonClass =
  'rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 landscape:py-2.5 landscape:text-base'

const MenuButtons = () => {
  const { user, loading, isAuthenticated } = useAuth()
  const { commander, loading: commanderLoading, hasCommander } = useCommander()

  const [authAction, setAuthAction] = useState(null)

  const isSigningIn = authAction === 'sign-in'
  const isSigningOut = authAction === 'sign-out'

  const [error, setError] = useState('')

  const navigate = useNavigate()

  async function handleSignIn() {
    try {
      setAuthAction('sign-in')
      setError('')

      await signInWithGoogle()
    } catch (signInError) {
      console.error(signInError)
      setError('Unable to sign in with Google.')
    } finally {
      setAuthAction(null)
    }
  }

  async function handleSignOut() {
    try {
      setAuthAction('sign-out')
      setError('')

      await signOut()
    } catch (signOutError) {
      console.error(signOutError)
      setError('Unable to sign out.')
    } finally {
      setAuthAction(null)
    }
  }

  if (loading || commanderLoading) {
    return (
      <nav className="flex w-full flex-col gap-4 landscape:max-w-xs landscape:gap-2">
        <button className={secondaryButtonClass} disabled>
          Loading profile...
        </button>
      </nav>
    )
  }

  return (
    <>
      <nav className="flex w-full flex-col gap-4 landscape:max-w-xs landscape:gap-2">
        {isAuthenticated ? (
          <>
            {hasCommander ? (
              <>
                <button className={primaryButtonClass} onClick={() => navigate('/game/station')}>
                  Continue
                </button>
                <button className={secondaryButtonClass}>Commander</button>
              </>
            ) : (
              <button className={primaryButtonClass} onClick={() => navigate('/commander/new')}>
                Create Commander
              </button>
            )}

            <button className={secondaryButtonClass}>Settings</button>
            <button className={secondaryButtonClass} disabled={isSigningOut} onClick={handleSignOut}>
              {isSigningOut ? 'Signing Out...' : 'Sign Out'}
            </button>
          </>
        ) : (
          <>
            <button className={primaryButtonClass} disabled={isSigningIn} onClick={handleSignIn}>
              {isSigningIn ? 'Opening Google...' : 'Sign In with Google'}
            </button>
            <button className={secondaryButtonClass}>Settings</button>
          </>
        )}
      </nav>

      {commander ? (
        <p className="mt-4 truncate text-sm text-white/50 landscape:mt-2 landscape:max-w-xs landscape:text-[11px]">
          Commander {commander.name} · {commander.credits.toLocaleString()} credits
        </p>
      ) : user ? (
        <p className="mt-4 truncate text-sm text-white/50 landscape:mt-2 landscape:max-w-xs landscape:text-[11px]">
          Signed in as {user.email}
        </p>
      ) : null}
      {error && <p className="mt-4 text-sm text-red-300">{error}</p>}
    </>
  )
}

export default MenuButtons
