const sampleProducts = [
  { id: 1, name: "Eco-Friendly Water Bottle", price: "$25.00", stock: 120 },
  { id: 2, name: "Reusable Bamboo Cutlery", price: "$15.00", stock: 80 },
  { id: 3, name: "Organic Cotton Tote Bag", price: "$18.00", stock: 45 },
];

const Products = () => (
  <section className="space-y-7 text-slate-800">
    <header className="space-y-2">
      <h2 className="text-3xl font-bold text-slate-900">Products</h2>
      <p className="text-base text-slate-500">Manage your product catalog and inventory levels.</p>
    </header>
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {sampleProducts.map((product) => (
        <article
          key={product.id}
          className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-2xl transition hover:-translate-y-1 hover:shadow-emerald-200"
        >
          <h3 className="text-xl font-semibold text-slate-900">{product.name}</h3>
          <dl className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between text-slate-500">
              <dt>Price</dt>
              <dd className="text-base font-semibold text-emerald-700">{product.price}</dd>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <dt>Stock</dt>
              <dd className="text-base font-semibold text-slate-800">{product.stock}</dd>
            </div>
          </dl>
          <button className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700">
            Edit product
          </button>
        </article>
      ))}
    </div>
  </section>
);

export default Products;
