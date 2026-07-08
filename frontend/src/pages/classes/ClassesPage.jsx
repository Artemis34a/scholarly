import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import ClasseFilters from '../../components/classes/ClasseFilters'
import ClasseTable from '../../components/classes/ClasseTable'
import { cyclesService } from '../../services/cyclesService'
import { classesService } from '../../services/classesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { applyClasseFilters } from './classes.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  idCycle: 'all',
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

function ClassesPage() {
  const [classes, setClasses] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    let isMounted = true

    cyclesService.findAll().then((data) => {
      if (isMounted) setCycles(data)
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, filters.idCycle])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const result = await classesService.findAll({
          search: deferredSearch.trim() || undefined,
          cycle: filters.idCycle !== 'all' ? filters.idCycle : undefined,
          page,
          limit: PAGE_SIZE,
        })

        if (!isMounted) return

        setClasses(result.data)
        setPageInfo({ page: result.page, totalPages: result.totalPages, total: result.total })
        setError('')
      } catch (err) {
        if (!isMounted) return
        setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [deferredSearch, filters.idCycle, page])

  const filteredClasses = useMemo(
    () => applyClasseFilters(classes, filters, cycles),
    [classes, filters, cycles],
  )

  const stats = useMemo(() => {
    const totalEleves = filteredClasses.reduce((sum, classe) => sum + (classe.salles?.[0]?._count?.frequentes ?? 0), 0)
    const avecTitulaire = filteredClasses.filter((classe) => classe.salles?.[0]?.titulaire).length

    return {
      total: filteredClasses.length,
      totalEleves,
      avecTitulaire,
    }
  }, [filteredClasses])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(classe) {
    const confirmed = window.confirm(
      `Supprimer definitivement la classe ${classe.libelle} ? Les cours, affectations et paiements lies a cette classe seront egalement supprimes.`,
    )

    if (!confirmed) return

    try {
      setDeletingId(classe.id)
      await classesService.remove(classe.id)

      const isLastItemOnPage = classes.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        const result = await classesService.findAll({
          search: deferredSearch.trim() || undefined,
          cycle: filters.idCycle !== 'all' ? filters.idCycle : undefined,
          page,
          limit: PAGE_SIZE,
        })
        setClasses(result.data)
        setPageInfo({ page: result.page, totalPages: result.totalPages, total: result.total })
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
            Structure
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des classes</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Organisez les classes, leur cycle, leur titulaire et leurs effectifs depuis une interface reliee a l API NestJS.
              </p>
            </div>
            <Link
              to="/dashboard/classes/nouvelle"
              className={BUTTON_ON_DARK.primary}
            >
              Nouvelle classe
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Classes affichees" value={stats.total} detail="Resultats apres filtres" />
        <StatCard label="Eleves inscrits" value={stats.totalEleves} detail="Sur cette page" />
        <StatCard label="Avec titulaire" value={stats.avecTitulaire} detail="Classes affectees" />
      </section>

      <Card
        title="Recherche et filtres"
        subtitle="Combinez la recherche backend avec des filtres visuels locaux pour naviguer plus vite."
      >
        <ClasseFilters
          filters={filters}
          cycles={cycles}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card
        title="Liste des classes"
        subtitle="Consultation, edition, suppression et acces au detail complet."
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des classes...</div>
        ) : (
          <>
            <ClasseTable
              classes={filteredClasses}
              cycles={cycles}
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

export default ClassesPage
