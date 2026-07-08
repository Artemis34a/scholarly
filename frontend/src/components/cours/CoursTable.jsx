import { Link } from 'react-router-dom'
import ActifBadge from '../ActifBadge'
import { BUTTON_LIGHT } from '../buttonStyles'
import { getClasseLabel, getEnseignantsNames } from '../../pages/cours/cours.utils'

function CoursTable({ coursList, classes, deletingId, onDelete }) {
  if (coursList.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun cours a afficher</p>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier vos filtres ou creez un nouveau cours.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.1fr_0.8fr_0.6fr_1.2fr_0.7fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Cours</span>
        <span>Classe</span>
        <span>Coeff.</span>
        <span>Enseignant(s)</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {coursList.map((cours) => (
          <article
            key={cours.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_0.8fr_0.6fr_1.2fr_0.7fr_1fr] lg:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">{cours.libelle}</p>
              <p className="mt-1 text-xs text-slate-400">ID {cours.id}</p>
            </div>

            <div className="text-sm font-medium text-slate-700">
              {getClasseLabel(classes, cours.idClasse)}
            </div>

            <div className="text-sm text-slate-600">{cours.coefficient}</div>

            <div className="text-sm text-slate-600">
              {getEnseignantsNames(cours)}
            </div>

            <div>
              <ActifBadge actif={cours.actif} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/cours/${cours.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/cours/${cours.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(cours)}
                disabled={deletingId === cours.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === cours.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default CoursTable
