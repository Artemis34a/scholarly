import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import DisciplineSubNav from '../../components/disciplines/DisciplineSubNav'
import RapportFilters from '../../components/disciplines/RapportFilters'
import RapportTable from '../../components/disciplines/RapportTable'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { disciplinesService } from '../../services/disciplinesService'

const PAGE_SIZE = 10

const defaultFilters = {
  idDiscipline: 'all',
  statut: 'all',
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

function RapportsPage() {
  const [rapportsList, setRapportsList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [disciplinesList, setDisciplinesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    let isMounted = true

    disciplinesService.types.findAll().then((data) => {
      if (isMounted) setDisciplinesList(data)
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, filters.idDiscipline, filters.statut])

  async function loadRapports() {
    setLoading(true)
    try {
      const result = await disciplinesService.rapports.findAll({
        search: deferredSearch.trim() || undefined,
        disciplineId: filters.idDiscipline !== 'all' ? filters.idDiscipline : undefined,
        statut: filters.statut !== 'all' ? filters.statut : undefined,
        page,
        limit: PAGE_SIZE,
      })
      setRapportsList(result.data)
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
      await loadRapports()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, filters.idDiscipline, filters.statut, page])

  const stats = useMemo(() => {
    const ouverts = rapportsList.filter((r) => r.statut === 'OUVERT').length
    const resolus = rapportsList.filter((r) => r.statut === 'RESOLU' || r.statut === 'FERME').length
    return { total: pageInfo.total, ouverts, resolus }
  }, [rapportsList, pageInfo.total])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(rapport) {
    const confirmed = window.confirm(
      `Supprimer le rapport concernant ${rapport.eleve?.nom} ${rapport.eleve?.prenom} ?`,
    )
    if (!confirmed) return

    try {
      setDeletingId(rapport.id)
      await disciplinesService.rapports.remove(rapport.id)

      const isLastItemOnPage = rapportsList.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        await loadRapports()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Vie scolaire</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion de la discipline</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Suivez les incidents, sanctions et comportements positifs, relie a l API NestJS.
              </p>
            </div>
            <Link
              to="/dashboard/disciplines/nouveau"
              className={BUTTON_ON_DARK.primary}
            >
              Nouveau rapport
            </Link>
          </div>
        </div>
      </Card>

      <DisciplineSubNav />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Rapports au total" value={stats.total} detail="Toutes pages confondues" />
        <StatCard label="Ouverts (page courante)" value={stats.ouverts} detail="Necessitent une action" />
        <StatCard label="Resolus/fermes (page courante)" value={stats.resolus} detail="Dossiers traites" />
      </section>

      <Card title="Recherche et filtres" subtitle="Recherchez par eleve ou description, filtrez par type et par statut.">
        <RapportFilters
          filters={filters}
          disciplinesList={disciplinesList}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card title="Liste des rapports" subtitle="Consultation, edition et suppression des rapports disciplinaires.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des rapports...</div>
        ) : (
          <>
            <RapportTable
              rapportsList={rapportsList}
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

export default RapportsPage
