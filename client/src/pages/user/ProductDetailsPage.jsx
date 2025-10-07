import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
import { addCartItem } from "../../api/cart.js";
import { ApiError } from "../../api/client.js";
import {
  addWishlistItem,
  checkProductInWishlist,
  removeWishlistItem,
} from "../../api/wishlist.js";

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

const resolveErrorMessage = (error, fallbackMessage) => {
  if (!error) {
    return fallbackMessage;
  }

  if (error instanceof ApiError && error.payload) {
    const payloadMessage =
      error.payload?.message ??
      error.payload?.error ??
      (Array.isArray(error.payload?.errors)
        ? error.payload.errors[0]?.message
        : null);
    if (payloadMessage) {
      return payloadMessage;
    }
  }

  if (typeof error.payload?.message === "string") {
    return error.payload.message;
  }

  if (typeof error.message === "string") {
    return error.message;
  }

  return fallbackMessage;
};

const ProductDetailsPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [productDetail, setProductDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastMessage, setToastMessage] = useState("");
  const [actionNotice, setActionNotice] = useState({
    status: "idle",
    message: "",
    context: "add",
  });
  const [wishlistStatus, setWishlistStatus] = useState({
    inWishlist: false,
    itemId: null,
    loading: false,
    error: "",
  });

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

  useEffect(() => {
    setActionNotice({ status: "idle", message: "", context: "add" });
  }, [productDetail]);

  const resetWishlistStatus = useCallback(() => {
    setWishlistStatus({
      inWishlist: false,
      itemId: null,
      loading: false,
      error: "",
    });
  }, []);

  const productDocumentId = useMemo(() => {
    if (!productDetail) {
      return null;
    }

    return (
      productDetail.backendId ??
      productDetail.mongoId ??
      productDetail._id ??
      productDetail.productId ??
      productDetail.id ??
      null
    );
  }, [productDetail]);

  const refreshWishlistStatus = useCallback(
    async (targetProductId, { signal } = {}) => {
      if (!targetProductId) {
        resetWishlistStatus();
        return;
      }

      setWishlistStatus((previous) => ({
        ...previous,
        loading: true,
        error: "",
      }));

      try {
        const result = await checkProductInWishlist(targetProductId, {
          signal,
        });
        if (signal?.aborted) {
          return;
        }

        setWishlistStatus({
          inWishlist: Boolean(result.inWishlist),
          itemId: result.itemId ?? null,
          loading: false,
          error: "",
        });
      } catch (apiError) {
        if (signal?.aborted) {
          return;
        }

        setWishlistStatus((previous) => ({
          ...previous,
          loading: false,
          error: resolveErrorMessage(
            apiError,
            "We couldn't verify your wishlist status."
          ),
        }));
      }
    },
    [resetWishlistStatus]
  );

  useEffect(() => {
    if (!productDocumentId) {
      resetWishlistStatus();
      return;
    }

    const controller = new AbortController();
    refreshWishlistStatus(productDocumentId, { signal: controller.signal });

    return () => controller.abort();
  }, [productDocumentId, refreshWishlistStatus, resetWishlistStatus]);

  const addToCart = useCallback(
    async (
      { product, quantity, variant, size, color },
      { context = "add", skipToast } = {}
    ) => {
      if (!product || !variant) {
        setActionNotice({
          status: "error",
          message:
            "Please choose a size and color combination before adding to cart.",
          context,
        });
        return { success: false };
      }

      const identifier =
        product.backendId ??
        product.mongoId ??
        product._id ??
        product.productId ??
        product.id ??
        product.slug ??
        null;

      if (!identifier) {
        setActionNotice({
          status: "error",
          message:
            "This product is missing a reference ID. Please contact support.",
          context,
        });
        return { success: false };
      }

      setActionNotice({ status: "loading", message: "", context });

      try {
        await addCartItem({
          productId: identifier,
          variantSku: variant.sku,
          quantity,
          size,
          color,
        });

        const successMessage =
          context === "buy"
            ? "Added to your bag. Redirecting to checkout…"
            : `Added ${quantity} item${quantity > 1 ? "s" : ""} to your bag.`;

        setActionNotice({
          status: "success",
          message: successMessage,
          context,
        });

        if (!skipToast) {
          setToastMessage(successMessage);
          window.setTimeout(() => setToastMessage(""), 2800);
        }

        return { success: true };
      } catch (cartError) {
        const fallbackMessage =
          cartError instanceof ApiError && cartError.status === 401
            ? "Please sign in to manage your cart."
            : "We couldn't add this product to your cart. Please try again.";

        const message = resolveErrorMessage(cartError, fallbackMessage);

        setActionNotice({
          status: "error",
          message,
          context,
        });

        if (cartError instanceof ApiError && cartError.status === 401) {
          window.setTimeout(() => {
            navigate("/login", {
              replace: true,
              state: { redirectTo: location.pathname },
            });
          }, 1200);
        }

        return { success: false, error: message };
      }
    },
    [location.pathname, navigate]
  );

  const handleAddToCart = useCallback(
    (payload) => {
      void addToCart(payload, { context: "add" });
    },
    [addToCart]
  );

  const handleBuyNow = useCallback(
    async (payload) => {
      const result = await addToCart(payload, {
        context: "buy",
        skipToast: true,
      });

      if (result.success) {
        setToastMessage("Opening checkout…");
        window.setTimeout(() => {
          navigate("/checkout");
        }, 600);
      }
    },
    [addToCart, navigate]
  );

  const handleToggleWishlist = useCallback(
    async ({ variant }) => {
      if (!productDocumentId) {
        setWishlistStatus((previous) => ({
          ...previous,
          error: "This product is missing a reference ID.",
        }));
        return;
      }

      if (wishlistStatus.loading) {
        return;
      }

      setWishlistStatus((previous) => ({
        ...previous,
        loading: true,
        error: "",
      }));

      try {
        if (wishlistStatus.inWishlist && wishlistStatus.itemId) {
          await removeWishlistItem(wishlistStatus.itemId);
          setWishlistStatus({
            inWishlist: false,
            itemId: null,
            loading: false,
            error: "",
          });
          setToastMessage("Removed from wishlist");
          window.setTimeout(() => setToastMessage(""), 2800);
          return;
        }

        const payload = {
          productId: productDocumentId,
        };

        if (variant?.sku) {
          payload.variantSku = variant.sku;
        }

        await addWishlistItem(payload);
        const refreshed = await checkProductInWishlist(productDocumentId);

        setWishlistStatus({
          inWishlist: Boolean(refreshed.inWishlist),
          itemId: refreshed.itemId ?? null,
          loading: false,
          error: "",
        });

        setToastMessage("Saved to wishlist");
        window.setTimeout(() => setToastMessage(""), 2800);
      } catch (wishlistError) {
        if (wishlistError instanceof ApiError && wishlistError.status === 401) {
          setWishlistStatus((previous) => ({
            ...previous,
            loading: false,
            error: "Please sign in to manage your wishlist.",
          }));

          window.setTimeout(() => {
            navigate("/login", {
              replace: true,
              state: { redirectTo: location.pathname },
            });
          }, 900);
          return;
        }

        const message = resolveErrorMessage(
          wishlistError,
          wishlistStatus.inWishlist
            ? "We couldn't remove this item from your wishlist."
            : "We couldn't save this item to your wishlist."
        );

        setWishlistStatus((previous) => ({
          ...previous,
          loading: false,
          error: message,
        }));
      }
    },
    [
      location.pathname,
      navigate,
      productDocumentId,
      wishlistStatus.inWishlist,
      wishlistStatus.itemId,
      wishlistStatus.loading,
    ]
  );

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
                product={{
                  ...productDetail,
                  backendId: productDocumentId ?? productDetail.backendId,
                }}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                actionStatus={actionNotice}
                onToggleWishlist={handleToggleWishlist}
                wishlistState={wishlistStatus}
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
