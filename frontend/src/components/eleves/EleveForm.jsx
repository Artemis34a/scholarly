import { langueOptions, sexeOptions } from '../../pages/eleves/eleves.utils'

function InputField({
  label,
  name,
  value,
  onChange,
  required = false,
  type = 'text',
  placeholder = '',
  hint = '',
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
      {hint && <span className="mt-1.5 block text-xs text-slate-400">{hint}</span>}
    </label>
  )
}

function SelectField({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
  required = false,
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">
        {label}
      </span>
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

function EleveForm({
  title,
  subtitle,
  values,
  classes,
  isCreate = true,
  submitting,
  error,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}) {
  const selectedClasse = classes?.find((classe) => `${classe.id}` === values.idClasse)

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Gestion des eleves
        </p>
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
          label="Nom"
          name="nom"
          value={values.nom}
          onChange={onChange}
          required
          placeholder="Ex: Njoya"
        />
        <InputField
          label="Prenom"
          name="prenom"
          value={values.prenom}
          onChange={onChange}
          required
          placeholder="Ex: Amina"
        />
        <InputField
          label="Date de naissance"
          name="dateNaissance"
          type="date"
          value={values.dateNaissance}
          onChange={onChange}
          required
        />
        <InputField
          label="Lieu de naissance"
          name="lieuNaissance"
          value={values.lieuNaissance}
          onChange={onChange}
          required
          placeholder="Ex: Yaounde"
        />
        <SelectField
          label="Sexe"
          name="sexe"
          value={values.sexe}
          onChange={onChange}
          options={sexeOptions}
        />
        <SelectField
          label="Langue"
          name="langue"
          value={values.langue}
          onChange={onChange}
          options={langueOptions.map((option) => ({ value: option, label: option }))}
        />
        <InputField
          label="Identifiant de connexion"
          name="username"
          value={values.username}
          onChange={onChange}
          required
          placeholder="Ex: paul.njoya"
        />
        <InputField
          label={isCreate ? 'Mot de passe' : 'Nouveau mot de passe'}
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          required={isCreate}
          placeholder={isCreate ? 'Minimum 4 caracteres' : ''}
          hint={isCreate ? '' : 'Laisser vide pour conserver le mot de passe actuel.'}
        />
        {classes && (
          <SelectField
            label="Classe"
            name="idClasse"
            value={values.idClasse}
            onChange={onChange}
            required
            options={classes.map((classe) => ({ value: `${classe.id}`, label: classe.libelle }))}
            placeholder="Choisir une classe"
          />
        )}
        {classes && (
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">Cycle</span>
            <div className="flex h-[50px] items-center rounded-2xl border border-slate-200 bg-slate-100 px-4 text-slate-700">
              {selectedClasse
                ? selectedClasse.cycle?.libelle
                : 'Determine automatiquement par la classe choisie'}
            </div>
          </label>
        )}
      </div>

      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
        <input
          type="checkbox"
          name="actif"
          checked={values.actif}
          onChange={onChange}
          className="h-4 w-4 rounded border-slate-300 text-sky-600"
        />
        <span className="text-sm font-medium text-slate-700">
          Marquer cet eleve comme actif
        </span>
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

export default EleveForm
