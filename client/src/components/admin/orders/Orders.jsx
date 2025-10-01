const sampleOrders = [
  { id: "#1001", customer: "Emily Carter", date: "2023-11-15", status: "Shipped" },
  { id: "#1002", customer: "David Lee", date: "2023-11-14", status: "Processing" },
  { id: "#1003", customer: "Olivia Brown", date: "2023-11-13", status: "Completed" },
];

const Orders = () => (
  <section className="space-y-7 text-slate-800">
    <header className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Orders</h2>
      <p className="text-base text-slate-500">Track and manage recent customer orders with live status updates.</p>
    </header>
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
      <table className="min-w-full divide-y divide-emerald-50">
        <thead className="bg-emerald-600/95 text-left text-xs font-semibold uppercase tracking-wide text-white">
          <tr>
            <th className="px-6 py-4">Order ID</th>
            <th className="px-6 py-4">Customer</th>
            <th className="px-6 py-4">Date</th>
            <th className="px-6 py-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50 text-sm">
          {sampleOrders.map((order) => (
            <tr key={order.id} className="hover:bg-emerald-50/60">
              <td className="px-6 py-4 font-semibold text-emerald-700">{order.id}</td>
              <td className="px-6 py-4">{order.customer}</td>
              <td className="px-6 py-4 text-slate-500">{order.date}</td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  {order.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default Orders;
