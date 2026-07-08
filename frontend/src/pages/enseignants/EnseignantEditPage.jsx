import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EnseignantForm from '../../components/enseignants/EnseignantForm'
import { useAuth } from '../../context/AuthContext'
import { enseignantsService } from '../../services/enseignantsService'
import { coursService } from '../../services/coursService'
import { buildEnseignantPayload, createFormValues } from './enseignants.utils'

function EnseignantEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(null)
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [enseignant, coursData] = await Promise.all([
          enseignantsService.findOne(id),
          coursService.findAll(),
        ])

        if (!isMounted) return

        setValues(createFormValues(enseignant))
        setCours(coursData)
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
      await enseignantsService.update(
        id,
        buildEnseignantPayload(values, user?.id),
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
          subtitle="Mettez a jour les informations et l'affectation sans quitter l'espace administrateur."
          values={values}
          cours={cours}
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
