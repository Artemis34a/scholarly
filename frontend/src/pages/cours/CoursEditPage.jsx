import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import CoursForm from '../../components/cours/CoursForm'
import { useAuth } from '../../context/AuthContext'
import { coursService } from '../../services/coursService'
import { classesService } from '../../services/classesService'
import { buildCoursPayload, createFormValues } from './cours.utils'

function CoursEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(null)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [cours, classesResult] = await Promise.all([
          coursService.findOne(id),
          classesService.findAll({ limit: 100 }),
        ])

        if (!isMounted) return

        setValues(createFormValues(cours))
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
      await coursService.update(
        id,
        buildCoursPayload(values, user?.id),
      )

      navigate(`/dashboard/cours/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du cours...</div>
      ) : (
        <CoursForm
          title="Modifier le cours"
          subtitle="Mettez a jour le cours sans quitter l'espace administrateur."
          values={values}
          classes={classes}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/cours/${id}`)}
        />
      )}
    </Card>
  )
}

export default CoursEditPage
