import { Navigate, useNavigate } from 'react-router-dom'
import { FiBriefcase, FiCompass, FiSettings, FiShoppingCart, FiUser } from 'react-icons/fi'
import { useAuth } from '../auth/authContext'
import { useCommander } from '../commander/commanderContext'
import { getStarSystem } from '../data/starSystems'
import { getStation } from '../data/stations'

const serviceButtonClass =
  'flex min-h-20 w-full items-center gap-4 rounded-xl border border-white/12 bg-[#07101d]/35 px-4 py-3 text-left shadow-[inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-xl transition hover:border-cyan-300/35 hover:bg-cyan-500/8 active:scale-[0.98] disabled:cursor-default disabled:opacity-75 landscape:min-h-18 landscape:px-4 landscape:py-3'

function StationServiceButton({ icon: Icon, title, description, disabled = false, onClick }) {
  return (
    <button className={serviceButtonClass} disabled={disabled} type="button" onClick={onClick}>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-500/8 text-xl text-cyan-200 landscape:h-10 landscape:w-10">
        <Icon />
      </span>

      <span className="min-w-0">
        <span className="block font-semibold text-white">{title}</span>
        <span className="mt-0.5 block text-sm leading-snug text-white/45 landscape:text-xs">{description}</span>
      </span>
    </button>
  )
}

function StationHub() {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { commander, loading: commanderLoading } = useCommander()

  if (authLoading || commanderLoading) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#02030a] text-sm uppercase tracking-[0.25em] text-cyan-200">
        Loading station...
      </main>
    )
  }

  if (!isAuthenticated || !commander) return <Navigate to="/" replace />

  const system = getStarSystem(commander.current_system)
  const station = getStation(commander.current_station)

  if (!system || !station) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#02030a] px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Location data unavailable</h1>
        <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3" onClick={() => navigate('/')}>
          Return to Main Menu
        </button>
      </main>
    )
  }

  return (
    <main className="relative h-dvh overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#020712]/30" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col px-5 pb-5 pt-5 landscape:px-8 landscape:pb-4 landscape:pt-4">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="max-w-56 text-xs uppercase leading-relaxed tracking-[0.35em] text-cyan-300 landscape:max-w-none">
              {station.type}
            </p>

            <h1 className="mt-2 text-4xl font-bold uppercase leading-[0.95] tracking-[0.08em] landscape:text-5xl">{station.name}</h1>

            <p className="mt-2 text-sm text-white/55">
              {station.orbiting} Orbit · {system.name} System
            </p>
          </div>

          <button
            className="shrink-0 rounded-lg border border-white/15 bg-black/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            onClick={() => navigate('/')}>
            Main Menu
          </button>
        </header>

        <div className="hide-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 landscape:mt-4">
          <div className="grid gap-5 pb-2 landscape:grid-cols-[0.9fr_1.1fr] landscape:items-start landscape:gap-8">
            <section className="rounded-2xl border border-cyan-200/12 bg-[#07101d]/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl landscape:p-6">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Docking report</p>

              <p className="mt-4 text-sm leading-7 text-white/65 landscape:text-base">{station.description}</p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Commander</p>

                  <p className="mt-2 truncate font-semibold">{commander.name}</p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Credits</p>

                  <p className="mt-2 font-semibold text-cyan-200">{commander.credits.toLocaleString()}</p>
                </div>
              </div>
            </section>

            <section className="grid gap-3 sm:grid-cols-2 landscape:grid-cols-1 min-[1050px]:landscape:grid-cols-2">
              <StationServiceButton icon={FiShoppingCart} title="Market" description="Trade commodities and supplies" disabled />
              <StationServiceButton
                icon={FiBriefcase}
                title="Ship"
                description="Inspect and manage your vessel"
                onClick={() => navigate('/game/ship')}
              />
              <StationServiceButton icon={FiCompass} title="Navigation" description="Review nearby systems and routes" disabled />
              <StationServiceButton icon={FiUser} title="Commander" description="View your commander profile" disabled />
              <StationServiceButton icon={FiSettings} title="Station Services" description="Repairs, fuel and administration" disabled />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default StationHub
