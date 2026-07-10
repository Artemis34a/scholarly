import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EnseignantForm from '../../components/enseignants/EnseignantForm'
import { useAuth } from '../../context/AuthContext'
import { enseignantsService } from '../../services/enseignantsService'
import { buildEnseignantPayload, createFormValues } from './enseignants.utils'

function EnseignantEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    enseignantsService.findOne(id)
      .then((enseignant) => {
        if (isMounted) setValues(createFormValues(enseignant))
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
      await enseignantsService.update(
        id,
        buildEnseignantPayload(values, user?.id, false),
      )

      navigate(`/dashboard/enseignants/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement de l'enseignant...</div>
      ) : (
        <EnseignantForm
          title="Modifier l'enseignant"
          subtitle="Mettez a jour les informations sans quitter l'espace administrateur."
          values={values}
          isCreate={false}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/enseignants/${id}`)}
        />
      )}
    </Card>
  )
}

export default EnseignantEditPage
