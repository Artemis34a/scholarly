import { Link } from 'react-router-dom'
import { BUTTON_LIGHT } from '../buttonStyles'
import { getCoursCount, getCycleLabel, getEffectif, getTitulaireName } from '../../pages/classes/classes.utils'

function ClasseTable({ classes, cycles, deletingId, onDelete }) {
  if (classes.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucune classe a afficher</p>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier vos filtres ou creez une nouvelle classe.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.1fr_0.9fr_0.9fr_0.7fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Classe</span>
        <span>Cycle</span>
        <span>Titulaire</span>
        <span>Effectif</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {classes.map((classe) => (
          <article
            key={classe.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_0.9fr_0.9fr_0.7fr_1fr] lg:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">{classe.libelle}</p>
              <p className="mt-1 text-xs text-slate-400">
                ID {classe.id} · {getCoursCount(classe)} cours
              </p>
            </div>

            <div className="text-sm font-medium text-slate-700">
              {getCycleLabel(cycles, classe.idCycle)}
            </div>

            <div className="text-sm text-slate-600">
              {getTitulaireName(classe)}
            </div>

            <div className="text-sm font-medium text-slate-700">
              {getEffectif(classe)} eleve{getEffectif(classe) > 1 ? 's' : ''}
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/classes/${classe.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/classes/${classe.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(classe)}
                disabled={deletingId === classe.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === classe.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default ClasseTable
