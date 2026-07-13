import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import AdminForm from '../../components/admins/AdminForm'
import { adminsService } from '../../services/adminsService'
import { buildAdminPayload, createFormValues } from './admins.utils'

function AdminEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    adminsService.findOne(id)
      .then((admin) => {
        if (isMounted) setValues(createFormValues(admin))
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
      await adminsService.update(id, buildAdminPayload(values))
      navigate('/dashboard/admins')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du compte...</div>
      ) : (
        <AdminForm
          title="Modifier l'administrateur"
          subtitle="Modifiez le login ou definissez un nouveau mot de passe pour ce compte."
          values={values}
          isCreate={false}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/admins')}
        />
      )}
    </Card>
  )
}

export default AdminEditPage
