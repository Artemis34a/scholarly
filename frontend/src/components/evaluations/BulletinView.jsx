import { Link } from 'react-router-dom'

function BulletinView({ bulletin, showCoursLink = true }) {
  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-white/70 bg-white/85 p-6 text-center shadow-[0_18px_45px_-34px_rgba(15,23,42,0.22)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Moyenne generale</p>
        <p className="mt-3 text-4xl font-semibold text-slate-900">
          {bulletin.moyenneGenerale !== null ? `${bulletin.moyenneGenerale.toFixed(2)}/20` : 'Aucune note'}
        </p>
      </div>

      {bulletin.parCours.length === 0 ? (
        <p className="text-sm text-slate-500">Aucune note saisie.</p>
      ) : (
        <div className="overflow-hidden rounded-[26px] border border-slate-200/80">
          <div className="hidden grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr] gap-3 bg-slate-900/95 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-200 lg:grid">
            <span>Cours</span>
            <span>Coefficient</span>
            <span>Moyenne</span>
            <span>Evaluations</span>
          </div>
          <div className="divide-y divide-slate-100 bg-white/90">
            {bulletin.parCours.map((cours) => (
              <div key={cours.idCours} className="grid gap-3 px-4 py-4 text-sm text-slate-600 lg:grid-cols-[1.4fr_0.8fr_0.8fr_0.8fr]">
                {showCoursLink ? (
                  <Link to={`/dashboard/cours/${cours.idCours}`} className="font-semibold text-slate-900 hover:text-sky-600">
                    {cours.libelleCours}
                  </Link>
                ) : (
                  <span className="font-semibold text-slate-900">{cours.libelleCours}</span>
                )}
                <span>{cours.coefficientCours}</span>
                <span>{cours.moyenne !== null ? cours.moyenne.toFixed(2) : '-'}</span>
                <span>{cours.nombreEvaluations}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BulletinView
