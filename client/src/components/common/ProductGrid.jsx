import ProductCard from "./ProductCard.jsx";

const ProductGrid = ({ products = [], onSelectProduct }) => (
  <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
    {products.map((product) => (
      <ProductCard
        key={product.id ?? product.title}
        onSelect={onSelectProduct}
        {...product}
        to={product.to ?? (product.id ? `/products/${product.id}` : undefined)}
      />
    ))}
  </div>
);

export default ProductGrid;
