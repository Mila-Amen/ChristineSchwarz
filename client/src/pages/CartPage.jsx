import React from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } =
    useCart();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <section className="bg-primary py-16 px-8 lg:px-32">
      <h2 className="text-3xl font-bold mb-6 mt-16 text-gray-50">
        {t("cartPage.title")}
      </h2>

      {cartItems.length === 0 ? (
        <p>
          {t("cartPage.empty")}{" "}
          <Link to="/shop" className="text-blue-500">
            {t("cartPage.backToShop")}
          </Link>
        </p>
      ) : (
        <>
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={index}
                className="flex flex-col lg:flex-row items-start lg:items-center justify-between bg-gray-100 p-4 rounded"
              >
                {/* Item Info */}
                <div className="flex flex-col gap-1 w-full lg:w-3/4">
                  <h3 className="font-bold text-lg">
                    {item.type === "consultation"
                      ? t(`consultation.titles.${item.key}`, {
                          defaultValue: item.title,
                        })
                      : t(`shop.products.${item.key}`, {
                          defaultValue: item.title,
                        })}
                  </h3>

                  {item.type && <p>{t(`cartPage.types.${item.type}`)}</p>}
                  {item.date && (
                    <p>
                      {t("cartPage.date")}:{" "}
                      {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                  {item.time && (
                    <p>
                      {t("cartPage.time")}: {item.time}
                    </p>
                  )}
                  {item.quantity && (
                    <p>
                      {t("cartPage.quantity")}: {item.quantity}
                    </p>
                  )}
                  <p>
                    {t("cartPage.price")}: {item.price}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 mt-4 lg:mt-0">
                  {item.quantity && (
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(index, parseInt(e.target.value))
                      }
                      className="w-20 border p-1 rounded"
                    />
                  )}
                  <button
                    onClick={() => removeFromCart(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    {t("cartPage.remove")}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Total & Actions */}
          <div className="mt-8 flex flex-col lg:flex-row justify-between items-center gap-4">
            <h3 className="text-xl font-bold text-gray-50">
              {t("cartPage.total")}: €{totalPrice.toFixed(2)}
            </h3>
            <div className="flex gap-2">
              <button
                onClick={clearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                {t("cartPage.clearCart")}
              </button>
              <button
                onClick={() => navigate("/checkout")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                {t("cartPage.checkout")}
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
