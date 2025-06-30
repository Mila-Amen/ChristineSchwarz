import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import AOS from "aos";
import "aos/dist/aos.css";

const services = [
  {
    key: "stressBurnoutCoaching",
    title: "Stress & Burnout Coaching",
    image: "Stress&BurnoutCoaching.jpg",
    link: "/services/consultation",
  },
  {
    key: "healthManagement",
    title: "Health Management",
    image: "HealthManagement.jpg",
    link: "/consultation",
  },
  {
    key: "meditation",
    title: "Meditation",
    image: "Meditation.jpg",
    link: "https://www.youtube.com/watch?v=3mbkVHjn7vY",
    target: "_blank",
  },
  {
    key: "myShop",
    title: "My Shop",
    image: "MyShop.jpg",
    link: "/shop",
  },
];

export default function Services() {
  const { t } = useTranslation();

  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-out",
      once: true,
    });
  }, []);

  return (
<section className="bg-primary">
<div className="max-w-7xl mx-auto px-6 py-16 ">
      <h2 className="text-3xl font-bold text-center text-white mb-12 mt-10">
        {t("services.title")}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {services.map(({ key, image, link, target }, index) => (
          <Link
            to={link}
            key={key}
            target={target}
            rel="noopener noreferrer"
            data-aos="fade-up"
            className="group relative block rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300">
            <img
              src={image}
              alt={t(`services.${key}`)}
              className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-xl">
              <h3 className="text-white text-3xl font-semibold px-4 text-center">
                {t(`services.${key}`)}
              </h3>
            </div>
            {/* Title below image for accessibility */}
            <div className="p-4 text-center md:hidden">
              <h3 className="text-lg font-semibold text-gray-800">
                {t(`services.${key}`)}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
</section>
  );
}
