import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EpreuveForm from '../../components/evaluations/EpreuveForm'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { buildEpreuvePayload, createEpreuveFormValues } from './evaluations.utils'

function EpreuveEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [cours, setCours] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [epreuve, coursData] = await Promise.all([
          evaluationsService.epreuves.findOne(id),
          coursService.findAll(),
        ])

        if (!isMounted) return

        setValues(createEpreuveFormValues(epreuve))
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
    setValues((current) => ({ ...current, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await evaluationsService.epreuves.update(id, buildEpreuvePayload(values))
      navigate(`/dashboard/evaluations/${id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement de l'epreuve...</div>
      ) : (
        <EpreuveForm
          title="Modifier l'epreuve"
          subtitle="Mettez a jour l'epreuve sans quitter l'espace administrateur."
          values={values}
          cours={cours}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate(`/dashboard/evaluations/${id}`)}
        />
      )}
    </Card>
  )
}

export default EpreuveEditPage
