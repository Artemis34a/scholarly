import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import { appPaths } from '../routes/paths'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@brightpath.edu')
  const [password, setPassword] = useState('password')
  const [role, setRole] = useState('Parent')

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate(appPaths.dashboard)
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
                <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
                  Bon retour
                </p>
                <h1 className="mt-6 max-w-md text-4xl font-semibold leading-tight md:text-5xl">
                  Accedez a votre portail scolaire avec le bon role et restez informe.
                </h1>
                <p className="mt-5 max-w-xl text-base text-slate-300 md:text-lg">
                  Les parents peuvent suivre l'assiduite et les performances, tandis
                  que les enseignants peuvent gerer les classes, les resultats et les
                  mises a jour des eleves depuis un seul tableau de bord.
                </p>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <p className="text-sm font-semibold uppercase tracking-[0.24em] text-sky-200">
                    Identifiants de demonstration
                  </p>
                  <div className="mt-4 space-y-3 text-sm text-slate-200">
                    <p>
                      E-mail :
                      <span className="ml-2 font-medium text-white">
                        admin@brightpath.edu
                      </span>
                    </p>
                    <p>
                      Mot de passe :
                      <span className="ml-2 font-medium text-white">password</span>
                    </p>
                    <p>
                      Roles :
                      <span className="ml-2 font-medium text-white">
                        Parent ou Enseignant
                      </span>
                    </p>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold">1,284</p>
                    <p className="mt-2 text-sm text-slate-300">Eleves actifs</p>
                  </div>
                  <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-semibold">64</p>
                    <p className="mt-2 text-sm text-slate-300">Enseignants en ligne</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="flex items-center bg-white/75 px-6 py-10 md:px-10 md:py-12">
            <div className="mx-auto w-full max-w-md">
              <div className="mb-8">
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
                  Connexion
                </p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">
                  Connectez-vous pour continuer
                </h2>
                <p className="mt-2 text-sm text-slate-500">
                  Choisissez votre role et poursuivez vers le tableau de bord.
                </p>
              </div>

              <form className="space-y-5" onSubmit={handleSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Adresse e-mail
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-600">
                    Mot de passe
                  </span>
                  <input
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none ring-0 transition placeholder:text-slate-400 focus:border-sky-400"
                  />
                </label>

                <div>
                  <span className="mb-3 block text-sm font-medium text-slate-600">
                    Selectionnez un role
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    {['Parent', 'Enseignant'].map((option) => {
                      const isActive = role === option

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setRole(option)}
                          className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                            isActive
                              ? 'border-sky-500 bg-sky-50 text-sky-700'
                              : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
                >
                  Aller au tableau de bord
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
