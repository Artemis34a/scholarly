import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import EvaluationsSubNav from '../../components/evaluations/EvaluationsSubNav'
import EvaluationFilters from '../../components/evaluations/EvaluationFilters'
import EvaluationTable from '../../components/evaluations/EvaluationTable'
import { evaluationsService } from '../../services/evaluationsService'
import { classesService } from '../../services/classesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'

const PAGE_SIZE = 10

const defaultFilters = {
  idClasse: 'all',
  localSearch: '',
}

function StatCard({ label, value, detail }) {
  return (
    <div className="rounded-[26px] border border-white/70 bg-white/85 p-5 shadow-[0_22px_70px_-42px_rgba(15,23,42,0.28)] ring-1 ring-slate-100/80 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <p className="mt-4 text-3xl font-semibold text-slate-900">{value}</p>
      <p className="mt-2 text-sm text-slate-500">{detail}</p>
    </div>
  )
}

function NotesPage() {
  const [evaluationsList, setEvaluationsList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    let isMounted = true

    classesService.findAll({ limit: 100 }).then((result) => {
      if (isMounted) setClasses(result.data)
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, filters.idClasse])

  async function loadEvaluations() {
    setLoading(true)
    try {
      const result = await evaluationsService.notes.findAll({
        search: deferredSearch.trim() || undefined,
        classe: filters.idClasse !== 'all' ? filters.idClasse : undefined,
        page,
        limit: PAGE_SIZE,
      })
      setEvaluationsList(result.data)
      setPageInfo({ page: result.page, totalPages: result.totalPages, total: result.total })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let isMounted = true
    const timeoutId = setTimeout(async () => {
      if (!isMounted) return
      await loadEvaluations()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, filters.idClasse, page])

  const stats = useMemo(() => {
    const notes = evaluationsList.map((e) => e.note).filter((n) => n !== null && n !== undefined)
    const moyenne = notes.length ? notes.reduce((sum, n) => sum + n, 0) / notes.length : null
    return {
      total: pageInfo.total,
      notees: notes.length,
      moyenne: moyenne !== null ? moyenne.toFixed(2) : '-',
    }
  }, [evaluationsList, pageInfo.total])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(evaluation) {
    const confirmed = window.confirm(
      `Supprimer la note de ${evaluation.eleve?.nom} ${evaluation.eleve?.prenom} pour "${evaluation.epreuve?.libelle}" ?`,
    )
    if (!confirmed) return

    try {
      setDeletingId(evaluation.id)
      await evaluationsService.notes.remove(evaluation.id)

      const isLastItemOnPage = evaluationsList.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        await loadEvaluations()
      }
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Notes</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Toutes les notes</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Recherchez et filtrez toutes les evaluations saisies, tous cours et classes confondus.
              </p>
            </div>
            <Link
              to="/dashboard/evaluations/notes/nouvelle"
              className={BUTTON_ON_DARK.primary}
            >
              Nouvelle note
            </Link>
          </div>
        </div>
      </Card>

      <EvaluationsSubNav />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Notes au total" value={stats.total} detail="Toutes pages confondues" />
        <StatCard label="Notes saisies sur cette page" value={stats.notees} detail={`Sur ${evaluationsList.length} lignes`} />
        <StatCard label="Moyenne (page courante)" value={stats.moyenne} detail="Calcul local a la page affichee" />
      </section>

      <Card title="Recherche et filtres" subtitle="Recherchez par eleve ou epreuve, filtrez par classe.">
        <EvaluationFilters
          filters={filters}
          classes={classes}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card title="Liste des notes" subtitle="Consultation, edition et suppression des evaluations.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des notes...</div>
        ) : (
          <>
            <EvaluationTable
              evaluationsList={evaluationsList}
              deletingId={deletingId}
              onDelete={handleDelete}
            />
            <Pagination
              page={pageInfo.page}
              totalPages={pageInfo.totalPages}
              total={pageInfo.total}
              onPageChange={setPage}
            />
          </>
        )}
      </Card>
    </div>
  )
}

export default NotesPage
