import { Navigate, Route, Routes } from 'react-router-dom'
import AdminShell from '../components/AdminShell'
import TeacherShell from '../components/TeacherShell'
import StudentShell from '../components/StudentShell'
import AppLayout from '../layouts/AppLayout'
import AdminDashboard from '../pages/AdminDashboard'
import TeacherDashboard from '../pages/TeacherDashboard'
import StudentDashboard from '../pages/StudentDashboard'
import EleveCreatePage from '../pages/eleves/EleveCreatePage'
import EleveDetailsPage from '../pages/eleves/EleveDetailsPage'
import EleveEditPage from '../pages/eleves/EleveEditPage'
import EleveProfilePage from '../pages/eleves/EleveProfilePage'
import ElevesPage from '../pages/eleves/ElevesPage'
import EnseignantCreatePage from '../pages/enseignants/EnseignantCreatePage'
import EnseignantDetailsPage from '../pages/enseignants/EnseignantDetailsPage'
import EnseignantEditPage from '../pages/enseignants/EnseignantEditPage'
import EnseignantProfilePage from '../pages/enseignants/EnseignantProfilePage'
import EnseignantsPage from '../pages/enseignants/EnseignantsPage'
import AdminsPage from '../pages/admins/AdminsPage'
import AdminCreatePage from '../pages/admins/AdminCreatePage'
import AdminEditPage from '../pages/admins/AdminEditPage'
import AnneesAcademiquesPage from '../pages/academics/AnneesAcademiquesPage'
import CyclesPage from '../pages/academics/CyclesPage'
import TrimestresPage from '../pages/academics/TrimestresPage'
import SessionsPage from '../pages/academics/SessionsPage'
import ClasseCreatePage from '../pages/classes/ClasseCreatePage'
import ClasseDetailsPage from '../pages/classes/ClasseDetailsPage'
import ClasseEditPage from '../pages/classes/ClasseEditPage'
import ClassesPage from '../pages/classes/ClassesPage'
import CoursCreatePage from '../pages/cours/CoursCreatePage'
import CoursDetailsPage from '../pages/cours/CoursDetailsPage'
import CoursEditPage from '../pages/cours/CoursEditPage'
import CoursPage from '../pages/cours/CoursPage'
import EpreuveCreatePage from '../pages/evaluations/EpreuveCreatePage'
import EpreuveDetailsPage from '../pages/evaluations/EpreuveDetailsPage'
import EpreuveEditPage from '../pages/evaluations/EpreuveEditPage'
import EpreuvesPage from '../pages/evaluations/EpreuvesPage'
import NotesPage from '../pages/evaluations/NotesPage'
import NoteCreatePage from '../pages/evaluations/NoteCreatePage'
import NoteEditPage from '../pages/evaluations/NoteEditPage'
import BulletinPage from '../pages/evaluations/BulletinPage'
import RapportsPage from '../pages/disciplines/RapportsPage'
import RapportCreatePage from '../pages/disciplines/RapportCreatePage'
import RapportEditPage from '../pages/disciplines/RapportEditPage'
import TypesPage from '../pages/disciplines/TypesPage'
import HistoriquePage from '../pages/disciplines/HistoriquePage'
import EmploiDuTempsPage from '../pages/emploi-du-temps/EmploiDuTempsPage'
import EmploiCreatePage from '../pages/emploi-du-temps/EmploiCreatePage'
import EmploiEditPage from '../pages/emploi-du-temps/EmploiEditPage'
import PaiementsPage from '../pages/paiements/PaiementsPage'
import PaiementCreatePage from '../pages/paiements/PaiementCreatePage'
import PaiementEditPage from '../pages/paiements/PaiementEditPage'
import PaiementDetailsPage from '../pages/paiements/PaiementDetailsPage'
import ScolaritesPage from '../pages/paiements/ScolaritesPage'
import ScolariteCreatePage from '../pages/paiements/ScolariteCreatePage'
import ScolariteEditPage from '../pages/paiements/ScolariteEditPage'
import ScolariteDetailsPage from '../pages/paiements/ScolariteDetailsPage'
import TranchesPage from '../pages/paiements/TranchesPage'
import ModesPage from '../pages/paiements/ModesPage'
import PaiementsHistoriquePage from '../pages/paiements/HistoriquePage'
import TeacherClassesPage from '../pages/teacher/TeacherClassesPage'
import TeacherClasseElevesPage from '../pages/teacher/TeacherClasseElevesPage'
import TeacherElevesPage from '../pages/teacher/TeacherElevesPage'
import TeacherEmploiPage from '../pages/teacher/TeacherEmploiPage'
import TeacherProfilPage from '../pages/teacher/TeacherProfilPage'
import TeacherEvaluationsPage from '../pages/teacher/TeacherEvaluationsPage'
import TeacherEpreuveCreatePage from '../pages/teacher/TeacherEpreuveCreatePage'
import TeacherEpreuveDetailsPage from '../pages/teacher/TeacherEpreuveDetailsPage'
import TeacherNotesPage from '../pages/teacher/TeacherNotesPage'
import TeacherStatsPage from '../pages/teacher/TeacherStatsPage'
import StudentProfilPage from '../pages/student/StudentProfilPage'
import StudentNotesPage from '../pages/student/StudentNotesPage'
import StudentBulletinPage from '../pages/student/StudentBulletinPage'
import StudentEmploiPage from '../pages/student/StudentEmploiPage'
import StudentPaiementsPage from '../pages/student/StudentPaiementsPage'
import StudentDisciplinePage from '../pages/student/StudentDisciplinePage'
import Login from '../pages/Login'
import PrivateRoute from './PrivateRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route
          element={(
            <PrivateRoute allowedRoles={['admin', 'directeur']}>
              <AdminShell />
            </PrivateRoute>
          )}
        >
          <Route path="/dashboard" element={<AdminDashboard />} />
          <Route path="/dashboard/admins" element={<AdminsPage />} />
          <Route path="/dashboard/admins/nouveau" element={<AdminCreatePage />} />
          <Route path="/dashboard/admins/:id/modifier" element={<AdminEditPage />} />
          <Route path="/dashboard/eleves" element={<ElevesPage />} />
          <Route path="/dashboard/eleves/nouveau" element={<EleveCreatePage />} />
          <Route path="/dashboard/eleves/:id" element={<EleveDetailsPage />} />
          <Route path="/dashboard/eleves/:id/profil" element={<EleveProfilePage />} />
          <Route path="/dashboard/eleves/:id/modifier" element={<EleveEditPage />} />
          <Route path="/dashboard/enseignants" element={<EnseignantsPage />} />
          <Route path="/dashboard/enseignants/nouveau" element={<EnseignantCreatePage />} />
          <Route path="/dashboard/enseignants/:id" element={<EnseignantDetailsPage />} />
          <Route path="/dashboard/enseignants/:id/profil" element={<EnseignantProfilePage />} />
          <Route path="/dashboard/enseignants/:id/modifier" element={<EnseignantEditPage />} />
          <Route path="/dashboard/classes" element={<ClassesPage />} />
          <Route path="/dashboard/classes/nouvelle" element={<ClasseCreatePage />} />
          <Route path="/dashboard/classes/:id" element={<ClasseDetailsPage />} />
          <Route path="/dashboard/classes/:id/modifier" element={<ClasseEditPage />} />
          <Route path="/dashboard/cours" element={<CoursPage />} />
          <Route path="/dashboard/cours/nouveau" element={<CoursCreatePage />} />
          <Route path="/dashboard/cours/:id" element={<CoursDetailsPage />} />
          <Route path="/dashboard/cours/:id/modifier" element={<CoursEditPage />} />
          <Route path="/dashboard/annees-academiques" element={<AnneesAcademiquesPage />} />
          <Route path="/dashboard/cycles" element={<CyclesPage />} />
          <Route path="/dashboard/trimestres" element={<TrimestresPage />} />
          <Route path="/dashboard/sessions" element={<SessionsPage />} />
          <Route path="/dashboard/evaluations" element={<EpreuvesPage />} />
          <Route path="/dashboard/evaluations/nouvelle" element={<EpreuveCreatePage />} />
          <Route path="/dashboard/evaluations/notes" element={<NotesPage />} />
          <Route path="/dashboard/evaluations/notes/nouvelle" element={<NoteCreatePage />} />
          <Route path="/dashboard/evaluations/notes/:id/modifier" element={<NoteEditPage />} />
          <Route path="/dashboard/evaluations/bulletins" element={<BulletinPage />} />
          <Route path="/dashboard/evaluations/:id" element={<EpreuveDetailsPage />} />
          <Route path="/dashboard/evaluations/:id/modifier" element={<EpreuveEditPage />} />
          <Route path="/dashboard/disciplines" element={<RapportsPage />} />
          <Route path="/dashboard/disciplines/nouveau" element={<RapportCreatePage />} />
          <Route path="/dashboard/disciplines/types" element={<TypesPage />} />
          <Route path="/dashboard/disciplines/historique" element={<HistoriquePage />} />
          <Route path="/dashboard/disciplines/:id/modifier" element={<RapportEditPage />} />
          <Route path="/dashboard/emplois-du-temps" element={<EmploiDuTempsPage />} />
          <Route path="/dashboard/emplois-du-temps/nouveau" element={<EmploiCreatePage />} />
          <Route path="/dashboard/emplois-du-temps/:id/modifier" element={<EmploiEditPage />} />
          <Route path="/dashboard/paiements" element={<PaiementsPage />} />
          <Route path="/dashboard/paiements/nouveau" element={<PaiementCreatePage />} />
          <Route path="/dashboard/paiements/scolarites" element={<ScolaritesPage />} />
          <Route path="/dashboard/paiements/scolarites/nouvelle" element={<ScolariteCreatePage />} />
          <Route path="/dashboard/paiements/scolarites/:id" element={<ScolariteDetailsPage />} />
          <Route path="/dashboard/paiements/scolarites/:id/modifier" element={<ScolariteEditPage />} />
          <Route path="/dashboard/paiements/tranches" element={<TranchesPage />} />
          <Route path="/dashboard/paiements/modes" element={<ModesPage />} />
          <Route path="/dashboard/paiements/historique" element={<PaiementsHistoriquePage />} />
          <Route path="/dashboard/paiements/:id" element={<PaiementDetailsPage />} />
          <Route path="/dashboard/paiements/:id/modifier" element={<PaiementEditPage />} />
        </Route>
        <Route
          element={(
            <PrivateRoute allowedRoles={['enseignant']}>
              <TeacherShell />
            </PrivateRoute>
          )}
        >
          <Route path="/teacher" element={<TeacherDashboard />} />
          <Route path="/teacher/classes" element={<TeacherClassesPage />} />
          <Route path="/teacher/classes/:id/eleves" element={<TeacherClasseElevesPage />} />
          <Route path="/teacher/eleves" element={<TeacherElevesPage />} />
          <Route path="/teacher/emploi-du-temps" element={<TeacherEmploiPage />} />
          <Route path="/teacher/evaluations" element={<TeacherEvaluationsPage />} />
          <Route path="/teacher/evaluations/nouvelle" element={<TeacherEpreuveCreatePage />} />
          <Route path="/teacher/evaluations/:id" element={<TeacherEpreuveDetailsPage />} />
          <Route path="/teacher/notes" element={<TeacherNotesPage />} />
          <Route path="/teacher/statistiques" element={<TeacherStatsPage />} />
          <Route path="/teacher/profil" element={<TeacherProfilPage />} />
        </Route>
        <Route
          element={(
            <PrivateRoute allowedRoles={['eleve']}>
              <StudentShell />
            </PrivateRoute>
          )}
        >
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/student/profil" element={<StudentProfilPage />} />
          <Route path="/student/notes" element={<StudentNotesPage />} />
          <Route path="/student/bulletins" element={<StudentBulletinPage />} />
          <Route path="/student/discipline" element={<StudentDisciplinePage />} />
          <Route path="/student/paiements" element={<StudentPaiementsPage />} />
          <Route path="/student/emploi-du-temps" element={<StudentEmploiPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  )
}

export default AppRoutes
