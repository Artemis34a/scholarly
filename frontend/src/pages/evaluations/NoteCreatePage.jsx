import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import EvaluationForm from '../../components/evaluations/EvaluationForm'
import { evaluationsService } from '../../services/evaluationsService'
import { elevesService } from '../../services/elevesService'
import { buildEvaluationPayload, evaluationInitialValues } from './evaluations.utils'

function NoteCreatePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(evaluationInitialValues)
  const [epreuves, setEpreuves] = useState([])
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      evaluationsService.epreuves.findAll(),
      elevesService.findAll({ limit: 100 }),
    ])
      .then(([epreuvesData, elevesResult]) => {
        if (isMounted) {
          setEpreuves(epreuvesData)
          setEleves(elevesResult.data)
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
      const created = await evaluationsService.notes.create(buildEvaluationPayload(values))
      navigate(`/dashboard/evaluations/${created.epreuve.id}`)
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
        <EvaluationForm
          title="Saisir une nouvelle note"
          subtitle="Le classement de l'epreuve est recalcule automatiquement apres la saisie."
          values={values}
          epreuves={epreuves}
          eleves={eleves}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer la note"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/evaluations/notes')}
        />
      )}
    </Card>
  )
}

export default NoteCreatePage
