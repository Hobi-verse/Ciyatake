import products from "./products.json";
import detailData from "./productDetailData.json";

const {
  colorHexMap = {},
  sharedBenefits = [],
  media = {},
  overrides = {},
} = detailData;

const toColorOption = (value) => {
  if (!value) return null;
  if (typeof value === "object") return value;

  const label = value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return {
    value,
    label,
    hex: colorHexMap[value] ?? value,
  };
};

const titleCase = (value) =>
  value
    ?.split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ") ?? "";

const createDefaultDetail = (product) => ({
  description: `${product.title} is crafted with premium materials for everyday wear.`,
  features: [
    "Premium construction",
    "Thoughtful fit",
    "Easy care",
    "Designed to last",
  ],
});

const defaultSpecifications = [
  { label: "Material", value: "Premium blend" },
  { label: "Care", value: "Machine wash cold" },
];

const defaultReviewHighlights = [
  {
    title: "Loved by customers",
    description: "Consistently high marks for quality and comfort.",
  },
];

export const getProductDetailById = (productId) => {
  const fallbackProduct = products[0];
  const baseProduct =
    products.find((product) => product.id === productId) ?? fallbackProduct;
  const override = overrides[baseProduct.id] ?? {};

  const normalizedColors = (
    override.colors ?? baseProduct.colors ?? []
  )
    .map(toColorOption)
    .filter(Boolean);

  const normalizedSizes = override.sizes ?? baseProduct.sizes ?? [];

  const detail = {
    ...baseProduct,
    ...override,
    title: override.title ?? baseProduct.title,
    category: titleCase(baseProduct.category),
    media:
      override.media ??
      media[baseProduct.id] ?? [
        {
          src: baseProduct.imageUrl,
          thumbnail: baseProduct.imageUrl,
          alt: baseProduct.title,
        },
      ],
    colors: normalizedColors,
    sizes: normalizedSizes,
    benefits: override.benefits ?? sharedBenefits,
    details: override.details ?? createDefaultDetail(baseProduct),
    specifications: override.specifications ?? defaultSpecifications,
    reviewHighlights: override.reviewHighlights ?? defaultReviewHighlights,
    relatedProducts:
      override.relatedProducts ??
      products.filter((product) => product.id !== baseProduct.id).slice(0, 4),
    requestedId: productId,
    resolvedId: baseProduct.id,
    isFallback: baseProduct.id !== productId,
  };

  return detail;
};

export default getProductDetailById;
