import { NavLink } from 'react-router-dom'
import { appPaths } from '../routes/paths'

const navItems = [
  { label: 'Connexion', to: appPaths.login },
  { label: 'Tableau de bord', to: appPaths.dashboard },
]

function Header({ role, email }) {
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        {(role || email) && (
          <div className="rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur">
            {role && <p className="font-semibold text-white">{role}</p>}
            {email && <p className="truncate text-slate-200/90">{email}</p>}
          </div>
        )}

        <nav className="flex items-center gap-2 rounded-full border border-white/10 bg-white/10 p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-medium transition duration-200 ${
                  isActive
                    ? 'bg-white text-slate-900 shadow-[0_10px_30px_-18px_rgba(15,23,42,0.9)]'
                    : 'text-slate-100 hover:bg-white/12 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
