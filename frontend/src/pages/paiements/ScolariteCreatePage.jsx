import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import ScolariteForm from '../../components/paiements/ScolariteForm'
import { paiementsService } from '../../services/paiementsService'
import { elevesService } from '../../services/elevesService'
import { anneesService } from '../../services/anneesService'
import { classesService } from '../../services/classesService'
import { buildScolaritePayload, scolariteInitialValues } from './paiements.utils'

function ScolariteCreatePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(scolariteInitialValues)
  const [eleves, setEleves] = useState([])
  const [annees, setAnnees] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      elevesService.findAll({ limit: 100 }),
      anneesService.findAll(),
      classesService.findAll({ limit: 100 }),
    ])
      .then(([elevesResult, anneesData, classesResult]) => {
        if (isMounted) {
          setEleves(elevesResult.data)
          setAnnees(anneesData)
          setClasses(classesResult.data)
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

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const created = await paiementsService.scolarites.create(buildScolaritePayload(values))
      navigate(`/dashboard/paiements/scolarites/${created.id}`)
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
        <ScolariteForm
          title="Creer une scolarite"
          subtitle="Definissez les frais et la reduction pour cet eleve sur cette annee academique."
          values={values}
          eleves={eleves}
          annees={annees}
          classes={classes}
          submitting={submitting}
          error={error}
          submitLabel="Creer la scolarite"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/paiements/scolarites')}
        />
      )}
    </Card>
  )
}

export default ScolariteCreatePage
