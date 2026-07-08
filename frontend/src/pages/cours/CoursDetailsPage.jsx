import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { coursService } from '../../services/coursService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function CoursDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [cours, setCours] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    coursService.findOne(id)
      .then((data) => {
        if (isMounted) setCours(data)
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
  }, [id])

  async function handleDelete() {
    if (!cours) return

    const confirmed = window.confirm(
      `Supprimer definitivement le cours ${cours.libelle} ?`,
    )

    if (!confirmed) return

    try {
      setDeleting(true)
      await coursService.remove(cours.id)
      navigate('/dashboard/cours')
    } catch (err) {
      setError(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        {loading || !cours ? (
          <div className="rounded-[28px] border border-white/10 p-8 text-center text-slate-300">
            Chargement du cours...
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Consultation detaillee
                </p>
                <h2 className="mt-4 text-3xl font-semibold md:text-4xl">{cours.libelle}</h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Cours #{cours.id} · {cours.classe?.libelle}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to={`/dashboard/cours/${cours.id}/modifier`}
                  className={BUTTON_ON_DARK.primary}
                >
                  Modifier
                </Link>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className={BUTTON_ON_DARK.danger}
                >
                  {deleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {cours && (
        <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <Card title="Informations generales" subtitle="Resume complet du cours pour consultation administrative.">
            <div className="grid gap-4 md:grid-cols-2">
              <InfoRow label="Libelle" value={cours.libelle} />
              <InfoRow label="Statut" value={<ActifBadge actif={cours.actif} />} />
              <InfoRow label="Classe" value={cours.classe?.libelle ?? 'Non renseignee'} />
              <InfoRow label="Cycle" value={cours.classe?.cycle?.libelle ?? 'Non renseigne'} />
              <InfoRow label="Coefficient" value={cours.coefficient} />
              <InfoRow label="Note" value={cours.note ?? 'Non renseignee'} />
              <InfoRow label="Description" value={cours.description || 'Aucune description'} />
              <InfoRow label="Identifiant" value={`#${cours.id}`} />
            </div>
          </Card>

          <Card
            title="Enseignants affectes"
            subtitle="Personnes en charge de ce cours. L'affectation se gere depuis le module Enseignants."
          >
            <div className="space-y-4">
              {cours.enseignants?.length > 0 ? (
                cours.enseignants.map((enseignant) => (
                  <Link
                    key={enseignant.id}
                    to={`/dashboard/enseignants/${enseignant.id}`}
                    className="block rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4 transition hover:border-sky-200 hover:bg-sky-50/70"
                  >
                    <p className="text-sm font-semibold text-slate-900">
                      {enseignant.personne?.nom} {enseignant.personne?.prenom}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">{enseignant.personne?.username}</p>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-slate-500">Aucun enseignant affecte a ce cours.</p>
              )}

              <Link
                to={`/dashboard/enseignants/nouveau?idCours=${cours.id}`}
                className="block rounded-[22px] border border-dashed border-slate-300 bg-white px-4 py-4 text-center text-sm font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-50"
              >
                + Affecter un enseignant a ce cours
              </Link>
            </div>
          </Card>
        </section>
      )}
    </div>
  )
}

export default CoursDetailsPage
