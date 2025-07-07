import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// Dummy authentication check
const isAuthenticated = () => !!localStorage.getItem("user");

const consultationDetails = {
  meditation: {
    price: "€200",
    description: "Relax your mind and body with guided meditation sessions.",
  },
  health: {
    price: "€300",
    description: "Comprehensive health management and coaching.",
  },
  stress: {
    price: "€250",
    description: "Professional help for stress and burnout recovery.",
  },
};

export default function ConsultationDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const details = consultationDetails[id];

  if (!details) {
    return <p className="text-center py-20 text-white">{t("consultation.notFound")}</p>;
  }

  const handleAddToCart = () => {
    if (!isAuthenticated()) {
      navigate("/login", { state: { from: `/consultation/${id}` } });
    } else {
      // Add to cart logic (replace with real implementation)
      alert(`${t("consultation.added")} ${t(`consultation.titles.${id}`)}`);
    }
  };

  return (
    <section className="bg-primary py-16 px-4">
      <div className="max-w-3xl mx-auto text-center mt-20">
        <h2 className="text-3xl font-bold mb-4">
          {t(`consultationDetails.titles.${id}`)}
        </h2>
        <p className="mb-4 text-gray-700">{details.description}</p>
        <p className="text-2xl font-bold mb-6">{details.price}</p>

        <button
          onClick={handleAddToCart}
          className="bg-green-600 text-white py-2 px-6 rounded hover:bg-green-700"
        >
          {t("consultationDetails.addToCart")}
        </button>
      </div>
    </section>
  );
}
