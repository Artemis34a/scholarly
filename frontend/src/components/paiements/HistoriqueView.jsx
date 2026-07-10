import Card from '../Card'
import StatutPaiementBadge from './StatutPaiementBadge'
import { formatDate, formatMontant } from '../../pages/paiements/paiements.utils'

function HistoriqueView({ historique, eleveLabel = 'Eleve' }) {
  if (historique.parAnnee.length === 0) {
    return (
      <Card>
        <p className="text-sm text-slate-500">Aucune scolarite enregistree.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {historique.parAnnee.map((annee) => (
        <Card
          key={annee.idScolarite}
          title={`${eleveLabel} — ${annee.anneeAcademique}`}
          subtitle={`${annee.classe} · Solde calcule automatiquement`}
        >
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Attendu</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatMontant(annee.montantAttendu)}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Paye</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatMontant(annee.montantPaye)}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reste</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatMontant(annee.reste)}</p>
            </div>
            <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Statut ({annee.pourcentage}%)</p>
              <p className="mt-2"><StatutPaiementBadge statut={annee.statut} /></p>
            </div>
          </div>

          {annee.paiements.length > 0 && (
            <div className="mt-5 space-y-3">
              {annee.paiements.map((paiement) => (
                <div key={paiement.id} className="rounded-[20px] border border-slate-200/80 bg-white px-4 py-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-slate-900">{formatMontant(paiement.montant)}</p>
                    <p className="text-xs text-slate-400">{formatDate(paiement.datePaiement)}</p>
                  </div>
                  <p className="mt-1 text-xs text-slate-500">{paiement.tranche?.libelle ?? 'Versement libre'} · {paiement.modePaiement?.libelle}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
      ))}
    </div>
  )
}

export default HistoriqueView
