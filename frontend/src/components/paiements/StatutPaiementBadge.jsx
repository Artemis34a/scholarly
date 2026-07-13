import { getStatutColor, getStatutLabel } from '../../pages/paiements/paiements.utils'

function StatutPaiementBadge({ statut }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatutColor(statut)}`}>
      {getStatutLabel(statut)}
    </span>
  )
}

export default StatutPaiementBadge
