import { useEffect, useState } from "react";
import { fetchCustomers } from "../../../api/admin.js";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadCustomers = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchCustomers();
        if (isMounted) {
          setCustomers(
            Array.isArray(response) ? response : response?.items ?? []
          );
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

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-7 text-slate-800">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Customers</h2>
        <p className="text-base text-slate-500">
          View customer details and recent engagement.
        </p>
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
            {error ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-6 text-center text-sm text-rose-600"
                >
                  Unable to load customers.
                </td>
              </tr>
            ) : loading ? (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-6 text-center text-sm text-emerald-600"
                >
                  Loading customers...
                </td>
              </tr>
            ) : customers.length ? (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-emerald-50/60">
                  <td className="px-6 py-4 font-semibold text-emerald-700">
                    {customer.name}
                  </td>
                  <td className="px-6 py-4 text-slate-600">{customer.email}</td>
                  <td className="px-6 py-4 text-slate-500">
                    {customer.joined}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="px-6 py-6 text-center text-sm text-slate-500"
                >
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Customers;
