import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAdmin, loginPersonne, loginEleve } from '../services/authService'
import { homePathForRole } from '../routes/paths'
import { BUTTON_LIGHT } from '../components/buttonStyles'
import Header from '../components/Header'

function SchoolIcon({ className = 'h-8 w-8' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3 1 8l11 5 9-4.09V17h2V8L12 3Z"
        fill="currentColor"
      />
      <path
        d="M5 10.18v4.34c0 1.5 3.13 3.48 7 3.48s7-1.98 7-3.48v-4.34l-7 3.18-7-3.18Z"
        fill="currentColor"
        opacity="0.55"
      />
    </svg>
  )
}

function AdminIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M9 12.2 11 14l4-4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function TeacherIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 5.5h11a2 2 0 0 1 2 2V19H6a2 2 0 0 1-2-2V5.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M8 5.5V19" stroke="currentColor" strokeWidth="1.6" />
      <path d="M17 8h3v10.5a1.5 1.5 0 0 1-1.5 1.5H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function StudentIcon({ className = 'h-6 w-6' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M12 4 2 9l10 5 10-5-10-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M6 11.3V16c0 1.4 2.7 3 6 3s6-1.6 6-3v-4.7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M21 9v5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function EyeIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M1.5 12S5 5 12 5s10.5 7 10.5 7-3.5 7-10.5 7S1.5 12 1.5 12Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  )
}

function EyeOffIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M3 3l18 18M9.9 5.2A10.4 10.4 0 0 1 12 5c7 0 10.5 7 10.5 7a17.4 17.4 0 0 1-3.6 4.6M6.6 6.6C3.6 8.5 1.5 12 1.5 12s3.5 7 10.5 7a10.6 10.6 0 0 0 3.4-.56"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const roles = [
  { value: 'admin', label: 'Administrateur', tagline: 'Pilotage global de l\'école', Icon: AdminIcon },
  { value: 'enseignant', label: 'Enseignant', tagline: 'Classes, notes, emploi du temps', Icon: TeacherIcon },
  { value: 'eleve', label: 'Élève', tagline: 'Notes, bulletins, emploi du temps', Icon: StudentIcon },
]

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function handleRoleChange(nextRole) {
    setRole(nextRole)
    setUsername('')
    setPassword('')
    setError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    if (!username.trim() || !password.trim()) {
      setError('Veuillez renseigner votre identifiant et votre mot de passe.')
      return
    }

    setLoading(true)
    try {
      const data = role === 'admin'
        ? await loginAdmin(username.trim(), password)
        : role === 'eleve'
          ? await loginEleve(username.trim(), password)
          : await loginPersonne(username.trim(), password)
      login(data.user)
      navigate(homePathForRole(data.user.role))
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-7xl flex-col gap-8">
        <Header />
        <main className="grid flex-1 overflow-hidden rounded-[36px] border border-white/60 bg-white/70 shadow-[0_35px_120px_-55px_rgba(15,23,42,0.45)] backdrop-blur lg:grid-cols-2">
          <section className="relative overflow-hidden bg-slate-900 px-6 py-10 text-white md:px-10 md:py-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.3),_transparent_32%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.24),_transparent_28%)]" />
            <div className="relative z-10 flex h-full flex-col justify-between gap-10">
              <div>
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-2.5">
                  <SchoolIcon className="h-7 w-7 text-sky-300" />
                  <span className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-200">BrightPath Academy</span>
                </div>
                <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight md:text-5xl">
                  Plateforme de Gestion d'École Primaire
                </h1>
                <p className="mt-4 max-w-md text-sm leading-7 text-slate-300 md:text-base">
                  Un espace unique pour piloter les classes, suivre les élèves et
                  accompagner les enseignants au quotidien.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                {roles.map(({ value, label, tagline, Icon }) => (
                  <div
                    key={value}
                    className="rounded-3xl border border-white/10 bg-white/5 p-4 transition duration-200 hover:border-sky-300/30 hover:bg-white/10"
                  >
                    <Icon className="h-6 w-6 text-sky-300" />
                    <p className="mt-3 text-lg font-semibold">{label}</p>
                    <p className="mt-1 text-sm text-slate-300">{tagline}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex items-center bg-white/75 px-6 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-7">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Connexion</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Connectez-vous pour continuer</h2>
                <p className="mt-2 text-sm text-slate-500">Choisissez votre profil, puis saisissez vos identifiants.</p>
              </div>

              <div className="mb-6">
                <span className="mb-3 block text-sm font-medium text-slate-600">Je suis...</span>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map(({ value, label, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleRoleChange(value)}
                      aria-pressed={role === value}
                      className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-3 text-xs font-semibold transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-20px_rgba(14,165,233,0.6)] sm:text-sm ${
                        role === value
                          ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-[0_16px_30px_-20px_rgba(14,165,233,0.7)]'
                          : 'border-slate-200 bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Icon className={`h-5 w-5 ${role === value ? 'text-sky-600' : 'text-slate-400'}`} />
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Identifiant</span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    autoComplete="username"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Mot de passe</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-400/30"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((current) => !current)}
                      aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-sky-600"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                </label>

                <button type="submit" disabled={loading} className={BUTTON_LIGHT.submit}>
                  {loading ? 'Connexion...' : 'Se connecter'}
                </button>
              </form>
            </div>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Login
