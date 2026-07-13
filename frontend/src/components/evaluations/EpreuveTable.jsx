import { Link } from 'react-router-dom'
import ActifBadge from '../ActifBadge'
import { BUTTON_LIGHT } from '../buttonStyles'
import { formatDate, getEpreuveClasseLabel, getEpreuveCoursLabel, getTypeEpreuveLabel } from '../../pages/evaluations/evaluations.utils'

function EpreuveTable({ epreuvesList, deletingId, onDelete }) {
  if (epreuvesList.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucune epreuve a afficher</p>
        <p className="mt-2 text-sm text-slate-500">Essayez de modifier vos filtres ou creez une nouvelle epreuve.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_0.6fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Epreuve</span>
        <span>Type</span>
        <span>Classe / Cours</span>
        <span>Date</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {epreuvesList.map((epreuve) => (
          <article key={epreuve.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.2fr_0.9fr_0.9fr_0.8fr_0.6fr_1fr] lg:items-center">
            <div>
              <p className="text-base font-semibold text-slate-900">{epreuve.libelle}</p>
              <p className="mt-1 text-xs text-slate-400">ID {epreuve.id} · Coeff. {epreuve.coefficient}</p>
            </div>

            <div className="text-sm font-medium text-slate-700">{getTypeEpreuveLabel(epreuve.typeEpreuve)}</div>

            <div className="text-sm text-slate-600">
              <p>{getEpreuveClasseLabel(epreuve)}</p>
              <p className="text-xs text-slate-400">{getEpreuveCoursLabel(epreuve)}</p>
            </div>

            <div className="text-sm text-slate-600">{formatDate(epreuve.dateEpreuve)}</div>

            <div><ActifBadge actif={epreuve.actif} /></div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/evaluations/${epreuve.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/evaluations/${epreuve.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(epreuve)}
                disabled={deletingId === epreuve.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === epreuve.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default EpreuveTable
