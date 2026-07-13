// Avatar par defaut utilise partout ou une photo de profil n'est pas renseignee
// (eleves, enseignants...), pour eviter un espace vide ou un texte d'erreur.
function DefaultAvatar({ className = 'h-48 w-full' }) {
  return (
    <svg
      viewBox="0 0 100 100"
      role="img"
      aria-label="Avatar par defaut"
      className={`${className} rounded-[22px] bg-slate-100`}
    >
      <rect width="100" height="100" fill="#e2e8f0" />
      <circle cx="50" cy="38" r="18" fill="#94a3b8" />
      <path d="M50 60c-20 0-32 12-32 26v14h64V86c0-14-12-26-32-26z" fill="#94a3b8" />
    </svg>
  )
}

export default DefaultAvatar
