import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { BUTTON_LIGHT } from '../../components/buttonStyles'
import { getMesAffectations } from './teacher.utils'

function TeacherNotesPage() {
  const { user } = useAuth()
  const [evaluationsList, setEvaluationsList] = useState([])
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      evaluationsService.notes.findAll({ page: 1, limit: 200 }),
      coursService.findAll(),
    ])
      .then(([notesResult, coursData]) => {
        if (isMounted) {
          setEvaluationsList(notesResult.data)
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

  const mesClasseCoursIds = useMemo(
    () => new Set(getMesAffectations(coursList, user.id).map((a) => a.idClasseCours)),
    [coursList, user.id],
  )
  const mesNotes = useMemo(
    () => evaluationsList.filter((evaluation) => evaluation.epreuve?.idClasseCours && mesClasseCoursIds.has(evaluation.epreuve.idClasseCours)),
    [evaluationsList, mesClasseCoursIds],
  )

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Toutes mes notes</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Vue consolidee de toutes les notes saisies pour vos cours.
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Notes saisies" subtitle="Pour modifier une note, ouvrez l'epreuve correspondante.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : mesNotes.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune note saisie</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1.2fr_1.1fr_0.9fr_0.6fr_0.6fr_1fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Eleve</span>
              <span>Epreuve</span>
              <span>Cours</span>
              <span>Note</span>
              <span>Rang</span>
              <span>Actions</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {mesNotes.map((evaluation) => (
                <div key={evaluation.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.2fr_1.1fr_0.9fr_0.6fr_0.6fr_1fr] lg:items-center">
                  <span className="font-semibold text-slate-900">{evaluation.eleve?.nom} {evaluation.eleve?.prenom}</span>
                  <span>{evaluation.epreuve?.libelle}</span>
                  <span>{evaluation.epreuve?.classeCours?.cours?.libelle}</span>
                  <span>{evaluation.note !== null && evaluation.note !== undefined ? `${evaluation.note}/${evaluation.epreuve?.noteMax}` : 'Non note'}</span>
                  <span className="font-semibold text-slate-800">{evaluation.rang ?? '-'}</span>
                  <Link
                    to={`/teacher/evaluations/${evaluation.epreuve?.id}`}
                    className={`w-fit ${BUTTON_LIGHT.primary}`}
                  >
                    Modifier
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

export default TeacherNotesPage
