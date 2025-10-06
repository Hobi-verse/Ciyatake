import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumbs from "../../components/common/Breadcrumbs.jsx";
import SectionHeading from "../../components/common/SectionHeading.jsx";
import ProductGrid from "../../components/common/ProductGrid.jsx";
import ProductGallery from "../../components/user/product/ProductGallery.jsx";
import ProductSummary from "../../components/user/product/ProductSummary.jsx";
import ProductHighlights from "../../components/user/product/ProductHighlights.jsx";
import ProductInformation from "../../components/user/product/ProductInformation.jsx";
import ProductReviewsSummary from "../../components/user/product/ProductReviewsSummary.jsx";
import UserNavbar from "../../components/user/common/UserNavbar.jsx";
import { fetchProductById } from "../../api/catalog.js";

const normalizeMedia = (media = [], fallbackAlt = "") =>
  media
    .map((item) => {
      if (!item) {
        return null;
      }

      const src = item.src ?? item.url;
      const thumbnail = item.thumbnail ?? item.preview ?? src;

      if (!src) {
        return null;
      }

      return {
        src,
        thumbnail,
        alt: item.alt ?? fallbackAlt,
        tag: item.tag,
      };
    })
    .filter(Boolean);

const normalizeBenefits = (benefits = []) =>
  benefits.map((benefit) =>
    typeof benefit === "string"
      ? { title: benefit, description: "" }
      : {
          title: benefit.title ?? "Benefit",
          description: benefit.description ?? benefit.detail ?? "",
        }
  );

const normalizeColors = (colors = []) =>
  colors
    .map((color) => {
      if (!color) {
        return null;
      }

      if (typeof color === "string") {
        const formattedLabel = color
          .split(/[\s-_]+/)
          .filter(Boolean)
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join(" ");

        return {
          value: color,
          label: formattedLabel,
          hex: undefined,
        };
      }

      const value = color.value ?? color.name;
      if (!value) {
        return null;
      }

      return {
        value,
        label: color.label ?? color.name ?? value,
        hex: color.hex,
      };
    })
    .filter(Boolean);

const normalizeRelatedProducts = (relatedProducts = []) =>
  relatedProducts.map((product) => {
    const id = product.id ?? product.slug ?? product._id ?? product.productId;
    return {
      id,
      title: product.title ?? product.name ?? "Untitled product",
      price: product.price ?? product.basePrice ?? 0,
      imageUrl:
        product.imageUrl ?? product.media?.[0]?.url ?? product.thumbnail ?? "",
    };
  });

const transformProductDetail = (product) => {
  if (!product) {
    return null;
  }

  const price = product.price ?? product.basePrice ?? 0;
  const rating = Number(product.rating ?? product.averageRating ?? 0);
  const reviewCount = product.reviewCount ?? product.reviewsCount ?? 0;

  return {
    ...product,
    price,
    summary: product.summary ?? product.description ?? "",
    rating,
    reviewCount,
    colors: normalizeColors(product.colors),
    media: (() => {
      const media = normalizeMedia(product.media, product.title);
      if (!media.length && product.imageUrl) {
        media.push({
          src: product.imageUrl,
          thumbnail: product.imageUrl,
          alt: product.title,
        });
      }
      return media;
    })(),
    benefits: normalizeBenefits(product.benefits),
    specifications: product.specifications ?? [],
    details: product.details ?? {},
    relatedProducts: normalizeRelatedProducts(product.relatedProducts),
  };
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  const loadProduct = useCallback(async (targetProductId, { signal } = {}) => {
    if (!targetProductId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const product = await fetchProductById(targetProductId, { signal });
      if (signal?.aborted) {
        return;
      }

      setProductDetail(transformProductDetail(product));
    } catch (apiError) {
      if (!signal?.aborted) {
        setError(apiError);
        setProductDetail(null);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadProduct(productId, { signal: controller.signal });

    return () => controller.abort();
  }, [loadProduct, productId]);

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

  return (
    <div className="min-h-screen bg-[#07150f] text-emerald-50">
      <UserNavbar />

      <div className="mx-auto max-w-6xl space-y-12 px-4 pb-24 pt-8">
        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-emerald-200/70">
            Loading product details...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-300/40 bg-rose-500/10 p-8 text-center text-sm text-rose-100">
            We couldn&apos;t load this product right now.
          </div>
        ) : productDetail ? (
          <>
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
              <SectionHeading
                title="You might also like"
                eyebrow="Recommended"
              />
              <ProductGrid products={productDetail.relatedProducts} />
            </section>
          </>
        ) : null}
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
