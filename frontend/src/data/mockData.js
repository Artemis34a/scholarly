export const teacherAccount = {
  role: 'Enseignant',
  email: 'teacher@brightpath.edu',
  name: 'Mr. Mensah',
  subject: 'Departement de mathematiques',
}

export const teacherOverview = {
  classesCount: 4,
  studentsCount: 128,
  homeworkCount: 36,
  averageGrade: '86%',
}

export const teacherSummaryCards = [
  {
    title: 'Nombre de classes',
    value: `${teacherOverview.classesCount}`,
    detail: 'Actives ce trimestre',
    accent: 'from-sky-500 to-cyan-400',
  },
  {
    title: "Nombre d'eleves",
    value: `${teacherOverview.studentsCount}`,
    detail: 'Toutes sections confondues',
    accent: 'from-emerald-500 to-teal-400',
  },
  {
    title: 'Nombre de devoirs',
    value: `${teacherOverview.homeworkCount}`,
    detail: 'Corrections en attente cette semaine',
    accent: 'from-amber-500 to-orange-400',
  },
  {
    title: 'Moyenne generale',
    value: teacherOverview.averageGrade,
    detail: 'Performance actuelle des classes',
    accent: 'from-violet-500 to-fuchsia-400',
  },
]

export const classList = [
  {
    id: 1,
    name: 'Classe de 3e - Section Bleue',
    subject: 'Mathematiques',
    students: 32,
    schedule: 'Lun / Mer 08:00',
  },
  {
    id: 2,
    name: 'Classe de 4e - Section Or',
    subject: 'Mathematiques',
    students: 30,
    schedule: 'Mar / Jeu 10:30',
  },
  {
    id: 3,
    name: 'Classe de 1ere - Scientifique',
    subject: 'Algebre avancee',
    students: 29,
    schedule: 'Lun / Ven 13:00',
  },
  {
    id: 4,
    name: 'Classe de 5e - Section Verte',
    subject: 'Bases des mathematiques',
    students: 37,
    schedule: 'Mer / Jeu 14:30',
  },
]

export const students = [
  {
    id: 1,
    name: 'Lina Neba',
    className: 'Classe de 3e - Section Bleue',
    averageGrade: '92%',
    status: 'Excellent',
  },
  {
    id: 2,
    name: 'David Tabi',
    className: 'Classe de 4e - Section Or',
    averageGrade: '74%',
    status: 'Suivi requis',
  },
  {
    id: 3,
    name: 'Ruth Asaba',
    className: 'Classe de 1ere - Scientifique',
    averageGrade: '95%',
    status: 'Excellent',
  },
  {
    id: 4,
    name: 'Kelvin Fomum',
    className: 'Classe de 5e - Section Verte',
    averageGrade: '81%',
    status: 'En progression',
  },
  {
    id: 5,
    name: 'Maya Tchinda',
    className: 'Classe de 3e - Section Bleue',
    averageGrade: '87%',
    status: 'Excellent',
  },
]
