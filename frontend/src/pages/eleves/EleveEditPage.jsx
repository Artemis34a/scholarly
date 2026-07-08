import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EleveForm from '../../components/eleves/EleveForm'
import { useAuth } from '../../context/AuthContext'
import { elevesService } from '../../services/elevesService'
import { buildElevePayload, createFormValues } from './eleves.utils'

function EleveEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const eleve = await elevesService.findOne(id)

        if (!isMounted) return

        setValues(createFormValues(eleve))
      } catch (err) {
        if (isMounted) {
          setError(err.message)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
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
      await elevesService.update(
        id,
        buildElevePayload(values, user?.id),
      )

      navigate(`/dashboard/eleves/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du dossier...</div>
      ) : (
        <EleveForm
          title="Modifier le dossier eleve"
          subtitle="Mettez a jour les informations de l eleve sans quitter l espace administrateur."
          values={values}
          isCreate={false}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/eleves/${id}`)}
        />
      )}
    </Card>
  )
}

export default EleveEditPage
