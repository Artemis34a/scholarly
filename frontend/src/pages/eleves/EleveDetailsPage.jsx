import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EleveStatusBadge from '../../components/eleves/EleveStatusBadge'
import HistoriqueView from '../../components/paiements/HistoriqueView'
import { elevesService } from '../../services/elevesService'
import { paiementsService } from '../../services/paiementsService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, getEleveClasseLabel, getEleveCycleLabel, getSexeLabel } from './eleves.utils'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function EleveDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [eleve, setEleve] = useState(null)
  const [historique, setHistorique] = useState(null)
  const [loading, setLoading] = useState(true)
  const [historiqueError, setHistoriqueError] = useState('')
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const eleveData = await elevesService.findOne(id)

        if (!isMounted) return

        setEleve(eleveData)
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()
    paiementsService.getHistorique(id)
      .then((data) => {
        if (isMounted) setHistorique(data)
      })
      .catch((err) => {
        if (isMounted) setHistoriqueError(err.message)
      })

    return () => {
      isMounted = false
    }
  }, [id])

  async function handleDelete() {
    if (!eleve) return

    const confirmed = window.confirm(
      `Supprimer definitivement ${eleve.nom} ${eleve.prenom} ?`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await elevesService.remove(eleve.id)
      navigate('/dashboard/eleves')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !eleve ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement du dossier...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Consultation detaillee
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                  {eleve.nom} {eleve.prenom}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Dossier eleve #{eleve.id} · ne le {formatDate(eleve.dateNaissance)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/eleves/${eleve.id}/profil`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Voir le profil
                </Link>
                <Link
                  to={`/dashboard/eleves/${eleve.id}/modifier`}
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

      {eleve && (
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card title="Informations generales" subtitle="Resume complet du dossier pour consultation administrative.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Nom complet" value={`${eleve.nom} ${eleve.prenom}`} />
              <InfoRow label="Statut" value={<EleveStatusBadge actif={eleve.actif} />} />
              <InfoRow label="Sexe" value={getSexeLabel(eleve.sexe)} />
              <InfoRow label="Langue" value={eleve.langue} />
              <InfoRow label="Lieu de naissance" value={eleve.lieuNaissance} />
              <InfoRow label="Classe" value={getEleveClasseLabel(eleve)} />
              <InfoRow label="Cycle" value={getEleveCycleLabel(eleve)} />
              <InfoRow label="Date de naissance" value={formatDate(eleve.dateNaissance)} />
              <InfoRow label="Identifiant" value={`#${eleve.id}`} />
            </div>
          </Card>

          <Card title="Actions rapides" subtitle="Navigation rapide vers les operations les plus frequentes.">
            <div className="space-y-4">
              <Link
                to={`/dashboard/eleves/${eleve.id}/profil`}
                className="block rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4 transition hover:border-sky-200 hover:bg-sky-50/70"
              >
                <p className="font-semibold text-slate-900">Ouvrir le profil eleve</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Vue visuelle pour lecture rapide du dossier.</p>
              </Link>
              <Link
                to={`/dashboard/eleves/${eleve.id}/modifier`}
                className="block rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4 transition hover:border-amber-200 hover:bg-amber-50/70"
              >
                <p className="font-semibold text-slate-900">Mettre a jour les informations</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Nom, date de naissance, cycle, langue et statut.</p>
              </Link>
              <button
                type="button"
                onClick={() => navigate('/dashboard/eleves')}
                className="w-full rounded-[24px] border border-slate-200/80 bg-white px-4 py-4 text-left transition hover:border-slate-300 hover:bg-slate-50"
              >
                <p className="font-semibold text-slate-900">Retour a la liste</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">Revenir a la recherche et aux filtres eleves.</p>
              </button>
            </div>
          </Card>
        </section>
      )}

      {eleve && (
        <Card
          title="Situation financiere"
          subtitle="Montant total des frais, versements deja effectues et reste a payer, par annee academique."
        >
          <div className="mb-5 flex justify-end">
            {historique?.parAnnee?.[0] ? (
              <Link
                to={`/dashboard/paiements/nouveau?idScolarite=${historique.parAnnee[0].idScolarite}`}
                className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600"
              >
                Enregistrer un paiement
              </Link>
            ) : historique && !historiqueError ? (
              <Link
                to="/dashboard/paiements/scolarites/nouvelle"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
              >
                Creer une scolarite
              </Link>
            ) : null}
          </div>

          {historiqueError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {historiqueError}
            </div>
          ) : !historique ? (
            <div className="py-8 text-center text-slate-400">Chargement de la situation financiere...</div>
          ) : historique.parAnnee.length === 0 ? (
            <p className="text-sm text-slate-500">
              Aucune scolarite enregistree pour cet eleve : aucun frais n'a encore ete defini.
            </p>
          ) : (
            <HistoriqueView historique={historique} eleveLabel="Annee academique" />
          )}
        </Card>
      )}
    </div>
  )
}

export default EleveDetailsPage
