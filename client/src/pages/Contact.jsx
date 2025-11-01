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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatusMessage("Sending...");

    try {
      const response = await fetch("http://192.168.178.87:5003/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });      

      if (response.ok) {
        setStatusMessage("✅ Message sent successfully!");
        setFormData({ name: "", email: "", subject: "", message: "" });
      } else {
        const data = await response.json();
        setStatusMessage(`❌ Failed to send message: ${data.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("⚠️ An error occurred. Please try again later.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="bg-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 flex flex-col lg:flex-row justify-between space-y-12 lg:space-y-0 lg:space-x-8">
        <div className="flex-1 mt-10">
          <h2 className="text-2xl mb-4 text-gray-200 font-bold">
            {t("contact.title")}
          </h2>
          <p className="text-justify text-gray-100">{t("contact.paragraph")}</p>

          <div className="mt-8 space-y-2 text-gray-100">
            <p className="flex items-center text-[13px]">
              <FaMapMarkerAlt className="text-teal-600 mr-2" />
              {t("contact.address")}
            </p>
            <p className="flex items-center text-[13px]">
              <FaPhone className="text-teal-600 mr-2" />
              {t("contact.phone")}
            </p>
            <p className="flex items-center text-[13px]">
              <FaEnvelope className="text-teal-600 mr-2" />
              <a href="mailto:info@christineschwarz.life" className="hover:underline">
                info@christineschwarz.life
              </a>
            </p>

            <div className="pt-6 mt-8 border-t border-gray-300">
              <div className="flex space-x-8 text-teal-600 text-xl mt-4">
                <a href="https://www.facebook.com/yourpage" target="_blank" rel="noopener noreferrer">
                  <FaFacebookF className="hover:text-[#3b5998]" />
                </a>
                <a href="https://www.instagram.com/tine.lifestyle/" target="_blank" rel="noopener noreferrer">
                  <FaInstagram className="hover:text-[#E1306C]" />
                </a>
                <a href="https://www.youtube.com/watch?v=InS0o62WO7U" target="_blank" rel="noopener noreferrer">
                  <FaYoutube className="hover:text-[#FF0000]" size={24} />
                </a>
              </div>
            </div>
          </div>
        </div>

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
                className="w-full px-4 py-2 border border-primary"
              />
              <input
                type="email"
                name="email"
                placeholder={t("contact.form.email")}
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-primary"
              />
            </div>

            <input
              type="text"
              name="subject"
              placeholder={t("contact.form.subject")}
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-primary"
            />

            <textarea
              name="message"
              placeholder={t("contact.form.message")}
              value={formData.message}
              onChange={handleChange}
              required
              rows="6"
              className="w-full px-3 py-2 border border-primary"
            ></textarea>

            <button
              type="submit"
              disabled={isSending}
              className="px-8 py-2 bg-primary text-white hover:bg-white hover:text-[#8E7037] border border-gray-100 font-bold"
            >
              {isSending ? "Sending..." : "Send"}
            </button>
          </form>

          {statusMessage && <p className="mt-2 text-gray-100">{statusMessage}</p>}
        </div>
      </div>

      <div className="w-full mt-12">
        <iframe
          title="Google Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2583.7123175689476!2d12.114113415707413!3d49.834710779393534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a04f0795600a0f%3A0xfd2ab78a029e5492!2sFreiherr-von-Lindenfels-Stra%C3%9Fe%2022%2C%2092703%20Krummennaab%2C%20Germany!5e0!3m2!1sen!2sde!4v1719480000000!5m2!1sen!2sde"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>
    </section>
  );
}
