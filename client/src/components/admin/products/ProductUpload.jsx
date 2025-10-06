import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "../../common/Button.jsx";
import FormField from "./FormField.jsx";
import FormSection from "./FormSection.jsx";
import ImageUploader from "./ImageUploader.jsx";
import VideoUploader from "./VideoUploader.jsx";
import ColorPicker from "./ColorPicker.jsx";
import MultiSelectTags from "./MultiSelectTags.jsx";
import RichTextEditor from "./RichTextEditor.jsx";
import { createProduct, updateProduct } from "../../../api/admin.js";
import { fetchProductById } from "../../../api/catalog.js";
import {
  categoryStructure,
  sizeOptions,
  materialOptions,
  fitTypes,
  countries,
} from "../../../data/categories.js";

const DEFAULT_FORM = {
  title: "",
  description: "",
  brand: "",
  gender: "",
  category: "",
  subCategory: "",
  productType: "",
  images: [],
  primaryImageIndex: 0,
  video: null,
  price: "",
  discountPercentage: "",
  stockQuantity: "",
  sku: "",
  availableSizes: [],
  colors: [],
  material: "",
  fitType: "",
  careInstructions: "",
  madeIn: "India",
  warranty: "",
  metaTitle: "",
  metaDescription: "",
  tags: [],
  shippingTime: "3-5 business days",
  returnPolicy: true,
  visibility: "draft",
  featured: false,
};

const commonTags = [
  "New Arrival",
  "Best Seller",
  "Limited Edition",
  "Eco Friendly",
  "Festive",
  "Casual",
  "Formal",
  "Summer",
  "Winter",
  "Premium",
  "Budget",
  "Trending",
];

const deepClone = (value) => {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => deepClone(item));
  }

  if (value && typeof value === "object") {
    const FileCtor = typeof File !== "undefined" ? File : null;
    const BlobCtor = typeof Blob !== "undefined" ? Blob : null;

    if (
      (FileCtor && value instanceof FileCtor) ||
      (BlobCtor && value instanceof BlobCtor)
    ) {
      return value;
    }

    return Object.keys(value).reduce((accumulator, key) => {
      accumulator[key] = deepClone(value[key]);
      return accumulator;
    }, {});
  }

  return value;
};

const createInitialForm = () => deepClone(DEFAULT_FORM);

const generateId = () =>
  typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id-${Math.random().toString(36).slice(2, 11)}`;

const slugify = (value = "") =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || generateId();

const toTitleCase = (value = "") =>
  value
    .split(/[\s-_]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

const ensureArray = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

const splitMultiline = (value) =>
  value
    ?.split(/\r?\n+/)
    .map((line) => line.trim())
    .filter(Boolean) ?? [];

const resolveErrorMessage = (error, fallback) => {
  if (!error) {
    return fallback;
  }

  if (typeof error === "string") {
    return error;
  }

  if (error?.payload?.message) {
    return error.payload.message;
  }

  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  if (error?.message) {
    return error.message;
  }

  return fallback;
};

const buildMediaPayload = (form) => {
  const images = ensureArray(form.images).map((image, index) => {
    const url = image?.url || image?.preview || "";
    if (!url) {
      return null;
    }

    const primaryIndex =
      typeof form.primaryImageIndex === "number" ? form.primaryImageIndex : 0;
    const isVideo =
      typeof image?.type === "string" && image.type.startsWith("video");

    return {
      url,
      alt: image?.name || `${form.title || "Product"} image ${index + 1}`,
      isPrimary: !isVideo && index === primaryIndex,
      type: isVideo ? "video" : "image",
    };
  });

  const video =
    form.video && (form.video.url || form.video.preview)
      ? [
          {
            url: form.video.url ?? form.video.preview,
            alt: form.video.name ?? `${form.title || "Product"} video`,
            isPrimary: false,
            type: "video",
          },
        ]
      : [];

  return [...images.filter(Boolean), ...video];
};

const buildDetails = (form) => ({
  title: form.title ?? "",
  description: form.description ?? "",
  features: splitMultiline(form.careInstructions),
});

const buildSpecifications = (form) => {
  const specs = [
    form.material ? { label: "Material", value: form.material } : null,
    form.fitType ? { label: "Fit", value: form.fitType } : null,
    form.madeIn ? { label: "Made in", value: form.madeIn } : null,
    form.warranty ? { label: "Warranty", value: form.warranty } : null,
    form.shippingTime
      ? { label: "Shipping time", value: form.shippingTime }
      : null,
  ];

  if (typeof form.returnPolicy === "boolean") {
    specs.push({
      label: "Return policy",
      value: form.returnPolicy ? "Eligible for easy returns" : "Final sale",
    });
  }

  return specs.filter(Boolean);
};

const buildSeo = (form, tags) => {
  const stripHtml = (value = "") => value.replace(/<[^>]*>/g, "");
  const description =
    form.metaDescription?.trim() ||
    stripHtml(form.description ?? "").slice(0, 160);

  return {
    metaTitle: form.metaTitle?.trim() || form.title?.trim() || "",
    metaDescription: description,
    keywords: tags,
  };
};

const buildVariants = (form, slug) => {
  const sizes = ensureArray(form.availableSizes).length
    ? ensureArray(form.availableSizes)
    : ["standard"];

  const colors = ensureArray(form.colors).length
    ? ensureArray(form.colors)
    : [
        {
          value: "default",
          name: "Default",
          hex: "#000000",
        },
      ];

  const combinations = [];
  colors.forEach((color) => {
    sizes.forEach((size) => {
      combinations.push({ size, color });
    });
  });

  const totalStock = Math.max(0, Number.parseInt(form.stockQuantity, 10) || 0);

  const baseSku = (form.sku || slug || generateId())
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 48);

  const imageUrls = buildMediaPayload(form)
    .filter((media) => media.type === "image")
    .map((media) => media.url);

  if (!combinations.length) {
    return [
      {
        sku: `${baseSku}-default`.slice(0, 64),
        size: "standard",
        color: {
          name: "default",
          hex: "",
        },
        stockLevel: totalStock,
        isActive: form.visibility !== "archived",
      },
    ];
  }

  const variants = combinations.map(({ size, color }, index) => {
    const allocation =
      Math.floor(totalStock / combinations.length) +
      (index < totalStock % combinations.length ? 1 : 0);

    const colorValue = color.value ?? color.name ?? `color-${index + 1}`;

    return {
      sku: `${baseSku}-${size}-${colorValue}`.replace(/-+/g, "-").slice(0, 64),
      size,
      color: {
        name: colorValue,
        hex: color.hex ?? "",
      },
      stockLevel: allocation,
      isActive: form.visibility !== "archived",
      images: imageUrls,
    };
  });

  return variants;
};

const prepareProductPayload = (form) => {
  const title = form.title?.trim();
  const slug = slugify(title || form.sku || generateId());
  const tags = ensureArray(form.tags)
    .map((tag) => tag.trim())
    .filter(Boolean);

  const variants = buildVariants(form, slug);
  const totalStock = variants.reduce(
    (sum, variant) => sum + Math.max(0, Number(variant.stockLevel) || 0),
    0
  );

  return {
    slug,
    title,
    description: form.description ?? "",
    category: slugify(form.category || "general"),
    basePrice: Math.max(0, Number(form.price) || 0),
    media: buildMediaPayload(form),
    benefits: tags.slice(0, 4),
    details: buildDetails(form),
    specifications: buildSpecifications(form),
    reviewHighlights: [],
    variants,
    tags,
    seo: buildSeo(form, tags),
    isActive: form.visibility !== "draft",
    totalStock,
    featured: Boolean(form.featured),
  };
};

const mapProductToForm = (product) => {
  const next = createInitialForm();

  next.title = product.title ?? next.title;
  next.description = product.description ?? next.description;
  next.category = toTitleCase(product.category ?? next.category);
  next.price = product.basePrice ?? product.price ?? next.price;
  next.stockQuantity = product.totalStock ?? next.stockQuantity;
  next.sku = product.variants?.[0]?.sku ?? product.id ?? next.sku;
  next.tags = ensureArray(product.tags);
  next.availableSizes = ensureArray(product.sizes);
  next.colors = ensureArray(product.colors).map((color) => ({
    id: generateId(),
    name: color.label ?? color.name ?? color.value ?? "Color",
    hex: color.hex ?? "",
    value:
      color.value ??
      color.name ??
      slugify(color.label ?? color.name ?? "color"),
  }));
  next.images = ensureArray(product.media).map((media, index) => ({
    id: media._id ?? generateId(),
    name: media.alt || `${product.title || "Product"} image ${index + 1}`,
    preview: media.url,
    url: media.url,
    type: media.type ?? "image",
    size: 0,
  }));
  const primaryIndex = product.media?.findIndex((media) => media.isPrimary);
  next.primaryImageIndex =
    typeof primaryIndex === "number" && primaryIndex >= 0 ? primaryIndex : 0;
  next.metaTitle = product.seo?.metaTitle ?? next.metaTitle;
  next.metaDescription = product.seo?.metaDescription ?? next.metaDescription;
  next.visibility = product.isAvailable ? "published" : "draft";
  next.careInstructions = product.details?.features?.length
    ? product.details.features.join("\n")
    : next.careInstructions;
  if (product.details?.description) {
    next.description = product.details.description;
  }

  const findSpec = (keyword) =>
    product.specifications?.find((spec) =>
      spec.label?.toLowerCase().includes(keyword)
    )?.value;

  next.material = findSpec("material") ?? next.material;
  next.fitType = findSpec("fit") ?? next.fitType;
  next.madeIn = findSpec("made") ?? next.madeIn;
  next.warranty = findSpec("warranty") ?? next.warranty;

  const shipping = findSpec("shipping");
  if (shipping) {
    next.shippingTime = shipping;
  }

  const returnPolicy = findSpec("return");
  if (returnPolicy) {
    next.returnPolicy = !/final/i.test(returnPolicy);
  }

  return next;
};

const ProductUpload = ({ mode = "create", productId, onSuccess }) => {
  const initialFormRef = useRef(createInitialForm());
  const [form, setForm] = useState(() => createInitialForm());
  const [sections, setSections] = useState({
    basic: true,
    media: true,
    pricing: true,
    details: false,
    seo: false,
    shipping: false,
    status: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [existingProductId, setExistingProductId] = useState(null);

  const availableCategories = useMemo(() => {
    if (form.gender && categoryStructure[form.gender]) {
      return Object.keys(categoryStructure[form.gender] ?? {});
    }

    const allCategories = new Set();
    Object.values(categoryStructure).forEach((group) => {
      Object.keys(group ?? {}).forEach((category) =>
        allCategories.add(category)
      );
    });

    return Array.from(allCategories);
  }, [form.gender]);

  const availableSubCategories = useMemo(() => {
    if (form.gender && form.category) {
      return categoryStructure[form.gender]?.[form.category] ?? [];
    }

    if (form.category) {
      return Object.values(categoryStructure).flatMap(
        (group) => group[form.category] ?? []
      );
    }

    return [];
  }, [form.gender, form.category]);

  const availableSizes = useMemo(() => {
    if (form.gender === "Kids") return sizeOptions.kids;
    if (form.category?.toLowerCase().includes("footwear")) {
      return sizeOptions.footwear;
    }
    return sizeOptions.clothing;
  }, [form.gender, form.category]);

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const updateForm = useCallback(
    (keyOrUpdates, value) => {
      setForm((prev) => {
        if (typeof keyOrUpdates === "function") {
          return keyOrUpdates(prev);
        }

        const next = { ...prev };

        if (typeof keyOrUpdates === "string") {
          next[keyOrUpdates] =
            typeof value === "function" ? value(prev[keyOrUpdates]) : value;
        } else if (
          keyOrUpdates &&
          typeof keyOrUpdates === "object" &&
          !Array.isArray(keyOrUpdates)
        ) {
          Object.entries(keyOrUpdates).forEach(([key, val]) => {
            next[key] = typeof val === "function" ? val(prev[key]) : val;
          });
        }

        return next;
      });

      if (typeof keyOrUpdates === "string") {
        setErrors((prevErrors) => {
          if (!prevErrors[keyOrUpdates]) {
            return prevErrors;
          }
          const nextErrors = { ...prevErrors };
          delete nextErrors[keyOrUpdates];
          return nextErrors;
        });
      } else if (
        keyOrUpdates &&
        typeof keyOrUpdates === "object" &&
        !Array.isArray(keyOrUpdates)
      ) {
        const keys = Object.keys(keyOrUpdates);
        if (keys.length) {
          setErrors((prevErrors) => {
            const nextErrors = { ...prevErrors };
            keys.forEach((key) => {
              if (nextErrors[key]) {
                delete nextErrors[key];
              }
            });
            return nextErrors;
          });
        }
      }

      if (feedback) {
        setFeedback(null);
      }
    },
    [feedback]
  );

  const selectGender = (gender) => {
    updateForm({
      gender,
      category: "",
      subCategory: "",
    });
  };

  const selectCategory = (category) => {
    const updates = {
      category,
      subCategory: "",
    };

    if (!form.gender) {
      const match = Object.entries(categoryStructure).find(([, groups]) =>
        Object.prototype.hasOwnProperty.call(groups, category)
      );

      if (match) {
        updates.gender = match[0];
      }
    }

    updateForm(updates);
  };

  const toggleSize = (size) => {
    updateForm(
      "availableSizes",
      form.availableSizes.includes(size)
        ? form.availableSizes.filter((item) => item !== size)
        : [...form.availableSizes, size]
    );
  };

  useEffect(() => {
    if (mode !== "edit") {
      const emptyForm = createInitialForm();
      initialFormRef.current = deepClone(emptyForm);
      setForm(emptyForm);
      setExistingProductId(null);
      setLoadError(null);
      return;
    }

    if (!productId) {
      return;
    }

    let cancelled = false;
    setLoadingExisting(true);
    setLoadError(null);

    fetchProductById(productId)
      .then((detail) => {
        if (cancelled) {
          return;
        }

        if (!detail) {
          setLoadError("Product not found.");
          return;
        }

        const mapped = mapProductToForm(detail);
        initialFormRef.current = deepClone(mapped);
        setForm(mapped);
        setExistingProductId(detail.id ?? productId);
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        setLoadError(
          resolveErrorMessage(error, "Unable to load product details.")
        );
      })
      .finally(() => {
        if (!cancelled) {
          setLoadingExisting(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [mode, productId]);

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Product title is required";
    if (!form.description.trim())
      nextErrors.description = "Product description is required";
    if (!form.category) nextErrors.category = "Select a category";

    if (!form.price || Number(form.price) <= 0) {
      nextErrors.price = "Price must be positive";
    }

    if (form.stockQuantity === "" || form.stockQuantity === null) {
      nextErrors.stockQuantity = "Stock quantity is required";
    } else if (Number(form.stockQuantity) < 0) {
      nextErrors.stockQuantity = "Stock cannot be negative";
    }

    if (!form.sku.trim()) nextErrors.sku = "SKU is required";
    if (!form.images.length)
      nextErrors.images = "Upload at least one product image";

    if (
      form.discountPercentage &&
      (Number(form.discountPercentage) < 0 ||
        Number(form.discountPercentage) > 100)
    ) {
      nextErrors.discountPercentage = "Discount must be between 0 and 100";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) {
      return;
    }

    setSaving(true);
    setFeedback(null);

    const payload = prepareProductPayload(form);

    try {
      if (mode === "edit") {
        const targetId = existingProductId ?? productId;
        if (!targetId) {
          throw new Error("Product identifier is missing.");
        }

        const updatedProduct = await updateProduct(targetId, payload);

        setFeedback({
          type: "success",
          text: "Product updated successfully.",
        });

        setExistingProductId(payload.slug);
        initialFormRef.current = deepClone(form);
        onSuccess?.(updatedProduct ?? null, { mode: "edit" });
      } else {
        const createdProduct = await createProduct(payload);

        setFeedback({
          type: "success",
          text: "Product created successfully.",
        });

        const resetFormState = createInitialForm();
        initialFormRef.current = deepClone(resetFormState);
        setForm(resetFormState);
        onSuccess?.(createdProduct ?? null, { mode: "create" });
      }
    } catch (error) {
      setFeedback({
        type: "error",
        text: resolveErrorMessage(
          error,
          mode === "edit"
            ? "Unable to update product. Please try again."
            : "Unable to create product. Please try again."
        ),
      });
    } finally {
      setSaving(false);
    }
  };

  const resetForm = useCallback(() => {
    setForm(() => deepClone(initialFormRef.current));
    setErrors({});
    setFeedback(null);
  }, []);

  const discountedPrice = useMemo(() => {
    const price = Number(form.price) || 0;
    const discount = Number(form.discountPercentage) || 0;
    if (!price) return 0;
    return Math.round(price - price * (discount / 100));
  }, [form.price, form.discountPercentage]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 pb-16">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-600">
              Catalog
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">
              {mode === "edit" ? "Edit product" : "Add new product"}
            </h1>
            <p className="text-sm text-slate-600">
              {mode === "edit"
                ? "Update catalog information and publish changes instantly."
                : "Provide detailed information so shoppers understand the product instantly."}
            </p>
            {mode === "edit" && (existingProductId || productId) ? (
              <p className="mt-2 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">
                Editing {existingProductId || productId}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="border border-emerald-200 bg-white text-emerald-700"
              onClick={resetForm}
              disabled={
                saving ||
                loadingExisting ||
                (mode === "edit" && Boolean(loadError))
              }
            >
              {mode === "edit" ? "Revert changes" : "Reset form"}
            </Button>
            <Button
              type="button"
              className={`border border-emerald-200 ${
                form.visibility === "draft"
                  ? "bg-white text-emerald-700"
                  : "bg-emerald-600 text-white"
              }`}
              disabled={
                saving ||
                loadingExisting ||
                (mode === "edit" && Boolean(loadError))
              }
              onClick={() =>
                updateForm(
                  "visibility",
                  form.visibility === "draft" ? "published" : "draft"
                )
              }
            >
              {form.visibility === "draft" ? "Mark as ready" : "Back to draft"}
            </Button>
          </div>
        </div>

        {mode === "edit" && loadingExisting ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            Loading product details…
          </div>
        ) : null}

        {loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {loadError}
          </div>
        ) : null}

        {feedback?.text ? (
          <div
            className={`rounded-2xl border px-4 py-3 text-sm ${
              feedback.type === "error"
                ? "border-rose-200 bg-rose-50 text-rose-700"
                : "border-emerald-200 bg-emerald-50 text-emerald-700"
            }`}
          >
            {feedback.text}
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection
            title="Basic information"
            subtitle="Describe what you are selling and how shoppers will find it."
            isOpen={sections.basic}
            onToggle={() => toggleSection("basic")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                label="Product title"
                required
                error={errors.title}
                className="md:col-span-2"
              >
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="e.g. Organic cotton oversized tee"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField
                label="Description"
                required
                error={errors.description}
                className="md:col-span-2"
              >
                <RichTextEditor
                  value={form.description}
                  onChange={(value) => updateForm("description", value)}
                />
              </FormField>

              <FormField label="Brand" required error={errors.brand}>
                <input
                  type="text"
                  value={form.brand}
                  onChange={(event) => updateForm("brand", event.target.value)}
                  placeholder="Brand name"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="Gender" required error={errors.gender}>
                <select
                  value={form.gender}
                  onChange={(event) => selectGender(event.target.value)}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select audience</option>
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Kids">Kids</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </FormField>

              <FormField label="Category" required error={errors.category}>
                <select
                  value={form.category}
                  onChange={(event) => selectCategory(event.target.value)}
                  disabled={!availableCategories.length}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {availableCategories.length
                      ? "Select category"
                      : "Choose gender first"}
                  </option>
                  {availableCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Sub-category">
                <select
                  value={form.subCategory}
                  onChange={(event) =>
                    updateForm("subCategory", event.target.value)
                  }
                  disabled={!availableSubCategories.length}
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                  <option value="">
                    {availableSubCategories.length
                      ? "Select sub-category"
                      : "Choose category first"}
                  </option>
                  {availableSubCategories.map((subcategory) => (
                    <option key={subcategory} value={subcategory}>
                      {subcategory}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Product type"
                helpText="Optional: use to further classify variants (e.g. Crew neck, V-neck)."
              >
                <input
                  type="text"
                  value={form.productType}
                  onChange={(event) =>
                    updateForm("productType", event.target.value)
                  }
                  placeholder="e.g. Crew neck"
                  className="w-full rounded-xl border border-emerald-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Media"
            subtitle="High-quality visuals drastically improve conversion."
            isOpen={sections.media}
            onToggle={() => toggleSection("media")}
          >
            <FormField label="Images" required error={errors.images}>
              <ImageUploader
                images={form.images}
                onChange={(images) => updateForm("images", images)}
                primaryImageIndex={form.primaryImageIndex}
                onPrimaryChange={(index) =>
                  updateForm("primaryImageIndex", index)
                }
              />
            </FormField>

            <FormField
              label="Product video"
              helpText="Optional short hero clip or unboxing video (max 50MB)."
            >
              <VideoUploader
                video={form.video}
                onChange={(video) => updateForm("video", video)}
              />
            </FormField>
          </FormSection>

          <FormSection
            title="Pricing & inventory"
            subtitle="Control price, stock, and available variants."
            isOpen={sections.pricing}
            onToggle={() => toggleSection("pricing")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="MRP (₹)" required error={errors.price}>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => updateForm("price", event.target.value)}
                  placeholder="0.00"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="Discount %" error={errors.discountPercentage}>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={form.discountPercentage}
                  onChange={(event) =>
                    updateForm("discountPercentage", event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField
                label="Stock quantity"
                required
                error={errors.stockQuantity}
              >
                <input
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) =>
                    updateForm("stockQuantity", event.target.value)
                  }
                  placeholder="0"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="SKU" required error={errors.sku}>
                <input
                  type="text"
                  value={form.sku}
                  onChange={(event) => updateForm("sku", event.target.value)}
                  placeholder="Unique SKU code"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <FormField
                label="Available sizes"
                helpText="Choose every size variant that can be purchased."
              >
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <label
                      key={size}
                      className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition ${
                        form.availableSizes.includes(size)
                          ? "border-emerald-400 bg-emerald-50 text-emerald-800"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200"
                      }`}
                    >
                      <input
                        type="checkbox"
                        className="accent-emerald-500"
                        checked={form.availableSizes.includes(size)}
                        onChange={() => toggleSize(size)}
                      />
                      <span>{size.toUpperCase()}</span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Colors">
                <ColorPicker
                  colors={form.colors}
                  onChange={(colors) => updateForm("colors", colors)}
                />
              </FormField>
            </div>

            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50/60 px-4 py-3 text-sm text-emerald-800">
              Expected selling price:{" "}
              <span className="font-semibold">
                ₹{discountedPrice.toLocaleString("en-IN")}
              </span>
            </div>
          </FormSection>

          <FormSection
            title="Additional details"
            subtitle="These attributes improve search ranking and filters."
            isOpen={sections.details}
            onToggle={() => toggleSection("details")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Material">
                <select
                  value={form.material}
                  onChange={(event) =>
                    updateForm("material", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select material</option>
                  {materialOptions.map((material) => (
                    <option key={material} value={material}>
                      {material}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Fit type">
                <select
                  value={form.fitType}
                  onChange={(event) =>
                    updateForm("fitType", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="">Select fit</option>
                  {fitTypes.map((fit) => (
                    <option key={fit} value={fit}>
                      {fit}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Care instructions" className="md:col-span-2">
                <textarea
                  value={form.careInstructions}
                  onChange={(event) =>
                    updateForm("careInstructions", event.target.value)
                  }
                  rows={3}
                  placeholder="Machine wash cold, tumble dry low…"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="Country of origin">
                <select
                  value={form.madeIn}
                  onChange={(event) => updateForm("madeIn", event.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  {countries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="Warranty">
                <input
                  type="text"
                  value={form.warranty}
                  onChange={(event) =>
                    updateForm("warranty", event.target.value)
                  }
                  placeholder="e.g. 6 months manufacturing warranty"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="SEO & discoverability"
            subtitle="Optimise listing preview for search, social, and ads."
            isOpen={sections.seo}
            onToggle={() => toggleSection("seo")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Meta title">
                <input
                  type="text"
                  value={form.metaTitle}
                  onChange={(event) =>
                    updateForm("metaTitle", event.target.value)
                  }
                  placeholder="Title shown in search engines"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="Meta description" className="md:col-span-2">
                <textarea
                  rows={3}
                  value={form.metaDescription}
                  onChange={(event) =>
                    updateForm("metaDescription", event.target.value)
                  }
                  placeholder="Short pitch about the product for search previews"
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField
                label="Tags"
                helpText="Tags help customers find the product via filters and search."
                className="md:col-span-2"
              >
                <MultiSelectTags
                  options={commonTags}
                  value={form.tags}
                  onChange={(tags) => updateForm("tags", tags)}
                  maxTags={15}
                  allowCustom
                />
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Shipping & returns"
            subtitle="Set delivery expectations clearly."
            isOpen={sections.shipping}
            onToggle={() => toggleSection("shipping")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Dispatch time">
                <input
                  type="text"
                  value={form.shippingTime}
                  onChange={(event) =>
                    updateForm("shippingTime", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                />
              </FormField>

              <FormField label="Return policy">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <span className="text-slate-600">Returns accepted</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateForm("returnPolicy", !form.returnPolicy)
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      form.returnPolicy ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    aria-pressed={form.returnPolicy}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.returnPolicy ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </FormField>
            </div>
          </FormSection>

          <FormSection
            title="Publishing"
            subtitle="Choose how the product appears across the storefront."
            isOpen={sections.status}
            onToggle={() => toggleSection("status")}
          >
            <div className="grid gap-6 md:grid-cols-2">
              <FormField label="Visibility">
                <select
                  value={form.visibility}
                  onChange={(event) =>
                    updateForm("visibility", event.target.value)
                  }
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </FormField>

              <FormField label="Featured listing">
                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
                  <span className="text-slate-600">
                    Highlight on landing page
                  </span>
                  <button
                    type="button"
                    onClick={() => updateForm("featured", !form.featured)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                      form.featured ? "bg-emerald-500" : "bg-slate-300"
                    }`}
                    aria-pressed={form.featured}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                        form.featured ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </FormField>
            </div>
          </FormSection>

          <div className="sticky bottom-6 z-10 flex flex-col gap-3 rounded-3xl border border-emerald-200 bg-white/90 p-4 shadow-xl backdrop-blur">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {mode === "edit" ? "Review and publish" : "Ready to publish"}
                </p>
                <p className="text-xs text-slate-500">
                  {mode === "edit"
                    ? "Save updates to sync with the live catalog."
                    : "Publish the product to make it available in the store."}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="border border-slate-200 bg-white text-slate-600"
                  disabled={
                    saving ||
                    loadingExisting ||
                    (mode === "edit" && Boolean(loadError))
                  }
                >
                  {mode === "edit" ? "Revert" : "Reset"}
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 px-6 py-2 text-white shadow-lg hover:bg-emerald-700"
                  disabled={
                    saving ||
                    loadingExisting ||
                    (mode === "edit" && Boolean(loadError))
                  }
                >
                  {saving
                    ? "Saving…"
                    : mode === "edit"
                    ? "Save changes"
                    : "Save product"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpload;
