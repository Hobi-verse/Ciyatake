require("dotenv").config();
const mongoose = require("mongoose");
const Category = require("../models/Category");

// Sample categories
const categories = [
  {
    slug: "clothing",
    name: "Clothing",
    description: "Discover our collection of premium clothing for every occasion",
    heroImage: {
      url: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04",
      alt: "Clothing Collection",
    },
    filters: {
      sizes: ["xs", "s", "m", "l", "xl", "xxl"],
      colors: [
        { name: "white", hex: "#FFFFFF" },
        { name: "black", hex: "#000000" },
        { name: "blue", hex: "#0066CC" },
        { name: "red", hex: "#CC0000" },
        { name: "beige", hex: "#F5F5DC" },
      ],
      priceRanges: [
        { label: "Under ₹1000", min: 0, max: 1000 },
        { label: "₹1000 - ₹3000", min: 1000, max: 3000 },
        { label: "₹3000 - ₹5000", min: 3000, max: 5000 },
        { label: "Above ₹5000", min: 5000, max: 100000 },
      ],
    },
    displayOrder: 1,
    isActive: true,
  },
  {
    slug: "shoes",
    name: "Shoes",
    description: "Step up your style with our premium footwear collection",
    heroImage: {
      url: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2",
      alt: "Shoes Collection",
    },
    filters: {
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      colors: [
        { name: "black", hex: "#000000" },
        { name: "white", hex: "#FFFFFF" },
        { name: "brown", hex: "#8B4513" },
        { name: "navy", hex: "#000080" },
      ],
      priceRanges: [
        { label: "Under ₹2000", min: 0, max: 2000 },
        { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
        { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
        { label: "Above ₹10000", min: 10000, max: 100000 },
      ],
    },
    displayOrder: 2,
    isActive: true,
  },
  {
    slug: "accessories",
    name: "Accessories",
    description: "Complete your look with our stylish accessories",
    heroImage: {
      url: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93",
      alt: "Accessories Collection",
    },
    filters: {
      sizes: ["all", "s", "m", "l"],
      colors: [
        { name: "black", hex: "#000000" },
        { name: "brown", hex: "#8B4513" },
        { name: "tan", hex: "#D2B48C" },
        { name: "navy", hex: "#000080" },
      ],
      priceRanges: [
        { label: "Under ₹500", min: 0, max: 500 },
        { label: "₹500 - ₹2000", min: 500, max: 2000 },
        { label: "₹2000 - ₹5000", min: 2000, max: 5000 },
        { label: "Above ₹5000", min: 5000, max: 100000 },
      ],
    },
    displayOrder: 3,
    isActive: true,
  },
  {
    slug: "bags",
    name: "Bags",
    description: "Carry in style with our premium bag collection",
    heroImage: {
      url: "https://images.unsplash.com/photo-1491637639811-60e2756cc1c7",
      alt: "Bags Collection",
    },
    filters: {
      sizes: ["all", "small", "medium", "large"],
      colors: [
        { name: "black", hex: "#000000" },
        { name: "brown", hex: "#8B4513" },
        { name: "navy", hex: "#000080" },
        { name: "grey", hex: "#808080" },
      ],
      priceRanges: [
        { label: "Under ₹1000", min: 0, max: 1000 },
        { label: "₹1000 - ₹3000", min: 1000, max: 3000 },
        { label: "₹3000 - ₹7000", min: 3000, max: 7000 },
        { label: "Above ₹7000", min: 7000, max: 100000 },
      ],
    },
    displayOrder: 4,
    isActive: true,
  },
  {
    slug: "watches",
    name: "Watches",
    description: "Timeless elegance meets modern design",
    heroImage: {
      url: "https://images.unsplash.com/photo-1524805444758-089113d48a6d",
      alt: "Watches Collection",
    },
    filters: {
      sizes: ["all"],
      colors: [
        { name: "black", hex: "#000000" },
        { name: "silver", hex: "#C0C0C0" },
        { name: "gold", hex: "#FFD700" },
        { name: "rose-gold", hex: "#B76E79" },
      ],
      priceRanges: [
        { label: "Under ₹3000", min: 0, max: 3000 },
        { label: "₹3000 - ₹10000", min: 3000, max: 10000 },
        { label: "₹10000 - ₹25000", min: 10000, max: 25000 },
        { label: "Above ₹25000", min: 25000, max: 1000000 },
      ],
    },
    displayOrder: 5,
    isActive: true,
  },
];

// Seed function
async function seedCategories() {
  try {
    console.log("\n🌱 Seeding Categories...\n");

    // Connect to MongoDB
    await mongoose.connect(
      process.env.MONGODB_URI || "mongodb://localhost:27017/ciyatake",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("✅ Connected to MongoDB");

    // Clear existing categories
    const deletedCount = await Category.deleteMany({});
    console.log(`🗑️  Cleared ${deletedCount.deletedCount} existing categories`);

    // Insert new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`✅ Created ${createdCategories.length} categories:`);

    createdCategories.forEach((cat) => {
      console.log(`   - ${cat.name} (${cat.slug})`);
    });

    console.log("\n✅ Category seeding completed!\n");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
  } finally {
    await mongoose.connection.close();
    console.log("🔌 Disconnected from MongoDB\n");
  }
}

// Run seed
seedCategories();
