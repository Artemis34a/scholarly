import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EpreuveForm from '../../components/evaluations/EpreuveForm'
import { evaluationsService } from '../../services/evaluationsService'
import { coursService } from '../../services/coursService'
import { classesService } from '../../services/classesService'
import { buildEpreuvePayload, createEpreuveFormValues } from './evaluations.utils'

function EpreuveEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [cours, setCours] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [epreuve, coursData, classesResult] = await Promise.all([
          evaluationsService.epreuves.findOne(id),
          coursService.findAll(),
          classesService.findAll({ limit: 200 }),
        ])

        if (!isMounted) return

        setValues(createEpreuveFormValues(epreuve))
        setCours(coursData)
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
      ...(name === 'idClasse' && value !== current.idClasse ? { idClasseCours: '' } : {}),
    }))
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
          classes={classes}
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
