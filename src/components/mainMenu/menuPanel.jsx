const MenuPanel = ({ children }) => {
  return (
    <div className="relative z-10 h-dvh px-6 py-6 landscape:px-8 landscape:py-3">
      <div className="mx-auto flex h-full w-full max-w-6xl flex-col justify-center landscape:flex-row landscape:items-center landscape:justify-start">
        <section className="flex w-full max-w-sm flex-col landscape:h-full landscape:max-w-xs landscape:justify-center landscape:pr-6">
          {children}
        </section>
      </div>
    </div>
  )
}

export default MenuPanel
