import Scene from '../components/three/scene'

function MainMenu() {
  return (
    <main className="relative min-h-dvh overflow-hidden bg-black text-white">
      <div className="absolute inset-0">
        <Scene />
      </div>

      <div className="absolute inset-0 bg-black/10" />

      <div className="relative z-10 min-h-dvh px-6 py-6 landscape:px-10 landscape:py-5">
        <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col justify-center landscape:min-h-[calc(100dvh-2.5rem)] landscape:flex-row landscape:items-center landscape:justify-start">
          <section className="w-full max-w-sm landscape:max-w-md landscape:pr-8">
            <header className="mb-10 text-left landscape:mb-6">
              <p className="mb-3 text-sm uppercase tracking-[0.4em] text-cyan-300 landscape:text-xs">A handcrafted space RPG</p>

              <h1 className="text-5xl font-bold uppercase leading-none tracking-[0.12em] landscape:text-5xl">Space RPG</h1>
            </header>

            <nav className="flex flex-col gap-4 landscape:gap-3">
              <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98] landscape:py-3">
                Continue
              </button>

              <button className="rounded-xl border border-cyan-400/40 bg-cyan-500/15 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-cyan-500/25 active:scale-[0.98] landscape:py-3">
                New Game
              </button>

              <button className="rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-lg font-semibold backdrop-blur-md transition hover:bg-white/20 active:scale-[0.98] landscape:py-3">
                Settings
              </button>
            </nav>

            <p className="mt-10 text-center text-xs uppercase tracking-[0.2em] text-white/50 landscape:mt-5 landscape:text-left">
              Version 0.1
            </p>
          </section>
        </div>
      </div>
    </main>
  )
}

export default MainMenu
