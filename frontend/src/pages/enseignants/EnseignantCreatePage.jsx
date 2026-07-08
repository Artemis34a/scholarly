import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Card from '../../components/Card'
import EnseignantForm from '../../components/enseignants/EnseignantForm'
import { useAuth } from '../../context/AuthContext'
import { enseignantsService } from '../../services/enseignantsService'
import { coursService } from '../../services/coursService'
import { classesService } from '../../services/classesService'
import { buildEnseignantPayload, enseignantInitialValues } from './enseignants.utils'

function EnseignantCreatePage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchParams] = useSearchParams()
  const prefillIdCours = searchParams.get('idCours')
  const [values, setValues] = useState(
    prefillIdCours ? { ...enseignantInitialValues, idCours: prefillIdCours } : enseignantInitialValues,
  )
  const [cours, setCours] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    Promise.all([
      coursService.findAll(),
      classesService.findAll({ limit: 200 }),
    ])
      .then(([coursData, classesResult]) => {
        if (isMounted) {
          setCours(coursData)
          setClasses(classesResult.data)
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
      if (values.idClasseTitulaire) {
        const classe = classes.find((item) => `${item.id}` === values.idClasseTitulaire)
        const titulaireActuel = await classesService.getTitulaire(values.idClasseTitulaire)
        if (titulaireActuel) {
          throw new Error(
            `La classe "${classe?.libelle ?? ''}" a deja un titulaire (${titulaireActuel.personne?.nom} ${titulaireActuel.personne?.prenom}). Retirez-le d'abord depuis la fiche classe.`,
          )
        }
      }

      const created = await enseignantsService.create(
        buildEnseignantPayload(values, user?.id),
      )

      if (values.idClasseTitulaire) {
        await classesService.assignTitulaire(values.idClasseTitulaire, created.idPers)
      }

      navigate(`/dashboard/enseignants/${created.id}`)
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
        <EnseignantForm
          title="Creer un nouvel enseignant"
          subtitle="Un compte de connexion et une affectation a un cours sont crees ensemble."
          values={values}
          cours={cours}
          classes={classes}
          isCreate
          submitting={submitting}
          error={error}
          submitLabel="Creer l'enseignant"
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={() => navigate('/dashboard/enseignants')}
        />
      )}
    </Card>
  )
}

export default EnseignantCreatePage
