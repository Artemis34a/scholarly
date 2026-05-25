import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../components/Card'
import Header from '../components/Header'
import { useAuth } from '../context/AuthContext'
import { elevesService } from '../services/elevesService'
import { classesService } from '../services/classesService'
import { coursService } from '../services/coursService'
import { personnesService } from '../services/personnesService'

function StatCard({ label, value, color = 'sky' }) {
  return (
    <div className={`rounded-3xl border border-${color}-100 bg-${color}-50 p-5`}>
      <p className={`text-3xl font-bold text-${color}-700`}>{value ?? '…'}</p>
      <p className="mt-2 text-sm text-slate-500">{label}</p>
    </div>
  )
}

function Dashboard() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState({})
  const [eleves, setEleves] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      elevesService.findActifs(),
      classesService.findAll(),
      coursService.findActifs(),
      personnesService.findAll(),
    ]).then(([elevesData, classesData, coursData, personnesData]) => {
      setStats({
        eleves: elevesData.length,
        classes: classesData.length,
        cours: coursData.length,
        personnes: personnesData.length,
      })
      setEleves(elevesData.slice(0, 8))
      setClasses(classesData.slice(0, 6))
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const handleLogout = () => {
    signOut()
    navigate('/login')
  }

  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:gap-8">
        <div className="flex items-center justify-between">
          <Header role={user?.role} email={user?.username} />
          <button onClick={handleLogout}
            className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition">
            Déconnexion
          </button>
        </div>

        <main className="grid gap-6 md:gap-7">
          <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                Tableau de bord {user?.role === 'admin' ? 'administrateur' : 'enseignant'}
              </p>
              <h1 className="mt-4 text-3xl font-semibold md:text-4xl">
                Bienvenue, {user?.nom || user?.username} 👋
              </h1>
            </div>
          </Card>

          {loading ? (
            <div className="text-center py-12 text-slate-400">Chargement des données…</div>
          ) : (
            <>
              <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Élèves actifs"   value={stats.eleves}   color="sky" />
                <StatCard label="Classes"          value={stats.classes}  color="violet" />
                <StatCard label="Cours actifs"     value={stats.cours}    color="emerald" />
                <StatCard label="Personnes"        value={stats.personnes} color="amber" />
              </section>

              <section className="grid gap-6 xl:grid-cols-2">
                <Card title="Classes" subtitle="Liste des classes enregistrées">
                  <div className="divide-y divide-slate-100">
                    {classes.length === 0 && <p className="py-4 text-sm text-slate-400">Aucune classe</p>}
                    {classes.map((c) => (
                      <div key={c.idClasse} className="flex items-center justify-between py-3">
                        <span className="font-medium text-slate-800">{c.libelle}</span>
                        <span className="text-xs text-slate-400">ID {c.idClasse}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card title="Élèves actifs" subtitle="Derniers élèves enregistrés">
                  <div className="divide-y divide-slate-100">
                    {eleves.length === 0 && <p className="py-4 text-sm text-slate-400">Aucun élève</p>}
                    {eleves.map((e) => (
                      <div key={e.matricule} className="flex items-center justify-between py-3">
                        <div>
                          <p className="font-medium text-slate-800">{e.nom} {e.prenom}</p>
                          <p className="text-xs text-slate-400">Matricule : {e.matricule}</p>
                        </div>
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${e.actif ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'}`}>
                          {e.actif ? 'Actif' : 'Inactif'}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
