import { statutOptions } from '../../pages/disciplines/disciplines.utils'

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

function InputField({ label, name, value, onChange, type = 'text', placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function TextAreaField({ label, name, value, onChange, placeholder = '', required = false }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={4}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function RapportForm({
  title,
  subtitle,
  values,
  eleves,
  disciplinesList,
  personnes,
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
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Gestion de la discipline</p>
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
          label="Eleve concerne"
          name="idEleve"
          value={values.idEleve}
          onChange={onChange}
          required
          options={eleves.map((eleve) => ({ value: `${eleve.id}`, label: `${eleve.nom} ${eleve.prenom}` }))}
          placeholder="Choisir un eleve"
        />
        <SelectField
          label="Type de discipline"
          name="idDiscipline"
          value={values.idDiscipline}
          onChange={onChange}
          required
          options={disciplinesList.map((discipline) => ({ value: `${discipline.id}`, label: discipline.libelle }))}
          placeholder="Choisir un type"
        />
        <SelectField
          label="Auteur du rapport"
          name="idAuteur"
          value={values.idAuteur}
          onChange={onChange}
          required
          options={personnes.map((personne) => ({ value: `${personne.id}`, label: `${personne.nom} ${personne.prenom}` }))}
          placeholder="Choisir un auteur"
        />
        <InputField
          label="Date et heure"
          name="dateRapport"
          type="datetime-local"
          value={values.dateRapport}
          onChange={onChange}
        />
        <SelectField
          label="Statut"
          name="statut"
          value={values.statut}
          onChange={onChange}
          required
          options={statutOptions}
        />
        <InputField
          label="Temoins"
          name="temoins"
          value={values.temoins}
          onChange={onChange}
          placeholder="Ex: Jean, Marie"
        />
        <InputField
          label="Sanction appliquee"
          name="sanctionAppliquee"
          value={values.sanctionAppliquee}
          onChange={onChange}
          placeholder="Ex: Retenue le mercredi"
        />
        <TextAreaField
          label="Description"
          name="description"
          value={values.description}
          onChange={onChange}
          required
          placeholder="Decrivez les faits en detail"
        />
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

export default RapportForm
