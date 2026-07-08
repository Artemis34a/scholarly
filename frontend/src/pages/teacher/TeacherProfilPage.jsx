import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import ActifBadge from '../../components/ActifBadge'
import { useAuth } from '../../context/AuthContext'
import { personnesService } from '../../services/personnesService'
import { enseignantsService } from '../../services/enseignantsService'

function InfoRow({ label, value }) {
  return (
    <div className="rounded-[22px] border border-slate-200/80 bg-slate-50/80 px-4 py-4">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}

function TeacherProfilPage() {
  const { user } = useAuth()
  const [personne, setPersonne] = useState(null)
  const [enseignant, setEnseignant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      personnesService.findOne(user.id),
      enseignantsService.findAll({ limit: 100 }),
    ])
      .then(([personneData, enseignantsResult]) => {
        if (!isMounted) return
        setPersonne(personneData)
        setEnseignant(enseignantsResult.data.find((e) => e.personne?.id === user.id) ?? null)
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

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <div className="flex items-center gap-5">
            <div className="flex h-20 w-20 items-center justify-center rounded-[28px] bg-white/12 text-3xl font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
              {user?.nom?.[0]}
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">Mon profil</p>
              <h2 className="mt-3 text-3xl font-semibold md:text-4xl">{user?.nom}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{user?.username}</p>
            </div>
          </div>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {loading || !personne ? (
        <Card>
          <div className="py-12 text-center text-slate-400">Chargement du profil...</div>
        </Card>
      ) : (
        <Card title="Informations personnelles" subtitle="Vos coordonnees et votre affectation.">
          <div className="grid gap-4 md:grid-cols-2">
            <InfoRow label="Nom complet" value={`${personne.nom} ${personne.prenom}`} />
            <InfoRow label="Identifiant" value={personne.username} />
            <InfoRow label="Telephone" value={personne.mobile || 'Non renseigne'} />
            <InfoRow label="Cours enseigne" value={enseignant?.cours?.libelle ?? 'Non renseigne'} />
            <InfoRow label="Statut" value={enseignant ? <ActifBadge actif={enseignant.actif} /> : 'Non renseigne'} />
          </div>
        </Card>
      )}
    </div>
  )
}

export default TeacherProfilPage
