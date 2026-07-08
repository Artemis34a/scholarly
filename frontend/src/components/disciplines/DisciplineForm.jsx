import { graviteOptions } from '../../pages/disciplines/disciplines.utils'

function InputField({ label, name, value, onChange, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function SelectField({ label, name, value, onChange, options }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

function DisciplineForm({ values, submitting, error, isEditing, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <InputField label="Libelle" name="libelle" value={values.libelle} onChange={onChange} placeholder="Ex: Retard repete" />
        <InputField label="Description" name="description" value={values.description} onChange={onChange} placeholder="Optionnelle" />
        <SelectField
          label="Nature"
          name="estFaute"
          value={values.estFaute ? 'true' : 'false'}
          onChange={(event) => onChange({ target: { name: 'estFaute', type: 'checkbox', checked: event.target.value === 'true' } })}
          options={[{ value: 'true', label: 'Faute' }, { value: 'false', label: 'Comportement positif' }]}
        />
        <SelectField label="Gravite" name="gravite" value={values.gravite} onChange={onChange} options={graviteOptions} />
        <InputField label="Type de sanction" name="sanctionType" value={values.sanctionType} onChange={onChange} placeholder="Ex: Retenue" />
        <label className="flex items-center gap-3 self-end rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
          <input
            type="checkbox"
            name="actif"
            checked={values.actif}
            onChange={onChange}
            className="h-4 w-4 rounded border-slate-300 text-sky-600"
          />
          <span className="text-sm font-medium text-slate-700">Actif</span>
        </label>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:opacity-60"
        >
          {submitting ? 'Enregistrement...' : isEditing ? 'Enregistrer' : 'Ajouter'}
        </button>
        {isEditing && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Annuler
          </button>
        )}
      </div>
    </form>
  )
}

export default DisciplineForm
