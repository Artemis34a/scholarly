import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'

const PAGE_SIZE = 10

function StudentNotesPage() {
  const { user } = useAuth()
  const [evaluationsList, setEvaluationsList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    setLoading(true)

    evaluationsService.notes.findAll({ eleveId: user.id, page, limit: PAGE_SIZE })
      .then((result) => {
        if (isMounted) {
          setEvaluationsList(result.data)
          setPageInfo({ page: result.page, totalPages: result.totalPages, total: result.total })
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
  }, [user.id, page])

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Resultats</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mes notes</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Toutes vos notes, avec le classement calcule automatiquement pour chaque epreuve.
          </p>
        </div>
      </Card>

      <Card title="Liste de mes notes" subtitle="Triees de la plus recente a la plus ancienne.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement de mes notes...</div>
        ) : evaluationsList.length === 0 ? (
          <div className="rounded-[26px] border border-dashed border-slate-200 bg-slate-50/80 px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-900">Aucune note pour le moment</p>
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-[28px] border border-slate-200/80 bg-white/92">
              <div className="hidden grid-cols-[1.4fr_1fr_0.6fr_0.6fr_1.2fr] gap-3 bg-slate-900 px-5 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-200 lg:grid">
                <span>Epreuve</span>
                <span>Cours</span>
                <span>Note</span>
                <span>Rang</span>
                <span>Appreciation</span>
              </div>
              <div className="divide-y divide-slate-100">
                {evaluationsList.map((evaluation) => (
                  <article key={evaluation.id} className="grid gap-4 px-5 py-5 lg:grid-cols-[1.4fr_1fr_0.6fr_0.6fr_1.2fr] lg:items-center">
                    <span className="text-sm font-semibold text-slate-900">{evaluation.epreuve?.libelle}</span>
                    <span className="text-sm text-slate-600">{evaluation.epreuve?.cours?.libelle ?? '-'}</span>
                    <span className="text-sm text-slate-600">
                      {evaluation.note !== null && evaluation.note !== undefined ? `${evaluation.note}/${evaluation.epreuve?.noteMax}` : 'Non note'}
                    </span>
                    <span className="text-sm font-semibold text-slate-800">{evaluation.rang ?? '-'}</span>
                    <span className="text-sm text-slate-600">{evaluation.appreciation || '-'}</span>
                  </article>
                ))}
              </div>
            </div>
            <Pagination page={pageInfo.page} totalPages={pageInfo.totalPages} total={pageInfo.total} onPageChange={setPage} />
          </>
        )}
      </Card>
    </div>
  )
}

export default StudentNotesPage
