import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import StatutPaiementBadge from '../../components/paiements/StatutPaiementBadge'
import { paiementsService } from '../../services/paiementsService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, formatMontant } from './paiements.utils'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function ScolariteDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [scolarite, setScolarite] = useState(null)
  const [solde, setSolde] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  async function loadAll() {
    try {
      const [scolariteData, soldeData] = await Promise.all([
        paiementsService.scolarites.findOne(id),
        paiementsService.scolarites.getSolde(id),
      ])
      setScolarite(scolariteData)
      setSolde(soldeData)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    loadAll().catch(() => {}).finally(() => {
      if (!isMounted) setLoading(false)
    })
    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  async function handleDelete() {
    if (!scolarite) return

    const confirmed = window.confirm(
      `Supprimer la scolarite de ${scolarite.eleve?.nom} ${scolarite.eleve?.prenom} ? Tous les paiements associes seront egalement supprimes.`,
    )
    if (!confirmed) return

    try {
      setDeleting(true)
      await paiementsService.scolarites.remove(scolarite.id)
      navigate('/dashboard/paiements/scolarites')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !scolarite ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement de la scolarite...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Consultation detaillee</p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                  {scolarite.eleve?.nom} {scolarite.eleve?.prenom}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {scolarite.anneeAcademique?.libelle} · {scolarite.classe?.libelle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/paiements/nouveau?idScolarite=${scolarite.id}`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Ajouter un paiement
                </Link>
                <Link
                  to={`/dashboard/paiements/scolarites/${scolarite.id}/modifier`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={BUTTON_ON_DARK.danger}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {scolarite && solde && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant attendu</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{formatMontant(solde.montantAttendu)}</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Montant paye</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{formatMontant(solde.montantPaye)}</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Reste a payer</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{formatMontant(solde.reste)}</p>
            </div>
            <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Statut ({solde.pourcentage}%)</p>
              <p className="mt-3"><StatutPaiementBadge statut={solde.statut} /></p>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Card title="Details du dossier" subtitle="Frais et reduction appliques.">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Statut de la scolarite" value={scolarite.statut} />
                <InfoRow label="Date d'inscription" value={formatDate(scolarite.dateInscription)} />
                <InfoRow label="Frais d'inscription" value={formatMontant(scolarite.fraisInscription)} />
                <InfoRow label="Frais de scolarite" value={formatMontant(scolarite.fraisScolarite)} />
                <InfoRow label="Reduction" value={formatMontant(scolarite.reduction)} />
                <InfoRow label="Observations" value={scolarite.observations || 'Aucune'} />
              </div>
            </Card>

            <Card title="Paiements" subtitle="Historique des versements pour cette scolarite.">
              {scolarite.paiements.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun paiement enregistre.</p>
              ) : (
                <div className="space-y-3">
                  {scolarite.paiements.map((paiement) => (
                    <Link
                      key={paiement.id}
                      to={`/dashboard/paiements/${paiement.id}`}
                      className="block rounded-[20px] border border-slate-200/80 bg-slate-50/80 px-4 py-3 transition hover:border-sky-200 hover:bg-sky-50/70"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-slate-900">{formatMontant(paiement.montant)}</p>
                        <p className="text-xs text-slate-400">{formatDate(paiement.datePaiement)}</p>
                      </div>
                      <p className="mt-1 text-xs text-slate-500">{paiement.tranche?.libelle} · {paiement.modePaiement?.libelle}</p>
                    </Link>
                  ))}
                </div>
              )}
            </Card>
          </section>
        </>
      )}
    </div>
  )
}

export default ScolariteDetailsPage
