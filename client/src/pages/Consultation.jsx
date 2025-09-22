import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function ConsultationPage() {
  const { t } = useTranslation();

  const consultationKeys = ["meditation", "health", "stress"];

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12 mt-20">
        <h2 className="text-3xl font-bold text-teal-600 hover:text-white">
          {t("consultation.title")}
        </h2>
        <p className="text-gray-100 mt-2">{t("consultation.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {consultationKeys.map((key) => {
          const item = t(`consultation.items.${key}`, { returnObjects: true });
          const packages = t(`consultationDetails.items.${key}.packages`, {
            returnObjects: true,
          }) || [{ label: item.invest || "", price: item.invest || "" }];

          // show price or range if multiple packages
          const priceDisplay =
            key === "stress"
              ? "€360 "
              : packages.length > 1
              ? `${packages[0].price} - ${packages[packages.length - 1].price}`
              : packages[0].price;

          return (
            <div
              key={key}
              className={`rounded-lg shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 ${
                key === "health"
                  ? "bg-[#1b3d35] text-white scale-105 hover:scale-110"
                  : "bg-white text-gray-900"
              }`}>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  {t(`consultation.titles.${key}`)}
                </h3>
                <p className="text-sm mb-4">{item.description}</p>
                <p className="text-3xl font-bold mb-2">
                  {priceDisplay}
                  <span className="text-base font-normal"> /3 Session</span>
                </p>
                <hr
                  className={`mb-4 ${
                    key === "health" ? "border-yellow-500" : "border-gray-300"
                  }`}
                />
                <ul className="space-y-2 text-sm">
                  {item.features.map((feature, idx) => (
                    <li key={idx}>• {feature}</li>
                  ))}
                </ul>
              </div>

              <Link
                to={`/consultation/${key}`}
                className="mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center">
                {t("consultation.button")}
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
