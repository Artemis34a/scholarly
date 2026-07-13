import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import EnseignantForm from '../../components/enseignants/EnseignantForm'
import { useAuth } from '../../context/AuthContext'
import { enseignantsService } from '../../services/enseignantsService'
import { coursService } from '../../services/coursService'
import { buildEnseignantPayload, enseignantInitialValues, getClasseCoursOptions } from './enseignants.utils'

function EnseignantCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(enseignantInitialValues)
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    coursService.findAll()
      .then((coursData) => {
        if (isMounted) {
          setCours(coursData)
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

  const classeCoursOptions = useMemo(() => getClasseCoursOptions(cours), [cours])

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
      const created = await enseignantsService.create(
        buildEnseignantPayload(values, user?.id, true),
      )

      navigate(`/dashboard/enseignants/${created.id}`)
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
        <EnseignantForm
          title="Creer un nouvel enseignant"
          subtitle="Un compte de connexion et une affectation cours/classe initiale sont crees ensemble."
          values={values}
          classeCoursOptions={classeCoursOptions}
          isCreate
          submitting={submitting}
          error={error}
          submitLabel="Creer l'enseignant"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/enseignants')}
        />
      )}
    </Card>
  )
}

export default EnseignantCreatePage
