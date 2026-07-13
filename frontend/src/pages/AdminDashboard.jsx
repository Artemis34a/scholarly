import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import SummaryCard from '../components/SummaryCard'
import { adminModules } from '../data/adminModules'
import { useAuth } from '../context/AuthContext'
import { dashboardService } from '../services/dashboardService'
import { classesService } from '../services/classesService'
import { disciplinesService } from '../services/disciplinesService'
import { getPrimarySalle } from './classes/classes.utils'

function InsightRow({ title, detail }) {
  return (
    <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/90 p-4">
      <p className="font-semibold text-slate-900">{title}</p>
      <p className="mt-1 text-sm leading-6 text-slate-500">{detail}</p>
    </div>
  )
}

function AdminDashboard() {
  const { user } = useAuth()
  const dashboardModule = adminModules[0]
  const featureModules = adminModules.filter((module) => module.id !== 'dashboard')

  const [stats, setStats] = useState(null)
  const [insights, setInsights] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      dashboardService.getAdminStats(),
      classesService.findAll({ limit: 200 }),
      disciplinesService.rapports.findAll({ limit: 200 }),
    ])
      .then(([adminStats, classesResult, rapportsResult]) => {
        if (!isMounted) return

        const classesSansTitulaire = classesResult.data.filter(
          (classe) => !getPrimarySalle(classe)?.titulaire,
        ).length

        const rapportsOuverts = rapportsResult.data.filter(
          (rapport) => rapport.statut === 'OUVERT',
        ).length

        setStats(adminStats)
        setInsights({ classesSansTitulaire, rapportsOuverts })
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
            {dashboardModule.badge}
          </p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            Bienvenue, {user?.nom || user?.username || 'Administrateur'}
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            {dashboardModule.description}
          </p>
        </div>
      </Card>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <SummaryCard title="Eleves inscrits" value={loading ? '…' : stats.totalEleves} detail="Total actuel" accent={dashboardModule.accent} />
        <SummaryCard title="Enseignants" value={loading ? '…' : stats.totalEnseignants} detail="Total actuel" accent={dashboardModule.accent} />
        <SummaryCard title="Classes" value={loading ? '…' : stats.totalClasses} detail="Toutes classes" accent={dashboardModule.accent} />
        <SummaryCard title="Cours" value={loading ? '…' : stats.totalCours} detail="Toutes classes" accent={dashboardModule.accent} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.25fr_0.95fr]">
        <Card
          title="Acces rapide aux modules"
          subtitle="Chaque carte ouvre un espace de gestion dedie a l'un de ces sujets."
        >
          <div className="grid gap-4 md:grid-cols-2">
            {featureModules.map((module) => (
              <Link
                key={module.id}
                to={`/dashboard/${module.id}`}
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

        <Card title="Points d'attention" subtitle="Indicateurs calcules a partir des donnees actuelles.">
          {loading ? (
            <div className="py-12 text-center text-slate-400">Chargement...</div>
          ) : (
            <div className="space-y-4">
              <InsightRow
                title="Classes sans titulaire"
                detail={`${insights.classesSansTitulaire} classe(s) n'ont pas encore d'enseignant titulaire.`}
              />
              <InsightRow
                title="Rapports disciplinaires ouverts"
                detail={`${insights.rapportsOuverts} rapport(s) necessitent encore un traitement.`}
              />
              <InsightRow
                title="Scolarites en attente de paiement"
                detail={`${stats.paiements.enAttente} scolarite(s) ont un solde restant a payer.`}
              />
            </div>
          )}
        </Card>
      </section>
    </div>
  )
}

export default AdminDashboard
