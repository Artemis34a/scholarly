import { joursSemaine } from '../../pages/emploi-du-temps/emploiDuTemps.utils'

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
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Emploi du temps</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
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
        <InputField label="Heure de debut" name="heureDebut" type="time" value={values.heureDebut} onChange={onChange} required />
        <InputField label="Heure de fin" name="heureFin" type="time" value={values.heureFin} onChange={onChange} required />
        <SelectField
          label="Cours"
          name="idCours"
          value={values.idCours}
          onChange={onChange}
          required
          options={cours.map((item) => ({ value: `${item.id}`, label: item.libelle }))}
          placeholder="Choisir un cours"
        />
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
