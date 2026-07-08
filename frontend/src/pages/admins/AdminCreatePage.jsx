import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import AdminForm from '../../components/admins/AdminForm'
import { adminsService } from '../../services/adminsService'
import { buildAdminPayload, adminInitialValues } from './admins.utils'

function AdminCreatePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(adminInitialValues)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

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
      const created = await adminsService.create(buildAdminPayload(values))
      navigate(`/dashboard/admins/${created.id}/modifier`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      <AdminForm
        title="Creer un nouvel administrateur"
        subtitle="Un compte de connexion est cree immediatement avec le login et le mot de passe choisis."
        values={values}
        isCreate
        submitting={submitting}
        error={error}
        submitLabel="Creer l'administrateur"
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={() => navigate('/dashboard/admins')}
      />
    </Card>
  )
}

export default AdminCreatePage
