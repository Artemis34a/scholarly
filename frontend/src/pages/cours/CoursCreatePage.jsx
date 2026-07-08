import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import CoursForm from '../../components/cours/CoursForm'
import { useAuth } from '../../context/AuthContext'
import { coursService } from '../../services/coursService'
import { classesService } from '../../services/classesService'
import { buildCoursPayload, coursInitialValues } from './cours.utils'

function CoursCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(coursInitialValues)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    classesService.findAll({ limit: 100 })
      .then((result) => {
        if (isMounted) setClasses(result.data)
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
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      const created = await coursService.create(
        buildCoursPayload(values, user?.id),
      )

      navigate(`/dashboard/cours/${created.id}`)
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
        <CoursForm
          title="Creer un nouveau cours"
          subtitle="Rattachez le cours a une classe et definissez son coefficient."
          values={values}
          classes={classes}
          submitting={submitting}
          error={error}
          submitLabel="Creer le cours"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/cours')}
        />
      )}
    </Card>
  )
}

export default CoursCreatePage
