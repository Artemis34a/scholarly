import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Card from '../../components/Card'
import EleveForm from '../../components/eleves/EleveForm'
import { useAuth } from '../../context/AuthContext'
import { elevesService } from '../../services/elevesService'
import { classesService } from '../../services/classesService'
import { frequenteService } from '../../services/frequenteService'
import { getPrimarySalle } from '../classes/classes.utils'
import { buildElevePayload, eleveInitialValues } from './eleves.utils'

function EleveCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [values, setValues] = useState(eleveInitialValues)
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    classesService.findAll({ limit: 200 })
      .then((classesResult) => {
        if (isMounted) {
          setClasses(classesResult.data.filter((classe) => getPrimarySalle(classe)))
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message)
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [])

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
      const created = await elevesService.create(
        buildElevePayload(values, user?.id),
      )

      const classe = classes.find((item) => `${item.id}` === values.idClasse)
      const salle = getPrimarySalle(classe)
      if (salle) {
        await frequenteService.create({ idSalle: salle.id, idEleve: created.id })
      }

      navigate(`/dashboard/eleves/${created.id}`)
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
        <EleveForm
          title="Inscrire un nouvel eleve"
          subtitle="Saisissez les informations essentielles. L'eleve sera automatiquement inscrit dans la classe choisie."
          values={values}
          classes={classes}
          isCreate
          submitting={submitting}
          error={error}
          submitLabel="Creer le dossier"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/eleves')}
        />
      )}
    </Card>
  )
}

export default EleveCreatePage
