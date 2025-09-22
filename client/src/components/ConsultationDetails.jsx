import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useCart } from "../context/CartContext.jsx";

const consultations = [
  { key: "meditation", price: "€200" },
  { key: "health", price: "€300" },
  { key: "stress", price: "€250" },
];

// Example time slots – you can expand these as needed
const timeSlots = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00"];

export default function ConsultationDetails() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { addToCart } = useCart();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");

  const consultation = consultations.find((c) => c.key === id);

  if (!consultation) {
    return (
      <div className="max-w-3xl mx-auto py-20 text-center text-gray-800">
        <h2 className="text-2xl font-bold mb-4">
          {t("consultationDetails.notFound")}
        </h2>
        <Link
          to="/consultations"
          className="mt-4 inline-block bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
          ← {t("consultation.back")}
        </Link>
      </div>
    );
  }
  // get meditation packages
  const packages =
    consultation.key === "meditation"
      ? t(`consultationDetails.items.${consultation.key}.packages`, {
          returnObjects: true,
        }) || []
      : [];
  // handle selected price for meditation
  const [selectedPrice, setSelectedPrice] = useState(
    consultation.key === "meditation"
      ? t(`consultationDetails.items.${consultation.key}.packages`, {
          returnObjects: true,
        })[0].price
      : consultation.price
  );

  const features = t(`consultation.items.${consultation.key}.features`, {
    returnObjects: true,
  });
  const handleAddToCart = () => {
    if (!selectedDate) {
      alert(t("consultationDetails.dateError"));
      return;
    }
    if (!selectedTime) {
      alert(t("consultationDetails.timeError"));
      return;
    }

    addToCart({
      ...consultation,
      date: selectedDate,
      time: selectedTime,
      price:
        consultation.key === "meditation" ? selectedPrice : consultation.price,
    });
  };

  return (
    <section className="bg-gray-50 py-16 px-4">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-8">
        {/* title */}
        <h2 className="text-3xl font-bold text-teal-700 mb-4">
          {t(`consultationDetails.titles.${consultation.key}`)}
        </h2>

        {/* intro */}
        <p className="text-gray-700 mb-6">
          {t(`consultationDetails.items.${consultation.key}.intro`)}
        </p>

        {/* expect */}
        <h3 className="text-xl font-semibold mb-2">
          {t("consultationDetails.expectTitle", "What to expect")}
        </h3>
        <ul className="list-disc list-inside space-y-2 mb-6 text-gray-700">
          {t(`consultationDetails.items.${consultation.key}.expect`, {
            returnObjects: true,
          }).map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        {/* for whom */}
        <h3 className="text-xl font-semibold mb-2">
          {t("consultationDetails.forWhomTitle", "For whom")}
        </h3>
        <p className="text-gray-700 mb-6">
          {t(`consultationDetails.items.${consultation.key}.forWhom`)}
        </p>

        {/* invest */}
        <h3 className="text-xl font-semibold mb-2">
          {t("consultationDetails.investTitle", "Your investment")}
        </h3>
        <p className="text-gray-700 mb-6">
          {consultation.key === "meditation"
            ? selectedPrice + " / Session"
            : consultation.key === "health"
            ? "€290 / Session"
            : consultation.key === "stress"
            ? "€360 – 3 Sessions"
            : t(`consultationDetails.items.${consultation.key}.invest`)}
        </p>
        {/* Price selector for meditation */}
        {consultation.key === "meditation" && (
          <div className="mb-6">
            <h4 className="font-semibold mb-2">
              {t("consultationDetails.choosePrice")}
            </h4>
            <select
              value={selectedPrice}
              onChange={(e) => setSelectedPrice(e.target.value)}
              className="border px-3 py-2 rounded w-full">
              <option value="">
                {t("consultationDetails.pricePlaceholder")}
              </option>
              {packages.map((p, idx) => (
                <option key={idx} value={p.price}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* calendar */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">
            {t("consultationDetails.chooseDate")}
          </h4>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            className="border px-3 py-2 rounded w-full"
            placeholderText={t("consultationDetails.datePlaceholder")}
          />
        </div>

        {/* time slots */}
        <div className="mb-6">
          <h4 className="font-semibold mb-2">
            {t("consultationDetails.chooseTime")}
          </h4>
          <select
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            className="border px-3 py-2 rounded w-full">
            <option value="">{t("consultationDetails.timePlaceholder")}</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>

        {/* buttons */}
        <div className="flex justify-between">
          <Link
            to="/consultation"
            className="bg-gray-300 text-gray-900 py-2 px-4 rounded hover:bg-gray-400">
            ← {t("consultation.back")}
          </Link>
          <button
            onClick={handleAddToCart}
            className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">
            {t("consultationDetails.addToCart")}
          </button>
        </div>
      </div>
    </section>
  );
}
