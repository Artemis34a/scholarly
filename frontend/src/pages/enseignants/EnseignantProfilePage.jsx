import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { enseignantsService } from '../../services/enseignantsService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, getAffectationsLabel } from './enseignants.utils'

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function EnseignantProfilePage() {
  const { id } = useParams()
  const [enseignant, setEnseignant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    enseignantsService.findOne(id)
      .then((data) => {
        if (isMounted) setEnseignant(data)
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

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-slate-400">Chargement du profil enseignant...</div>
      </Card>
    )
  }

  if (error || !enseignant) {
    return (
      <Card>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || 'Enseignant introuvable'}
        </div>
      </Card>
    )
  }

  const { personne, affectations } = enseignant

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/12 text-3xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {personne?.prenom?.[0]}
                {personne?.nom?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Profil enseignant
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  {personne?.nom} {personne?.prenom}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  #{enseignant.id} · {getAffectationsLabel(enseignant)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/dashboard/enseignants/${enseignant.id}`}
                className={BUTTON_ON_DARK.primary}
              >
                Consulter le dossier
              </Link>
              <Link
                to={`/dashboard/enseignants/${enseignant.id}/modifier`}
                className={BUTTON_ON_DARK.primary}
              >
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProfileStat label="Date de naissance" value={formatDate(personne?.dateNaissance)} />
        <ProfileStat label="Nombre d'affectations" value={affectations?.length ?? 0} />
        <ProfileStat label="Statut" value={<ActifBadge actif={enseignant.actif} />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Identite" subtitle="Informations principales visibles en un clin d oeil.">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileStat label="Nom" value={personne?.nom} />
            <ProfileStat label="Prenom" value={personne?.prenom} />
            <ProfileStat label="Identifiant" value={personne?.username} />
            <ProfileStat label="Telephone" value={personne?.mobile || 'Non renseigne'} />
          </div>
        </Card>

        <Card title="Affectations d'enseignement" subtitle="Cours assures par cet enseignant, classe par classe.">
          <div className="space-y-3">
            {affectations?.length > 0 ? (
              affectations.map((affectation) => (
                <div key={affectation.id} className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4">
                  <p className="font-semibold text-slate-900">{affectation.classeCours?.cours?.libelle ?? 'Cours inconnu'}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{affectation.classeCours?.classe?.libelle ?? 'Classe inconnue'}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">Aucune affectation d'enseignement pour le moment.</p>
            )}
          </div>
        </Card>
      </section>
    </div>
  )
}

export default EnseignantProfilePage
