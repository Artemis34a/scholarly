import { joursSemaine, groupByJour } from '../../pages/emploi-du-temps/emploiDuTemps.utils'
import { BUTTON_LIGHT } from '../buttonStyles'

function SlotCard({ slot, onEdit, onDelete }) {
  return (
    <div className="rounded-[18px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)]">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sky-600">
        {slot.heureDebut} - {slot.heureFin}
      </p>
      <p className="mt-1 text-sm font-semibold text-slate-900">{slot.cours?.libelle}</p>
      <p className="mt-1 text-xs text-slate-500">{slot.classe?.libelle}</p>
      {slot.salle && <p className="text-xs text-slate-400">{slot.salle.libelle}</p>}
      {(onEdit || onDelete) && (
        <div className="mt-2 flex gap-2">
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(slot)}
              className={BUTTON_LIGHT.primarySmall}
            >
              Modifier
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={() => onDelete(slot)}
              className="rounded-full border border-rose-200 px-2.5 py-1 text-[11px] font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              Supprimer
            </button>
          )}
        </div>
      )}
    </div>
  )
}

function WeeklyGrid({ slots, onEdit, onDelete }) {
  const grouped = groupByJour(slots)

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      {joursSemaine.map((jour) => {
        const daySlots = grouped.get(jour.value) ?? []
        return (
          <div key={jour.value} className="rounded-[24px] border border-slate-200/70 bg-slate-50/70 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{jour.label}</p>
            <div className="mt-3 space-y-3">
              {daySlots.length === 0 ? (
                <p className="text-xs text-slate-400">Aucun cours</p>
              ) : (
                daySlots.map((slot) => (
                  <SlotCard key={slot.id} slot={slot} onEdit={onEdit} onDelete={onDelete} />
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default WeeklyGrid
