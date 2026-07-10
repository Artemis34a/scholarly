import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import EvaluationsSubNav from '../../components/evaluations/EvaluationsSubNav'
import EpreuveFilters from '../../components/evaluations/EpreuveFilters'
import EpreuveTable from '../../components/evaluations/EpreuveTable'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { applyEpreuveFilters } from './evaluations.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  typeEpreuve: 'all',
  idCours: 'all',
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

function EpreuvesPage() {
  const [epreuvesList, setEpreuvesList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    let isMounted = true

    coursService.findAll().then((coursData) => {
      if (isMounted) {
        setCours(coursData)
      }
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, filters.typeEpreuve, filters.idCours])

  async function loadEpreuves() {
    setLoading(true)
    try {
      const result = await evaluationsService.epreuves.findAll({
        search: deferredSearch.trim() || undefined,
        type: filters.typeEpreuve !== 'all' ? filters.typeEpreuve : undefined,
        cours: filters.idCours !== 'all' ? filters.idCours : undefined,
        page,
        limit: PAGE_SIZE,
      })
      setEpreuvesList(result.data)
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
      await loadEpreuves()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, filters.typeEpreuve, filters.idCours, page])

  const filteredEpreuves = useMemo(
    () => applyEpreuveFilters(epreuvesList, filters, cours),
    [epreuvesList, filters, cours],
  )

  const stats = useMemo(() => ({
    total: filteredEpreuves.length,
    actives: filteredEpreuves.filter((item) => item.actif).length,
    avecCours: filteredEpreuves.filter((item) => item.idCours).length,
  }), [filteredEpreuves])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(epreuve) {
    const confirmed = window.confirm(`Supprimer definitivement l'epreuve ${epreuve.libelle} et toutes ses notes ?`)
    if (!confirmed) return

    try {
      setDeletingId(epreuve.id)
      await evaluationsService.epreuves.remove(epreuve.id)

      const isLastItemOnPage = epreuvesList.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        await loadEpreuves()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Resultats</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des evaluations</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Centralisez les epreuves, les notes et les statistiques de performance des eleves.
              </p>
            </div>
            <Link
              to="/dashboard/evaluations/nouvelle"
              className={BUTTON_ON_DARK.primary}
            >
              Nouvelle epreuve
            </Link>
          </div>
        </div>
      </Card>

      <EvaluationsSubNav />

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Epreuves affichees" value={stats.total} detail="Resultats apres filtres" />
        <StatCard label="Epreuves actives" value={stats.actives} detail="Statut actif uniquement" />
        <StatCard label="Rattachees a un cours" value={stats.avecCours} detail="Sur cette page" />
      </section>

      <Card title="Recherche et filtres" subtitle="Combinez la recherche et des filtres pour retrouver une epreuve plus vite.">
        <EpreuveFilters
          filters={filters}
          cours={cours}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card title="Liste des epreuves" subtitle="Consultation, edition, suppression et acces au classement detaille.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des epreuves...</div>
        ) : (
          <>
            <EpreuveTable
              epreuvesList={filteredEpreuves}
              cours={cours}
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

export default EpreuvesPage
