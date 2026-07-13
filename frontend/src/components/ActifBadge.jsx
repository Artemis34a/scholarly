function ActifBadge({ actif, activeLabel = 'Actif', inactiveLabel = 'Inactif' }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
        actif
          ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
          : 'bg-rose-50 text-rose-700 ring-1 ring-rose-100'
      }`}
    >
      {actif ? activeLabel : inactiveLabel}
    </span>
  )
}

export default ActifBadge
