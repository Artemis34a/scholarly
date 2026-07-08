import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EleveStatusBadge from '../../components/eleves/EleveStatusBadge'
import DefaultAvatar from '../../components/DefaultAvatar'
import { elevesService } from '../../services/elevesService'
import { villesService } from '../../services/villesService'
import { BUTTON_ON_DARK } from '../../components/buttonStyles'
import { formatDate, getSexeLabel, getVilleLabel } from './eleves.utils'

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function EleveProfilePage() {
  const { id } = useParams()
  const [eleve, setEleve] = useState(null)
  const [villes, setVilles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [eleveData, villesData] = await Promise.all([
          elevesService.findOne(id),
          villesService.findAll(),
        ])

        if (!isMounted) return

        setEleve(eleveData)
        setVilles(villesData)
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [id])

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-slate-400">Chargement du profil eleve...</div>
      </Card>
    )
  }

  if (error || !eleve) {
    return (
      <Card>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || 'Eleve introuvable'}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/12 text-3xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                {eleve.prenom?.[0]}
                {eleve.nom?.[0]}
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
                  Profil eleve
                </p>
                <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                  {eleve.nom} {eleve.prenom}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-300">
                  Dossier #{eleve.id} · {getVilleLabel(villes, eleve.idVilleNaissance)}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={`/dashboard/eleves/${eleve.id}`}
                className={BUTTON_ON_DARK.primary}
              >
                Consulter le dossier
              </Link>
              <Link
                to={`/dashboard/eleves/${eleve.id}/modifier`}
                className={BUTTON_ON_DARK.primary}
              >
                Modifier
              </Link>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProfileStat label="Date de naissance" value={formatDate(eleve.dateNaissance)} />
        <ProfileStat label="Sexe" value={getSexeLabel(eleve.sexe)} />
        <ProfileStat label="Langue" value={eleve.langue} />
        <ProfileStat label="Statut" value={<EleveStatusBadge actif={eleve.actif} />} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card title="Identite" subtitle="Informations principales visibles en un clin d oeil.">
          <div className="grid gap-4 md:grid-cols-2">
            <ProfileStat label="Nom" value={eleve.nom} />
            <ProfileStat label="Prenom" value={eleve.prenom} />
            <ProfileStat label="Lieu de naissance" value={eleve.lieuNaissance} />
            <ProfileStat label="Ville de naissance" value={getVilleLabel(villes, eleve.idVilleNaissance)} />
          </div>
        </Card>

        <Card title="Medias et suivi" subtitle="Bloc pret pour accueillir d autres donnees quand l API s enrichira.">
          <div className="space-y-4">
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4">
              <p className="font-semibold text-slate-900">Photo de profil</p>
              {eleve.photoURL ? (
                <img
                  src={eleve.photoURL}
                  alt={`${eleve.nom} ${eleve.prenom}`}
                  className="mt-4 h-48 w-full rounded-[22px] object-cover"
                />
              ) : (
                <DefaultAvatar className="mt-4 h-48 w-full" />
              )}
            </div>
            <div className="rounded-[24px] border border-slate-200/80 bg-slate-50/90 p-4">
              <p className="font-semibold text-slate-900">Perspectives d evolution</p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Ce profil est pret a accueillir les inscriptions par classe, les evaluations, les rapports disciplinaires et l historique de paiements.
              </p>
            </div>
          </div>
        </Card>
      </section>
    </div>
  )
}

export default EleveProfilePage
