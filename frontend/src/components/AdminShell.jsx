import RoleShell from './RoleShell'
import { adminModules } from '../data/adminModules'

function AdminShell() {
  return (
    <RoleShell
      title="Espace Administrateur"
      subtitle="Gere tous les modules du projet depuis une interface unifiee."
      basePath="/dashboard"
      modules={adminModules}
    />
  )
}

export default AdminShell
