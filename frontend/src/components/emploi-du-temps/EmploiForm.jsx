import { useMemo, useState } from 'react'
import {
  joursSemaine,
  getCoursOptionsPourClasse,
  getEnseignantsPourCoursClasse,
} from '../../pages/emploi-du-temps/emploiDuTemps.utils'

function SelectField({ label, name, value, onChange, options, placeholder, required = false, disabled = false, hint = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

function InputField({ label, name, value, onChange, type = 'text', required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

// Le parcours attendu est volontairement guidé : classe -> cours (filtrés sur les
// cours reellement affectes a cette classe) -> enseignant (filtre sur ceux
// reellement affectes a ce cours dans cette classe precise), pour qu'il soit
// impossible de composer, meme dans l'interface, une combinaison incoherente
// avant meme l'envoi au serveur.
function EmploiForm({
  title,
  subtitle,
  values,
  classes,
  cours,
  salles,
  submitting,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}) {
  const [localError, setLocalError] = useState('')

  const coursOptions = useMemo(
    () => getCoursOptionsPourClasse(cours, values.idClasse),
    [cours, values.idClasse],
  )
  const enseignantOptions = useMemo(
    () => getEnseignantsPourCoursClasse(cours, values.idCours, values.idClasse),
    [cours, values.idCours, values.idClasse],
  )

  function handleSubmit(event) {
    event.preventDefault()
    setLocalError('')

    if (!values.idClasse) {
      setLocalError('Choisissez une classe.')
      return
    }
    if (!values.idCours) {
      setLocalError('Choisissez un cours parmi ceux affectés à cette classe.')
      return
    }
    if (!values.idEnseignant) {
      setLocalError('Choisissez un enseignant parmi ceux affectés à ce cours.')
      return
    }
    if (!values.heureDebut || !values.heureFin) {
      setLocalError('Renseignez les heures de début et de fin.')
      return
    }
    if (values.heureDebut >= values.heureFin) {
      setLocalError("Les horaires saisis sont invalides : l'heure de fin doit être après l'heure de début.")
      return
    }

    onSubmit(event)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Emploi du temps</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      {(localError || error) && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {localError || error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField label="Jour" name="jour" value={values.jour} onChange={onChange} required options={joursSemaine} />

        <SelectField
          label="Classe"
          name="idClasse"
          value={values.idClasse}
          onChange={onChange}
          required
          options={classes.map((classe) => ({ value: `${classe.id}`, label: classe.libelle }))}
          placeholder="Choisir une classe"
        />

        <SelectField
          label="Cours"
          name="idCours"
          value={values.idCours}
          onChange={onChange}
          required
          disabled={!values.idClasse}
          options={coursOptions.map((item) => ({ value: `${item.id}`, label: item.libelle }))}
          placeholder={values.idClasse ? 'Choisir un cours' : "Choisissez d'abord une classe"}
          hint={values.idClasse && coursOptions.length === 0 ? 'Aucun cours affecté à cette classe.' : ''}
        />

        <SelectField
          label="Enseignant"
          name="idEnseignant"
          value={values.idEnseignant}
          onChange={onChange}
          required
          disabled={!values.idCours}
          options={enseignantOptions.map((enseignant) => ({
            value: `${enseignant.id}`,
            label: `${enseignant.personne?.nom ?? ''} ${enseignant.personne?.prenom ?? ''}`.trim(),
          }))}
          placeholder={values.idCours ? 'Choisir un enseignant' : "Choisissez d'abord un cours"}
          hint={values.idCours && enseignantOptions.length === 0 ? "Aucun enseignant n'assure ce cours dans cette classe." : ''}
        />

        <InputField label="Heure de debut" name="heureDebut" type="time" value={values.heureDebut} onChange={onChange} required />
        <InputField label="Heure de fin" name="heureFin" type="time" value={values.heureFin} onChange={onChange} required />

        <SelectField
          label="Salle (optionnelle)"
          name="idSalle"
          value={values.idSalle}
          onChange={onChange}
          options={salles.map((salle) => ({ value: `${salle.id}`, label: salle.libelle }))}
          placeholder="Aucune salle specifique"
        />
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          name="actif"
          checked={values.actif}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 text-sky-600"
        />
        <span className="text-sm font-medium text-slate-700">Creneau actif</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          {submitting ? 'Enregistrement...' : submitLabel}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
        >
          Annuler
        </button>
      </div>
    </form>
  )
}

export default EmploiForm
