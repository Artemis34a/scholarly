export const adminInitialValues = {
  nom: '',
  username: '',
  password: '',
  mobile: '',
  actif: true,
}

export function createFormValues(admin) {
  if (!admin) return adminInitialValues

  return {
    nom: admin.nom ?? '',
    username: admin.username ?? '',
    password: '',
    mobile: admin.mobile ?? '',
    actif: Boolean(admin.actif),
  }
}

export function buildAdminPayload(values) {
  const payload = {
    nom: values.nom.trim(),
    username: values.username.trim(),
    mobile: values.mobile.trim() || undefined,
    actif: Boolean(values.actif),
  }

  if (values.password && values.password.trim()) {
    payload.password = values.password.trim()
  }

  return payload
}

export function applyAdminFilters(admins, filters) {
  return admins.filter((admin) => {
    if (filters.actif !== 'all') {
      const isActive = filters.actif === 'true'
      if (Boolean(admin.actif) !== isActive) return false
    }

    return true
  })
}
