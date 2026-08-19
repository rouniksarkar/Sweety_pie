import { Cart } from "../models/cart.model.js";
import { Product } from "../models/products.model.js";

// Helper: format cart with discount
const formatCartWithDiscount = (cart) => {
  if (!cart) return null;

  return {
    ...cart.toObject(),
    items: cart.items.map(item => ({
      ...item.toObject(),
      productId: {
        ...item.productId.toObject(),
        finalPrice: item.productId.getDiscountedPrice(), // ✅ add discounted price
      }
    }))
  };
};

// Helper: calculate total with discount
const calculateTotal = async (items) => {
  let total = 0;
  for (let item of items) {
    const product = await Product.findById(item.productId);
    if (product) {
      const discounted = product.getDiscountedPrice(); // ✅ use discount
      total += discounted * item.quantity;
    }
  }
  return total;
};

// ✅ Add product to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ customer: userId }).populate("items.productId");

    if (!cart) {
      cart = new Cart({
        customer: userId,
        items: [{ productId, quantity }],
        totalPrice: product.getDiscountedPrice() * quantity,
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      cart.totalPrice = await calculateTotal(cart.items);
    }

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      message: "Added to cart",
      cart: formatCartWithDiscount(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// In your cart controller file (cart.controller.js)
// ✅ Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find user's cart
    let cart = await Cart.findOne({ customer: userId });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false,
        message: 'Cart not found' 
      });
    }
    
    // Clear cart items and reset total
    cart.items = [];
    cart.totalPrice = 0;
    
    await cart.save();
    
    return res.status(200).json({
      success: true,
      message: 'Cart cleared successfully',
      cart: {
        items: [],
        totalPrice: 0
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error clearing cart' 
    });
  }
};

// ✅ Get user's cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ customer: req.user._id })
      .populate({
        path: "items.productId",
        select: "name price discountType discountValue productImage",
      });

    if (!cart) {
      return res.status(200).json({ message: "Cart is empty", cart: { items: [] } });
    }

    return res.status(200).json({
      cart: formatCartWithDiscount(cart),
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await Cart.findOne({ customer: req.user._id }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(item => item.productId._id.toString() !== productId);
    cart.totalPrice = await calculateTotal(cart.items);

    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      message: "Removed from cart",
      cart: formatCartWithDiscount(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Update quantity
export const updateQuantity = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    const cart = await Cart.findOne({ customer: req.user._id }).populate("items.productId");
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(item => item.productId._id.toString() === productId);
    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
    } else {
      return res.status(404).json({ message: "Product not in cart" });
    }

    cart.totalPrice = await calculateTotal(cart.items);
    await cart.save();
    await cart.populate("items.productId");

    return res.status(200).json({
      message: "Quantity updated",
      cart: formatCartWithDiscount(cart),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
