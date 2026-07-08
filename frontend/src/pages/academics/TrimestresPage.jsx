import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { trimestresService } from '../../services/trimestresService'
import { anneesService } from '../../services/anneesService'

const initialValues = { libelle: '', periode: '', idAca: '' }

function getAnneeLabel(annees, idAca) {
  const annee = annees.find((item) => item.id === idAca)
  return annee?.libelle ?? `Annee #${idAca}`
}

function TrimestresPage() {
  const [trimestres, setTrimestres] = useState([])
  const [annees, setAnnees] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [values, setValues] = useState(initialValues)
  const [editingId, setEditingId] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState(null)

  async function loadAll() {
    try {
      const [trimestresData, anneesData] = await Promise.all([
        trimestresService.findAll(),
        anneesService.findAll(),
      ])
      setTrimestres(trimestresData)
      setAnnees(anneesData)
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

  function handleEdit(trimestre) {
    setEditingId(trimestre.id)
    setValues({
      libelle: trimestre.libelle,
      periode: trimestre.periode,
      idAca: `${trimestre.idAca}`,
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
        periode: values.periode.trim(),
        idAca: Number(values.idAca),
      }
      if (editingId) {
        await trimestresService.update(editingId, payload)
      } else {
        await trimestresService.create(payload)
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

  async function handleDelete(trimestre) {
    const confirmed = window.confirm(`Supprimer le trimestre "${trimestre.libelle}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(trimestre.id)
      await trimestresService.remove(trimestre.id)
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
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Gestion des trimestres</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Decoupez chaque annee academique en trimestres.
          </p>
        </div>
      </Card>

      <Card title={editingId ? 'Modifier le trimestre' : 'Ajouter un trimestre'} subtitle="Rattachez chaque trimestre a une annee academique.">
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
              placeholder="Ex: Trimestre 1"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Periode</span>
            <input
              type="text"
              name="periode"
              value={values.periode}
              onChange={handleChange}
              required
              placeholder="Ex: Septembre - Decembre"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Annee academique</span>
            <select
              name="idAca"
              value={values.idAca}
              onChange={handleChange}
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
            >
              <option value="">Choisir une annee</option>
              {annees.map((annee) => (
                <option key={annee.id} value={annee.id}>{annee.libelle}</option>
              ))}
            </select>
          </label>
          <div className="flex flex-wrap gap-3 md:col-span-3">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
            >
              {submitting ? 'Enregistrement...' : editingId ? 'Enregistrer' : 'Ajouter le trimestre'}
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

      <Card title="Liste des trimestres" subtitle="Modifiez ou supprimez un trimestre existant.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : trimestres.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun trimestre</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1fr_1.3fr_1fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Libelle</span>
              <span>Periode</span>
              <span>Annee</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {trimestres.map((trimestre) => (
                <div key={trimestre.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1fr_1.3fr_1fr_0.8fr]">
                  <span className="font-semibold text-slate-900">{trimestre.libelle}</span>
                  <span>{trimestre.periode}</span>
                  <span>{getAnneeLabel(annees, trimestre.idAca)}</span>
                  <span className="flex flex-wrap gap-2">
                    <button type="button" onClick={() => handleEdit(trimestre)} className={BUTTON_LIGHT.primary}>
                      Modifier
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(trimestre)}
                      disabled={deletingId === trimestre.id}
                      className="rounded-full border border-rose-200 px-3 py-1.5 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:opacity-60"
                    >
                      {deletingId === trimestre.id ? '...' : 'Supprimer'}
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

export default TrimestresPage
