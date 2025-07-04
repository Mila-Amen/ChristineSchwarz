import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const categoriesData = [
  'all',
  'kinderkraft',
  'microbiome',
  'haircare'
];

const products = [
  { id: 1, key: 'kinderkraft', category: 'kinderkraft', price: '€12.99', image: '/KinderKraft.jpg', link: 'https://example.com/product1' },
  { id: 2, key: 'microbiome', category: 'microbiome', price: '€24.50', image: '/MagicBox.jpg', link: 'https://example.com/product2' },
  { id: 3, key: 'haircare', category: 'haircare', price: '€18.00', image: '/HairCare.jpg', link: 'https://example.com/product3' },
  { id: 4, key: 'book', category: 'all', price: '€15.00', image: '/images/book.jpg', link: 'https://example.com/product4' }
];

export default function ShopPage() {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <section className="bg-primary">
      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto py-12 px-6 lg:px-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 mb-10 lg:mb-0 mt-20">
          <h2 className="text-xl font-bold mb-4 hover:text-teal-600">
            {t('shop.categoriesTitle')}
          </h2>
          <ul className="space-y-2 font-bold">
            {categoriesData.map((key) => (
              <li key={key}>
                <button
                  onClick={() => setSelectedCategory(key)}
                  className={`w-full text-left px-3 py-2 rounded ${
                    selectedCategory === key
                      ? 'bg-primary text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  {t(`shop.categories.${key}`)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Products Grid */}
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 flex-1 mt-20">
          {filteredProducts.map((product) => (
            <a
              key={product.id}
              href={product.link}
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-lg shadow hover:text-black transition block bg-[#4D5D53] text-white"
            >
              <img
                src={product.image}
                alt={t(`shop.products.${product.key}`)}
                className="w-full h-48 object-cover mb-4 rounded"
              />
              <h3 className="text-lg font-semibold mb-2">{t(`shop.products.${product.key}`)}</h3>
              <p className="text-primary font-bold text-white">{product.price}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
