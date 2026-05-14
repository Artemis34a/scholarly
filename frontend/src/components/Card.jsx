function Card({ title, subtitle, children, className = '' }) {
  return (
    <section
      className={`rounded-[32px] border border-white/70 bg-white/88 p-5 shadow-[0_28px_100px_-46px_rgba(15,23,42,0.34)] ring-1 ring-slate-100/70 backdrop-blur md:p-7 ${className}`}
    >
      {(title || subtitle) && (
        <div className="mb-6">
          {title && <h2 className="text-lg font-semibold text-slate-900 md:text-xl">{title}</h2>}
          {subtitle && <p className="mt-1.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      )}
      {children}
    </section>
  )
}

export default Card
