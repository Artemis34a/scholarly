import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { cyclesService } from '../../services/cyclesService'

function CyclesPage() {
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState({ description: '' })
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)

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
    const { value } = event.target
    setValues({ description: value })
  }

  function handleEdit(cycle) {
    setEditingId(cycle.id)
    setValues({ description: cycle.description ?? '' })
  }

  function handleCancelEdit() {
    setEditingId(null)
    setValues({ description: '' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await cyclesService.update(editingId, { description: values.description.trim() })
      setEditingId(null)
      setValues({ description: '' })
      await loadCycles()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Calendrier</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Gestion des cycles</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            L'etablissement est structure en deux cycles fixes : Cycle maternel et Cycle primaire.
            Chaque classe appartient obligatoirement a l'un des deux ; la liste ci-dessous n'est pas modifiable.
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Les deux cycles de l'etablissement" subtitle="Utilises par toutes les classes ; seule la description peut etre ajustee.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_1.8fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Cycle</span>
              <span>Description</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {cycles.map((cycle) => (
                <div key={cycle.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_1.8fr_0.8fr] lg:items-center">
                  <span className="font-semibold text-slate-900">{cycle.libelle}</span>
                  {editingId === cycle.id ? (
                    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
                      <input
                        type="text"
                        value={values.description}
                        onChange={handleChange}
                        required
                        className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-400"
                      />
                      <button
                        type="submit"
                        disabled={submitting}
                        className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
                      >
                        {submitting ? '...' : 'Enregistrer'}
                      </button>
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                      >
                        Annuler
                      </button>
                    </form>
                  ) : (
                    <span>{cycle.description}</span>
                  )}
                  <span>
                    {editingId !== cycle.id && (
                      <button
                        type="button"
                        onClick={() => handleEdit(cycle)}
                        className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                      >
                        Modifier la description
                      </button>
                    )}
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
