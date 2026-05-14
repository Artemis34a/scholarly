import Card from '../components/Card'
import ClassList from '../components/ClassList'
import Header from '../components/Header'
import StudentList from '../components/StudentList'
import SummaryCard from '../components/SummaryCard'
import {
  classList,
  students,
  teacherAccount,
  teacherSummaryCards,
} from '../data/mockData'

function Dashboard() {
  return (
    <div className="min-h-screen px-4 py-5 md:px-8 md:py-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:gap-8">
        <Header role={teacherAccount.role} email={teacherAccount.email} />

        <main className="grid gap-6 md:gap-7">
          <Card className="overflow-hidden border-transparent bg-slate-900 p-1 text-white shadow-[0_36px_110px_-46px_rgba(15,23,42,0.78)] ring-0">
            <div className="rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.34),_transparent_28%),linear-gradient(135deg,_rgba(15,23,42,1),_rgba(30,41,59,0.95))] p-6 md:p-8 lg:p-10">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-sky-300">
                Tableau de bord enseignant
              </p>
              <div className="mt-4 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <h1 className="max-w-3xl text-3xl font-semibold leading-tight md:text-5xl">
                    Gardez les classes, les devoirs et les performances eleves dans une seule vue.
                  </h1>
                  <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 md:text-base">
                    Suivez les sections actives, verifiez la charge des devoirs et
                    reperez les eleves qui ont besoin d'un accompagnement supplementaire.
                  </p>
                </div>

                <div className="rounded-[28px] border border-white/10 bg-white/10 px-5 py-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur md:min-w-72">
                  <p className="text-sm text-slate-300">{teacherAccount.subject}</p>
                  <p className="mt-2 text-xl font-semibold">{teacherAccount.name}</p>
                </div>
              </div>
            </div>
          </Card>

          <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {teacherSummaryCards.map((item) => (
              <SummaryCard key={item.title} {...item} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.92fr_1.08fr]">
            <Card title="Liste des classes" subtitle="Emploi du temps et effectifs des classes">
              <ClassList classes={classList} />
            </Card>

            <Card
              title="Liste des eleves avec notes"
              subtitle="Situation academique recente dans vos classes"
            >
              <StudentList students={students} />
            </Card>
          </section>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
