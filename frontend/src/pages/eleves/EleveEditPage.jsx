import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Card from '../../components/Card'
import EleveForm from '../../components/eleves/EleveForm'
import { useAuth } from '../../context/AuthContext'
import { elevesService } from '../../services/elevesService'
import { buildElevePayload, createFormValues, getEleveClasseLabel, getEleveCycleLabel } from './eleves.utils'

function EleveEditPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [eleve, setEleve] = useState(null)
  const [values, setValues] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const eleveData = await elevesService.findOne(id)

        if (!isMounted) return

        setEleve(eleveData)
        setValues(createFormValues(eleveData))
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
    <div className="space-y-6">
      {!loading && eleve && (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
          Classe actuelle : <span className="font-semibold text-slate-800">{getEleveClasseLabel(eleve)}</span>
          {' · '}Cycle : <span className="font-semibold text-slate-800">{getEleveCycleLabel(eleve)}</span>
          {' — '}la classe se change depuis la fiche de la classe, dans « Gestion des classes ».
        </div>
      )}
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
    </div>
  )
}

export default EleveEditPage
