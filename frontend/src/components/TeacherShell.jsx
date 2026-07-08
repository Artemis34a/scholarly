import RoleShell from './RoleShell'
import { teacherModules } from '../data/teacherModules'

function TeacherShell() {
  return (
    <RoleShell
      title="Espace Enseignant"
      subtitle="Vos classes, élèves et activités pédagogiques en un seul endroit."
      basePath="/teacher"
      modules={teacherModules}
    />
  )
}

export default TeacherShell
