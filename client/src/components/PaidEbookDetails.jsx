import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const paidEbook = {
  key: "paidEbook",
  title: "E-Book on Healthy Habits ",
  coverImage: "/E-Book.jpg",
  sampleLink: "/ebooks/kostenlosesE-Book.pdf", // can show same preview as free
  fullPrice: "€29",
};

export default function PaidEbookDetails() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      ...paidEbook,
      key: "paidEbook", // matches shop.products
      price: paidEbook.fullPrice,
      quantity: 1,
      type: "ebook",
      title: t("shop.products.paidEbook"), // ensures translation
    });
    setIsAdded(true);
  };

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-16">
        {/* Title */}
        <h2 className="text-3xl font-bold text-teal-700 mb-4">
          {t("shop.products.paidEbook")}
        </h2>

        {/* Description / Intro */}
        <p className="text-gray-700 mb-6">
          {t(
            "shop.products.paidEbookIntro",
            "This full version e-book provides detailed insights into healthy habits, nutrition, and practical exercises to improve your daily life."
          )}
        </p>

        {/* Sample PDF Preview */}

        <img
          src={paidEbook.coverImage} // add a new property for cover image in your ebook object
          alt="Paid Ebook Cover"
          className="w-full h-[600px] object-cover mb-6 rounded"
        />

        {/* Price & Add to Cart */}
        <h3 className="text-xl font-semibold mb-2">
          {t("shop.products.paidEbook", "Full Version")}
        </h3>

        <p className="text-gray-700 mb-4">{paidEbook.fullPrice}</p>
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
            isAdded ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          {isAdded
            ? t("shop.products.added", "Added")
            : t("shop.products.addToCart", "Add to Cart")}
        </button>

        {/* Back to Shop */}
        <div className="mt-6">
          <Link
            to="/shop"
            className="bg-gray-300 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
            ← {t("shop.products.backToShop", "Back to Shop")}
          </Link>
        </div>
      </div>
    </section>
  );
}
