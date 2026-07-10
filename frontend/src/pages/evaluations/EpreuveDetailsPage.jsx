import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { evaluationsService } from '../../services/evaluationsService'
import { elevesService } from '../../services/elevesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, getEpreuveClasseLabel, getEpreuveCoursLabel, getTypeEpreuveLabel } from './evaluations.utils'

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value ?? '-'}</p>
    </div>
  )
}

function EpreuveDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [epreuve, setEpreuve] = useState(null)
  const [stats, setStats] = useState(null)
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  const [noteForm, setNoteForm] = useState({ idEleve: '', note: '', appreciation: '' })
  const [savingNote, setSavingNote] = useState(false)
  const [deletingNoteId, setDeletingNoteId] = useState(null)

  async function loadAll() {
    try {
      const [epreuveData, statsData, elevesResult] = await Promise.all([
        evaluationsService.epreuves.findOne(id),
        evaluationsService.epreuves.getStats(id),
        elevesService.findAll({ limit: 100 }),
      ])

      setEpreuve(epreuveData)
      setStats(statsData)
      setEleves(elevesResult.data)
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

  const elevesNonNotes = useMemo(() => {
    if (!epreuve) return []
    const idsNotes = new Set(epreuve.evaluations.map((evaluation) => evaluation.idEleve))
    return eleves.filter((eleve) => !idsNotes.has(eleve.id))
  }, [epreuve, eleves])

  function handleNoteFormChange(event) {
    const { name, value } = event.target
    setNoteForm((current) => ({ ...current, [name]: value }))
  }

  async function handleAddNote(event) {
    event.preventDefault()
    if (!noteForm.idEleve) return

    setSavingNote(true)
    setError('')
    try {
      await evaluationsService.notes.create({
        idEpreuve: Number(id),
        idEleve: Number(noteForm.idEleve),
        note: noteForm.note.trim() ? Number(noteForm.note) : undefined,
        appreciation: noteForm.appreciation.trim() || undefined,
      })
      setNoteForm({ idEleve: '', note: '', appreciation: '' })
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingNote(false)
    }
  }

  async function handleDeleteNote(evaluationId) {
    const confirmed = window.confirm('Supprimer cette note ?')
    if (!confirmed) return

    setDeletingNoteId(evaluationId)
    setError('')
    try {
      await evaluationsService.notes.remove(evaluationId)
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setDeletingNoteId(null)
    }
  }

  async function handleDeleteEpreuve() {
    if (!epreuve) return

    const confirmed = window.confirm(`Supprimer definitivement l'epreuve ${epreuve.libelle} et toutes ses notes ?`)
    if (!confirmed) return

    try {
      setDeleting(true)
      await evaluationsService.epreuves.remove(epreuve.id)
      navigate('/dashboard/evaluations')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !epreuve ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement de l'epreuve...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Consultation detaillee</p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{epreuve.libelle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {getTypeEpreuveLabel(epreuve.typeEpreuve)} · {formatDate(epreuve.dateEpreuve)} · {getEpreuveClasseLabel(epreuve)} · {getEpreuveCoursLabel(epreuve)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/evaluations/${epreuve.id}/modifier`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={handleDeleteEpreuve}
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

      {epreuve && stats && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Moyenne de classe" value={stats.moyenneClasse !== null ? `${stats.moyenneClasse.toFixed(2)}/${stats.noteMax}` : 'Aucune note'} />
            <StatCard label="Meilleure note" value={stats.meilleureNote !== null ? `${stats.meilleureNote}/${stats.noteMax}` : '-'} />
            <StatCard label="Moins bonne note" value={stats.moinsBonneNote !== null ? `${stats.moinsBonneNote}/${stats.noteMax}` : '-'} />
            <StatCard label="Notes saisies" value={`${stats.nombreNotes}`} />
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
            <Card title="Classement" subtitle="Notes triees par rang (calcule automatiquement a chaque saisie).">
              {epreuve.evaluations.length === 0 ? (
                <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
                  <p className="text-lg font-semibold text-slate-900">Aucune note saisie</p>
                </div>
              ) : (
                <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
                  <div className="hidden grid-cols-[0.4fr_1.2fr_0.6fr_1fr_0.6fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
                    <span>Rang</span>
                    <span>Eleve</span>
                    <span>Note</span>
                    <span>Appreciation</span>
                    <span>Actions</span>
                  </div>
                  <div className="divide-y divide-slate-100 bg-white/90">
                    {epreuve.evaluations.map((evaluation) => (
                      <div key={evaluation.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[0.4fr_1.2fr_0.6fr_1fr_0.6fr]">
                        <span className="font-semibold text-slate-900">{evaluation.rang ?? '-'}</span>
                        <Link to={`/dashboard/eleves/${evaluation.eleve.id}`} className="font-medium text-slate-800 hover:text-sky-600">
                          {evaluation.eleve.nom} {evaluation.eleve.prenom}
                        </Link>
                        <span>{evaluation.note !== null ? `${evaluation.note}/${epreuve.noteMax}` : 'Non note'}</span>
                        <span>{evaluation.appreciation || '-'}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(evaluation.id)}
                          disabled={deletingNoteId === evaluation.id}
                          className="w-fit rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                        >
                          {deletingNoteId === evaluation.id ? '...' : 'Retirer'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            <Card title="Ajouter une note" subtitle="Saisissez la note d'un eleve non encore evalue pour cette epreuve.">
              {elevesNonNotes.length === 0 ? (
                <p className="text-sm text-slate-500">Tous les eleves disponibles ont deja une note pour cette epreuve.</p>
              ) : (
                <form onSubmit={handleAddNote} className="space-y-4">
                  <select
                    name="idEleve"
                    value={noteForm.idEleve}
                    onChange={handleNoteFormChange}
                    required
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                  >
                    <option value="">Choisir un eleve</option>
                    {elevesNonNotes.map((eleve) => (
                      <option key={eleve.id} value={eleve.id}>{eleve.nom} {eleve.prenom}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    name="note"
                    step="0.5"
                    min="0"
                    max={epreuve.noteMax}
                    value={noteForm.note}
                    onChange={handleNoteFormChange}
                    placeholder={`Note sur ${epreuve.noteMax}`}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                  />
                  <input
                    type="text"
                    name="appreciation"
                    value={noteForm.appreciation}
                    onChange={handleNoteFormChange}
                    placeholder="Appreciation (optionnelle)"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                  />
                  <button
                    type="submit"
                    disabled={savingNote}
                    className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                  >
                    {savingNote ? 'Enregistrement...' : 'Ajouter la note'}
                  </button>
                </form>
              )}

              <div className="mt-6 rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Statut</p>
                <p className="mt-2"><ActifBadge actif={epreuve.actif} /></p>
              </div>
            </Card>
          </section>
        </>
      )}
    </div>
  )
}

export default EpreuveDetailsPage
