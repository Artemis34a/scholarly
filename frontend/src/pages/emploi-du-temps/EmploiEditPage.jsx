import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EmploiForm from '../../components/emploi-du-temps/EmploiForm'
import { emploiDuTempsService } from '../../services/emploiDuTempsService'
import { classesService } from '../../services/classesService'
import { coursService } from '../../services/coursService'
import { buildEmploiPayload, createEmploiFormValues } from './emploiDuTemps.utils'

function EmploiEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [values, setValues] = useState(null)
  const [classes, setClasses] = useState([])
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const [emploi, classesResult, coursData] = await Promise.all([
          emploiDuTempsService.findOne(id),
          classesService.findAll({ limit: 100 }),
          coursService.findAll(),
        ])

        if (!isMounted) return

        setValues(createEmploiFormValues(emploi))
        setClasses(classesResult.data)
        setCoursList(coursData)
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

  const selectedClasse = classes.find((classe) => values && `${classe.id}` === values.idClasse)
  const salles = selectedClasse?.salles ?? []
  const coursFiltres = useMemo(
    () => (values?.idClasse ? coursList.filter((cours) => `${cours.idClasse}` === values.idClasse) : coursList),
    [coursList, values],
  )

  function handleChange(event) {
    const { name, value, type, checked } = event.target
    setValues((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'idClasse' ? { idCours: '', idSalle: '' } : {}),
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await emploiDuTempsService.update(id, buildEmploiPayload(values))
      navigate('/dashboard/emplois-du-temps')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Card>
      {loading || !values ? (
        <div className="py-12 text-center text-slate-400">Chargement du creneau...</div>
      ) : (
        <EmploiForm
          title="Modifier le creneau"
          subtitle="Les conflits de classe et de salle sont revalides automatiquement."
          values={values}
          classes={classes}
          cours={coursFiltres}
          salles={salles}
          submitting={submitting}
          error={error}
          submitLabel="Enregistrer les modifications"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/emplois-du-temps')}
        />
      )}
    </Card>
  )
}

export default EmploiEditPage
