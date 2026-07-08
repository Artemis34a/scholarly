import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import PaiementsSubNav from '../../components/paiements/PaiementsSubNav'
import ModeForm from '../../components/paiements/ModeForm'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { paiementsService } from '../../services/paiementsService'
import { buildModePayload, createModeFormValues, modeInitialValues } from './paiements.utils'

function ModesPage() {
  const [modes, setModes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(modeInitialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadModes() {
    try {
      const data = await paiementsService.modes.findAll()
      setModes(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadModes()
  }, [])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  function handleEdit(mode) {
    setEditingId(mode.id)
    setValues(createModeFormValues(mode))
  }

  function handleCancelEdit() {
    setEditingId(null)
    setValues(modeInitialValues)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = buildModePayload(values)
      if (editingId) {
        await paiementsService.modes.update(editingId, payload)
      } else {
        await paiementsService.modes.create(payload)
      }
      setEditingId(null)
      setValues(modeInitialValues)
      await loadModes()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(mode) {
    const confirmed = window.confirm(`Supprimer le mode de paiement "${mode.libelle}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(mode.id)
      await paiementsService.modes.remove(mode.id)
      await loadModes()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Finance</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Modes de paiement</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Especes, cheque, virement... les moyens de paiement acceptes par l'ecole.
          </p>
        </div>
      </Card>

      <PaiementsSubNav />

      <Card title={editingId ? 'Modifier le mode' : 'Ajouter un mode'} subtitle="Ces modes sont reutilises lors de la saisie d'un paiement.">
        <ModeForm
          values={values}
          submitting={submitting}
          error={error}
          isEditing={!!editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </Card>

      <Card title="Liste des modes" subtitle="Modifiez ou supprimez un mode existant.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : modes.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun mode de paiement</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_1.4fr_0.6fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Description</span>
              <span>Statut</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {modes.map((mode) => (
                <div key={mode.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_1.4fr_0.6fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{mode.libelle}</span>
                  <span>{mode.description || '-'}</span>
                  <span><ActifBadge actif={mode.actif} /></span>
                  <span className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(mode)}
                      className={BUTTON_LIGHT.primary}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(mode)}
                      disabled={deletingId === mode.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === mode.id ? '...' : 'Supprimer'}
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

export default ModesPage
