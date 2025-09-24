// src/pages/CheckoutPage.jsx
import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";

export default function CheckoutPage() {
  const { cartItems, totalPrice, cartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <section className="bg-primary py-16 px-4 text-center text-white">
        <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/shop" className="text-blue-400 underline">
          Go back to Shop
        </Link>
      </section>
    );
  }

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-3xl font-bold mb-6 text-gray-900">
          Checkout Summary
        </h2>

        {/* Cart Items */}
        <div className="space-y-4 mb-6">
          {cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-gray-100 p-4 rounded">
              <div className="flex flex-col">
                <h3 className="font-bold">{item.title}</h3>
                {item.quantity && <p>Qty: {item.quantity}</p>}
                {item.price && <p>Price: {item.price}</p>}
              </div>
              {item.coverImage && (
                <img
                  src={item.coverImage}
                  alt={item.title}
                  className="w-20 h-28 object-cover rounded"
                />
              )}
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">
            Total ({cartCount} items):
          </h3>
          <p className="text-xl font-bold text-gray-900">
            €{totalPrice.toFixed(2)}
          </p>
        </div>

        {/* Payment Button */}
        <button
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 text-lg font-bold"
          onClick={() => alert("Here we will redirect to payment gateway")}>
          Proceed to Payment
        </button>

        {/* Back to Cart */}
        <div className="mt-6 text-center">
          <Link to="/cart" className="text-blue-500 underline">
            ← Back to Cart
          </Link>
        </div>
      </div>
    </section>
  );
}
