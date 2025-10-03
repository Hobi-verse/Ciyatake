const AdminHeader = ({ user = { name: "Ayush" } }) => (
  <header className="sticky top-0 z-40 flex h-20 items-center gap-4 border-b border-emerald-100/70 bg-white/95 px-8 text-emerald-900 shadow-lg backdrop-blur">
    <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
    <p className="hidden text-sm text-emerald-700/80 md:block">
      Manage your commerce operations with real-time insights.
    </p>
    <div className="ml-auto flex items-center gap-4">
      <div className="hidden rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700 md:block">
        Signed in as <span className="font-semibold">{user.name}</span>
      </div>
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-emerald-600/90 text-lg font-semibold text-white shadow-inner">
        {user.name[0]}
      </div>
    </div>
  </header>
);

export default AdminHeader;
