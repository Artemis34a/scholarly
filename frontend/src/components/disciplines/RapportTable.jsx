import { Link } from 'react-router-dom'
import StatutBadge from './StatutBadge'
import { BUTTON_LIGHT } from '../buttonStyles'
import { formatDate } from '../../pages/disciplines/disciplines.utils'

function RapportTable({ rapportsList, deletingId, onDelete }) {
  if (rapportsList.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun rapport a afficher</p>
        <p className="mt-2 text-sm text-slate-500">Essayez de modifier vos filtres ou creez un nouveau rapport.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.1fr_1fr_0.9fr_1.3fr_0.7fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Eleve</span>
        <span>Type</span>
        <span>Date</span>
        <span>Description</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {rapportsList.map((rapport) => (
          <article key={rapport.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1fr_0.9fr_1.3fr_0.7fr_1fr] lg:items-center">
            <Link to={`/dashboard/eleves/${rapport.eleve?.id}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600">
              {rapport.eleve?.nom} {rapport.eleve?.prenom}
            </Link>

            <div className="text-sm font-medium text-slate-700">{rapport.discipline?.libelle}</div>

            <div className="text-sm text-slate-600">{formatDate(rapport.dateRapport)}</div>

            <div className="truncate text-sm text-slate-600" title={rapport.description}>{rapport.description}</div>

            <div><StatutBadge statut={rapport.statut} /></div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/disciplines/${rapport.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(rapport)}
                disabled={deletingId === rapport.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === rapport.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default RapportTable
