import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ScolariteForm from '../../components/paiements/ScolariteForm'
import { paiementsService } from '../../services/paiementsService'
import { elevesService } from '../../services/elevesService'
import { anneesService } from '../../services/anneesService'
import { classesService } from '../../services/classesService'
import { buildScolaritePayload, createScolariteFormValues } from './paiements.utils'

function ScolariteEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [eleves, setEleves] = useState([])
  const [annees, setAnnees] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [scolarite, elevesResult, anneesData, classesResult] = await Promise.all([
          paiementsService.scolarites.findOne(id),
          elevesService.findAll({ limit: 100 }),
          anneesService.findAll(),
          classesService.findAll({ limit: 100 }),
        ])

        if (!isMounted) return

        setValues(createScolariteFormValues(scolarite))
        setEleves(elevesResult.data)
        setAnnees(anneesData)
        setClasses(classesResult.data)
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

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await paiementsService.scolarites.update(id, buildScolaritePayload(values))
      navigate(`/dashboard/paiements/scolarites/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement de la scolarite...</div>
      ) : (
        <ScolariteForm
          title="Modifier la scolarite"
          subtitle="Mettez a jour les frais ou la reduction de cet eleve."
          values={values}
          eleves={eleves}
          annees={annees}
          classes={classes}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/paiements/scolarites/${id}`)}
        />
      )}
    </Card>
  )
}

export default ScolariteEditPage
