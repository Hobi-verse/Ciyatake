import RecentOrders from "./RecentOrders";
import RecentActivities from "./RecentActivities";

const DashboardHome = () => (
  <main className="space-y-8">
    <header>
      <h2 className="text-3xl font-bold text-slate-900">Dashboard</h2>
      <p className="mt-2 text-base text-slate-500">
        Welcome back, Sarah. Here's a snapshot of your store performance today.
      </p>
    </header>
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      <article className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50 p-6 shadow-lg">
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">Total Sales</div>
        <div className="mt-4 text-4xl font-semibold text-emerald-700">$120,000</div>
        <p className="mt-3 text-sm text-slate-500">+14% vs last month</p>
      </article>
      <article className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-lg">
        <div className="text-sm font-medium uppercase tracking-[0.2em] text-emerald-500">New Orders</div>
        <div className="mt-4 text-4xl font-semibold text-slate-900">35</div>
        <p className="mt-3 text-sm text-slate-500">8 awaiting fulfilment</p>
      </article>
      <article className="rounded-2xl border border-emerald-100 bg-emerald-600/95 p-6 shadow-lg text-white">
        <div className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-100">Top Product</div>
        <div className="mt-4 text-2xl font-semibold">Eco-Friendly Water Bottle</div>
        <p className="mt-3 text-sm text-emerald-100/80">620 units sold this week</p>
      </article>
    </div>
    <div className="flex flex-col gap-7 lg:flex-row">
      <RecentOrders />
      <RecentActivities />
    </div>
  </main>
);

export default DashboardHome;
