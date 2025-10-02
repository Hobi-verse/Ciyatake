import { useEffect, useState } from "react";
import { fetchProductsSummary } from "../../../api/admin.js";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchProductsSummary();
        if (isMounted) {
          setProducts(
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

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="space-y-7 text-slate-800">
      <header className="space-y-2">
        <h2 className="text-3xl font-bold text-slate-900">Products</h2>
        <p className="text-base text-slate-500">
          Manage your product catalog and inventory levels.
        </p>
      </header>
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-sm text-rose-600">
          Unable to load products.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(loading ? Array.from({ length: 3 }) : products).map(
            (product, index) => (
              <article
                key={product?.id ?? index}
                className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl transition hover:-translate-y-1 hover:shadow-emerald-200"
              >
                <h3 className="text-xl font-semibold text-slate-900">
                  {loading ? "Loading..." : product.name}
                </h3>
                <dl className="mt-5 space-y-3 text-sm">
                  <div className="flex items-center justify-between text-slate-500">
                    <dt>Price</dt>
                    <dd className="text-base font-semibold text-emerald-700">
                      {loading ? "--" : product.price}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between text-slate-500">
                    <dt>Stock</dt>
                    <dd className="text-base font-semibold text-slate-800">
                      {loading ? "--" : product.stock}
                    </dd>
                  </div>
                </dl>
                <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
                  Edit product
                </button>
              </article>
            )
          )}
        </div>
      )}
    </section>
  );
};

export default Products;
