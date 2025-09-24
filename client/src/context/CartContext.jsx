import React, { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("cartItems");
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Sync across multiple tabs
  useEffect(() => {
    const syncCart = (event) => {
      if (event.key === "cartItems" && event.newValue) {
        setCartItems(JSON.parse(event.newValue));
      }
    };
    window.addEventListener("storage", syncCart);
    return () => window.removeEventListener("storage", syncCart);
  }, []);

  const addToCart = (item) => {
    if (!item.quantity) item.quantity = 1;

    setCartItems((prev) => {
      const updated = [...prev];

      if (item.type !== "consultation") {
        const existingIndex = updated.findIndex(
          (i) => i.key === item.key && i.type !== "consultation"
        );

        if (existingIndex !== -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          };
          return updated;
        }
      }

      // Add new item if not found
      updated.push(item);
      return updated;
    });
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index, quantity) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const totalPrice = cartItems.reduce((total, item) => {
    const priceStr =
      typeof item.price === "string" ? item.price : String(item.price);
    const priceNum = parseFloat(priceStr.replace("€", "").trim()) || 0;
    const quantity = item.quantity || 1;
    return total + priceNum * quantity;
  }, 0);

  // Compute cartCount dynamically
  const cartCount = cartItems.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

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
      }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
