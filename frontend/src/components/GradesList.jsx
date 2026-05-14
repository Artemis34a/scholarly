function GradesList({ grades }) {
  return (
    <div className="space-y-4">
      {grades.map((item) => (
        <article
          key={item.subject}
          className="flex flex-col gap-4 rounded-3xl border border-slate-200/80 bg-slate-50/80 p-4 md:flex-row md:items-center md:justify-between"
        >
          <div>
            <p className="text-base font-semibold text-slate-900">{item.subject}</p>
            <p className="mt-1 text-sm text-slate-500">{item.teacher}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
              {item.grade}
            </span>
            <p className="text-sm text-slate-500">{item.remark}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default GradesList
