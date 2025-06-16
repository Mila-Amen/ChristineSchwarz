import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { LanguageContext } from "../context/LanguageContext.jsx";

export default function Footer() {
  const { dictionary } = useContext(LanguageContext);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const sendEmail = (e) => {
    e.preventDefault();

    if (!email) return setStatus("Please enter a valid email.");

    emailjs
      .send(
        "your_service_id",         // <-- replace with your Service ID
        "your_template_id",        // <-- replace with your Template ID
        { user_email: email },
        "your_public_key"          // <-- replace with your Public Key
      )
      .then(() => {
        setStatus("Thank you for subscribing!");
        setEmail("");
      })
      .catch(() => setStatus("Failed to send. Please try again."));
  };

  return (
    <footer className="bg-gray-100 text-gray-800 mt-16 border-t">
      <div className="container mx-auto px-6 md:px-40 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            {dictionary.contact}
          </h3>
          <p>Christine Schwarz</p>
          <p>forever.schwarz@gmail.com</p>
          <p>+49 12 12 4565452</p>
          <p>Asternweg 1, 92703 <br/>Krummennaab</p>
        </div>

        {/* Menu */}
        <div>
          <h3 className="text-lg font-semibold text-teal-600 mb-4">
            {dictionary.menu}
          </h3>
          <ul className="space-y-2">
            {[
              { path: "/home", label: dictionary.home },
              { path: "/about", label: dictionary.about },
              { path: "/services", label: dictionary.services },
              { path: "/shop", label: dictionary.shop },
              { path: "/contact", label: dictionary.contact },
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
            {dictionary.newsletterTitle || "Subscribe to Our Newsletter"}
          </h3>
          <p className="mb-4">
            {dictionary.newsletterDesc ||
              "Stay updated with wellness tips, offers, and news."}
          </p>

          <form onSubmit={sendEmail} className="flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              name="user_email"
              placeholder={dictionary.emailPlaceholder || "Your email address"}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="submit"
              className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700 transition">
              {dictionary.subscribe || "Subscribe"}
            </button>
          </form>

          {status && (
            <p className="text-sm mt-2 text-teal-700">{status}</p>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-gray-300 py-4 text-center text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Christine Schwarz.{" "}
        {dictionary.rights || "All rights reserved."}
      </div>
    </footer>
  );
}
