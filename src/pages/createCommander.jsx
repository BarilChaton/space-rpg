import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/authContext'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { createCommander } from '../services/commanderService'
import { useCommander } from '../commander/commanderContext'
import Scene from '../components/three/scene'

const portraits = [
  { id: 'commander-01', label: 'Commander 01', initials: 'C1' },
  { id: 'commander-02', label: 'Commander 02', initials: 'C2' },
  { id: 'commander-03', label: 'Commander 03', initials: 'C3' },
  { id: 'commander-04', label: 'Commander 04', initials: 'C4' }
]

const CreateCommander = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading } = useAuth()
  const { commander, loading: commanderLoading, setCommander } = useCommander()

  const [name, setName] = useState('')
  const [portraitIndex, setPortraitIndex] = useState(0)
  const [error, setError] = useState('')
  const [creatingCommander, setCreatingCommander] = useState(false)

  const selectedPortrait = useMemo(() => portraits[portraitIndex], [portraitIndex])

  const selectPreviousPortrait = () => {
    setPortraitIndex((current) => (current === 0 ? portraits.length - 1 : current - 1))
  }

  const selectNextPortrait = () => {
    setPortraitIndex((current) => (current === portraits.length - 1 ? 0 : current + 1))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const commanderName = name.trim()

    if (commanderName.length < 3) {
      setError('Commander name must contain at least 3 characters.')
      return
    }

    if (commanderName.length > 24) {
      setError('Commander name cannot exceed 24 characters.')
      return
    }

    try {
      setCreatingCommander(true)
      setError('')

      const createdCommander = await createCommander({
        name: commanderName,
        portrait: selectedPortrait.id
      })

      setCommander(createdCommander)
      navigate('/', { replace: true })
    } catch (error) {
      console.error(error)

      setError(error.message)
    } finally {
      setCreatingCommander(false)
    }
  }

  if (loading || commanderLoading) return null
  if (!isAuthenticated) return <Navigate to="/" replace />
  if (commander) return <Navigate to="/" replace />

  return (
    <main className="relative h-dvh overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <div className="absolute inset-0 bg-black/45" />

      <div className="relative z-10 flex h-dvh items-center justify-center px-5 py-5 landscape:px-8 landscape:py-3">
        <section className="relative w-full max-w-md rounded-2xl border border-white/15 bg-[#07101d]/85 p-6 shadow-2xl backdrop-blur-xl landscape:h-[calc(100dvh-1.5rem)] landscape:max-h-107.5 landscape:max-w-5xl landscape:p-5">
          <button
            className="mb-6 text-sm uppercase tracking-[0.2em] text-white/60 transition hover:text-white landscape:absolute landscape:left-5 landscape:top-4 landscape:mb-0 landscape:text-xs"
            onClick={() => navigate('/')}>
            ← Main Menu
          </button>

          <div className="landscape:grid landscape:h-full landscape:grid-cols-[0.9fr_1.1fr] landscape:items-center landscape:gap-10 landscape:pt-6">
            <header className="mb-7 landscape:mb-0 landscape:pr-3">
              <p className="mb-2 text-xs uppercase tracking-[0.35em] text-cyan-300">New profile</p>

              <h1 className="text-4xl font-bold uppercase leading-none tracking-widest landscape:text-[2.7rem] landscape:leading-[0.98]">
                Create Commander
              </h1>

              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/60 landscape:mt-3 landscape:text-[13px]">
                Choose the identity that will represent you throughout the Cradle Sector.
              </p>
            </header>

            <form className="flex flex-col gap-6 landscape:gap-3" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-white/60" htmlFor="commander-name">
                  Commander name
                </label>

                <input
                  id="commander-name"
                  className="w-full rounded-xl border border-white/15 bg-black/35 px-4 py-3 text-lg outline-none transition placeholder:text-white/25 focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-400/15 landscape:py-2.5 landscape:text-base"
                  maxLength={24}
                  placeholder="Enter commander name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (error) setError('')
                  }}
                />

                <div className="mt-2 flex justify-between text-xs text-white/35 landscape:mt-1">
                  <span>3-24 characters</span>
                  <span>{name.length}/24</span>
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-white/60 landscape:mb-2">Portrait</p>

                <div className="flex items-center justify-between gap-4">
                  <button
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-black/30 text-cyan-200 transition duration-200 hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-100 active:scale-95 landscape:h-10 landscape:w-10"
                    type="button"
                    onClick={selectPreviousPortrait}>
                    <FiChevronLeft size={22} />
                  </button>

                  <div className="flex flex-1 flex-col items-center">
                    <div className="flex aspect-square w-32 items-center justify-center rounded-full border border-cyan-400/35 bg-linear-to-br from-cyan-500/25 to-blue-950/70 text-3xl font-bold tracking-[0.15em] shadow-[0_0_40px_rgba(34,211,238,0.15)] landscape:w-24 landscape:text-2xl">
                      {selectedPortrait.initials}
                    </div>

                    <p className="mt-3 text-sm font-semibold text-white/75 landscape:mt-2 landscape:text-xs">{selectedPortrait.label}</p>
                  </div>

                  <button
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-cyan-400/20 bg-black/30 text-cyan-200 transition duration-200 hover:border-cyan-400/60 hover:bg-cyan-500/15 hover:text-cyan-100 active:scale-95 landscape:h-10 landscape:w-10"
                    type="button"
                    onClick={selectNextPortrait}>
                    <FiChevronRight size={22} />
                  </button>
                </div>
              </div>

              {error && (
                <p className="rounded-lg border border-red-400/20 bg-red-500/10 px-3 py-2 text-sm text-red-200 landscape:py-1.5 landscape:text-xs">
                  {error}
                </p>
              )}

              <button
                className="rounded-xl border border-cyan-400/40 bg-cyan-500/20 px-6 py-4 text-lg font-semibold transition hover:bg-cyan-500/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 landscape:py-2.5 landscape:text-base"
                disabled={creatingCommander}
                type="submit">
                {creatingCommander ? 'Creating Commander...' : 'Begin Journey'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  )
}

export default CreateCommander
