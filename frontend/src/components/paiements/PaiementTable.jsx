import { Link } from 'react-router-dom'
import { BUTTON_LIGHT } from '../buttonStyles'
import { formatDate, formatMontant } from '../../pages/paiements/paiements.utils'

function PaiementTable({ paiementsList, deletingId, onDelete }) {
  if (paiementsList.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun paiement a afficher</p>
        <p className="mt-2 text-sm text-slate-500">Essayez de modifier vos filtres ou enregistrez un nouveau paiement.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.9fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Eleve</span>
        <span>Tranche</span>
        <span>Mode</span>
        <span>Montant</span>
        <span>Date</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {paiementsList.map((paiement) => (
          <article key={paiement.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.8fr_0.9fr_1fr] lg:items-center">
            <Link to={`/dashboard/eleves/${paiement.scolarite?.eleve?.id}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600">
              {paiement.scolarite?.eleve?.nom} {paiement.scolarite?.eleve?.prenom}
            </Link>

            <div className="text-sm text-slate-600">{paiement.tranche?.libelle ?? 'Versement libre'}</div>

            <div className="text-sm text-slate-600">{paiement.modePaiement?.libelle}</div>

            <div className="text-sm font-semibold text-slate-800">{formatMontant(paiement.montant)}</div>

            <div className="text-sm text-slate-600">{formatDate(paiement.datePaiement)}</div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/paiements/${paiement.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/paiements/${paiement.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(paiement)}
                disabled={deletingId === paiement.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === paiement.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default PaiementTable
