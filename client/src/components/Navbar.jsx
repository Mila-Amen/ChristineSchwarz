import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  const langRef = useRef();
  const mobileLangRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        langRef.current &&
        !langRef.current.contains(event.target) &&
        mobileLangRef.current &&
        !mobileLangRef.current.contains(event.target)
      ) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleLangDropdown = () => setIsLangOpen(!isLangOpen);

  const selectLanguage = (lang) => {
    i18n.changeLanguage(lang.toLowerCase());
    setIsLangOpen(false);
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    setIsLangOpen(false);
  };

  const menuVariants = {
    hidden: { height: 0, opacity: 0, transition: { duration: 0.25 } },
    visible: { height: "auto", opacity: 1, transition: { duration: 0.3 } },
    exit: { height: 0, opacity: 0, transition: { duration: 0.25 } },
  };

  const navLinks = [
    { path: "home", label: t("navbar.home") },
    { path: "services", label: t("navbar.services") },
    { path: "shop", label: t("navbar.shop") },
    { path: "consultation", label: t("navbar.consultation") },
    { path: "about", label: t("navbar.about") },
    { path: "contact", label: t("navbar.contact") },
  ];

  return (
    <nav className="bg-black bg-opacity-30 shadow-md fixed top-0 w-full z-50 font-bold mt-5">
      <div className="container mx-auto px-6 md:px-40 py-4 flex items-center justify-between">
        <Link to="/home" className="text-2xl font-bold text-teal-600 hover:text-white">
          Christine Schwarz
        </Link>

        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          ☰
        </button>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <ul className="flex flex-row gap-6">
            {navLinks.map(({ path, label }) => (
              <li key={path}>
                <Link
                  to={`/${path}`}
                  className="text-white hover:text-teal-600 transition"
                  onClick={handleLinkClick}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4 ml-2 relative" ref={langRef}>
            <Link
              to="/favorites"
              className="text-white hover:text-teal-600 text-xl transition"
              aria-label={t("navbar.favorites")}
            >
              <FiHeart />
            </Link>

            <Link
              to="/cart"
              className="text-white hover:text-teal-600 text-xl transition"
              aria-label={t("navbar.cart")}
            >
              <FiShoppingCart />
            </Link>

            {/* Language Switch */}
            <div className="relative inline-block text-gray-700">
              <button
                onClick={toggleLangDropdown}
                className="px-3 py-1 border border-teal-600 rounded-md hover:bg-teal-600 text-white hover:text-white transition"
              >
                {i18n.language.toUpperCase()}
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-1 w-20 bg-white border border-gray-300 rounded-md shadow-lg text-center z-50"
                  >
                    {["EN", "DE"].map((lang) => (
                      <li
                        key={lang}
                        className={`cursor-pointer px-4 py-2 hover:bg-teal-600 hover:text-white ${
                          i18n.language.toUpperCase() === lang ? "font-bold" : ""
                        }`}
                        onClick={() => selectLanguage(lang)}
                      >
                        {lang}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="mobile-menu"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={menuVariants}
            className="md:hidden bg-white shadow-md px-6 pt-4 pb-6"
          >
            <ul className="flex flex-col gap-4">
              {navLinks.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    to={`/${path}`}
                    className="text-gray-700 hover:text-teal-600 transition block"
                    onClick={handleLinkClick}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-4 mt-6">
              <Link
                to="/favorites"
                className="text-gray-700 hover:text-teal-600 text-xl transition"
                onClick={handleLinkClick}
              >
                <FiHeart />
              </Link>

              <Link
                to="/cart"
                className="text-gray-700 hover:text-teal-600 text-xl transition"
                onClick={handleLinkClick}
              >
                <FiShoppingCart />
              </Link>

              <div
                className="relative ml-auto inline-block text-gray-700"
                ref={mobileLangRef}
              >
                <button
                  onClick={toggleLangDropdown}
                  className="px-3 py-1 border border-teal-600 rounded-md hover:bg-teal-600 hover:text-white transition"
                >
                  {i18n.language.toUpperCase()}
                </button>

                <AnimatePresence>
                  {isLangOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute top-full right-0 mt-1 min-w-[80px] bg-white border border-gray-300 rounded-md shadow-lg text-center z-[999]"
                    >
                      {["EN", "DE"].map((lang) => (
                        <li
                          key={lang}
                          className={`cursor-pointer px-4 py-2 hover:bg-teal-600 hover:text-white ${
                            i18n.language.toUpperCase() === lang
                              ? "font-bold"
                              : ""
                          }`}
                          onClick={() => selectLanguage(lang)}
                        >
                          {lang}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
