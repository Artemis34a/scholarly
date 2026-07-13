import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { BUTTON_LIGHT, BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate } from '../evaluations/evaluations.utils'
import { getMesAffectations } from './teacher.utils'

function TeacherEvaluationsPage() {
  const { user } = useAuth()
  const [epreuvesList, setEpreuvesList] = useState([])
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      evaluationsService.epreuves.findAll(),
      coursService.findAll(),
    ])
      .then(([epreuvesData, coursData]) => {
        if (isMounted) {
          setEpreuvesList(epreuvesData)
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

  const mesAffectations = useMemo(() => getMesAffectations(coursList, user.id), [coursList, user.id])
  const mesClasseCoursIds = useMemo(
    () => new Set(mesAffectations.map((affectation) => affectation.idClasseCours)),
    [mesAffectations],
  )
  const mesEpreuves = useMemo(
    () => epreuvesList.filter((epreuve) => epreuve.idClasseCours && mesClasseCoursIds.has(epreuve.idClasseCours)),
    [epreuvesList, mesClasseCoursIds],
  )

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Mes evaluations</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Creez une epreuve et saisissez les notes de vos eleves.
              </p>
            </div>
            <Link
              to="/teacher/evaluations/nouvelle"
              className={BUTTON_ON_DARK.primary}
            >
              Creer une epreuve
            </Link>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Mes epreuves" subtitle="Cliquez sur une epreuve pour saisir ou modifier les notes.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : mesEpreuves.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune epreuve pour le moment</p>
            <p className="mt-2 text-sm text-slate-500">Creez votre premiere epreuve avec le bouton ci-dessus.</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1.3fr_1fr_0.9fr_0.9fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Epreuve</span>
              <span>Classe</span>
              <span>Cours</span>
              <span>Date</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {mesEpreuves.map((epreuve) => (
                <div key={epreuve.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.3fr_1fr_0.9fr_0.9fr_0.8fr] lg:items-center">
                  <span className="font-semibold text-slate-900">{epreuve.libelle}</span>
                  <span>{epreuve.classe?.libelle}</span>
                  <span>{epreuve.classeCours?.cours?.libelle}</span>
                  <span>{formatDate(epreuve.dateEpreuve)}</span>
                  <Link
                    to={`/teacher/evaluations/${epreuve.id}`}
                    className={`w-fit ${BUTTON_LIGHT.primary}`}
                  >
                    Saisir les notes
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TeacherEvaluationsPage
