function MenuPanel({ children }) {
  return (
    <div className="relative z-10 min-h-dvh px-6 py-6 landscape:px-10 landscape:py-5">
      <div className="mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-6xl flex-col justify-center landscape:min-h-[calc(100dvh-2.5rem)] landscape:flex-row landscape:items-center landscape:justify-start">
        <section className="w-full max-w-sm landscape:max-w-md landscape:pr-8">{children}</section>
      </div>
    </div>
  )
}

export default MenuPanel
