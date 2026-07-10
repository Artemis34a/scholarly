import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { enseignantsService } from '../../services/enseignantsService'
import { coursService } from '../../services/coursService'
import { useAuth } from '../../context/AuthContext'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, getClasseCoursOptions } from './enseignants.utils'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function EnseignantDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [enseignant, setEnseignant] = useState(null)
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [selectedClasseCours, setSelectedClasseCours] = useState('')
  const [addingAffectation, setAddingAffectation] = useState(false)
  const [removingAffectationId, setRemovingAffectationId] = useState(null)

  async function loadEnseignant() {
    const data = await enseignantsService.findOne(id)
    setEnseignant(data)
    return data
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([enseignantsService.findOne(id), coursService.findAll()])
      .then(([enseignantData, coursData]) => {
        if (isMounted) {
          setEnseignant(enseignantData)
          setCours(coursData)
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

  const classeCoursOptions = useMemo(() => getClasseCoursOptions(cours), [cours])
  const classeCoursDisponibles = useMemo(
    () =>
      classeCoursOptions.filter(
        (option) => !enseignant?.affectations?.some((a) => `${a.idClasseCours}` === option.value),
      ),
    [classeCoursOptions, enseignant],
  )

  async function handleDelete() {
    if (!enseignant) return

    const confirmed = window.confirm(
      `Supprimer definitivement l'enseignant ${enseignant.personne?.nom} ${enseignant.personne?.prenom} et toutes ses affectations ?`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await enseignantsService.remove(enseignant.id)
      navigate('/dashboard/enseignants')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  async function handleAddAffectation(event) {
    event.preventDefault()
    if (!selectedClasseCours) return

    setAddingAffectation(true)
    setError('')
    try {
      await enseignantsService.addAffectation(enseignant.id, {
        idClasseCours: Number(selectedClasseCours),
        idAdmin: user?.id,
      })
      setSelectedClasseCours('')
      await loadEnseignant()
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingAffectation(false)
    }
  }

  async function handleRemoveAffectation(idAffectation) {
    const confirmed = window.confirm("Retirer cette affectation d'enseignement ?")
    if (!confirmed) return

    setRemovingAffectationId(idAffectation)
    setError('')
    try {
      await enseignantsService.removeAffectation(enseignant.id, idAffectation)
      await loadEnseignant()
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingAffectationId(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !enseignant ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement de l'enseignant...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Consultation detaillee
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
                  {enseignant.personne?.nom} {enseignant.personne?.prenom}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Enseignant #{enseignant.id} · {enseignant.personne?.username}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/enseignants/${enseignant.id}/profil`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Voir le profil
                </Link>
                <Link
                  to={`/dashboard/enseignants/${enseignant.id}/modifier`}
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

      {enseignant && (
        <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <Card title="Informations generales" subtitle="Resume complet de l'affectation pour consultation administrative.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Nom complet" value={`${enseignant.personne?.nom} ${enseignant.personne?.prenom}`} />
              <InfoRow label="Statut" value={<ActifBadge actif={enseignant.actif} />} />
              <InfoRow label="Identifiant de connexion" value={enseignant.personne?.username} />
              <InfoRow label="Telephone" value={enseignant.personne?.mobile || 'Non renseigne'} />
              <InfoRow label="Date de naissance" value={formatDate(enseignant.personne?.dateNaissance)} />
              <InfoRow label="Identifiant" value={`#${enseignant.id}`} />
            </div>
          </Card>

          <Card
            title="Affectations d'enseignement"
            subtitle="Un enseignant peut enseigner plusieurs cours, dans plusieurs classes. Le titulariat se gere depuis le module Classes."
          >
            <div className="space-y-4">
              {enseignant.affectations?.length > 0 ? (
                enseignant.affectations.map((affectation) => (
                  <div
                    key={affectation.id}
                    className="flex items-start justify-between gap-3 rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {affectation.classeCours?.cours?.libelle ?? 'Cours inconnu'}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {affectation.classeCours?.classe?.libelle ?? 'Classe inconnue'}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveAffectation(affectation.id)}
                      disabled={removingAffectationId === affectation.id}
                      className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {removingAffectationId === affectation.id ? '...' : 'Retirer'}
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Aucune affectation d'enseignement pour le moment.</p>
              )}

              {classeCoursDisponibles.length > 0 && (
                <form onSubmit={handleAddAffectation} className="rounded-[22px] border border-dashed border-slate-300 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Ajouter une affectation
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedClasseCours}
                      onChange={(event) => setSelectedClasseCours(event.target.value)}
                      required
                      className="min-w-[220px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                    >
                      <option value="">Choisir un cours dans une classe</option>
                      {classeCoursDisponibles.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={addingAffectation}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                    >
                      {addingAffectation ? 'Ajout...' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}

export default EnseignantDetailsPage
