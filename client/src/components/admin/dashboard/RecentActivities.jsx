const RecentActivities = () => (
  <aside className="w-full max-w-sm rounded-2xl border border-emerald-100 bg-white shadow-xl">
    <header className="flex items-center justify-between border-b border-emerald-100 px-6 py-4">
      <h3 className="text-lg font-semibold text-slate-900">Recent Activity</h3>
      <span className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
        Feed
      </span>
    </header>
    <div className="space-y-5 px-6 py-5 text-sm text-slate-600">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          🛒
        </span>
        <div className="flex-1">
          <p className="font-medium text-slate-800">New order #1006 was placed.</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">2 minutes ago</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-sky-100 text-sky-600">
          👤
        </span>
        <div className="flex-1">
          <p className="font-medium text-slate-800">New user registered: Alex Johnson.</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">45 minutes ago</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-600">
          ⚠️
        </span>
        <div className="flex-1">
          <p className="font-medium text-slate-800">Low stock alert for Bamboo Toothbrush.</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">2 hours ago</p>
        </div>
      </div>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          🛒
        </span>
        <div className="flex-1">
          <p className="font-medium text-slate-800">New order #1005 was placed.</p>
          <p className="text-xs uppercase tracking-wide text-slate-400">Yesterday</p>
        </div>
      </div>
    </div>
    <div className="border-t border-emerald-100 p-6">
      <button className="inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
        View all activity
      </button>
    </div>
  </aside>
);

export default RecentActivities;
