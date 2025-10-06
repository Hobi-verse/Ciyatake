const mongoose = require("mongoose");

// Schema for product variants (size, color combinations)
const variantSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  size: {
    type: String,
    required: true,
    trim: true,
  },
  color: {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    hex: {
      type: String,
      trim: true,
    },
  },
  stockLevel: {
    type: Number,
    default: 0,
    min: 0,
  },
  priceOverride: {
    type: Number,
    min: 0,
  },
  images: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
});

// Schema for product media (images, videos)
const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  thumbnail: {
    type: String,
  },
  alt: {
    type: String,
    default: "",
  },
  isPrimary: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    enum: ["image", "video"],
    default: "image",
  },
});

// Schema for product specifications
const specificationSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: String,
    required: true,
  },
});

// Schema for product details sections
const detailSectionSchema = new mongoose.Schema({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  features: [String],
});

// Schema for review highlights
const reviewHighlightSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
});

// Main Product schema
const productSchema = new mongoose.Schema(
  {
    // Unique identifier for URL (e.g., "classic-white-tee")
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    // Product title
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Product description
    description: {
      type: String,
      trim: true,
      default: "",
    },

    // Category reference (can be ObjectId or string enum)
    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    // Base price in smallest currency unit (e.g., paise for INR)
    basePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // Product media (images, videos)
    media: [mediaSchema],

    // Product benefits/highlights
    benefits: [String],

    // Product details and features
    details: detailSectionSchema,

    // Technical specifications
    specifications: [specificationSchema],

    // Review highlights
    reviewHighlights: [reviewHighlightSchema],

    // Product variants (size/color combinations)
    variants: [variantSchema],

    // Related product IDs
    relatedProductIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    // Tags for search and filtering
    tags: [String],

    // Product status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Total stock across all variants (computed field)
    totalStock: {
      type: Number,
      default: 0,
    },

    // Average rating (computed from reviews)
    averageRating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // Total number of reviews
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // SEO metadata
    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String],
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for performance
productSchema.index({ slug: 1 });
productSchema.index({ category: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ isActive: 1 });
productSchema.index({ "variants.sku": 1 });

// Virtual for availability
productSchema.virtual("isAvailable").get(function () {
  return this.isActive && this.totalStock > 0;
});

// Method to update total stock
productSchema.methods.updateTotalStock = function () {
  this.totalStock = this.variants.reduce(
    (sum, variant) => sum + (variant.isActive ? variant.stockLevel : 0),
    0
  );
  return this.totalStock;
};

// Method to get variant by SKU
productSchema.methods.getVariantBySku = function (sku) {
  return this.variants.find((v) => v.sku === sku);
};

// Pre-save hook to update total stock
productSchema.pre("save", function (next) {
  if (this.isModified("variants")) {
    this.updateTotalStock();
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);
