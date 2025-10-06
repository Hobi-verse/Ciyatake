import { useCallback, useMemo, useState } from "react";
import Button from "../../common/Button.jsx";
import FormField from "./FormField.jsx";
import FormSection from "./FormSection.jsx";
import ImageUploader from "./ImageUploader.jsx";
import VideoUploader from "./VideoUploader.jsx";
import ColorPicker from "./ColorPicker.jsx";
import MultiSelectTags from "./MultiSelectTags.jsx";
import RichTextEditor from "./RichTextEditor.jsx";
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

const ProductUpload = () => {
  const [form, setForm] = useState(DEFAULT_FORM);
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
  const [message, setMessage] = useState("");

  const availableCategories = useMemo(() => {
    if (!form.gender) return [];
    return Object.keys(categoryStructure[form.gender] ?? {});
  }, [form.gender]);

  const availableSubCategories = useMemo(() => {
    if (!form.gender || !form.category) return [];
    return categoryStructure[form.gender]?.[form.category] ?? [];
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

  const updateForm = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const selectGender = (gender) => {
    updateForm("gender", gender);
    updateForm("category", "");
    updateForm("subCategory", "");
  };

  const selectCategory = (category) => {
    updateForm("category", category);
    updateForm("subCategory", "");
  };

  const toggleSize = (size) => {
    updateForm(
      "availableSizes",
      form.availableSizes.includes(size)
        ? form.availableSizes.filter((item) => item !== size)
        : [...form.availableSizes, size]
    );
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Product title is required";
    if (!form.description.trim())
      nextErrors.description = "Product description is required";
    if (!form.brand.trim()) nextErrors.brand = "Brand is required";
    if (!form.gender) nextErrors.gender = "Select a target gender";
    if (!form.category) nextErrors.category = "Select a category";
    if (!form.price) nextErrors.price = "Price is required";
    if (form.price && Number(form.price) <= 0)
      nextErrors.price = "Price must be positive";
    if (!form.stockQuantity)
      nextErrors.stockQuantity = "Stock quantity is required";
    if (form.stockQuantity && Number(form.stockQuantity) < 0) {
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
    setMessage("");

    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setMessage(
        "Product saved as draft. Connect the backend to persist the data."
      );
      // Keep form data for subsequent edits.
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong while saving the product.");
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setForm(DEFAULT_FORM);
    setErrors({});
    setMessage("");
  };

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
              Add new product
            </h1>
            <p className="text-sm text-slate-600">
              Provide detailed information so shoppers understand the product
              instantly.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              type="button"
              className="border border-emerald-200 bg-white text-emerald-700"
              onClick={resetForm}
            >
              Reset form
            </Button>
            <Button
              type="button"
              className={`border border-emerald-200 ${
                form.visibility === "draft"
                  ? "bg-white text-emerald-700"
                  : "bg-emerald-600 text-white"
              }`}
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

        {message ? (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-100/60 px-4 py-3 text-sm text-emerald-800">
            {message}
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
                  Unsaved changes
                </p>
                <p className="text-xs text-slate-500">
                  Don’t worry, you can publish after connecting the backend
                  service.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  onClick={resetForm}
                  className="border border-slate-200 bg-white text-slate-600"
                  disabled={saving}
                >
                  Discard
                </Button>
                <Button
                  type="submit"
                  className="bg-emerald-600 px-6 py-2 text-white shadow-lg hover:bg-emerald-700"
                  disabled={saving}
                >
                  {saving ? "Saving…" : "Save product"}
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
