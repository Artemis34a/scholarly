function ClassList({ classes }) {
  return (
    <div className="space-y-4">
      {classes.map((item) => (
        <article
          key={item.id}
          className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.84))] p-4 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.28)] transition duration-200 hover:border-sky-200 hover:shadow-[0_26px_65px_-38px_rgba(14,165,233,0.25)] md:flex-row md:items-center md:justify-between md:p-5"
        >
          <div>
            <p className="text-base font-semibold text-slate-900 md:text-lg">{item.name}</p>
            <p className="mt-1 text-sm text-slate-500">{item.subject}</p>
          </div>

          <div className="flex flex-col items-start gap-2 md:items-end">
            <span className="rounded-full bg-sky-100 px-3 py-1.5 text-sm font-semibold text-sky-700">
              {item.students} eleves
            </span>
            <p className="text-sm text-slate-500">{item.schedule}</p>
          </div>
        </article>
      ))}
    </div>
  )
}

export default ClassList
