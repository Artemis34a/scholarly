import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { coursService } from '../../services/coursService'
import { classesService } from '../../services/classesService'
import { useAuth } from '../../context/AuthContext'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { getClassesLabels } from './cours.utils'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function CoursDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cours, setCours] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [selectedClasse, setSelectedClasse] = useState('')
  const [addingClasse, setAddingClasse] = useState(false)
  const [removingClasseId, setRemovingClasseId] = useState(null)

  async function loadCours() {
    const data = await coursService.findOne(id)
    setCours(data)
    return data
  }

  useEffect(() => {
    let isMounted = true

    Promise.all([coursService.findOne(id), classesService.findAll({ limit: 200 })])
      .then(([coursData, classesResult]) => {
        if (isMounted) {
          setCours(coursData)
          setClasses(classesResult.data)
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
    if (!cours) return

    const confirmed = window.confirm(
      `Supprimer definitivement le cours ${cours.libelle} ?`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await coursService.remove(cours.id)
      navigate('/dashboard/cours')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  async function handleAddClasse(event) {
    event.preventDefault()
    if (!selectedClasse) return

    setAddingClasse(true)
    setError('')
    try {
      await coursService.addClasse(cours.id, { idClasse: Number(selectedClasse), idAdmin: user?.id })
      setSelectedClasse('')
      await loadCours()
    } catch (err) {
      setError(err.message)
    } finally {
      setAddingClasse(false)
    }
  }

  async function handleRemoveClasse(idClasse) {
    const confirmed = window.confirm(
      "Retirer ce cours de cette classe ? Les affectations d'enseignants pour cette combinaison seront egalement supprimees.",
    )
    if (!confirmed) return

    setRemovingClasseId(idClasse)
    setError('')
    try {
      await coursService.removeClasse(cours.id, idClasse)
      await loadCours()
    } catch (err) {
      setError(err.message)
    } finally {
      setRemovingClasseId(null)
    }
  }

  const classesDisponibles = classes.filter(
    (classe) => !cours?.classesCours?.some((classeCours) => classeCours.idClasse === classe.id),
  )

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !cours ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement du cours...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Consultation detaillee
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{cours.libelle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Cours #{cours.id} · {getClassesLabels(cours)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/cours/${cours.id}/modifier`}
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

      {cours && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Informations generales" subtitle="Resume complet du cours pour consultation administrative.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Libelle" value={cours.libelle} />
              <InfoRow label="Statut" value={<ActifBadge actif={cours.actif} />} />
              <InfoRow label="Coefficient" value={cours.coefficient} />
              <InfoRow label="Note" value={cours.note ?? 'Non renseignee'} />
              <InfoRow label="Description" value={cours.description || 'Aucune description'} />
              <InfoRow label="Identifiant" value={`#${cours.id}`} />
            </div>
          </Card>

          <Card
            title="Classes associees"
            subtitle="Un cours peut etre enseigne dans plusieurs classes. Chaque classe affiche les enseignants qui y assurent ce cours."
          >
            <div className="space-y-4">
              {cours.classesCours?.length > 0 ? (
                cours.classesCours.map((classeCours) => (
                  <div
                    key={classeCours.id}
                    className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{classeCours.classe?.libelle}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {classeCours.classe?.cycle?.libelle ?? 'Cycle non renseigne'}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveClasse(classeCours.idClasse)}
                        disabled={removingClasseId === classeCours.idClasse}
                        className="rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                      >
                        {removingClasseId === classeCours.idClasse ? '...' : 'Retirer'}
                      </button>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {classeCours.affectations?.length > 0 ? (
                        classeCours.affectations.map((affectation) => (
                          <Link
                            key={affectation.id}
                            to={`/dashboard/enseignants/${affectation.enseignant.id}`}
                            className="block text-xs font-medium text-sky-700 hover:text-sky-900"
                          >
                            {affectation.enseignant.personne?.nom} {affectation.enseignant.personne?.prenom}
                          </Link>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">Aucun enseignant affecte pour cette classe.</p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Ce cours n'est associe a aucune classe.</p>
              )}

              {classesDisponibles.length > 0 && (
                <form onSubmit={handleAddClasse} className="rounded-[22px] border border-dashed border-slate-300 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
                    Associer une classe
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <select
                      value={selectedClasse}
                      onChange={(event) => setSelectedClasse(event.target.value)}
                      required
                      className="min-w-[200px] flex-1 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                    >
                      <option value="">Choisir une classe</option>
                      {classesDisponibles.map((classe) => (
                        <option key={classe.id} value={classe.id}>{classe.libelle}</option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      disabled={addingClasse}
                      className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                    >
                      {addingClasse ? 'Ajout...' : 'Ajouter'}
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

export default CoursDetailsPage
