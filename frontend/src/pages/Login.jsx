import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { loginAdmin, loginPersonne } from '../services/authService'
import Header from '../components/Header'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('admin')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      let data
      if (role === 'admin') {
        data = await loginAdmin(email, password)
        login(data.user)
      } else {
        data = await loginPersonne(email, password)
        login(data.user)
      }
      navigate('/dashboard')
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
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">Bon retour</p>
                <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight md:text-5xl">
                  Accédez à votre portail scolaire et restez informé.
                </h1>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">Admin</p>
                  <p className="mt-2 text-sm text-slate-300">email: superadmin (utilisé comme email)</p>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <p className="text-2xl font-semibold">Personne</p>
                  <p className="mt-2 text-sm text-slate-300">email: jean.dupont (utilisé comme email)</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center bg-white/75 px-6 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Connexion</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Connectez-vous pour continuer</h2>
              </div>

              {error && (
                <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Adresse email</span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                    placeholder="admin@scholarly.com"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">Mot de passe</span>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
                  />
                </label>

                <div>
                  <span className="mb-3 block text-sm font-medium text-slate-600">Rôle</span>
                  <div className="grid grid-cols-2 gap-3">
                    {[['admin', 'Administrateur'], ['personne', 'Enseignant / Parent']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setRole(val)}
                        className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                          role === val ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60">
                  {loading ? 'Connexion...' : 'Aller au tableau de bord'}
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
