import { useMemo, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import { getProductDetailById } from "../../data/productDetail.js";
import ProductGallery from "../../components/user/product/ProductGallery.jsx";
import ProductSummary from "../../components/user/product/ProductSummary.jsx";
import ProductHighlights from "../../components/user/product/ProductHighlights.jsx";
import ProductInformation from "../../components/user/product/ProductInformation.jsx";
import ProductReviewsSummary from "../../components/user/product/ProductReviewsSummary.jsx";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const productDetail = useMemo(
    () => getProductDetailById(productId),
    [productId]
  );
  const [toastMessage, setToastMessage] = useState("");

  const handleAddToCart = ({ quantity }) => {
    setToastMessage(
      `Added ${quantity} item${quantity > 1 ? "s" : ""} to your bag.`
    );
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  const handleBuyNow = ({ quantity }) => {
    setToastMessage(
      `Redirecting to checkout with ${quantity} item${quantity > 1 ? "s" : ""}.`
    );
    window.setTimeout(() => setToastMessage(""), 2800);
  };

  if (productDetail.isFallback && productId) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-24 pt-8">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            {
              label: productDetail.category,
              to: `/category/${productDetail.category?.toLowerCase()}`,
            },
            { label: productDetail.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
          <ProductGallery images={productDetail.media} />
          <ProductSummary
            product={productDetail}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ProductInformation
            details={productDetail.details}
            specifications={productDetail.specifications}
          />
          <ProductHighlights highlights={productDetail.benefits} />
        </div>

        <ProductReviewsSummary
          rating={productDetail.rating}
          reviewCount={productDetail.reviewCount}
          highlights={productDetail.reviewHighlights}
        />

        <section className="space-y-6">
          <SectionHeading title="You might also like" eyebrow="Recommended" />
          <ProductGrid products={productDetail.relatedProducts} />
        </section>
      </div>

      {toastMessage ? (
        <div className="fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
          <div className="max-w-sm rounded-full border border-emerald-300/60 bg-emerald-400/20 px-4 py-3 text-center text-sm font-medium text-emerald-50 shadow-lg">
            {toastMessage}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsPage;
