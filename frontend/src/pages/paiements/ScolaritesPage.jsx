import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import PaiementsSubNav from '../../components/paiements/PaiementsSubNav'
import StatutPaiementBadge from '../../components/paiements/StatutPaiementBadge'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { paiementsService } from '../../services/paiementsService'
import { formatMontant } from './paiements.utils'

function ScolaritesPage() {
  const [scolarites, setScolarites] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  async function loadScolarites() {
    try {
      const data = await paiementsService.scolarites.findAll()
      setScolarites(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadScolarites()
  }, [])

  async function handleDelete(scolarite) {
    const confirmed = window.confirm(
      `Supprimer la scolarite de ${scolarite.eleve?.nom} ${scolarite.eleve?.prenom} pour ${scolarite.anneeAcademique?.libelle} ? Tous les paiements associes seront egalement supprimes.`,
    )
    if (!confirmed) return

    try {
      setDeletingId(scolarite.id)
      await paiementsService.scolarites.remove(scolarite.id)
      await loadScolarites()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Finance</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Scolarites</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Frais d'inscription, de scolarite et reductions par eleve et par annee academique.
          </p>
        </div>
      </Card>

      <PaiementsSubNav />

      <Card
        title="Liste des scolarites"
        subtitle="Consultez le solde calcule automatiquement pour chaque dossier."
        className="relative"
      >
        <Link
          to="/dashboard/paiements/scolarites/nouvelle"
          className="absolute right-6 top-6 hidden rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 md:inline-flex"
        >
          Nouvelle scolarite
        </Link>
        <Link
          to="/dashboard/paiements/scolarites/nouvelle"
          className="mb-4 inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600 md:hidden"
        >
          Nouvelle scolarite
        </Link>

        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : scolarites.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune scolarite</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr_0.7fr_1fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Eleve</span>
              <span>Annee</span>
              <span>Classe</span>
              <span>Reste a payer</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {scolarites.map((scolarite) => (
                <div key={scolarite.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.1fr_0.8fr_0.8fr_0.9fr_0.7fr_1fr]">
                  <span className="font-semibold text-slate-900">{scolarite.eleve?.nom} {scolarite.eleve?.prenom}</span>
                  <span>{scolarite.anneeAcademique?.libelle}</span>
                  <span>{scolarite.classe?.libelle}</span>
                  <span>{formatMontant(scolarite.solde?.reste)}</span>
                  <span><StatutPaiementBadge statut={scolarite.solde?.statut} /></span>
                  <span className="flex flex-wrap gap-2">
                    <Link
                      to={`/dashboard/paiements/scolarites/${scolarite.id}`}
                      className={BUTTON_LIGHT.primary}
                    >
                      Details
                    </Link>
                    <Link
                      to={`/dashboard/paiements/scolarites/${scolarite.id}/modifier`}
                      className={BUTTON_LIGHT.primary}
                    >
                      Modifier
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(scolarite)}
                      disabled={deletingId === scolarite.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === scolarite.id ? '...' : 'Supprimer'}
                    </button>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default ScolaritesPage
