import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import RapportForm from '../../components/disciplines/RapportForm'
import { disciplinesService } from '../../services/disciplinesService'
import { elevesService } from '../../services/elevesService'
import { personnesService } from '../../services/personnesService'
import { buildRapportPayload, createRapportFormValues } from './disciplines.utils'

function RapportEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [eleves, setEleves] = useState([])
  const [disciplinesList, setDisciplinesList] = useState([])
  const [personnes, setPersonnes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [rapport, elevesResult, disciplinesData, personnesData] = await Promise.all([
          disciplinesService.rapports.findOne(id),
          elevesService.findAll({ limit: 100 }),
          disciplinesService.types.findAll(),
          personnesService.findAll(),
        ])

        if (!isMounted) return

        setValues(createRapportFormValues(rapport))
        setEleves(elevesResult.data)
        setDisciplinesList(disciplinesData)
        setPersonnes(personnesData)
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
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await disciplinesService.rapports.update(id, buildRapportPayload(values))
      navigate('/dashboard/disciplines')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du rapport...</div>
      ) : (
        <RapportForm
          title="Modifier le rapport"
          subtitle="Mettez a jour le statut, la sanction ou les details de l'incident."
          values={values}
          eleves={eleves}
          disciplinesList={disciplinesList}
          personnes={personnes}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/disciplines')}
        />
      )}
    </Card>
  )
}

export default RapportEditPage
