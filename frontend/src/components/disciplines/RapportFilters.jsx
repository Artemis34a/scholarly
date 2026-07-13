import { statutOptions } from '../../pages/disciplines/disciplines.utils'

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</span>
      <select
        value={value}
        onChange={onChange}
        className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
      >
        {children}
      </select>
    </label>
  )
}

function RapportFilters({ filters, disciplinesList, onChange, onReset, onSearchChange }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr_1fr_auto]">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Recherche</span>
        <input
          type="search"
          value={filters.localSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Eleve, description..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
        />
      </label>

      <SelectField label="Type" value={filters.idDiscipline} onChange={(event) => onChange('idDiscipline', event.target.value)}>
        <option value="all">Tous</option>
        {disciplinesList.map((discipline) => (
          <option key={discipline.id} value={discipline.id}>{discipline.libelle}</option>
        ))}
      </SelectField>

      <SelectField label="Statut" value={filters.statut} onChange={(event) => onChange('statut', event.target.value)}>
        <option value="all">Tous</option>
        {statutOptions.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </SelectField>

      <button
        type="button"
        onClick={onReset}
        className="mt-auto rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700"
      >
        Reinitialiser
      </button>
    </div>
  )
}

export default RapportFilters
