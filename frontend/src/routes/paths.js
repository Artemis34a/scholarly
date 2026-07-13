const appPaths = {
  dashboard: '/dashboard',
  teacher: '/teacher',
  student: '/student',
}

// Racine de navigation par rôle : où renvoyer un utilisateur après connexion
// ou lorsqu'il tente d'accéder à l'espace d'un autre rôle.
export function homePathForRole(role) {
  if (role === 'enseignant') return appPaths.teacher
  if (role === 'eleve') return appPaths.student
  return appPaths.dashboard
}
