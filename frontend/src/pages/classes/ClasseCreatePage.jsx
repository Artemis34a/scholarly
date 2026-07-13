import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import ClasseForm from '../../components/classes/ClasseForm'
import { useAuth } from '../../context/AuthContext'
import { classesService } from '../../services/classesService'
import { cyclesService } from '../../services/cyclesService'
import { buildClassePayload, classeInitialValues } from './classes.utils'

function ClasseCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(classeInitialValues)
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    cyclesService.findAll()
      .then((data) => {
        if (isMounted) setCycles(data)
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
      const created = await classesService.create(
        buildClassePayload(values, user?.id),
      )

      navigate(`/dashboard/classes/${created.id}`)
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
        <ClasseForm
          title="Creer une nouvelle classe"
          subtitle="Une salle principale est creee automatiquement pour accueillir les eleves et le titulaire."
          values={values}
          cycles={cycles}
          submitting={submitting}
          error={error}
          submitLabel="Creer la classe"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/classes')}
        />
      )}
    </Card>
  )
}

export default ClasseCreatePage
