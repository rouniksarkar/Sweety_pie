import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const storedCart = localStorage.getItem("cart");
    return storedCart ? JSON.parse(storedCart) : { items: [], totalPrice: 0 };
  });

  // Sync cart to localStorage
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // ✅ Add this function to clear the cart
  const clearCart = async () => {
    try {
      // Clear cart on backend
      await axios.delete("/api/v1/cart/clear-cart", {
        withCredentials: true,
      });
      
      // Clear cart locally
      setCart({ items: [], totalPrice: 0 });
      
      // Remove from localStorage
      localStorage.removeItem("cart");
    } catch (err) {
      console.error("Error clearing cart:", err);
      // Still clear locally even if backend fails
      setCart({ items: [], totalPrice: 0 });
      localStorage.removeItem("cart");
    }
  };

  const fetchCart = async () => {
    try {
      const { data } = await axios.get("/api/v1/cart/get-cart", {
        withCredentials: true,
      });
      const backendCart = data.cart || data;
      setCart(backendCart);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const { data } = await axios.post(
        "/api/v1/cart/add-cart",
        { productId, quantity },
        { withCredentials: true }
      );
      setCart(data.cart);
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  const updateQuantity = async (productId, quantity) => {
    const previousCart = { ...cart };
    try {
      // Optimistic update
      setCart((prevCart) => {
        const newItems = prevCart.items.map((item) =>
          item.productId._id === productId ? { ...item, quantity } : item
        );
        return { ...prevCart, items: newItems };
      });

      await axios.put(
        `/api/v1/cart/update-cart/${productId}`,
        { quantity },
        { withCredentials: true }
      );
    } catch (err) {
      console.error("Error updating quantity:", err);
      setCart(previousCart);
    }
  };

  const removeFromCart = async (productId) => {
    const previousCart = { ...cart };
    try {
      setCart((prevCart) => ({
        ...prevCart,
        items: prevCart.items.filter(
          (item) => item.productId._id !== productId
        ),
      }));

      await axios.delete(`/api/v1/cart/remove-cart/${productId}`, {
        withCredentials: true,
      });
    } catch (err) {
      console.error("Error removing product:", err);
      setCart(previousCart);
    }
  };

  // ✅ Calculate total with discount
  const getCartTotal = () => {
    return (cart.items || []).reduce((acc, item) => {
      const product = item.productId;
      const price = product.finalPrice ?? product.price; // backend sends finalPrice
      return acc + price * item.quantity;
    }, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        fetchCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        getCartTotal,
        clearCart, // ✅ Now this is provided to components
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);