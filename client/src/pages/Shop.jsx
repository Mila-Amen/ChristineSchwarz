import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const categoriesData = ["all", "healthManagement", "stressBurnout", "meditation", "ebook"];

const products = [
  {
    id: 1,
    key: "healthManagement",
    category: "healthManagement",
    image: "/HealthManagement.jpg",
    link: "https://thealoeveraco.shop/8FkLMnTE",
  },
  {
    id: 2,
    key: "stressBurnout",
    category: "stressBurnout",
    image: "/StressBurnoutCoaching.jpg",
    link: "https://thealoeveraco.shop/tP5KbRtM",
  },
  {
    id: 3,
    key: "meditation",
    category: "meditation",
    image: "/Meditation.jpg",
    link: "https://thealoeveraco.shop/OCPCUAi7",
  },
  {
    id: 4,
    key: "ebook",
    category: "ebook",
    image: "/Ebook.jpg",
    link: "/ebook-details", // redirect to your ebook details page
    download: true,
  },
];

export default function ShopPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="bg-primary">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-12 px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 mb-10 lg:mb-0 mt-20">
          <h2 className="text-xl font-bold mb-4 hover:text-teal-600">
            {t("shop.categoriesTitle")}
          </h2>
          <ul className="space-y-2 font-bold">
            {categoriesData.map((key) => (
              <li key={key}>
                <button
                  onClick={() => setSelectedCategory(key)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === key
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}>
                  {t(`shop.categories.${key}`)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-1 mt-20">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={product.category === "ebook" ? "/ebook-details" : product.link}
              target={product.download ? "_self" : "_blank"}
              rel="noopener noreferrer"
              className="p-4 rounded-lg shadow hover:text-black transition block bg-[#4D5D53] text-white">
              <img
                src={product.image}
                alt={t(`shop.products.${product.key}`)}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">
                {t(`shop.products.${product.key}`)}
              </h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
