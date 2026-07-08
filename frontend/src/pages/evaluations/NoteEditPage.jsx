import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EvaluationForm from '../../components/evaluations/EvaluationForm'
import { evaluationsService } from '../../services/evaluationsService'
import { elevesService } from '../../services/elevesService'
import { buildEvaluationPayload, createEvaluationFormValues } from './evaluations.utils'

function NoteEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [epreuves, setEpreuves] = useState([])
  const [eleves, setEleves] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [evaluation, epreuvesData, elevesResult] = await Promise.all([
          evaluationsService.notes.findOne(id),
          evaluationsService.epreuves.findAll(),
          elevesService.findAll({ limit: 100 }),
        ])

        if (!isMounted) return

        setValues(createEvaluationFormValues(evaluation))
        setEpreuves(epreuvesData)
        setEleves(elevesResult.data)
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
      const updated = await evaluationsService.notes.update(id, buildEvaluationPayload(values))
      navigate(`/dashboard/evaluations/${updated.epreuve.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement de la note...</div>
      ) : (
        <EvaluationForm
          title="Modifier la note"
          subtitle="Le classement de l'epreuve est recalcule automatiquement apres la modification."
          values={values}
          epreuves={epreuves}
          eleves={eleves}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/evaluations/notes')}
        />
      )}
    </Card>
  )
}

export default NoteEditPage
