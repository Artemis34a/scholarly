import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import BulletinView from '../../components/evaluations/BulletinView'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'

function StudentBulletinPage() {
  const { user } = useAuth()
  const [bulletin, setBulletin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    evaluationsService.getBulletin(user.id)
      .then((data) => {
        if (isMounted) setBulletin(data)
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Bulletin</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Mon bulletin</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Moyenne generale calculee automatiquement, ponderee par le coefficient de chaque cours.
          </p>
        </div>
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <Card title="Moyennes par cours" subtitle="Detail du calcul de votre moyenne generale.">
        {loading || !bulletin ? (
          <div className="py-8 text-center text-slate-400">Chargement du bulletin...</div>
        ) : (
          <BulletinView bulletin={bulletin} showCoursLink={false} />
        )}
      </Card>
    </div>
  )
}

export default StudentBulletinPage
