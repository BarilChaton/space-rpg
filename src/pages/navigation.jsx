import { useMemo, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiCircle, FiCompass, FiLock, FiMapPin, FiNavigation2 } from 'react-icons/fi'

import { useAuth } from '../auth/authContext'
import { useBackground } from '../background/backgroundContext'
import { useCommander } from '../commander/commanderContext'
import { solSystem } from '../data/solSystem'
import { useShip } from '../ship/shipContext'

const destinationButtonClass =
  'flex w-full items-center gap-4 rounded-xl border border-white/10 bg-[#07101d]/30 p-4 text-left shadow-[inset_0_1px_rgba(255,255,255,0.035)] backdrop-blur-xl transition hover:border-cyan-300/30 hover:bg-cyan-500/8 active:scale-[0.99] disabled:cursor-default disabled:opacity-50'

const DestinationCard = ({ location, current, selected, onSelect }) => {
  const disabled = current || !location.available

  return (
    <button
      className={`${destinationButtonClass} ${selected ? 'border-cyan-300/50 bg-cyan-500/12' : ''}`}
      disabled={disabled}
      type="button"
      onClick={() => onSelect(location)}>
      <span
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border ${selected ? 'border-cyan-300/50 bg-cyan-500/15 text-cyan-100' : 'border-white/10 bg-black/15 text-white/45'}`}>
        {current ? <FiMapPin /> : location.available ? <FiCircle /> : <FiLock />}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate font-semibold">{location.name}</span>

          {current && <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-cyan-300">Current</span>}
          {!current && !location.available && (
            <span className="shrink-0 text-[10px] uppercase tracking-[0.18em] text-white/35">Locked</span>
          )}
        </span>

        <span className="mt-1 block text-xs text-white/45">{location.distanceLabel}</span>
      </span>
    </button>
  )
}

const Navigation = () => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const { commander, loading: commanderLoading } = useCommander()
  const { ship, loading: shipLoading } = useShip()
  const { startTravel } = useBackground()

  const [selectedLocationId, setSelectedLocationId] = useState(null)

  const selectedLocation = useMemo(() => {
    return solSystem.locations.find((location) => location.id === selectedLocationId) ?? null
  }, [selectedLocationId])

  if (authLoading || commanderLoading || shipLoading) {
    return (
      <main className="flex h-dvh items-center justify-center bg-[#02030a] text-sm uppercase tracking-[0.25em] text-cyan-200">
        Loading navigation...
      </main>
    )
  }

  if (!isAuthenticated || !commander || !ship) return <Navigate to="/" replace />

  function selectDestination(location) {
    setSelectedLocationId(location.id)
  }

  function beginTravel() {
    if (!selectedLocation) return

    startTravel({
      systemId: solSystem.id,
      locationId: selectedLocation.id
    })
  }

  return (
    <main className="relative h-dvh overflow-hidden text-white">
      <div className="absolute inset-0 bg-[#020712]/30" />
      <div className="absolute inset-0 bg-linear-to-r from-black/55 via-black/20 to-transparent" />

      <div className="relative z-10 flex h-full flex-col px-5 py-5 landscape:px-8 landscape:py-4">
        <header className="flex shrink-0 items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Navigation console</p>
            <h1 className="mt-2 text-4xl font-bold uppercase leading-none tracking-[0.08em] landscape:text-5xl">{solSystem.name} System</h1>
            <p className="mt-2 text-sm text-white/55">Current location · Gateway Station, Earth Orbit</p>
          </div>

          <button
            className="flex shrink-0 items-center gap-2 rounded-lg border border-white/15 bg-black/15 px-4 py-2 text-xs uppercase tracking-[0.15em] text-white/65 backdrop-blur-xl transition hover:bg-white/10 hover:text-white"
            onClick={() => navigate('/game/station')}>
            <FiArrowLeft />
            Gateway
          </button>
        </header>

        <div className="hide-scrollbar mt-5 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 landscape:mt-4">
          <div className="grid gap-5 pb-2 landscape:grid-cols-[1.1fr_0.9fr] landscape:gap-8">
            <section className="rounded-2xl border border-cyan-200/12 bg-[#07101d]/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl landscape:p-6">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-500/10 text-xl text-cyan-200">
                  <FiCompass />
                </span>

                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Available routes</p>
                  <p className="mt-1 font-semibold">
                    {solSystem.locations.filter((location) => location.available).length} known destinations
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 landscape:grid-cols-1 min-[1050px]:landscape:grid-cols-2">
                {solSystem.locations.map((location) => (
                  <DestinationCard
                    key={location.id}
                    location={location}
                    current={location.id === commander.current_station}
                    selected={location.id === selectedLocationId}
                    onSelect={selectDestination}
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col rounded-2xl border border-cyan-200/12 bg-[#07101d]/35 p-5 shadow-[0_18px_60px_rgba(0,0,0,0.3),inset_0_1px_rgba(255,255,255,0.04)] backdrop-blur-2xl landscape:p-6">
              {selectedLocation ? (
                <>
                  <p className="text-xs uppercase tracking-[0.25em] text-cyan-300">Selected destination</p>
                  <h2 className="mt-3 text-3xl font-bold uppercase tracking-[0.06em]">{selectedLocation.name}</h2>
                  <p className="mt-2 text-sm text-white/45">{selectedLocation.distanceLabel}</p>
                  <p className="mt-5 text-sm leading-7 text-white/65">{selectedLocation.description}</p>

                  <div className="mt-6 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Vessel</p>
                      <p className="mt-2 truncate font-semibold">{ship.name}</p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-black/15 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-white/40">Fuel</p>
                      <p className="mt-2 font-semibold text-cyan-200">
                        {ship.fuel_current} / {ship.fuel_max}
                      </p>
                    </div>
                  </div>

                  <button
                    className="mt-6 flex items-center justify-center gap-3 rounded-xl border border-cyan-300/30 bg-cyan-500/12 px-6 py-4 text-lg font-semibold backdrop-blur-xl transition hover:border-cyan-300/50 hover:bg-cyan-500/18 active:scale-[0.98] landscape:mt-auto landscape:py-3"
                    type="button"
                    onClick={beginTravel}>
                    <FiNavigation2 />
                    Begin Travel
                  </button>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center py-10 text-center">
                  <FiNavigation2 className="text-4xl text-cyan-200/50" />

                  <h2 className="mt-5 text-xl font-semibold">Select a destination</h2>

                  <p className="mt-3 max-w-xs text-sm leading-6 text-white/45">
                    Choose an available location to review its route and prepare your ship for departure.
                  </p>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Navigation
