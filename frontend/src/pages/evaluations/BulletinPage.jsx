import { useEffect, useState } from 'react'
import Card from '../../components/Card'
import EvaluationsSubNav from '../../components/evaluations/EvaluationsSubNav'
import BulletinView from '../../components/evaluations/BulletinView'
import { evaluationsService } from '../../services/evaluationsService'
import { elevesService } from '../../services/elevesService'

function BulletinPage() {
  const [eleves, setEleves] = useState([])
  const [idEleve, setIdEleve] = useState('')
  const [bulletin, setBulletin] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadingBulletin, setLoadingBulletin] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    elevesService.findAll({ limit: 100 })
      .then((result) => {
        if (isMounted) setEleves(result.data)
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
  }, [])

  useEffect(() => {
    if (!idEleve) {
      setBulletin(null)
      return
    }

    let isMounted = true
    setLoadingBulletin(true)
    setError('')

    evaluationsService.getBulletin(idEleve)
      .then((data) => {
        if (isMounted) setBulletin(data)
      })
      .catch((err) => {
        if (isMounted) setError(err.message)
      })
      .finally(() => {
        if (isMounted) setLoadingBulletin(false)
      })

    return () => {
      isMounted = false
    }
  }, [idEleve])

  const eleveSelectionne = eleves.find((eleve) => `${eleve.id}` === idEleve)

  return (
    <div className="space-y-6 md:space-y-7">
      <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)]">
        <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">Bulletins</p>
          <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Moyennes par eleve</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-300 md:text-base">
            Moyenne generale calculee automatiquement a partir des notes saisies, ponderee par le coefficient de chaque cours.
          </p>
        </div>
      </Card>

      <EvaluationsSubNav />

      <Card title="Selectionner un eleve" subtitle="Choisissez un eleve pour afficher son bulletin.">
        {loading ? (
          <div className="py-6 text-center text-slate-400">Chargement des eleves...</div>
        ) : (
          <select
            value={idEleve}
            onChange={(event) => setIdEleve(event.target.value)}
            className="w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-400"
          >
            <option value="">Choisir un eleve</option>
            {eleves.map((eleve) => (
              <option key={eleve.id} value={eleve.id}>{eleve.nom} {eleve.prenom}</option>
            ))}
          </select>
        )}
      </Card>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      {idEleve && (
        <Card
          title={eleveSelectionne ? `Bulletin de ${eleveSelectionne.nom} ${eleveSelectionne.prenom}` : 'Bulletin'}
          subtitle="Moyenne par cours et moyenne generale ponderee par les coefficients."
        >
          {loadingBulletin || !bulletin ? (
            <div className="py-8 text-center text-slate-400">Chargement du bulletin...</div>
          ) : (
            <BulletinView bulletin={bulletin} />
          )}
        </Card>
      )}
    </div>
  )
}

export default BulletinPage
