import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import EpreuveForm from '../../components/evaluations/EpreuveForm'
import { useAuth } from '../../context/AuthContext'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { buildEpreuvePayload, epreuveInitialValues } from '../evaluations/evaluations.utils'
import { getMesCours } from './teacher.utils'

function TeacherEpreuveCreatePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [values, setValues] = useState(epreuveInitialValues)
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    coursService.findAll()
      .then((coursData) => {
        if (isMounted) {
          setCoursList(coursData)
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

  const mesCours = useMemo(() => getMesCours(coursList, user.id), [coursList, user.id])

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const created = await evaluationsService.epreuves.create(buildEpreuvePayload(values))
      navigate(`/teacher/evaluations/${created.id}`)
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
        <EpreuveForm
          title="Creer une nouvelle epreuve"
          subtitle="Uniquement pour les cours que vous enseignez."
          values={values}
          cours={mesCours}
          submitting={submitting}
          error={error}
          submitLabel="Creer l'epreuve"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/teacher/evaluations')}
        />
      )}
    </Card>
  )
}

export default TeacherEpreuveCreatePage
