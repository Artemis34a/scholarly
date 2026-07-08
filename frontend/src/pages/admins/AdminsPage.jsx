import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import AdminFilters from '../../components/admins/AdminFilters'
import AdminTable from '../../components/admins/AdminTable'
import { adminsService } from '../../services/adminsService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { applyAdminFilters } from './admins.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  actif: 'all',
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

function AdminsPage() {
  const [admins, setAdmins] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    setPage(1)
  }, [deferredSearch])

  useEffect(() => {
    let isMounted = true
    setLoading(true)
    const timeoutId = setTimeout(async () => {
      try {
        const result = await adminsService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })

        if (!isMounted) return

        setAdmins(result.data)
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

  const filteredAdmins = useMemo(
    () => applyAdminFilters(admins, filters),
    [admins, filters],
  )

  const stats = useMemo(() => {
    const actifs = filteredAdmins.filter((item) => item.actif).length
    return { total: filteredAdmins.length, actifs }
  }, [filteredAdmins])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(admin) {
    const confirmed = window.confirm(`Supprimer le compte administrateur "${admin.nom}" ?`)
    if (!confirmed) return

    try {
      setDeletingId(admin.id)
      await adminsService.remove(admin.id)

      const isLastItemOnPage = admins.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        const result = await adminsService.findAll({
          search: deferredSearch.trim() || undefined,
          page,
          limit: PAGE_SIZE,
        })
        setAdmins(result.data)
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
            Comptes
          </p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des administrateurs</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Consultez, creez, modifiez et supprimez les comptes administrateurs de l'application.
              </p>
            </div>
            <Link to="/dashboard/admins/nouveau" className={BUTTON_ON_DARK.primary}>
              Nouvel administrateur
            </Link>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Comptes affiches" value={stats.total} detail="Resultats apres filtres" />
        <StatCard label="Comptes actifs" value={stats.actifs} detail="Statut actif uniquement" />
      </section>

      <Card
        title="Recherche et filtres"
        subtitle="Combinez la recherche backend avec des filtres visuels locaux pour naviguer plus vite."
      >
        <AdminFilters
          filters={filters}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card
        title="Liste des administrateurs"
        subtitle="Modifiez le login, le mot de passe ou supprimez un compte existant."
      >
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des administrateurs...</div>
        ) : (
          <>
            <AdminTable admins={filteredAdmins} deletingId={deletingId} onDelete={handleDelete} />
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

export default AdminsPage
