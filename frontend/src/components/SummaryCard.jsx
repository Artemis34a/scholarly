function SummaryCard({ title, value, detail, accent }) {
  return (
    <article className="group relative overflow-hidden rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.92))] p-5 shadow-[0_24px_80px_-42px_rgba(15,23,42,0.32)] ring-1 ring-slate-100/80 backdrop-blur transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_30px_90px_-42px_rgba(15,23,42,0.38)] md:p-6">
      <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent}`} />
      <div className={`absolute -right-10 -top-10 h-28 w-28 rounded-full bg-gradient-to-br ${accent} opacity-10 blur-2xl transition duration-200 group-hover:opacity-20`} />
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-5 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
        {value}
      </p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </article>
  )
}

export default SummaryCard
