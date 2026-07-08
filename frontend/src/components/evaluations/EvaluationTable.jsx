import { Link } from 'react-router-dom'
import { BUTTON_LIGHT } from '../buttonStyles'

function EvaluationTable({ evaluationsList, deletingId, onDelete }) {
  if (evaluationsList.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucune note a afficher</p>
        <p className="mt-2 text-sm text-slate-500">Essayez de modifier vos filtres ou saisissez une nouvelle note.</p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.1fr_1.1fr_0.7fr_0.6fr_1fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Eleve</span>
        <span>Epreuve</span>
        <span>Note</span>
        <span>Rang</span>
        <span>Appreciation</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {evaluationsList.map((evaluation) => (
          <article key={evaluation.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.1fr_1.1fr_0.7fr_0.6fr_1fr_1fr] lg:items-center">
            <Link to={`/dashboard/eleves/${evaluation.eleve?.id}`} className="text-sm font-semibold text-slate-900 hover:text-sky-600">
              {evaluation.eleve?.nom} {evaluation.eleve?.prenom}
            </Link>

            <Link to={`/dashboard/evaluations/${evaluation.epreuve?.id}`} className="text-sm font-medium text-slate-700 hover:text-sky-600">
              {evaluation.epreuve?.libelle}
            </Link>

            <div className="text-sm text-slate-600">
              {evaluation.note !== null && evaluation.note !== undefined ? `${evaluation.note}/${evaluation.epreuve?.noteMax}` : 'Non note'}
            </div>

            <div className="text-sm font-semibold text-slate-800">{evaluation.rang ?? '-'}</div>

            <div className="text-sm text-slate-600">{evaluation.appreciation || '-'}</div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/evaluations/notes/${evaluation.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(evaluation)}
                disabled={deletingId === evaluation.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === evaluation.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default EvaluationTable
