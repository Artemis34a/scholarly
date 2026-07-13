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

function AdminForm({
  title,
  subtitle,
  values,
  isCreate,
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
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">
          Gestion des administrateurs
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
          label="Nom complet"
          name="nom"
          value={values.nom}
          onChange={onChange}
          required
          placeholder="Ex: Jean Mballa"
        />
        <InputField
          label="Identifiant de connexion"
          name="username"
          value={values.username}
          onChange={onChange}
          required
          placeholder="Ex: jean.mballa"
        />
        <InputField
          label={isCreate ? 'Mot de passe' : 'Nouveau mot de passe'}
          name="password"
          type="password"
          value={values.password}
          onChange={onChange}
          required={isCreate}
          placeholder={isCreate ? 'Minimum 6 caracteres' : ''}
          hint={isCreate ? '' : 'Laisser vide pour conserver le mot de passe actuel.'}
        />
        <InputField
          label="Telephone mobile"
          name="mobile"
          value={values.mobile}
          onChange={onChange}
          placeholder="Ex: 699010203"
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
        <span className="text-sm font-medium text-slate-700">
          Marquer ce compte comme actif
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

export default AdminForm
