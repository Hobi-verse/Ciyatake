import { useEffect, useState } from "react";
import { fetchRecentOrders } from "../../../api/admin.js";

const statusClassMap = {
  Shipped: "bg-emerald-100 text-emerald-700",
  Processing: "bg-amber-100 text-amber-700",
  Completed: "bg-slate-200 text-slate-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchRecentOrders({ limit: 25 });
        if (isMounted) {
          setOrders(Array.isArray(response) ? response : response?.items ?? []);
        }
      } catch (apiError) {
        if (isMounted) {
          setError(apiError);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadOrders();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-7 text-slate-800">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Orders</h2>
        <p className="text-base text-slate-500">
          Track and manage recent customer orders with live status updates.
        </p>
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
            {error ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-sm text-rose-600"
                >
                  Unable to load orders.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-sm text-emerald-600"
                >
                  Loading orders...
                </td>
              </tr>
            ) : orders.length ? (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-emerald-50/60">
                  <td className="px-6 py-4 font-semibold text-emerald-700">
                    {order.id}
                  </td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4 text-slate-500">{order.date}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                        statusClassMap[order.status] ??
                        "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-sm text-slate-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Orders;
