import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const consultations = [
  {
    key: "meditation",
    price: "€200",
    highlighted: false,
  },
  {
    key: "health",
    price: "€300",
    highlighted: true,
  },
  {
    key: "stress",
    price: "€250",
    highlighted: false,
  },
];

export default function ConsultationPage() {
  const { t } = useTranslation();

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-7xl mx-auto text-center mb-12 mt-20">
        <h2 className="text-3xl font-bold text-teal-600 hover:text-white">
          {t("consultation.title")}
        </h2>
        <p className="text-gray-100 mt-2">{t("consultation.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {consultations.map((item) => (
          <div
            key={item.key}
            className={`rounded-lg shadow-lg p-6 flex flex-col justify-between transform transition-transform duration-300 hover:scale-105 ${
              item.highlighted
                ? "bg-[#1b3d35] text-white  scale-105 hover:scale-110"
                : "bg-white text-gray-900"
            }`}
          >
            <div>
              <h3 className="text-xl font-semibold mb-2 ">
                {t(`consultation.titles.${item.key}`)}
              </h3>
              <p className="text-sm mb-4">{t("consultation.description")}</p>
              <p className="text-3xl font-bold mb-2">
                {item.price}
                <span className="text-base font-normal"> /Session</span>
              </p>
              <hr
                className={`mb-4 ${
                  item.highlighted ? "border-yellow-500" : "border-gray-300"
                }`}
              />
              <ul className="space-y-2 text-sm">
                <li>• {t("consultation.features.therapy")}</li>
                <li>• {t("consultation.features.counseling")}</li>
                <li>• {t("consultation.features.mental")}</li>
                <li>• {t("consultation.features.success")}</li>
              </ul>
            </div>

            <Link
              to={`/consultation/${item.key}`}
              className="mt-6 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
            >
              {t("consultation.button")}
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
