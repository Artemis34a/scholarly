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

function EnseignantFilters({ filters, cours, onChange, onReset, onSearchChange }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.4fr_repeat(2,minmax(0,1fr))]">
      <label className="block">
        <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
          Recherche
        </span>
        <input
          type="search"
          value={filters.localSearch}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Nom, prenom, identifiant, cours..."
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
        label="Cours"
        value={filters.idCours}
        onChange={(event) => onChange('idCours', event.target.value)}
      >
        <option value="all">Tous</option>
        {cours.map((item) => (
          <option key={item.id} value={item.id}>
            {item.libelle}
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

export default EnseignantFilters
