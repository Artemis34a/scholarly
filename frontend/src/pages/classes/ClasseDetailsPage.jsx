import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { classesService } from '../../services/classesService'
import { cyclesService } from '../../services/cyclesService'
import { enseignantsService } from '../../services/enseignantsService'
import { elevesService } from '../../services/elevesService'
import { frequenteService } from '../../services/frequenteService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { getCycleLabel, getPrimarySalle } from './classes.utils'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function ClasseDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classe, setClasse] = useState(null)
  const [cycles, setCycles] = useState([])
  const [eleves, setEleves] = useState([])
  const [enseignants, setEnseignants] = useState([])
  const [tousLesEleves, setTousLesEleves] = useState([])
  const [selectedTitulaire, setSelectedTitulaire] = useState('')
  const [selectedEleve, setSelectedEleve] = useState('')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [removingId, setRemovingId] = useState(null)
  const [error, setError] = useState('')

  async function loadAll() {
    try {
      const [classeData, cyclesData, elevesData, enseignantsData, tousLesElevesResult] = await Promise.all([
        classesService.findOne(id),
        cyclesService.findAll(),
        classesService.findEleves(id),
        enseignantsService.findActifs(),
        elevesService.findAll({ limit: 100 }),
      ])

      setClasse(classeData)
      setCycles(cyclesData)
      setEleves(elevesData)
      setEnseignants(enseignantsData)
      setTousLesEleves(tousLesElevesResult.data)
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

  const salle = useMemo(() => getPrimarySalle(classe), [classe])
  const titulairePersonne = salle?.titulaire?.personne
  const elevesDisponibles = useMemo(
    () => tousLesEleves.filter((eleve) => !eleves.some((frequente) => frequente.eleve.id === eleve.id)),
    [tousLesEleves, eleves],
  )

  async function handleEnroll(event) {
    event.preventDefault()
    if (!selectedEleve || !salle) return

    setEnrolling(true)
    setError('')
    try {
      await frequenteService.create({ idSalle: salle.id, idEleve: Number(selectedEleve) })
      await loadAll()
      setSelectedEleve('')
    } catch (err) {
      setError(err.message)
    } finally {
      setEnrolling(false)
    }
  }

  async function handleUnenroll(frequente) {
    const confirmed = window.confirm(`Retirer ${frequente.eleve.nom} ${frequente.eleve.prenom} de cette classe ?`)
    if (!confirmed) return

    setRemovingId(frequente.id)
    setError('')
    try {
      await frequenteService.remove(frequente.id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingId(null)
    }
  }

  async function handleAssignTitulaire(event) {
    event.preventDefault()
    if (!selectedTitulaire) return

    if (titulairePersonne) {
      const confirmed = window.confirm(
        `Cette classe a deja un titulaire : ${titulairePersonne.nom} ${titulairePersonne.prenom}. Voulez-vous le remplacer ?`,
      )
      if (!confirmed) return
    }

    setAssigning(true)
    setError('')
    try {
      await classesService.assignTitulaire(id, Number(selectedTitulaire))
      await loadAll()
      setSelectedTitulaire('')
    } catch (err) {
      setError(err.message)
    } finally {
      setAssigning(false)
    }
  }

  async function handleRemoveTitulaire() {
    const confirmed = window.confirm('Retirer le titulaire de cette classe ?')
    if (!confirmed) return

    setAssigning(true)
    setError('')
    try {
      await classesService.removeTitulaire(id)
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setAssigning(false)
    }
  }

  async function handleDelete() {
    if (!classe) return

    const confirmed = window.confirm(
      `Supprimer definitivement la classe ${classe.libelle} ? Les cours, affectations et paiements lies a cette classe seront egalement supprimes.`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await classesService.remove(classe.id)
      navigate('/dashboard/classes')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !classe ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement de la classe...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Consultation detaillee
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{classe.libelle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Classe #{classe.id} · {getCycleLabel(cycles, classe.idCycle)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/classes/${classe.id}/modifier`}
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

      {classe && (
        <>
          <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <Card title="Informations generales" subtitle="Resume complet de la classe pour consultation administrative.">
              <div className="grid gap-4 md:grid-cols-2">
                <InfoRow label="Libelle" value={classe.libelle} />
                <InfoRow label="Cycle" value={getCycleLabel(cycles, classe.idCycle)} />
                <InfoRow label="Effectif" value={`${eleves.length} eleve${eleves.length > 1 ? 's' : ''}`} />
                <InfoRow label="Cours rattaches" value={`${classe.cours?.length ?? 0}`} />
                <InfoRow label="Salle principale" value={salle?.libelle ?? 'Non renseignee'} />
                <InfoRow label="Identifiant" value={`#${classe.id}`} />
              </div>
            </Card>

            <Card title="Titulaire de la classe" subtitle="Enseignant responsable de la classe.">
              <div className="space-y-4">
                {titulairePersonne ? (
                  <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Titulaire actuel</p>
                    <p className="mt-2 text-sm font-medium text-slate-800">
                      {titulairePersonne.nom} {titulairePersonne.prenom}
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">Aucun titulaire affecte pour cette classe.</p>
                )}

                <form onSubmit={handleAssignTitulaire} className="space-y-4">
                  <select
                    value={selectedTitulaire}
                    onChange={(event) => setSelectedTitulaire(event.target.value)}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                  >
                    <option value="">Choisir un enseignant</option>
                    {enseignants.map((enseignant) => (
                      <option key={enseignant.id} value={enseignant.idPers}>
                        {enseignant.personne?.nom} {enseignant.personne?.prenom} ({enseignant.cours?.libelle})
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={assigning || !selectedTitulaire}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                  >
                    {assigning
                      ? 'Traitement...'
                      : titulairePersonne
                        ? 'Remplacer le titulaire'
                        : 'Affecter comme titulaire'}
                  </button>
                </form>

                {titulairePersonne && (
                  <button
                    type="button"
                    onClick={handleRemoveTitulaire}
                    disabled={assigning}
                    className="w-full rounded-2xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                  >
                    {assigning ? 'Traitement...' : 'Retirer le titulaire'}
                  </button>
                )}
              </div>
            </Card>
          </section>

          <Card title="Eleves de la classe" subtitle="Liste des eleves inscrits dans la salle principale de cette classe.">
            <form onSubmit={handleEnroll} className="mb-5 flex flex-col gap-3 rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4 sm:flex-row sm:items-center">
              <select
                value={selectedEleve}
                onChange={(event) => setSelectedEleve(event.target.value)}
                required
                className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
              >
                <option value="">
                  {elevesDisponibles.length === 0 ? 'Tous les eleves sont deja inscrits' : 'Choisir un eleve a inscrire'}
                </option>
                {elevesDisponibles.map((eleve) => (
                  <option key={eleve.id} value={eleve.id}>{eleve.nom} {eleve.prenom}</option>
                ))}
              </select>
              <button
                type="submit"
                disabled={enrolling || !selectedEleve}
                className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
              >
                {enrolling ? 'Inscription...' : 'Inscrire'}
              </button>
            </form>

            {eleves.length === 0 ? (
              <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
                <p className="text-lg font-semibold text-slate-900">Aucun eleve inscrit</p>
                <p className="mt-2 text-sm text-slate-500">Inscrivez un eleve avec le formulaire ci-dessus.</p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
                <div className="hidden grid-cols-[1.4fr_0.8fr_0.6fr_0.7fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
                  <span>Eleve</span>
                  <span>Commentaire</span>
                  <span>Statut</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white/90">
                  {eleves.map((frequente) => (
                    <div
                      key={frequente.id}
                      className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.4fr_0.8fr_0.6fr_0.7fr] lg:items-center"
                    >
                      <Link to={`/dashboard/eleves/${frequente.eleve.id}`} className="font-semibold text-slate-900 hover:text-sky-600">
                        {frequente.eleve.nom} {frequente.eleve.prenom}
                      </Link>
                      <span>{frequente.commentaire || '-'}</span>
                      <span>
                        <ActifBadge actif={frequente.eleve.actif} />
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUnenroll(frequente)}
                        disabled={removingId === frequente.id}
                        className="w-fit rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                      >
                        {removingId === frequente.id ? '...' : 'Retirer'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

export default ClasseDetailsPage
