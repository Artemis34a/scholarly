import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import ClasseForm from '../../components/classes/ClasseForm'
import { useAuth } from '../../context/AuthContext'
import { classesService } from '../../services/classesService'
import { cyclesService } from '../../services/cyclesService'
import { buildClassePayload, createFormValues } from './classes.utils'

function ClasseEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(null)
  const [cycles, setCycles] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [classe, cyclesData] = await Promise.all([
          classesService.findOne(id),
          cyclesService.findAll(),
        ])

        if (!isMounted) return

        setValues(createFormValues(classe))
        setCycles(cyclesData)
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
    const { name, value } = event.target
    setValues((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await classesService.update(
        id,
        buildClassePayload(values, user?.id),
      )

      navigate(`/dashboard/classes/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement de la classe...</div>
      ) : (
        <ClasseForm
          title="Modifier la classe"
          subtitle="Mettez a jour le libelle et le cycle sans quitter l'espace administrateur."
          values={values}
          cycles={cycles}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/classes/${id}`)}
        />
      )}
    </Card>
  )
}

export default ClasseEditPage
