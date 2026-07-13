import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import PaiementsSubNav from '../../components/paiements/PaiementsSubNav'
import TrancheForm from '../../components/paiements/TrancheForm'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { paiementsService } from '../../services/paiementsService'
import { buildTranchePayload, createTrancheFormValues, formatDate, formatMontant, trancheInitialValues } from './paiements.utils'

function TranchesPage() {
  const [tranches, setTranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(trancheInitialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadTranches() {
    try {
      const data = await paiementsService.tranches.findAll()
      setTranches(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTranches()
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  function handleEdit(tranche) {
    setEditingId(tranche.id)
    setValues(createTrancheFormValues(tranche))
  }

  function handleCancelEdit() {
    setEditingId(null)
    setValues(trancheInitialValues)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const payload = buildTranchePayload(values)
      if (editingId) {
        await paiementsService.tranches.update(editingId, payload)
      } else {
        await paiementsService.tranches.create(payload)
      }
      setEditingId(null)
      setValues(trancheInitialValues)
      await loadTranches()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(tranche) {
    const confirmed = window.confirm(`Supprimer la tranche "${tranche.libelle}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(tranche.id)
      await paiementsService.tranches.remove(tranche.id)
      await loadTranches()
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
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Tranches de paiement</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Echeancier des versements attendus (inscription, tranche 1, tranche 2...).
          </p>
        </div>
      </Card>

      <PaiementsSubNav />

      <Card title={editingId ? 'Modifier la tranche' : 'Ajouter une tranche'} subtitle="Ces tranches sont reutilisees lors de la saisie d'un paiement.">
        <TrancheForm
          values={values}
          submitting={submitting}
          error={error}
          isEditing={!!editingId}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={handleCancelEdit}
        />
      </Card>

      <Card title="Liste des tranches" subtitle="Modifiez ou supprimez une tranche existante.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : tranches.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune tranche</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_0.8fr_0.8fr_0.5fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Montant</span>
              <span>Echeance</span>
              <span>Ordre</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {tranches.map((tranche) => (
                <div key={tranche.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_0.8fr_0.8fr_0.5fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{tranche.libelle}</span>
                  <span>{formatMontant(tranche.montant)}</span>
                  <span>{formatDate(tranche.echeance)}</span>
                  <span>{tranche.ordre}</span>
                  <span className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(tranche)}
                      className={BUTTON_LIGHT.primary}
                    >
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(tranche)}
                      disabled={deletingId === tranche.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === tranche.id ? '...' : 'Supprimer'}
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

export default TranchesPage
