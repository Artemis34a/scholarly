import { Link } from 'react-router-dom'
import ActifBadge from '../ActifBadge'
import { BUTTON_LIGHT } from '../buttonStyles'

function AdminTable({ admins, deletingId, onDelete }) {
  if (admins.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
        <p className="text-lg font-semibold text-slate-900">Aucun administrateur a afficher</p>
        <p className="mt-2 text-sm text-slate-500">
          Essayez de modifier vos filtres ou creez un nouveau compte.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
      <div className="hidden grid-cols-[1.3fr_1fr_0.8fr_1fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
        <span>Nom</span>
        <span>Identifiant</span>
        <span>Statut</span>
        <span>Actions</span>
      </div>

      <div className="divide-y divide-slate-100">
        {admins.map((admin) => (
          <article
            key={admin.id}
            className="grid gap-4 px-5 py-5 lg:grid-cols-[1.3fr_1fr_0.8fr_1fr] lg:items-center"
          >
            <div>
              <p className="text-base font-semibold text-slate-900">{admin.nom}</p>
              <p className="mt-1 text-xs text-slate-400">ID {admin.id}</p>
            </div>

            <div className="text-sm text-slate-600">{admin.username}</div>

            <div>
              <ActifBadge actif={admin.actif} />
            </div>

            <div className="flex flex-wrap gap-2">
              <Link
                to={`/dashboard/admins/${admin.id}/modifier`}
                className={BUTTON_LIGHT.primary}
              >
                Modifier
              </Link>
              <button
                type="button"
                onClick={() => onDelete(admin)}
                disabled={deletingId === admin.id}
                className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
              >
                {deletingId === admin.id ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

export default AdminTable
