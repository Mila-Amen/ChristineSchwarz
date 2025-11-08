import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaFacebookF,
  FaYoutube,
  FaInstagram,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Contact() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage(t("contact.status.sending") || "Sending...");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        setStatusMessage(
          t("contact.status.success") || "✅ Message sent successfully!"
        );
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setStatusMessage(
          `❌ ${t("contact.status.error") || "Failed to send message"}: ${
            data.error || "Unknown error"
          }`
        );
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage(
        t("contact.status.serverError") ||
          "⚠️ An error occurred. Please try again later."
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="bg-primary text-gray-100">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 flex flex-col lg:flex-row justify-between space-y-12 lg:space-y-0 lg:space-x-8">
        {/* Contact Info */}
        <div className="flex-1 mt-10">
          <h2 className="text-2xl font-bold mb-4">{t("contact.title")}</h2>
          <p className="text-justify">{t("contact.paragraph")}</p>

          <div className="mt-8 space-y-2 text-[13px]">
            <p className="flex items-center">
              <FaMapMarkerAlt className="text-teal-600 mr-2" />
              {t("contact.address")}
            </p>
            <p className="flex items-center">
              <FaPhone className="text-teal-600 mr-2" />
              {t("contact.phone")}
            </p>
            <p className="flex items-center">
              <FaEnvelope className="text-teal-600 mr-2" />
              <a
                href="mailto:info@christineschwarz.life"
                className="hover:underline">
                info@christineschwarz.life
              </a>
            </p>

            {/* Social Icons */}
            <div className="pt-6 mt-8 border-t border-gray-300">
              <div className="flex space-x-6 text-teal-600 text-xl mt-4">
                <a
                  href="https://www.facebook.com/yourpage"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaFacebookF className="hover:text-[#3b5998]" />
                </a>
                <a
                  href="https://www.instagram.com/tine.lifestyle/"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaInstagram className="hover:text-[#E1306C]" />
                </a>
                <a
                  href="https://www.youtube.com/watch?v=InS0o62WO7U"
                  target="_blank"
                  rel="noopener noreferrer">
                  <FaYoutube className="hover:text-[#FF0000]" size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl w-full mx-auto">
          <form onSubmit={handleSubmit} className="space-y-4 mt-20">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                placeholder={t("contact.form.name")}
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input
                type="email"
                name="email"
                placeholder={t("contact.form.email")}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder={t("contact.form.subject")}
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />

            <textarea
              name="message"
              placeholder={t("contact.form.message")}
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"></textarea>

            <button
              type="submit"
              disabled={isSending}
              className="px-8 py-2 bg-teal-600 text-white hover:bg-teal-700 rounded-md font-bold transition">
              {isSending
                ? t("contact.status.sending") || "Sending..."
                : t("contact.form.send") || "Send"}
            </button>
          </form>

          {statusMessage && (
            <p className="mt-2 text-green-400">{statusMessage}</p>
          )}
        </div>
      </div>

      {/* Google Map */}
      <div className="w-full mt-12">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.7123175689476!2d12.114113415707413!3d49.834710779393534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a04f0795600a0f%3A0xfd2ab78a029e5492!2sFreiherr-von-Lindenfels-Stra%C3%9Fe%2022%2C%2092703%20Krummennaab%2C%20Germany!5e0!3m2!1sen!2sde!4v1719480000000!5m2!1sen!2sde"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
    </section>
  );
}
