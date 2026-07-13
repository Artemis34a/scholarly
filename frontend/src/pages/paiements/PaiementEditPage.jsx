import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import PaiementForm from '../../components/paiements/PaiementForm'
import { paiementsService } from '../../services/paiementsService'
import { buildPaiementPayload, createPaiementFormValues } from './paiements.utils'

function PaiementEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [scolarites, setScolarites] = useState([])
  const [tranches, setTranches] = useState([])
  const [modes, setModes] = useState([])
  const [soldeInfo, setSoldeInfo] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [paiement, scolaritesData, tranchesData, modesData] = await Promise.all([
          paiementsService.findOne(id),
          paiementsService.scolarites.findAll(),
          paiementsService.tranches.findAll(),
          paiementsService.modes.findAll(),
        ])

        if (!isMounted) return

        setValues(createPaiementFormValues(paiement))
        setScolarites(scolaritesData)
        setTranches(tranchesData)
        setModes(modesData)
      } catch (err) {
        if (isMounted) setError(err.message)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [id])

  useEffect(() => {
    if (!values?.idScolarite) {
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
  }, [values])

  function handleChange(event) {
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await paiementsService.update(id, buildPaiementPayload(values))
      navigate('/dashboard/paiements')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du paiement...</div>
      ) : (
        <PaiementForm
          title="Modifier le paiement"
          subtitle="Le montant est revalide automatiquement par rapport au reste a payer."
          values={values}
          scolarites={scolarites}
          tranches={tranches}
          modes={modes}
          soldeInfo={soldeInfo}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/paiements')}
        />
      )}
    </Card>
  )
}

export default PaiementEditPage
