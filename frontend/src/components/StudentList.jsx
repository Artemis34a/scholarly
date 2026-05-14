const statusStyles = {
  Excellent: 'bg-emerald-100 text-emerald-700',
  'En progression': 'bg-amber-100 text-amber-700',
  'Suivi requis': 'bg-rose-100 text-rose-700',
}

function StudentList({ students }) {
  return (
    <div className="space-y-4">
      {students.map((student) => (
        <article
          key={student.id}
          className="flex flex-col gap-4 rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.84))] p-4 shadow-[0_20px_50px_-38px_rgba(15,23,42,0.28)] transition duration-200 hover:border-sky-200 hover:shadow-[0_26px_65px_-38px_rgba(14,165,233,0.25)] md:flex-row md:items-center md:justify-between md:p-5"
        >
          <div>
            <p className="text-base font-semibold text-slate-900 md:text-lg">{student.name}</p>
            <p className="text-sm text-slate-500">{student.className}</p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto">
            <span className="text-sm font-semibold text-slate-700">
              {student.averageGrade}
            </span>
            <span
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                statusStyles[student.status]
              }`}
            >
              {student.status}
            </span>
          </div>
        </article>
      ))}
    </div>
  )
}

export default StudentList
