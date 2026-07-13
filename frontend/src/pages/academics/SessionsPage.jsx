import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { sessionsService } from '../../services/sessionsService'
import { trimestresService } from '../../services/trimestresService'

const initialValues = { libelle: '', description: '', idTrimestre: '' }

function getTrimestreLabel(trimestres, idTrimestre) {
  const trimestre = trimestres.find((item) => item.id === idTrimestre)
  return trimestre?.libelle ?? `Trimestre #${idTrimestre}`
}

function SessionsPage() {
  const [sessions, setSessions] = useState([])
  const [trimestres, setTrimestres] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(initialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadAll() {
    try {
      const [sessionsData, trimestresData] = await Promise.all([
        sessionsService.findAll(),
        trimestresService.findAll(),
      ])
      setSessions(sessionsData)
      setTrimestres(trimestresData)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleEdit(session) {
    setEditingId(session.id)
    setValues({
      libelle: session.libelle,
      description: session.description ?? '',
      idTrimestre: `${session.idTrimestre}`,
    })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setValues(initialValues)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = {
        libelle: values.libelle.trim(),
        description: values.description.trim() || undefined,
        idTrimestre: Number(values.idTrimestre),
      }
      if (editingId) {
        await sessionsService.update(editingId, payload)
      } else {
        await sessionsService.create(payload)
      }
      setEditingId(null)
      setValues(initialValues)
      await loadAll()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(session) {
    const confirmed = window.confirm(`Supprimer la session "${session.libelle}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(session.id)
      await sessionsService.remove(session.id)
      await loadAll()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Calendrier</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Gestion des sessions</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Organisez les sessions pedagogiques rattachees a chaque trimestre.
          </p>
        </div>
      </Card>

      <Card title={editingId ? 'Modifier la session' : 'Ajouter une session'} subtitle="Rattachez chaque session a un trimestre.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-3">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Libelle</span>
            <input
              type="text"
              name="libelle"
              value={values.libelle}
              onChange={handleChange}
              required
              placeholder="Ex: Session de rentree"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Description</span>
            <input
              type="text"
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Ex: Debut de l'annee scolaire"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Trimestre</span>
            <select
              name="idTrimestre"
              value={values.idTrimestre}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            >
              <option value="">Choisir un trimestre</option>
              {trimestres.map((trimestre) => (
                <option key={trimestre.id} value={trimestre.id}>{trimestre.libelle}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              {submitting ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter la session'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </Card>

      <Card title="Liste des sessions" subtitle="Modifiez ou supprimez une session existante.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : sessions.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune session</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_1.3fr_1fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Trimestre</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {sessions.map((session) => (
                <div key={session.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_1.3fr_1fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{session.libelle}</span>
                  <span>{session.description}</span>
                  <span>{getTrimestreLabel(trimestres, session.idTrimestre)}</span>
                  <span className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleEdit(session)} className={BUTTON_LIGHT.primary}>
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(session)}
                      disabled={deletingId === session.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === session.id ? '...' : 'Supprimer'}
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

export default SessionsPage
