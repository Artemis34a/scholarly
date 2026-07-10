import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import EnseignantFilters from '../../components/enseignants/EnseignantFilters'
import EnseignantTable from '../../components/enseignants/EnseignantTable'
import { coursService } from '../../services/coursService'
import { enseignantsService } from '../../services/enseignantsService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { applyEnseignantFilters } from './enseignants.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  actif: 'all',
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

function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState([])
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

    coursService.findAll().then((data) => {
      if (isMounted) setCours(data)
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
        const result = await enseignantsService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })

        if (!isMounted) return

        setEnseignants(result.data)
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

  const filteredEnseignants = useMemo(
    () => applyEnseignantFilters(enseignants, filters, cours),
    [enseignants, filters, cours],
  )

  const stats = useMemo(() => {
    const actifs = filteredEnseignants.filter((item) => item.actif).length
    const coursCouverts = new Set(filteredEnseignants.map((item) => item.idCours).filter(Boolean)).size

    return {
      total: filteredEnseignants.length,
      actifs,
      coursCouverts,
    }
  }, [filteredEnseignants])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(enseignant) {
    const confirmed = window.confirm(
      `Supprimer l'affectation de ${enseignant.personne?.nom} ${enseignant.personne?.prenom} ?`,
    )

    if (!confirmed) return

    try {
      setDeletingId(enseignant.id)
      await enseignantsService.remove(enseignant.id)

      const isLastItemOnPage = enseignants.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        const result = await enseignantsService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })
        setEnseignants(result.data)
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
            Ressources humaines
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des enseignants</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Gerez les informations des enseignants et leurs affectations aux differents cours.
              </p>
            </div>
            <Link
              to="/dashboard/enseignants/nouveau"
              className={BUTTON_ON_DARK.primary}
            >
              Nouvel enseignant
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Enseignants affiches" value={stats.total} detail="Resultats apres filtres" />
        <StatCard label="Enseignants actifs" value={stats.actifs} detail="Statut actif uniquement" />
        <StatCard label="Cours couverts" value={stats.coursCouverts} detail="Sur cette page" />
      </section>

      <Card
        title="Recherche et filtres"
        subtitle="Combinez la recherche et des filtres pour retrouver un enseignant plus vite."
      >
        <EnseignantFilters
          filters={filters}
          cours={cours}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card
        title="Liste des enseignants"
        subtitle="Consultation, edition, suppression et acces au profil detaille."
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des enseignants...</div>
        ) : (
          <>
            <EnseignantTable
              enseignants={filteredEnseignants}
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

export default EnseignantsPage
