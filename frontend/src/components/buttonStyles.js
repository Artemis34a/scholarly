// Styles de boutons d'action partages, utilises sur les bandeaux superieurs
// (cartes sombres) a travers toute l'application, pour une apparence uniforme :
// couleur primaire pleine, texte contraste, effets hover/disabled coherents.
export const BUTTON_ON_DARK = {
  primary:
    'rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(14,165,233,0.9)] transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60',
  danger:
    'rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_-24px_rgba(244,63,94,0.9)] transition hover:bg-rose-400 disabled:cursor-not-allowed disabled:opacity-60',
}

// Boutons d'action (pilules) utilises sur fond clair : lignes de tableau, cartes,
// grilles. Meme intention que ci-dessus (couleur primaire pleine, texte blanc)
// mais tailles plus compactes adaptees a ces contextes.
export const BUTTON_LIGHT = {
  primary:
    'rounded-full bg-sky-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60',
  primarySmall:
    'rounded-full bg-sky-600 px-2.5 py-1 text-[11px] font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60',
  // Bouton principal pleine largeur pour les formulaires sur fond clair (ex: connexion).
  submit:
    'w-full rounded-2xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:opacity-60',
}
