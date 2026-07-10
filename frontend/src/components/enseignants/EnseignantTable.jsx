import { Link } from 'react-router-dom'
import ActifBadge from '../ActifBadge'
import { BUTTON_LIGHT } from '../buttonStyles'
import { getAffectationsLabel } from '../../pages/enseignants/enseignants.utils'

function EnseignantTable({ enseignants, deletingId, onDelete }) {
  if (enseignants.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun enseignant a afficher</p>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier vos filtres ou creez une nouvelle affectation.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.35fr_1fr_0.8fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Enseignant</span>
        <span>Affectations</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {enseignants.map((enseignant) => (
          <article
            key={enseignant.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.35fr_1fr_0.8fr_1fr] lg:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">
                {enseignant.personne?.nom} {enseignant.personne?.prenom}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {enseignant.personne?.username}
              </p>
              <p className="mt-1 text-xs text-slate-400">ID {enseignant.id}</p>
            </div>

            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-800">{getAffectationsLabel(enseignant)}</p>
            </div>

            <div>
              <ActifBadge actif={enseignant.actif} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/enseignants/${enseignant.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/enseignants/${enseignant.id}/profil`}
                className={BUTTON_LIGHT.primary}
              >
                Profil
              </Link>
              <Link
                to={`/dashboard/enseignants/${enseignant.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(enseignant)}
                disabled={deletingId === enseignant.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === enseignant.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default EnseignantTable
