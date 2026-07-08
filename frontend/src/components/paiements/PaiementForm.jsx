import { formatMontant, getScolariteLabel } from '../../pages/paiements/paiements.utils'
import StatutPaiementBadge from './StatutPaiementBadge'

function SelectField({ label, name, value, onChange, options, placeholder, required = false }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <select
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  )
}

function InputField({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-600">{label}</span>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-400"
      />
    </label>
  )
}

function PaiementForm({
  title,
  subtitle,
  values,
  scolarites,
  tranches,
  modes,
  soldeInfo,
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
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-600">Gestion des paiements</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">{title}</h2>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-500">{subtitle}</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid gap-5 md:grid-cols-2">
        <SelectField
          label="Scolarite (eleve / annee)"
          name="idScolarite"
          value={values.idScolarite}
          onChange={onChange}
          required
          options={scolarites.map((s) => ({ value: `${s.id}`, label: getScolariteLabel(s) }))}
          placeholder="Choisir une scolarite"
        />
        <SelectField
          label="Tranche"
          name="idTranche"
          value={values.idTranche}
          onChange={onChange}
          required
          options={tranches.map((t) => ({ value: `${t.id}`, label: t.libelle }))}
          placeholder="Choisir une tranche"
        />
        <SelectField
          label="Mode de paiement"
          name="idModePaiement"
          value={values.idModePaiement}
          onChange={onChange}
          required
          options={modes.map((m) => ({ value: `${m.id}`, label: m.libelle }))}
          placeholder="Choisir un mode"
        />
        <InputField label="Montant" name="montant" type="number" value={values.montant} onChange={onChange} required placeholder="Ex: 50000" />
        <InputField label="Date de paiement" name="datePaiement" type="date" value={values.datePaiement} onChange={onChange} />
        <InputField label="Reference" name="reference" value={values.reference} onChange={onChange} placeholder="Ex: VIR-2026-00458" />
        <InputField label="Numero de recu" name="recuNumero" value={values.recuNumero} onChange={onChange} placeholder="Ex: RECU-2026-0123" />
        <InputField label="Commentaire" name="commentaire" value={values.commentaire} onChange={onChange} placeholder="Optionnel" />
      </div>

      {soldeInfo && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-sky-200 bg-sky-50 px-4 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-600">Solde de la scolarite selectionnee</p>
            <p className="mt-1 text-sm text-slate-700">
              Attendu {formatMontant(soldeInfo.montantAttendu)} · Paye {formatMontant(soldeInfo.montantPaye)} · Reste{' '}
              <span className="font-semibold">{formatMontant(soldeInfo.reste)}</span>
            </p>
          </div>
          <StatutPaiementBadge statut={soldeInfo.statut} />
        </div>
      )}

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

export default PaiementForm
