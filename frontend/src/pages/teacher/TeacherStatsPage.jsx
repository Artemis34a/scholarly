import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { getMesCours } from './teacher.utils'

function TeacherStatsPage() {
  const { user } = useAuth()
  const [coursList, setCoursList] = useState([])
  const [statsParCours, setStatsParCours] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      coursService.findAll(),
      evaluationsService.epreuves.findAll(),
    ])
      .then(async ([coursData, epreuvesData]) => {
        if (!isMounted) return
        setCoursList(coursData)

        const mesCours = getMesCours(coursData, user.id)
        const result = {}

        for (const cours of mesCours) {
          const epreuvesDuCours = epreuvesData.filter((epreuve) => epreuve.idCours === cours.id)
          const statsListe = await Promise.all(
            epreuvesDuCours.map((epreuve) => evaluationsService.epreuves.getStats(epreuve.id)),
          )

          const totalNotes = statsListe.reduce((sum, s) => sum + s.nombreNotes, 0)
          const totalPondere = statsListe.reduce((sum, s) => sum + (s.moyenneClasse ?? 0) * s.nombreNotes, 0)
          const meilleures = statsListe.map((s) => s.meilleureNote).filter((n) => n !== null)
          const moinsBonnes = statsListe.map((s) => s.moinsBonneNote).filter((n) => n !== null)

          result[cours.id] = {
            nombreEpreuves: epreuvesDuCours.length,
            moyenneGenerale: totalNotes > 0 ? totalPondere / totalNotes : null,
            meilleureNote: meilleures.length ? Math.max(...meilleures) : null,
            moinsBonneNote: moinsBonnes.length ? Math.min(...moinsBonnes) : null,
          }
        }

        if (isMounted) setStatsParCours(result)
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

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Espace enseignant</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mes statistiques</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Moyenne generale ponderee par cours, calculee automatiquement a partir de vos epreuves.
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
          <div className="py-12 text-center text-slate-400">Calcul des statistiques...</div>
        </Card>
      ) : mesCours.length === 0 ? (
        <Card>
          <p className="text-sm text-slate-500">Aucun cours affecte pour le moment.</p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {mesCours.map((cours) => {
            const stat = statsParCours[cours.id]
            return (
              <Card key={cours.id} title={cours.libelle} subtitle={`${stat?.nombreEpreuves ?? 0} epreuve(s)`}>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Moyenne</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">
                      {stat?.moyenneGenerale !== null && stat?.moyenneGenerale !== undefined ? `${stat.moyenneGenerale.toFixed(2)}/20` : 'Aucune note'}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Meilleure</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{stat?.meilleureNote ?? '-'}</p>
                  </div>
                  <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Moins bonne</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{stat?.moinsBonneNote ?? '-'}</p>
                  </div>
                </div>
                <Link
                  to="/teacher/evaluations"
                  className="mt-4 inline-flex rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
                >
                  Voir les epreuves
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default TeacherStatsPage
