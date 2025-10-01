const sampleUsers = [
  { id: 1, name: "Sarah Chen", role: "Admin", lastActive: "5 minutes ago" },
  { id: 2, name: "James Wilson", role: "Manager", lastActive: "30 minutes ago" },
  { id: 3, name: "Ava Patel", role: "Support", lastActive: "1 hour ago" },
];

const Users = () => (
  <section className="space-y-7 text-slate-800">
    <header className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Admin Users</h2>
      <p className="text-base text-slate-500">Manage who has access to the admin console.</p>
    </header>
    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-2xl">
      <table className="min-w-full divide-y divide-emerald-50">
        <thead className="bg-emerald-600/95 text-left text-xs font-semibold uppercase tracking-wide text-white">
          <tr>
            <th className="px-6 py-4">Name</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Last Active</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-emerald-50 text-sm">
          {sampleUsers.map((user) => (
            <tr key={user.id} className="hover:bg-emerald-50/60">
              <td className="px-6 py-4 font-semibold text-emerald-700">{user.name}</td>
              <td className="px-6 py-4 text-slate-600">{user.role}</td>
              <td className="px-6 py-4 text-slate-500">{user.lastActive}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </section>
);

export default Users;
