import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import SummaryCard from '../components/SummaryCard'
import { teacherModules } from '../data/teacherModules'
import { useAuth } from '../context/AuthContext'
import { coursService } from '../services/coursService'
import { classesService } from '../services/classesService'
import { evaluationsService } from '../services/evaluationsService'
import { emploiDuTempsService } from '../services/emploiDuTempsService'
import { getMesCours, getMesClasses } from './teacher/teacher.utils'

const JOURS = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI']

function TeacherDashboard() {
  const { user } = useAuth()
  const dashboardModule = teacherModules[0]
  const featureModules = teacherModules.filter((module) => module.id !== 'dashboard')

  const [stats, setStats] = useState(null)
  const [aujourdhui, setAujourdhui] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      coursService.findAll(),
      classesService.findAll({ limit: 200 }),
      evaluationsService.epreuves.findAll(),
      emploiDuTempsService.getGrilleEnseignant(user.id),
    ])
      .then(([coursData, classesResult, epreuves, slots]) => {
        if (!isMounted) return

        const mesCours = getMesCours(coursData, user.id)
        const mesClasses = getMesClasses(classesResult.data, mesCours, user.id)
        // Deja restreint par le backend aux epreuves de l'enseignant connecte.
        const mesEpreuves = epreuves

        const effectif = mesClasses.reduce((sum, classe) => {
          const salle = classe.salles?.[0]
          return sum + (salle?._count?.frequentes ?? 0)
        }, 0)

        setStats({
          classes: mesClasses.length,
          eleves: effectif,
          cours: mesCours.length,
          evaluations: mesEpreuves.length,
        })

        const jourAujourdhui = JOURS[new Date().getDay()]
        const mesSlots = slots
          .filter((slot) => slot.jour === jourAujourdhui)
          .sort((a, b) => a.heureDebut.localeCompare(b.heureDebut))
        setAujourdhui(mesSlots)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user.id])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
            {dashboardModule.badge}
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Bienvenue, {user?.nom || user?.username || 'Enseignant'}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            {dashboardModule.description}
          </p>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Mes classes" value={loading ? '…' : stats.classes} detail="Cette annee" accent={dashboardModule.accent} />
        <SummaryCard title="Mes eleves" value={loading ? '…' : stats.eleves} detail="Toutes classes" accent={dashboardModule.accent} />
        <SummaryCard title="Mes cours" value={loading ? '…' : stats.cours} detail="Cours enseignes" accent={dashboardModule.accent} />
        <SummaryCard title="Mes evaluations" value={loading ? '…' : stats.evaluations} detail="Epreuves creees" accent={dashboardModule.accent} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <Card
          title="Accès rapide"
          subtitle="Chaque carte ouvre un espace dédié à la gestion de vos classes."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {featureModules.map((module) => (
              <Link
                key={module.id}
                to={`/teacher/${module.id}`}
                className="group relative overflow-hidden rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(248,250,252,0.95),rgba(241,245,249,0.84))] p-5 shadow-[0_22px_60px_-42px_rgba(15,23,42,0.32)] transition duration-200 hover:-translate-y-0.5 hover:border-sky-200 hover:shadow-[0_30px_80px_-38px_rgba(14,165,233,0.25)]"
              >
                <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${module.accent}`} />
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-400">
                  {module.badge}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-slate-900">
                  {module.label}
                </h3>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  {module.description}
                </p>
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Aujourd'hui" subtitle="Vos cours prevus pour la journee.">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Chargement...</div>
          ) : aujourdhui.length === 0 ? (
            <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center">
              <p className="text-sm font-semibold text-slate-700">Aucun cours prevu aujourd'hui.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {aujourdhui.map((slot) => (
                <div key={slot.id} className="rounded-[24px] border border-slate-200/70 bg-slate-50/90 p-4">
                  <p className="font-semibold text-slate-900">
                    {slot.heureDebut} - {slot.heureFin} · {slot.cours?.libelle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    {slot.classe?.libelle} {slot.salle ? `· ${slot.salle.libelle}` : ''}
                  </p>
                </div>
              ))}
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default TeacherDashboard
