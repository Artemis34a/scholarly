import Card from '../Card'
import StatutBadge from './StatutBadge'
import { formatDate } from '../../pages/disciplines/disciplines.utils'

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function HistoriqueView({ historique, title = 'Historique' }) {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total" value={historique.total} />
        <StatCard label="Fautes" value={historique.fautes} />
        <StatCard label="Comportements positifs" value={historique.comportementsPositifs} />
        <StatCard label="Dossiers en cours" value={historique.dossiersOuverts} />
      </section>

      <Card title={title} subtitle="Rapports classes du plus recent au plus ancien.">
        {historique.rapports.length === 0 ? (
          <p className="text-sm text-slate-500">Aucun rapport enregistre.</p>
        ) : (
          <div className="space-y-4">
            {historique.rapports.map((rapport) => (
              <div key={rapport.id} className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold text-slate-900">{rapport.discipline.libelle}</p>
                  <StatutBadge statut={rapport.statut} />
                </div>
                <p className="mt-1 text-xs text-slate-400">
                  {formatDate(rapport.dateRapport)} · Rapporte par {rapport.auteur?.nom} {rapport.auteur?.prenom}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-600">{rapport.description}</p>
                {rapport.sanctionAppliquee && (
                  <p className="mt-2 text-sm font-medium text-slate-700">Sanction : {rapport.sanctionAppliquee}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  )
}

export default HistoriqueView
