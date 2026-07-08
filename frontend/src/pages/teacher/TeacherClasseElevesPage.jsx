import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { classesService } from '../../services/classesService'

function TeacherClasseElevesPage() {
  const { id } = useParams()
  const [classe, setClasse] = useState(null)
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findOne(id),
      classesService.findEleves(id),
    ])
      .then(([classeData, elevesData]) => {
        if (isMounted) {
          setClasse(classeData)
          setEleves(elevesData)
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
  }, [id])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">
            {loading || !classe ? 'Eleves de la classe' : `Eleves de ${classe.libelle}`}
          </h2>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Liste des eleves" subtitle="Vue en lecture seule.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement...</div>
        ) : eleves.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucun eleve inscrit</p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
            <div className="hidden grid-cols-[1.4fr_0.8fr_0.6fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
              <span>Eleve</span>
              <span>Commentaire</span>
              <span>Statut</span>
            </div>
            <div className="divide-y divide-slate-100 bg-white/90">
              {eleves.map((frequente) => (
                <div key={frequente.id} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.4fr_0.8fr_0.6fr]">
                  <span className="font-semibold text-slate-900">{frequente.eleve.nom} {frequente.eleve.prenom}</span>
                  <span>{frequente.commentaire || '-'}</span>
                  <span><ActifBadge actif={frequente.eleve.actif} /></span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}

export default TeacherClasseElevesPage
