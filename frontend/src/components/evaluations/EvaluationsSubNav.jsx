import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/dashboard/evaluations', label: 'Epreuves', end: true },
  { to: '/dashboard/evaluations/notes', label: 'Notes' },
  { to: '/dashboard/evaluations/natures', label: "Types d'epreuves" },
  { to: '/dashboard/evaluations/bulletins', label: 'Bulletins' },
]

function EvaluationsSubNav() {
  return (
    <nav className="flex flex-wrap gap-2 rounded-[28px] border border-slate-200/80 bg-white/85 p-2 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.28)] backdrop-blur">
      {tabs.map((tab) => (
        <NavLink
          key={tab.to}
          to={tab.to}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-2xl px-4 py-2 text-sm font-semibold transition ${
              isActive
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default EvaluationsSubNav
