const sampleReports = [
  { id: 1, title: "Monthly Sales Summary", summary: "Overall sales increased by 12% compared to the previous month." },
  { id: 2, title: "Inventory Insights", summary: "Five products are nearing low stock levels. Consider restocking soon." },
  { id: 3, title: "Customer Engagement", summary: "Email campaign open rates improved by 8% week-over-week." },
];

const Reports = () => (
  <section className="space-y-7 text-slate-800">
    <header className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Reports</h2>
      <p className="text-base text-slate-500">Review performance metrics and actionable insights.</p>
    </header>
    <ul className="grid gap-6 md:grid-cols-2">
      {sampleReports.map((report) => (
        <li
          key={report.id}
          className="rounded-2xl border border-emerald-100 bg-white/95 p-6 shadow-2xl ring-1 ring-emerald-50 transition hover:-translate-y-1 hover:shadow-emerald-200"
        >
          <h3 className="text-xl font-semibold text-slate-900">{report.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">{report.summary}</p>
          <button className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 transition hover:text-emerald-600">
            View full report
            <span aria-hidden>→</span>
          </button>
        </li>
      ))}
    </ul>
  </section>
);

export default Reports;
