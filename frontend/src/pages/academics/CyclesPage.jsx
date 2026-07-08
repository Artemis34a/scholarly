import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { cyclesService } from '../../services/cyclesService'

const initialValues = { libelle: '', description: '' }

function CyclesPage() {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(initialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadCycles() {
    try {
      const data = await cyclesService.findAll()
      setCycles(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadCycles()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleEdit(cycle) {
    setEditingId(cycle.id)
    setValues({ libelle: cycle.libelle, description: cycle.description ?? '' })
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
      const payload = { libelle: values.libelle.trim(), description: values.description.trim() }
      if (editingId) {
        await cyclesService.update(editingId, payload)
      } else {
        await cyclesService.create(payload)
      }
      setEditingId(null)
      setValues(initialValues)
      await loadCycles()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(cycle) {
    const confirmed = window.confirm(`Supprimer le cycle "${cycle.libelle}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(cycle.id)
      await cyclesService.remove(cycle.id)
      await loadCycles()
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
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Gestion des cycles</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Structurez les niveaux pedagogiques (maternelle, primaire...) utilises par les classes.
          </p>
        </div>
      </Card>

      <Card title={editingId ? 'Modifier le cycle' : 'Ajouter un cycle'} subtitle="Ces cycles sont utilises lors de la creation d'une classe.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Libelle</span>
            <input
              type="text"
              name="libelle"
              value={values.libelle}
              onChange={handleChange}
              required
              placeholder="Ex: Cycle 1"
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
              required
              placeholder="Ex: Premier cycle primaire"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            />
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-2">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              {submitting ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter le cycle'}
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

      <Card title="Liste des cycles" subtitle="Modifiez ou supprimez un cycle existant.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : cycles.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun cycle</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_1.5fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_1.5fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{cycle.libelle}</span>
                  <span>{cycle.description}</span>
                  <span className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleEdit(cycle)} className={BUTTON_LIGHT.primary}>
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cycle)}
                      disabled={deletingId === cycle.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === cycle.id ? '...' : 'Supprimer'}
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

export default CyclesPage
