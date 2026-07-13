import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../../components/Card'
import PaiementForm from '../../components/paiements/PaiementForm'
import { useAuth } from '../../context/AuthContext'
import { paiementsService } from '../../services/paiementsService'
import { buildPaiementPayload, paiementInitialValues } from './paiements.utils'

function PaiementCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const prefillIdScolarite = searchParams.get('idScolarite')
  const [values, setValues] = useState(
    prefillIdScolarite ? { ...paiementInitialValues, idScolarite: prefillIdScolarite } : paiementInitialValues,
  )
  const [scolarites, setScolarites] = useState([])
  const [tranches, setTranches] = useState([])
  const [modes, setModes] = useState([])
  const [soldeInfo, setSoldeInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      paiementsService.scolarites.findAll(),
      paiementsService.tranches.findAll(),
      paiementsService.modes.findAll(),
    ])
      .then(([scolaritesData, tranchesData, modesData]) => {
        if (isMounted) {
          setScolarites(scolaritesData)
          setTranches(tranchesData)
          setModes(modesData)
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
  }, [])

  useEffect(() => {
    if (!values.idScolarite) {
      setSoldeInfo(null)
      return
    }

    let isMounted = true
    paiementsService.scolarites.getSolde(values.idScolarite)
      .then((data) => {
        if (isMounted) setSoldeInfo(data)
      })
      .catch(() => {
        if (isMounted) setSoldeInfo(null)
      })

    return () => {
      isMounted = false
    }
  }, [values.idScolarite])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await paiementsService.create(buildPaiementPayload(values, user?.id))
      navigate('/dashboard/paiements')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading ? (
        <div className="py-12 text-center text-slate-400">Chargement du formulaire...</div>
      ) : (
        <PaiementForm
          title="Enregistrer un paiement"
          subtitle="Le montant est verifie automatiquement par rapport au reste a payer de la scolarite."
          values={values}
          scolarites={scolarites}
          tranches={tranches}
          modes={modes}
          soldeInfo={soldeInfo}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer le paiement"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/paiements')}
        />
      )}
    </Card>
  )
}

export default PaiementCreatePage
