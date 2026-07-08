function InputField({ label, name, value, onChange, required = false, type = 'text', placeholder = '', step }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        step={step}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

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
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  )
}

function TextAreaField({ label, name, value, onChange, placeholder = '' }) {
  return (
    <label className="block md:col-span-2">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function EpreuveForm({
  title,
  subtitle,
  values,
  natures,
  cours,
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
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Gestion des evaluations</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <InputField
          label="Libelle de l'epreuve"
          name="libelle"
          value={values.libelle}
          onChange={onChange}
          required
          placeholder="Ex: Composition trimestrielle"
        />
        <SelectField
          label="Type d'epreuve"
          name="idNatureEpreuve"
          value={values.idNatureEpreuve}
          onChange={onChange}
          required
          options={natures.map((nature) => ({ value: `${nature.id}`, label: nature.libelle }))}
          placeholder="Choisir un type"
        />
        <SelectField
          label="Cours (optionnel)"
          name="idCours"
          value={values.idCours}
          onChange={onChange}
          options={cours.map((item) => ({ value: `${item.id}`, label: item.libelle }))}
          placeholder="Aucun cours specifique"
        />
        <InputField
          label="Date et heure"
          name="dateEpreuve"
          type="datetime-local"
          value={values.dateEpreuve}
          onChange={onChange}
          required
        />
        <InputField
          label="Duree (minutes)"
          name="duree"
          type="number"
          value={values.duree}
          onChange={onChange}
          placeholder="Ex: 60"
        />
        <InputField
          label="Coefficient"
          name="coefficient"
          type="number"
          step="0.5"
          value={values.coefficient}
          onChange={onChange}
          required
        />
        <InputField
          label="Note maximale"
          name="noteMax"
          type="number"
          step="0.5"
          value={values.noteMax}
          onChange={onChange}
          required
        />
        <TextAreaField
          label="Description"
          name="description"
          value={values.description}
          onChange={onChange}
          placeholder="Contenu ou consignes de l'epreuve"
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
        <span className="text-sm font-medium text-slate-700">Marquer cette epreuve comme active</span>
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

export default EpreuveForm
