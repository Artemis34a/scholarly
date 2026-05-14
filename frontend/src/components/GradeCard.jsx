function GradeCard({ subject, average, teacher, trend, completion }) {
  return (
    <article className="rounded-3xl border border-slate-200/80 bg-slate-50/80 p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-900">{subject}</p>
          <p className="mt-1 text-sm text-slate-500">{teacher}</p>
        </div>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
          {average}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-500">{trend}</p>

      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
          <span>Progression</span>
          <span>{completion}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-sky-500 to-cyan-400"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>
    </article>
  )
}

export default GradeCard
