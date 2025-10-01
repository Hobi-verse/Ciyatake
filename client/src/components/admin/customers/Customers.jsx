const sampleCustomers = [
  { id: 1, name: "Emily Carter", email: "emily.carter@example.com", joined: "Jan 12, 2023" },
  { id: 2, name: "David Lee", email: "david.lee@example.com", joined: "Mar 03, 2023" },
  { id: 3, name: "Olivia Brown", email: "olivia.brown@example.com", joined: "Jul 21, 2023" },
];

const Customers = () => (
  <section className="space-y-7 text-slate-800">
    <header className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Customers</h2>
      <p className="text-base text-slate-500">View customer details and recent engagement.</p>
    </header>
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
      <table className="min-w-full divide-y divide-emerald-50">
        <thead className="bg-emerald-600/95 text-left text-xs font-semibold uppercase tracking-wide text-white">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Email</th>
            <th className="px-6 py-4">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50 text-sm">
          {sampleCustomers.map((customer) => (
            <tr key={customer.id} className="hover:bg-emerald-50/60">
              <td className="px-6 py-4 font-semibold text-emerald-700">{customer.name}</td>
              <td className="px-6 py-4 text-slate-600">{customer.email}</td>
              <td className="px-6 py-4 text-slate-500">{customer.joined}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default Customers;
