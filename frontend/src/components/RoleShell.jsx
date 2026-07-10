import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function RoleShell({ title, subtitle, basePath, modules }) {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 lg:flex-row">
        <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)] lg:w-[300px] lg:flex-none">
          <div className="flex h-full flex-col overflow-hidden rounded-[34px] border border-white/35 bg-[linear-gradient(180deg,rgba(15,23,42,0.98),rgba(30,41,59,0.95)_46%,rgba(12,74,110,0.94))] p-5 shadow-[0_35px_120px_-50px_rgba(15,23,42,0.88)] ring-1 ring-white/10 backdrop-blur md:p-6">
            <div className="rounded-[28px] border border-white/10 bg-white/6 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-sky-200">
                BrightPath Academy
              </p>
              <h1 className="mt-4 text-2xl font-semibold text-white">{title}</h1>
              <p className="mt-2 text-sm text-slate-300">{subtitle}</p>
            </div>

            <div className="mt-5 rounded-[26px] border border-white/10 bg-white/8 p-4 text-sm text-slate-200">
              <p className="font-semibold text-white">{user?.nom || user?.username}</p>
              <p className="mt-1 text-slate-300">{user?.role}</p>
            </div>

            <nav className="mt-6 flex-1 space-y-2 overflow-y-auto pr-1">
              {modules.map((module) => {
                const to = module.id === 'dashboard' ? basePath : `${basePath}/${module.id}`
                return (
                  <NavLink
                    key={module.id}
                    to={to}
                    end={module.id === 'dashboard'}
                    className={({ isActive }) =>
                      `group flex flex-col gap-0.5 rounded-2xl border px-4 py-3 text-sm transition ${
                        isActive
                          ? 'border-sky-300/40 bg-white text-slate-900 shadow-[0_16px_45px_-30px_rgba(255,255,255,0.78)]'
                          : 'border-white/8 bg-white/6 text-slate-200 hover:border-white/16 hover:bg-white/12 hover:text-white'
                      }`
                    }
                  >
                    <span className="font-medium leading-snug">{module.label}</span>
                    <span className="text-[0.65rem] uppercase tracking-[0.22em] text-slate-400 group-[.active]:text-slate-500">
                      {module.shortLabel}
                    </span>
                  </NavLink>
                )
              })}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-5 rounded-2xl border border-rose-300/15 bg-rose-400/10 px-4 py-3 text-left text-sm font-semibold text-rose-100 transition hover:border-rose-300/30 hover:bg-rose-400/16"
            >
              Déconnexion
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default RoleShell
