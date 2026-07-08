import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import DisciplineSubNav from '../../components/disciplines/DisciplineSubNav'
import DisciplineForm from '../../components/disciplines/DisciplineForm'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { disciplinesService } from '../../services/disciplinesService'
import { buildDisciplinePayload, createDisciplineFormValues, disciplineInitialValues, getGraviteLabel } from './disciplines.utils'

function TypesPage() {
  const [disciplinesList, setDisciplinesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(disciplineInitialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadDisciplines() {
    try {
      const data = await disciplinesService.types.findAll()
      setDisciplinesList(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDisciplines()
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleEdit(discipline) {
    setEditingId(discipline.id)
    setValues(createDisciplineFormValues(discipline))
  }

  function handleCancelEdit() {
    setEditingId(null)
    setValues(disciplineInitialValues)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = buildDisciplinePayload(values)
      if (editingId) {
        await disciplinesService.types.update(editingId, payload)
      } else {
        await disciplinesService.types.create(payload)
      }
      setEditingId(null)
      setValues(disciplineInitialValues)
      await loadDisciplines()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(discipline) {
    const confirmed = window.confirm(`Supprimer le type "${discipline.libelle}" et tous ses rapports associes ?`)
    if (!confirmed) return

    try {
      setDeletingId(discipline.id)
      await disciplinesService.types.remove(discipline.id)
      await loadDisciplines()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Discipline</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Types de discipline</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Definissez les categories de fautes et de comportements positifs utilisees pour creer des rapports.
          </p>
        </div>
      </Card>

      <DisciplineSubNav />

      <Card title={editingId ? 'Modifier le type' : 'Ajouter un type'} subtitle="Ces types sont reutilises lors de la creation d'un rapport.">
        <DisciplineForm
          values={values}
          submitting={submitting}
          error={error}
          isEditing={!!editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </Card>

      <Card title="Liste des types" subtitle="Modifiez ou supprimez un type existant.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : disciplinesList.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun type de discipline</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_0.8fr_0.8fr_0.7fr_0.6fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Nature</span>
              <span>Gravite</span>
              <span>Rapports</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {disciplinesList.map((discipline) => (
                <div key={discipline.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_0.8fr_0.8fr_0.7fr_0.6fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{discipline.libelle}</span>
                  <span>{discipline.estFaute ? 'Faute' : 'Comportement positif'}</span>
                  <span>{getGraviteLabel(discipline.gravite)}</span>
                  <span>{discipline._count?.rapports ?? 0}</span>
                  <span><ActifBadge actif={discipline.actif} /></span>
                  <span className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(discipline)}
                      className={BUTTON_LIGHT.primary}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(discipline)}
                      disabled={deletingId === discipline.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === discipline.id ? '...' : 'Supprimer'}
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

export default TypesPage
