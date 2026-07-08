import { langueOptions, sexeOptions } from '../../pages/eleves/eleves.utils'

function SelectField({ label, value, onChange, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
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

function EleveFilters({
  filters,
  villes,
  onChange,
  onReset,
  onSearchChange,
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.25fr_repeat(4,minmax(0,1fr))]">
      <label className="block xl:col-span-1">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Recherche
        </span>
        <input
          type="search"
          value={filters.localSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nom, prenom, ville, langue..."
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-400"
        />
      </label>

      <SelectField
        label="Statut"
        value={filters.actif}
        onChange={(event) => onChange('actif', event.target.value)}
      >
        <option value="all">Tous</option>
        <option value="true">Actifs</option>
        <option value="false">Inactifs</option>
      </SelectField>

      <SelectField
        label="Sexe"
        value={filters.sexe}
        onChange={(event) => onChange('sexe', event.target.value)}
      >
        <option value="all">Tous</option>
        {sexeOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Langue"
        value={filters.langue}
        onChange={(event) => onChange('langue', event.target.value)}
      >
        <option value="all">Toutes</option>
        {langueOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectField>

      <SelectField
        label="Ville"
        value={filters.ville}
        onChange={(event) => onChange('ville', event.target.value)}
      >
        <option value="all">Toutes</option>
        {villes.map((ville) => (
          <option key={ville.id} value={ville.id}>
            {ville.libelle}
          </option>
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

export default EleveFilters
