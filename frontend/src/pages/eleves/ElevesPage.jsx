import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import EleveFilters from '../../components/eleves/EleveFilters'
import EleveTable from '../../components/eleves/EleveTable'
import { elevesService } from '../../services/elevesService'
import { cyclesService } from '../../services/cyclesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { applyEleveFilters } from './eleves.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  actif: 'all',
  sexe: 'all',
  langue: 'all',
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

function ElevesPage() {
  const [eleves, setEleves] = useState([])
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
  }, [deferredSearch])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const result = await elevesService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })

        if (!isMounted) return

        setEleves(result.data)
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
  }, [deferredSearch, page])

  const filteredEleves = useMemo(
    () => applyEleveFilters(eleves, filters),
    [eleves, filters],
  )

  const stats = useMemo(() => {
    const actifs = filteredEleves.filter((item) => item.actif).length
    const filles = filteredEleves.filter((item) => `${item.sexe}` === '2').length
    const langues = new Set(filteredEleves.map((item) => item.langue).filter(Boolean)).size

    return {
      total: filteredEleves.length,
      actifs,
      filles,
      langues,
    }
  }, [filteredEleves])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(eleve) {
    const confirmed = window.confirm(
      `Supprimer le dossier de ${eleve.nom} ${eleve.prenom} ?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(eleve.id)
      await elevesService.remove(eleve.id)

      const isLastItemOnPage = eleves.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        const result = await elevesService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })
        setEleves(result.data)
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
            Inscriptions
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des eleves</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Consultez, recherchez et gerez facilement les dossiers des eleves de l'etablissement.
              </p>
            </div>
            <Link
              to="/dashboard/eleves/nouveau"
              className={BUTTON_ON_DARK.primary}
            >
              Nouvel eleve
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Dossiers affiches" value={stats.total} detail="Resultats apres filtres" />
        <StatCard label="Eleves actifs" value={stats.actifs} detail="Statut actif uniquement" />
        <StatCard label="Filles" value={stats.filles} detail="Repartition actuelle" />
        <StatCard label="Langues couvertes" value={stats.langues} detail="Diversite linguistique" />
      </section>

      <Card
        title="Recherche et filtres"
        subtitle="Combinez la recherche et des filtres pour retrouver un eleve plus vite."
      >
        <EleveFilters
          filters={filters}
          cycles={cycles}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card
        title="Liste des eleves"
        subtitle="Consultation, edition, suppression et acces au profil detaille."
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des eleves...</div>
        ) : (
          <>
            <EleveTable
              eleves={filteredEleves}
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

export default ElevesPage
