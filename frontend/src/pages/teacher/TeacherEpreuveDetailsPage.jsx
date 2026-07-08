import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import { evaluationsService } from '../../services/evaluationsService'
import { classesService } from '../../services/classesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate } from '../evaluations/evaluations.utils'

function StatCard({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-2xl font-semibold text-slate-900">{value ?? '-'}</p>
    </div>
  )
}

function buildRoster(epreuve, elevesFrequentes) {
  const evaluationsParEleve = new Map(epreuve.evaluations.map((evaluation) => [evaluation.idEleve, evaluation]))

  return elevesFrequentes.map((frequente) => {
    const evaluation = evaluationsParEleve.get(frequente.eleve.id)
    return {
      eleve: frequente.eleve,
      evaluation: evaluation ?? null,
    }
  })
}

function TeacherEpreuveDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [epreuve, setEpreuve] = useState(null)
  const [stats, setStats] = useState(null)
  const [roster, setRoster] = useState([])
  const [noteInputs, setNoteInputs] = useState({})
  const [loading, setLoading] = useState(true)
  const [savingId, setSavingId] = useState(null)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  async function loadAll() {
    const epreuveData = await evaluationsService.epreuves.findOne(id)
    const statsData = await evaluationsService.epreuves.getStats(id)
    const idClasse = epreuveData.cours?.classe?.id

    const elevesFrequentes = idClasse ? await classesService.findEleves(idClasse) : []
    const nextRoster = buildRoster(epreuveData, elevesFrequentes)

    setEpreuve(epreuveData)
    setStats(statsData)
    setRoster(nextRoster)
    setNoteInputs((current) => {
      const next = { ...current }
      nextRoster.forEach(({ eleve, evaluation }) => {
        if (!next[eleve.id]) {
          next[eleve.id] = {
            note: evaluation && evaluation.note !== null && evaluation.note !== undefined ? `${evaluation.note}` : '',
            appreciation: evaluation?.appreciation ?? '',
          }
        }
      })
      return next
    })
  }

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError('')

    loadAll()
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleNoteChange(eleveId, field, value) {
    setNoteInputs((current) => ({
      ...current,
      [eleveId]: { ...current[eleveId], [field]: value },
    }))
  }

  async function handleSaveRow(row) {
    const input = noteInputs[row.eleve.id] ?? { note: '', appreciation: '' }
    setSavingId(row.eleve.id)
    setError('')
    setMessage('')

    try {
      const payload = {
        idEpreuve: Number(id),
        idEleve: row.eleve.id,
        note: input.note.trim() ? Number(input.note) : undefined,
        appreciation: input.appreciation.trim() || undefined,
      }

      if (row.evaluation) {
        await evaluationsService.notes.update(row.evaluation.id, payload)
      } else {
        await evaluationsService.notes.create(payload)
      }

      await loadAll()
      setMessage(`Note enregistree pour ${row.eleve.nom} ${row.eleve.prenom}.`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSavingId(null)
    }
  }

  async function handleDelete() {
    if (!epreuve) return

    const confirmed = window.confirm(`Supprimer definitivement l'epreuve ${epreuve.libelle} et toutes ses notes ?`)
    if (!confirmed) return

    try {
      await evaluationsService.epreuves.remove(epreuve.id)
      navigate('/teacher/evaluations')
    } catch (err) {
      setError(err.message)
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
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Espace enseignant</p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{epreuve.libelle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  {epreuve.cours?.libelle} · {epreuve.cours?.classe?.libelle} · {formatDate(epreuve.dateEpreuve)}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/teacher/evaluations`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Retour a la liste
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  className={BUTTON_ON_DARK.danger}
                >
                  Supprimer l'epreuve
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
      {message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      {epreuve && stats && (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard label="Moyenne de classe" value={stats.moyenneClasse !== null ? `${stats.moyenneClasse.toFixed(2)}/${stats.noteMax}` : 'Aucune note'} />
            <StatCard label="Meilleure note" value={stats.meilleureNote !== null ? `${stats.meilleureNote}/${stats.noteMax}` : '-'} />
            <StatCard label="Moins bonne note" value={stats.moinsBonneNote !== null ? `${stats.moinsBonneNote}/${stats.noteMax}` : '-'} />
            <StatCard label="Notes saisies" value={`${stats.nombreNotes}/${roster.length}`} />
          </section>

          <Card title="Saisie des notes" subtitle="Modifiez la note et l'appreciation de chaque eleve, puis enregistrez ligne par ligne.">
            {roster.length === 0 ? (
              <p className="text-sm text-slate-500">Aucun eleve inscrit dans cette classe.</p>
            ) : (
              <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
                <div className="hidden grid-cols-[1.2fr_0.6fr_0.5fr_1.2fr_0.7fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
                  <span>Eleve</span>
                  <span>Note</span>
                  <span>Rang</span>
                  <span>Appreciation</span>
                  <span>Actions</span>
                </div>
                <div className="divide-y divide-slate-100 bg-white/90">
                  {roster.map((row) => {
                    const input = noteInputs[row.eleve.id] ?? { note: '', appreciation: '' }
                    return (
                      <div key={row.eleve.id} className="grid gap-3 px-4 py-4 lg:grid-cols-[1.2fr_0.6fr_0.5fr_1.2fr_0.7fr] lg:items-center">
                        <span className="text-sm font-semibold text-slate-900">{row.eleve.nom} {row.eleve.prenom}</span>
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          max={epreuve.noteMax}
                          value={input.note}
                          onChange={(event) => handleNoteChange(row.eleve.id, 'note', event.target.value)}
                          placeholder={`/${epreuve.noteMax}`}
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                        />
                        <span className="text-sm font-semibold text-slate-800">{row.evaluation?.rang ?? '-'}</span>
                        <input
                          type="text"
                          value={input.appreciation}
                          onChange={(event) => handleNoteChange(row.eleve.id, 'appreciation', event.target.value)}
                          placeholder="Appreciation"
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveRow(row)}
                          disabled={savingId === row.eleve.id}
                          className="w-fit rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                        >
                          {savingId === row.eleve.id ? 'Enregistrement...' : row.evaluation ? 'Mettre a jour' : 'Enregistrer'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  )
}

export default TeacherEpreuveDetailsPage
