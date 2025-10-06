const Cart = require('../models/Cart');
const Product = require('../models/Product');

/**
 * @desc    Get user's cart
 * @route   GET /api/cart
 * @access  Private
 */
const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get or create cart
    let cart = await Cart.findOne({ userId }).populate('items.productId', 'title slug price salePrice brand category media');

    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Update product snapshots with latest data
    const updatedItems = await Promise.all(
      cart.items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (product) {
          const variant = product.variants.find(v => v.sku === item.variantSku);
          if (variant) {
            // Update snapshot data
            item.price = variant.price || product.salePrice || product.price;
            item.title = product.title;
            item.imageUrl = product.media.find(m => m.isPrimary)?.url || product.media[0]?.url;
          }
        }
        return item;
      })
    );

    cart.items = updatedItems;
    await cart.save();

    res.status(200).json({
      success: true,
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId?.slug || item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            addedAt: item.addedAt,
            variantSku: item.variantSku
          })),
          totals: cart.totals,
          lastActivityAt: cart.lastActivityAt
        }
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart',
      error: error.message
    });
  }
};

/**
 * @desc    Add item to cart
 * @route   POST /api/cart/items
 * @access  Private
 */
const addCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, variantSku, quantity = 1 } = req.body;

    // Validate input
    if (!productId || !variantSku) {
      return res.status(400).json({
        success: false,
        message: 'Product ID and variant SKU are required'
      });
    }

    // Find product and variant
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) {
      return res.status(404).json({
        success: false,
        message: 'Product variant not found'
      });
    }

    // Check stock availability
    if (variant.stockLevel < quantity) {
      return res.status(400).json({
        success: false,
        message: `Only ${variant.stockLevel} items available in stock`
      });
    }

    // Get or create cart
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = await Cart.create({ userId });
    }

    // Prepare item data
    const itemData = {
      productId: product._id,
      variantSku: variant.sku,
      title: product.title,
      price: variant.price || product.salePrice || product.price,
      size: variant.size,
      color: variant.color.name,
      imageUrl: product.media.find(m => m.isPrimary)?.url || product.media[0]?.url,
      quantity: quantity,
      savedForLater: false
    };

    // Add item using model method
    cart.addItem(itemData);
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Item added to cart',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Add cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add item to cart',
      error: error.message
    });
  }
};

/**
 * @desc    Update cart item quantity
 * @route   PATCH /api/cart/items/:itemId
 * @access  Private
 */
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate quantity
    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1'
      });
    }

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Find item
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Check stock availability
    const product = await Product.findById(item.productId);
    if (product) {
      const variant = product.variants.find(v => v.sku === item.variantSku);
      if (variant && variant.stockLevel < quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${variant.stockLevel} items available in stock`
        });
      }
    }

    // Update quantity
    cart.updateItemQuantity(itemId, quantity);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update cart item',
      error: error.message
    });
  }
};

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/cart/items/:itemId
 * @access  Private
 */
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Remove item
    cart.removeItem(itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to remove item from cart',
      error: error.message
    });
  }
};

/**
 * @desc    Save item for later
 * @route   PATCH /api/cart/items/:itemId/save-for-later
 * @access  Private
 */
const saveItemForLater = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart'
      });
    }

    // Save for later
    cart.saveItemForLater(itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item saved for later',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Save item for later error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save item for later',
      error: error.message
    });
  }
};

/**
 * @desc    Move item back to cart from saved for later
 * @route   PATCH /api/cart/items/:itemId/move-to-cart
 * @access  Private
 */
const moveItemToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { itemId } = req.params;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Check if item exists
    const item = cart.items.id(itemId);
    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found'
      });
    }

    // Check stock availability
    const product = await Product.findById(item.productId);
    if (product) {
      const variant = product.variants.find(v => v.sku === item.variantSku);
      if (variant && variant.stockLevel < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Only ${variant.stockLevel} items available in stock`
        });
      }
    }

    // Move to cart
    cart.moveItemToCart(itemId);
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item moved to cart',
      data: {
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Move item to cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to move item to cart',
      error: error.message
    });
  }
};

/**
 * @desc    Clear cart
 * @route   DELETE /api/cart
 * @access  Private
 */
const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    // Clear cart
    cart.clearCart();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: {
        cart: {
          id: cart._id,
          items: [],
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
};

/**
 * @desc    Get cart summary (for header/badge display)
 * @route   GET /api/cart/summary
 * @access  Private
 */
const getCartSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get cart
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(200).json({
        success: true,
        data: {
          itemCount: 0,
          subtotal: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        itemCount: cart.totals.itemCount,
        subtotal: cart.totals.subtotal,
        savedItemCount: cart.totals.savedItemCount
      }
    });
  } catch (error) {
    console.error('Get cart summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve cart summary',
      error: error.message
    });
  }
};

/**
 * @desc    Validate cart items (check stock, prices)
 * @route   POST /api/cart/validate
 * @access  Private
 */
const validateCart = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find cart
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found'
      });
    }

    const issues = [];
    const updatedItems = [];

    // Check each item
    for (const item of cart.items) {
      if (item.savedForLater) continue;

      const product = await Product.findById(item.productId);

      if (!product) {
        issues.push({
          itemId: item._id,
          type: 'product_not_found',
          message: `Product "${item.title}" is no longer available`
        });
        continue;
      }

      const variant = product.variants.find(v => v.sku === item.variantSku);

      if (!variant) {
        issues.push({
          itemId: item._id,
          type: 'variant_not_found',
          message: `Size ${item.size} in ${item.color} is no longer available for "${item.title}"`
        });
        continue;
      }

      // Check stock
      if (variant.stockLevel < item.quantity) {
        issues.push({
          itemId: item._id,
          type: 'insufficient_stock',
          message: `Only ${variant.stockLevel} items available for "${item.title}" (${item.size}, ${item.color})`,
          availableStock: variant.stockLevel,
          requestedQuantity: item.quantity
        });
      }

      // Check price changes
      const currentPrice = variant.price || product.salePrice || product.price;
      if (currentPrice !== item.price) {
        issues.push({
          itemId: item._id,
          type: 'price_changed',
          message: `Price for "${item.title}" has changed`,
          oldPrice: item.price,
          newPrice: currentPrice
        });

        // Update price in cart
        item.price = currentPrice;
        updatedItems.push(item._id);
      }
    }

    // Save if prices were updated
    if (updatedItems.length > 0) {
      await cart.save();
    }

    res.status(200).json({
      success: true,
      data: {
        valid: issues.length === 0,
        issues,
        updatedItems,
        cart: {
          id: cart._id,
          items: cart.items.map(item => ({
            id: item._id,
            productId: item.productId,
            title: item.title,
            price: item.price,
            size: item.size,
            color: item.color,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
            savedForLater: item.savedForLater,
            variantSku: item.variantSku
          })),
          totals: cart.totals
        }
      }
    });
  } catch (error) {
    console.error('Validate cart error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to validate cart',
      error: error.message
    });
  }
};

module.exports = {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  saveItemForLater,
  moveItemToCart,
  clearCart,
  getCartSummary,
  validateCart
};
