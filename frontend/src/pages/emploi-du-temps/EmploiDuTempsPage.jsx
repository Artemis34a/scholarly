import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import WeeklyGrid from '../../components/emploi-du-temps/WeeklyGrid'
import { emploiDuTempsService } from '../../services/emploiDuTempsService'
import { classesService } from '../../services/classesService'
import { enseignantsService } from '../../services/enseignantsService'
import { elevesService } from '../../services/elevesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'

const vues = [
  { value: 'classe', label: 'Par classe' },
  { value: 'enseignant', label: 'Par enseignant' },
  { value: 'eleve', label: 'Par eleve' },
]

function EmploiDuTempsPage() {
  const navigate = useNavigate()
  const [vue, setVue] = useState('classe')
  const [classes, setClasses] = useState([])
  const [enseignants, setEnseignants] = useState([])
  const [eleves, setEleves] = useState([])
  const [selectedId, setSelectedId] = useState('')
  const [slots, setSlots] = useState([])
  const [loadingOptions, setLoadingOptions] = useState(true)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState(null)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findAll({ limit: 100 }),
      enseignantsService.findActifs(),
      elevesService.findAll({ limit: 100 }),
    ])
      .then(([classesResult, enseignantsData, elevesResult]) => {
        if (isMounted) {
          setClasses(classesResult.data)
          setEnseignants(enseignantsData)
          setEleves(elevesResult.data)
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoadingOptions(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setSelectedId('')
    setSlots([])
  }, [vue])

  async function loadSlots(id) {
    if (!id) return
    setLoadingSlots(true)
    setError('')
    try {
      let data
      if (vue === 'classe') data = await emploiDuTempsService.getGrilleClasse(id)
      else if (vue === 'enseignant') data = await emploiDuTempsService.getGrilleEnseignant(id)
      else data = await emploiDuTempsService.getGrilleEleve(id)
      setSlots(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingSlots(false)
    }
  }

  useEffect(() => {
    if (selectedId) loadSlots(selectedId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const options = useMemo(() => {
    if (vue === 'classe') return classes.map((c) => ({ value: `${c.id}`, label: c.libelle }))
    if (vue === 'enseignant') return enseignants.map((e) => ({ value: `${e.idPers}`, label: `${e.personne?.nom} ${e.personne?.prenom}` }))
    return eleves.map((e) => ({ value: `${e.id}`, label: `${e.nom} ${e.prenom}` }))
  }, [vue, classes, enseignants, eleves])

  async function handleDelete(slot) {
    const confirmed = window.confirm(`Supprimer le creneau de ${slot.cours?.libelle} le ${slot.jour} ?`)
    if (!confirmed) return

    try {
      setDeletingId(slot.id)
      await emploiDuTempsService.remove(slot.id)
      await loadSlots(selectedId)
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Plannings</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des emplois du temps</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Consultez le planning par classe, par enseignant ou par eleve.
              </p>
            </div>
            <Link
              to="/dashboard/emplois-du-temps/nouveau"
              className={BUTTON_ON_DARK.primary}
            >
              Nouveau creneau
            </Link>
          </div>
        </div>
      </Card>

      <Card title="Choisir une vue" subtitle="Selectionnez un type de planning puis une entite pour afficher la grille.">
        <div className="grid gap-4 md:grid-cols-[1fr_2fr]">
          <div className="grid grid-cols-3 gap-2">
            {vues.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setVue(item.value)}
                className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                  vue === item.value ? 'border-sky-500 bg-sky-50 text-sky-700' : 'border-slate-200 bg-slate-50 text-slate-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {loadingOptions ? (
            <div className="py-3 text-center text-slate-400">Chargement...</div>
          ) : (
            <select
              value={selectedId}
              onChange={(event) => setSelectedId(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
            >
              <option value="">Choisir...</option>
              {options.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          )}
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {selectedId && (
        <Card title="Grille hebdomadaire" subtitle="Cliquez sur un creneau pour le modifier ou le supprimer.">
          {loadingSlots ? (
            <div className="py-12 text-center text-slate-400">Chargement de la grille...</div>
          ) : (
            <WeeklyGrid
              slots={slots}
              onEdit={(slot) => navigate(`/dashboard/emplois-du-temps/${slot.id}/modifier`)}
              onDelete={handleDelete}
            />
          )}
        </Card>
      )}
    </div>
  )
}

export default EmploiDuTempsPage
