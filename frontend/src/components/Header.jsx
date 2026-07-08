function Header() {
  return (
    <header className="mx-auto flex w-full max-w-7xl flex-col gap-5 overflow-hidden rounded-[36px] border border-white/35 bg-[linear-gradient(135deg,rgba(15,23,42,0.96),rgba(30,41,59,0.9)_42%,rgba(14,165,233,0.82))] px-5 py-5 shadow-[0_28px_90px_-42px_rgba(15,23,42,0.8)] ring-1 ring-white/10 backdrop-blur md:flex-row md:items-center md:justify-between md:px-7 md:py-6">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-200">
          BrightPath Academy
        </p>
        <p className="mt-1 text-sm text-slate-200/90">
          Portail de gestion scolaire
        </p>
      </div>
    </header>
  )
}

export default Header
