import { Navigate, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBox, FiCpu, FiShield, FiUsers, FiZap } from 'react-icons/fi'

import { useAuth } from '../auth/authContext'
import { useCommander } from '../commander/commanderContext'
import { useShip } from '../ship/shipContext'

const StatusBar = ({ label, current, maximum, icon: Icon }) => {
  const percentage = maximum > 0 ? Math.min((current / maximum) * 100, 100) : 0

  return (
    <div className="rounded-xl border border-white/10 bg-[#07101d]/30 p-4 shadow-[inset_0_1px_rgba(255,255,255,0.035)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Icon className="text-cyan-200" />

          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-white/55">{label}</span>
        </div>

        <span className="text-sm font-semibold">
          {current} / {maximum}
        </span>
      </div>

      <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-cyan-300 transition-all duration-500" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  )
}

const ShipInfoCard = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-xl border border-white/10 bg-[#07101d]/30 p-4 shadow-[inset_0_1px_rgba(255,255,255,0.035)] backdrop-blur-xl">
      <div className="flex items-center gap-3">
        <Icon className="shrink-0 text-cyan-200" />

        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">{label}</p>

          <p className="mt-1 truncate font-semibold text-white/85">{value}</p>
        </div>
      </div>
    </div>
  )
}

const Ship = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { commander, loading: commanderLoading } = useCommander()
  const { ship, loading: shipLoading, error } = useShip()

  if (authLoading || commanderLoading || shipLoading) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#02030a] text-sm uppercase tracking-[0.25em] text-cyan-200">
        Loading ship...
      </main>
    )
  }

  if (!isAuthenticated || !commander) return <Navigate to="/" replace />
  if (!ship) {
    return (
      <main className="flex h-dvh flex-col items-center justify-center gap-5 bg-[#02030a] px-6 text-center text-white">
        <h1 className="text-2xl font-semibold">Ship unavailable</h1>

        <p className="text-sm text-white/55">{error || 'No ship could be found for this commander.'}</p>

        <button className="rounded-xl border border-white/20 bg-white/10 px-5 py-3" onClick={() => navigate('/game/station')}>
          Return to Gateway
        </button>
      </main>
    )
  }

  return (
    <main className="relative h-dvh overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#020712]/35" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col px-5 py-5 landscape:px-8 landscape:py-4">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Light exploration craft</p>

            <h1 className="mt-2 truncate text-4xl font-bold uppercase leading-none tracking-[0.08em] landscape:text-5xl">{ship.name}</h1>

            <p className="mt-2 text-sm text-white/55">
              {ship.registry} · {ship.manufacturer}
            </p>
          </div>

          <button
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-black/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/60 backdrop-blur-md transition hover:bg-white/10 hover:text-white"
            onClick={() => navigate('/game/station')}>
            <FiArrowLeft />
            Gateway
          </button>
        </header>

        <div className="hide-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 landscape:mt-4">
          <div className="grid gap-5 pb-2 landscape:grid-cols-[0.85fr_1.15fr] landscape:gap-8">
            <section className="rounded-2xl border border-cyan-200/12 bg-[#07101d]/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl landscape:p-6">
              <div className="flex min-h-52 items-center justify-center rounded-xl border border-cyan-400/15 bg-black/12 landscape:min-h-64">
                <div className="text-center">
                  <p className="text-5xl font-bold uppercase tracking-[0.18em] text-cyan-200/80">CSE</p>

                  <p className="mt-3 text-xs uppercase tracking-[0.3em] text-white/35">Ship visualization</p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <ShipInfoCard label="Class" value={ship.ship_class} icon={FiCpu} />
                <ShipInfoCard label="Role" value={ship.role} icon={FiZap} />
                <ShipInfoCard label="FTL Drive" value={ship.ftl_drive} icon={FiCpu} />
                <ShipInfoCard label="Commander" value={commander.name} icon={FiUsers} />
              </div>
            </section>

            <section className="grid content-start gap-3">
              <StatusBar label="Hull integrity" current={ship.hull_current} maximum={ship.hull_max} icon={FiShield} />
              <StatusBar label="Shield strength" current={ship.shield_current} maximum={ship.shield_max} icon={FiZap} />
              <StatusBar label="Fuel reserves" current={ship.fuel_current} maximum={ship.fuel_max} icon={FiCpu} />

              <div className="grid grid-cols-2 gap-3">
                <ShipInfoCard label="Cargo" value={`${ship.cargo_used} / ${ship.cargo_capacity} t`} icon={FiBox} />
                <ShipInfoCard label="Crew" value={`${ship.crew_current} / ${ship.crew_capacity}`} icon={FiUsers} />
                <ShipInfoCard label="Weapon slots" value={ship.weapon_slots} icon={FiZap} />
                <ShipInfoCard label="Utility slots" value={ship.utility_slots} icon={FiCpu} />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Ship
