import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import EmploiForm from '../../components/emploi-du-temps/EmploiForm'
import { emploiDuTempsService } from '../../services/emploiDuTempsService'
import { classesService } from '../../services/classesService'
import { coursService } from '../../services/coursService'
import { buildEmploiPayload, emploiInitialValues } from './emploiDuTemps.utils'

function EmploiCreatePage() {
  const navigate = useNavigate()
  const [values, setValues] = useState(emploiInitialValues)
  const [classes, setClasses] = useState([])
  const [coursList, setCoursList] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      classesService.findAll({ limit: 100 }),
      coursService.findAll(),
    ])
      .then(([classesResult, coursData]) => {
        if (isMounted) {
          setClasses(classesResult.data)
          setCoursList(coursData)
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

  // La classe deja chargee (avec ses salles incluses) sert de source pour le menu
  // "salle" : pas besoin d'un service Salle dedie.
  const selectedClasse = classes.find((classe) => `${classe.id}` === values.idClasse)
  const salles = selectedClasse?.salles ?? []
  const coursFiltres = useMemo(
    () => (values.idClasse ? coursList.filter((cours) => `${cours.idClasse}` === values.idClasse) : coursList),
    [coursList, values.idClasse],
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
      await emploiDuTempsService.create(buildEmploiPayload(values))
      navigate('/dashboard/emplois-du-temps')
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
        <EmploiForm
          title="Creer un creneau"
          subtitle="Les conflits de classe et de salle sont detectes automatiquement."
          values={values}
          classes={classes}
          cours={coursFiltres}
          salles={salles}
          submitting={submitting}
          error={error}
          submitLabel="Creer le creneau"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/emplois-du-temps')}
        />
      )}
    </Card>
  )
}

export default EmploiCreatePage
