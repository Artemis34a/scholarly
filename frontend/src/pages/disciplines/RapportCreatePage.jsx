import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import RapportForm from '../../components/disciplines/RapportForm'
import { disciplinesService } from '../../services/disciplinesService'
import { elevesService } from '../../services/elevesService'
import { personnesService } from '../../services/personnesService'
import { buildRapportPayload, rapportInitialValues } from './disciplines.utils'

function RapportCreatePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(rapportInitialValues)
  const [eleves, setEleves] = useState([])
  const [disciplinesList, setDisciplinesList] = useState([])
  const [personnes, setPersonnes] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      elevesService.findAll({ limit: 100 }),
      disciplinesService.types.findAll(),
      personnesService.findAll(),
    ])
      .then(([elevesResult, disciplinesData, personnesData]) => {
        if (isMounted) {
          setEleves(elevesResult.data)
          setDisciplinesList(disciplinesData)
          setPersonnes(personnesData)
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
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await disciplinesService.rapports.create(buildRapportPayload(values))
      navigate('/dashboard/disciplines')
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
        <RapportForm
          title="Creer un rapport disciplinaire"
          subtitle="Decrivez l'incident ou le comportement observe pour un eleve."
          values={values}
          eleves={eleves}
          disciplinesList={disciplinesList}
          personnes={personnes}
          submitting={submitting}
          error={error}
          submitLabel="Creer le rapport"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/disciplines')}
        />
      )}
    </Card>
  )
}

export default RapportCreatePage
