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

function TrancheForm({ values, submitting, error, isEditing, onChange, onSubmit, onCancel }) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <InputField label="Libelle" name="libelle" value={values.libelle} onChange={onChange} placeholder="Ex: Tranche 1" />
        <InputField label="Description" name="description" value={values.description} onChange={onChange} placeholder="Optionnelle" />
        <InputField label="Montant" name="montant" type="number" value={values.montant} onChange={onChange} placeholder="Ex: 50000" />
        <InputField label="Echeance" name="echeance" type="date" value={values.echeance} onChange={onChange} />
        <InputField label="Ordre" name="ordre" type="number" value={values.ordre} onChange={onChange} />
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

export default TrancheForm
