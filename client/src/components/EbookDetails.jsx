import React, { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const ebook = {
  key: "ebook",
  title: "E-Book über gesunde Gewohnheiten",
  sampleLink: "/ebooks/kostenloses E-Book.pdf",
  fullPrice: "€29",
};

export default function EbookDetails() {
  const { t } = useTranslation();
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart({
      ...ebook,
      price: ebook.fullPrice,
      quantity: 1,
    });
    setIsAdded(true);
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* Title */}
        <h2 className="text-3xl font-bold text-teal-700 mb-4">{ebook.title}</h2>

        {/* Description / Intro */}
        <p className="text-gray-700 mb-6">
          {t("shop.products.ebookIntro", "Dieses E-Book gibt dir wertvolle Einblicke in gesunde Gewohnheiten und Ernährung.")}
        </p>

        {/* Sample PDF Preview */}
        <h3 className="text-xl font-semibold mb-2">{t("shop.products.sample", "Leseprobe")}</h3>
        <iframe
          src={ebook.sampleLink}
          title="Ebook Preview"
          className="w-full h-96 border mb-6"
        ></iframe>

        {/* Price & Add to Cart */}
        <h3 className="text-xl font-semibold mb-2">{t("shop.products.fullPrice", "Vollversion")}</h3>
        <p className="text-gray-700 mb-4">{ebook.fullPrice}</p>
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 ${
            isAdded ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isAdded ? t("shop.products.added", "Hinzugefügt") : t("shop.products.addToCart", "In den Warenkorb")}
        </button>

        {/* Back to Shop */}
        <div className="mt-6">
          <Link
            to="/shop"
            className="bg-gray-300 text-gray-900 py-2 px-4 rounded hover:bg-gray-400"
          >
            ← {t("shop.backToShop", "Zurück zum Shop")}
          </Link>
        </div>
      </div>
    </section>
  );
}
