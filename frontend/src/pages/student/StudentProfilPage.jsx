import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { useAuth } from '../../context/AuthContext'
import { elevesService } from '../../services/elevesService'
import { villesService } from '../../services/villesService'
import { formatDate, getSexeLabel, getVilleLabel } from '../eleves/eleves.utils'

function ProfileStat({ label, value }) {
  return (
    <div className="rounded-[24px] border border-white/70 bg-white/85 px-4 py-4 shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-3 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  )
}

function StudentProfilPage() {
  const { user } = useAuth()
  const [eleve, setEleve] = useState(null)
  const [villes, setVilles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      elevesService.findOne(user.id),
      villesService.findAll(),
    ])
      .then(([eleveData, villesData]) => {
        if (isMounted) {
          setEleve(eleveData)
          setVilles(villesData)
        }
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
  }, [user.id])

  if (loading) {
    return (
      <Card>
        <div className="py-12 text-center text-slate-400">Chargement du profil...</div>
      </Card>
    )
  }

  if (error || !eleve) {
    return (
      <Card>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error || 'Profil introuvable'}
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/12 text-3xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {eleve.prenom?.[0]}
              {eleve.nom?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Mon profil</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
                {eleve.nom} {eleve.prenom}
              </h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">
                Dossier #{eleve.id} · {getVilleLabel(villes, eleve.idVilleNaissance)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ProfileStat label="Date de naissance" value={formatDate(eleve.dateNaissance)} />
        <ProfileStat label="Sexe" value={getSexeLabel(eleve.sexe)} />
        <ProfileStat label="Langue" value={eleve.langue} />
        <ProfileStat label="Statut" value={<ActifBadge actif={eleve.actif} />} />
      </section>

      <Card title="Identite" subtitle="Informations principales de votre dossier.">
        <div className="grid gap-4 md:grid-cols-2">
          <ProfileStat label="Nom" value={eleve.nom} />
          <ProfileStat label="Prenom" value={eleve.prenom} />
          <ProfileStat label="Lieu de naissance" value={eleve.lieuNaissance} />
          <ProfileStat label="Ville de naissance" value={getVilleLabel(villes, eleve.idVilleNaissance)} />
        </div>
      </Card>
    </div>
  )
}

export default StudentProfilPage
