import { useEffect, useMemo, useState } from 'react'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { useAuth } from '../../context/AuthContext'
import { classesService } from '../../services/classesService'
import { coursService } from '../../services/coursService'
import { getMesClasses, getMesCours } from './teacher.utils'

function TeacherElevesPage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [coursList, setCoursList] = useState([])
  const [elevesParClasse, setElevesParClasse] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findAll({ limit: 100 }),
      coursService.findAll(),
    ])
      .then(async ([classesResult, coursData]) => {
        if (!isMounted) return
        setClasses(classesResult.data)
        setCoursList(coursData)

        const mesCours = getMesCours(coursData, user.id)
        const mesClasses = getMesClasses(classesResult.data, mesCours, user.id)

        const entries = await Promise.all(
          mesClasses.map(async (classe) => [classe.id, await classesService.findEleves(classe.id)]),
        )

        if (isMounted) setElevesParClasse(Object.fromEntries(entries))
      })
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
  }, [user.id])

  const mesCours = useMemo(() => getMesCours(coursList, user.id), [coursList, user.id])
  const mesClasses = useMemo(() => getMesClasses(classes, mesCours, user.id), [classes, mesCours, user.id])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mes eleves</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Tous les eleves de vos classes, regroupes par classe.
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading ? (
        <Card>
          <div className="py-12 text-center text-slate-400">Chargement de mes eleves...</div>
        </Card>
      ) : mesClasses.length === 0 ? (
        <Card>
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun eleve pour le moment</p>
          </div>
        </Card>
      ) : (
        mesClasses.map((classe) => {
          const eleves = elevesParClasse[classe.id] ?? []
          return (
            <Card key={classe.id} title={classe.libelle} subtitle={`${eleves.length} eleve${eleves.length > 1 ? 's' : ''}`}>
              {eleves.length === 0 ? (
                <p className="text-sm text-slate-500">Aucun eleve inscrit dans cette classe.</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {eleves.map((frequente) => (
                    <div key={frequente.id} className="flex items-center justify-between py-3 text-sm">
                      <span className="font-semibold text-slate-900">{frequente.eleve.nom} {frequente.eleve.prenom}</span>
                      <ActifBadge actif={frequente.eleve.actif} />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )
        })
      )}
    </div>
  )
}

export default TeacherElevesPage
