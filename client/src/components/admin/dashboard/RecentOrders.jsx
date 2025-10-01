const RecentOrders = () => (
  <section className="flex-1 rounded-2xl border border-emerald-100 bg-white shadow-xl">
    <header className="flex items-center justify-between border-b border-emerald-100 bg-emerald-600/95 px-6 py-4 text-white">
      <div>
        <h3 className="text-lg font-semibold">Recent Orders</h3>
        <p className="text-sm text-emerald-100/80">Latest orders awaiting action</p>
      </div>
      <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em]">
        Live
      </span>
    </header>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-emerald-50 text-left text-sm text-slate-700">
        <thead className="bg-emerald-50/90 text-xs font-semibold uppercase tracking-wide text-emerald-700">
          <tr>
            <th className="px-6 py-3">Order ID</th>
            <th className="px-6 py-3">Customer</th>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50">
          <tr>
            <td className="px-6 py-4 font-semibold text-emerald-700">#1001</td>
            <td className="px-6 py-4">Emily Carter</td>
            <td className="px-6 py-4">2023-11-15</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Shipped
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-emerald-700">#1002</td>
            <td className="px-6 py-4">David Lee</td>
            <td className="px-6 py-4">2023-11-14</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                Processing
              </span>
            </td>
          </tr>
          <tr>
            <td className="px-6 py-4 font-semibold text-emerald-700">#1003</td>
            <td className="px-6 py-4">Olivia Brown</td>
            <td className="px-6 py-4">2023-11-13</td>
            <td className="px-6 py-4">
              <span className="inline-flex items-center rounded-full bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700">
                Completed
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
);

export default RecentOrders;
