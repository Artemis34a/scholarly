import RoleShell from './RoleShell'
import { studentModules } from '../data/studentModules'

function StudentShell() {
  return (
    <RoleShell
      title="Espace Élève"
      subtitle="Vos notes, votre emploi du temps et vos notifications."
      basePath="/student"
      modules={studentModules}
    />
  )
}

export default StudentShell
