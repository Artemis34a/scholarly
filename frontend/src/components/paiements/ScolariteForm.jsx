import { statutScolariteOptions } from '../../pages/paiements/paiements.utils'

function SelectField({ label, name, value, onChange, options, placeholder, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
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

function ScolariteForm({
  title,
  subtitle,
  values,
  eleves,
  annees,
  classes,
  submitting,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Gestion des paiements</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Eleve"
          name="idEleve"
          value={values.idEleve}
          onChange={onChange}
          required
          options={eleves.map((eleve) => ({ value: `${eleve.id}`, label: `${eleve.nom} ${eleve.prenom}` }))}
          placeholder="Choisir un eleve"
        />
        <SelectField
          label="Annee academique"
          name="idAnneeAcademique"
          value={values.idAnneeAcademique}
          onChange={onChange}
          required
          options={annees.map((annee) => ({ value: `${annee.id}`, label: annee.libelle }))}
          placeholder="Choisir une annee"
        />
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
          label="Statut"
          name="statut"
          value={values.statut}
          onChange={onChange}
          required
          options={statutScolariteOptions}
        />
        <InputField label="Date d'inscription" name="dateInscription" type="date" value={values.dateInscription} onChange={onChange} />
        <InputField label="Frais d'inscription" name="fraisInscription" type="number" value={values.fraisInscription} onChange={onChange} />
        <InputField label="Frais de scolarite" name="fraisScolarite" type="number" value={values.fraisScolarite} onChange={onChange} />
        <InputField label="Reduction" name="reduction" type="number" value={values.reduction} onChange={onChange} />
        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-medium text-slate-600">Observations</span>
          <textarea
            name="observations"
            value={values.observations}
            onChange={onChange}
            rows={3}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
          />
        </label>
      </div>

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

export default ScolariteForm
