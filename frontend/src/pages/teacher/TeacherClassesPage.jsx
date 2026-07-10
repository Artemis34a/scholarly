import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { classesService } from '../../services/classesService'
import { coursService } from '../../services/coursService'
import { estTitulaireDeClasse, getMesAffectations, getMesClasses, getMesCours } from './teacher.utils'

function TeacherClassesPage() {
  const { user } = useAuth()
  const [classes, setClasses] = useState([])
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findAll({ limit: 100 }),
      coursService.findAll(),
    ])
      .then(([classesResult, coursData]) => {
        if (isMounted) {
          setClasses(classesResult.data)
          setCoursList(coursData)
        }
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
  }, [])

  const mesCours = useMemo(() => getMesCours(coursList, user.id), [coursList, user.id])
  const mesAffectations = useMemo(() => getMesAffectations(coursList, user.id), [coursList, user.id])
  const mesClasses = useMemo(() => getMesClasses(classes, mesCours, user.id), [classes, mesCours, user.id])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mes classes</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Les classes dont vous etes titulaire ou dans lesquelles vous enseignez.
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
          <div className="py-12 text-center text-slate-400">Chargement de mes classes...</div>
        </Card>
      ) : mesClasses.length === 0 ? (
        <Card>
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune classe ne vous est encore affectee</p>
          </div>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {mesClasses.map((classe) => {
            const mesCoursIci = mesAffectations
              .filter((affectation) => affectation.idClasse === classe.id)
              .map((affectation) => affectation.cours)
            const effectif = classe.salles?.[0]?._count?.frequentes ?? 0
            return (
              <Card key={classe.id} title={classe.libelle} subtitle={classe.cycle?.libelle}>
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    {effectif} eleve{effectif > 1 ? 's' : ''}
                    {estTitulaireDeClasse(classe, user.id) && ' · Vous etes titulaire de cette classe'}
                  </p>
                  {mesCoursIci.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {mesCoursIci.map((cours) => (
                        <span key={cours.id} className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-700 ring-1 ring-sky-100">
                          {cours.libelle}
                        </span>
                      ))}
                    </div>
                  )}
                  <Link
                    to={`/teacher/classes/${classe.id}/eleves`}
                    className="inline-flex rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-600"
                  >
                    Voir les eleves
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TeacherClassesPage
