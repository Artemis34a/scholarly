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

function PaiementDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [paiement, setPaiement] = useState(null)
  const [solde, setSolde] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    paiementsService.findOne(id)
      .then(async (data) => {
        if (!isMounted) return
        setPaiement(data)
        try {
          const soldeData = await paiementsService.scolarites.getSolde(data.idScolarite)
          if (isMounted) setSolde(soldeData)
        } catch {
          // ignore, solde is a nice-to-have on this page
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleDelete() {
    if (!paiement) return

    const confirmed = window.confirm(`Supprimer ce paiement de ${formatMontant(paiement.montant)} ?`)
    if (!confirmed) return

    try {
      setDeleting(true)
      await paiementsService.remove(paiement.id)
      navigate('/dashboard/paiements')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !paiement ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement du paiement...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Consultation detaillee</p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{formatMontant(paiement.montant)}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {paiement.scolarite?.eleve?.nom} {paiement.scolarite?.eleve?.prenom} · {formatDate(paiement.datePaiement)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/paiements/${paiement.id}/modifier`}
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

      {paiement && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Informations generales" subtitle="Details complets du paiement.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Eleve" value={`${paiement.scolarite?.eleve?.nom} ${paiement.scolarite?.eleve?.prenom}`} />
              <InfoRow label="Annee academique" value={paiement.scolarite?.anneeAcademique?.libelle} />
              <InfoRow label="Classe" value={paiement.scolarite?.classe?.libelle} />
              <InfoRow label="Tranche" value={paiement.tranche?.libelle ?? 'Versement libre'} />
              <InfoRow label="Mode de paiement" value={paiement.modePaiement?.libelle} />
              <InfoRow label="Montant" value={formatMontant(paiement.montant)} />
              <InfoRow label="Date" value={formatDate(paiement.datePaiement)} />
              <InfoRow label="Reference" value={paiement.reference || 'Non renseignee'} />
              <InfoRow label="Numero de recu" value={paiement.recuNumero || 'Non renseigne'} />
              <InfoRow label="Commentaire" value={paiement.commentaire || 'Aucun'} />
            </div>
          </Card>

          <Card title="Solde de la scolarite" subtitle="Calcule automatiquement a partir de tous les paiements de cette scolarite.">
            {solde ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-500">Statut</p>
                  <StatutPaiementBadge statut={solde.statut} />
                </div>
                <InfoRow label="Montant attendu" value={formatMontant(solde.montantAttendu)} />
                <InfoRow label="Montant paye" value={formatMontant(solde.montantPaye)} />
                <InfoRow label="Reste a payer" value={formatMontant(solde.reste)} />
                <InfoRow label="Pourcentage paye" value={`${solde.pourcentage}%`} />
                <Link
                  to={`/dashboard/paiements/scolarites/${paiement.idScolarite}`}
                  className="block rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4 text-center text-sm font-semibold text-sky-600 transition hover:border-sky-200 hover:bg-sky-50"
                >
                  Voir la scolarite complete
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-500">Solde indisponible.</p>
            )}
          </Card>
        </section>
      )}
    </div>
  )
}

export default PaiementDetailsPage
