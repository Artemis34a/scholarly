import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import WeeklyGrid from '../../components/emploi-du-temps/WeeklyGrid'
import { useAuth } from '../../context/AuthContext'
import { emploiDuTempsService } from '../../services/emploiDuTempsService'

function StudentEmploiPage() {
  const { user } = useAuth()
  const [slots, setSlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    emploiDuTempsService.getGrilleEleve(user.id)
      .then((data) => {
        if (isMounted) setSlots(data)
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
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Planning</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mon emploi du temps</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Le planning de votre classe pour la semaine.
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Grille hebdomadaire" subtitle="Vue en lecture seule.">
        {loading ? (
          <div className="py-12 text-center text-slate-400">Chargement de l'emploi du temps...</div>
        ) : (
          <WeeklyGrid slots={slots} />
        )}
      </Card>
    </div>
  )
}

export default StudentEmploiPage
