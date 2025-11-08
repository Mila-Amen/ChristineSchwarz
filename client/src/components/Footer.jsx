import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage(data.message); // success from backend
        setEmail(""); // clear input
      } else {
        setSuccessMessage(data.error || "Failed to subscribe");
      }
    } catch (err) {
      console.error(err);
      setSuccessMessage("Server error");
    }
  };

  return (
    <footer className="bg-gray-100 text-gray-800 mt-16 border-t">
      <div className="container mx-auto px-6 md:px-24 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            {t("footer.contact")}
          </h3>
          <p>Christine Schwarz</p>
          <p>info@christineschwarz.life</p>
          <p>+49 12 12 4565452</p>
          <p>
            Asternweg 1, 92703 <br />
            Krummennaab
          </p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            {t("footer.menu")}
          </h3>
          <ul className="space-y-2">
            {[
              { path: "/", label: t("navbar.home") },
              { path: "/about", label: t("navbar.about") },
              { path: "/services", label: t("navbar.services") },
              { path: "/shop", label: t("navbar.shop") },
              { path: "/contact", label: t("navbar.contact") },
            ].map(({ path, label }) => (
              <li key={path}>
                <Link to={path} className="hover:text-teal-600 transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            {t("footer.newsletterTitle")}
          </h3>
          <p className="mb-4">{t("footer.newsletterDesc")}</p>
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-2 items-center"
          >
            <input
              type="email"
              name="user_email"
              placeholder={t("footer.emailPlaceholder")}
              className="w-full sm:flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition"
            >
              {t("footer.subscribe")}
            </button>
          </form>
          {successMessage && (
            <p className="mt-2 text-sm text-green-600">{successMessage}</p>
          )}
        </div>
      </div>

      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Christine Schwarz. {t("footer.rights")}
      </div>
    </footer>
  );
}
