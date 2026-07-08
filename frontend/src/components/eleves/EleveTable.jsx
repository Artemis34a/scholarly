import { Link } from 'react-router-dom'
import EleveStatusBadge from './EleveStatusBadge'
import { BUTTON_LIGHT } from '../buttonStyles'
import { formatDate, getSexeLabel, getVilleLabel } from '../../pages/eleves/eleves.utils'

function EleveTable({ eleves, villes, deletingId, onDelete }) {
  if (eleves.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun eleve a afficher</p>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier vos filtres ou creez une nouvelle inscription.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.35fr_0.9fr_0.8fr_0.8fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Eleve</span>
        <span>Ville</span>
        <span>Sexe</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {eleves.map((eleve) => (
          <article
            key={eleve.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.35fr_0.9fr_0.8fr_0.8fr_1fr] lg:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">
                {eleve.nom} {eleve.prenom}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Ne le {formatDate(eleve.dateNaissance)} · {eleve.langue}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                ID {eleve.id} · {eleve.lieuNaissance}
              </p>
            </div>

            <div className="text-sm text-slate-600">
              <p className="font-medium text-slate-800">{getVilleLabel(villes, eleve.idVilleNaissance)}</p>
              <p className="mt-1 text-xs text-slate-400">Lieu saisi: {eleve.lieuNaissance}</p>
            </div>

            <div className="text-sm font-medium text-slate-700">
              {getSexeLabel(eleve.sexe)}
            </div>

            <div>
              <EleveStatusBadge actif={eleve.actif} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/eleves/${eleve.id}`}
                className={BUTTON_LIGHT.primary}
              >
                Details
              </Link>
              <Link
                to={`/dashboard/eleves/${eleve.id}/profil`}
                className={BUTTON_LIGHT.primary}
              >
                Profil
              </Link>
              <Link
                to={`/dashboard/eleves/${eleve.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(eleve)}
                disabled={deletingId === eleve.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === eleve.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default EleveTable
