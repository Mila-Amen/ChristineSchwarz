import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    // ✅ Initialize directly from localStorage
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  const [cartCount, setCartCount] = useState(() => {
    const saved = localStorage.getItem("cartCount");
    return saved ? Number(saved) : 0;
  });

  // ✅ Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartCount", cartCount.toString());
  }, [cartItems, cartCount]);

  // ✅ Sync across multiple browser tabs
  useEffect(() => {
    const syncCart = (event) => {
      if (event.key === "cartItems" && event.newValue) {
        setCartItems(JSON.parse(event.newValue));
      }
      if (event.key === "cartCount" && event.newValue) {
        setCartCount(Number(event.newValue));
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const addToCart = (item) => {
    setCartItems((prev) => [...prev, item]);
    setCartCount((prev) => prev + 1);
  };

  const removeFromCart = (index) => {
    const removedItem = cartItems[index];
    setCartItems((prev) => prev.filter((_, i) => i !== index));

    if (removedItem) {
      setCartCount((prev) => Math.max(prev - 1, 0));
    }
  };

  const updateQuantity = (index, quantity) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartCount(0);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const priceStr =
      typeof item.price === "string" ? item.price : String(item.price);
    const priceNum = parseFloat(priceStr.replace("€", "").trim()) || 0;
    const quantity = item.quantity || 1;
    return total + priceNum * quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
