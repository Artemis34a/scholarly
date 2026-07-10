import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../../components/Card'
import Pagination from '../../components/Pagination'
import PaiementsSubNav from '../../components/paiements/PaiementsSubNav'
import PaiementFilters from '../../components/paiements/PaiementFilters'
import PaiementTable from '../../components/paiements/PaiementTable'
import { paiementsService } from '../../services/paiementsService'
import { classesService } from '../../services/classesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatMontant } from './paiements.utils'

const PAGE_SIZE = 10

const defaultFilters = {
  idClasse: 'all',
  idModePaiement: 'all',
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

function PaiementsPage() {
  const [paiementsList, setPaiementsList] = useState([])
  const [pageInfo, setPageInfo] = useState({ page: 1, totalPages: 1, total: 0 })
  const [page, setPage] = useState(1)
  const [classes, setClasses] = useState([])
  const [modes, setModes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState(defaultFilters)
  const [deletingId, setDeletingId] = useState(null)
  const deferredSearch = useDeferredValue(filters.localSearch)

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findAll({ limit: 100 }),
      paiementsService.modes.findAll(),
    ]).then(([classesResult, modesData]) => {
      if (isMounted) {
        setClasses(classesResult.data)
        setModes(modesData)
      }
    }).catch(() => {})

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPage(1)
  }, [deferredSearch, filters.idClasse, filters.idModePaiement, filters.statut])

  async function loadPaiements() {
    setLoading(true)
    try {
      const result = await paiementsService.findAll({
        search: deferredSearch.trim() || undefined,
        classeId: filters.idClasse !== 'all' ? filters.idClasse : undefined,
        modeId: filters.idModePaiement !== 'all' ? filters.idModePaiement : undefined,
        statut: filters.statut !== 'all' ? filters.statut : undefined,
        page,
        limit: PAGE_SIZE,
      })
      setPaiementsList(result.data)
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
      await loadPaiements()
    }, 250)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deferredSearch, filters.idClasse, filters.idModePaiement, filters.statut, page])

  const stats = useMemo(() => {
    const total = paiementsList.reduce((sum, p) => sum + p.montant, 0)
    return {
      count: pageInfo.total,
      totalMontant: formatMontant(total),
    }
  }, [paiementsList, pageInfo.total])

  function handleFilterChange(name, value) {
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function handleReset() {
    setFilters(defaultFilters)
  }

  function handleSearchChange(value) {
    setFilters((current) => ({ ...current, localSearch: value }))
  }

  async function handleDelete(paiement) {
    const confirmed = window.confirm(
      `Supprimer le paiement de ${formatMontant(paiement.montant)} pour ${paiement.scolarite?.eleve?.nom} ${paiement.scolarite?.eleve?.prenom} ?`,
    )
    if (!confirmed) return

    try {
      setDeletingId(paiement.id)
      await paiementsService.remove(paiement.id)

      const isLastItemOnPage = paiementsList.length === 1 && page > 1
      if (isLastItemOnPage) {
        setPage((current) => current - 1)
      } else {
        await loadPaiements()
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Finance</p>
          <div className="mt-4 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-semibold md:text-4xl">Gestion des paiements</h2>
              <p className="mt-4 text-sm leading-7 text-slate-300 md:text-base">
                Encaissements, tranches, modes de paiement et suivi des soldes des eleves.
              </p>
            </div>
            <Link
              to="/dashboard/paiements/nouveau"
              className={BUTTON_ON_DARK.primary}
            >
              Nouveau paiement
            </Link>
          </div>
        </div>
      </Card>

      <PaiementsSubNav />

      <section className="grid gap-4 md:grid-cols-2">
        <StatCard label="Paiements au total" value={stats.count} detail="Toutes pages confondues" />
        <StatCard label="Encaisse (page courante)" value={stats.totalMontant} detail={`Sur ${paiementsList.length} paiements`} />
      </section>

      <Card title="Recherche et filtres" subtitle="Recherchez par eleve, reference ou recu, filtrez par classe/mode/statut.">
        <PaiementFilters
          filters={filters}
          classes={classes}
          modes={modes}
          onChange={handleFilterChange}
          onReset={handleReset}
          onSearchChange={handleSearchChange}
        />
      </Card>

      <Card title="Liste des paiements" subtitle="Consultation, edition et suppression des paiements.">
        {error && (
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement des paiements...</div>
        ) : (
          <>
            <PaiementTable
              paiementsList={paiementsList}
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

export default PaiementsPage
