import React from "react";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="min-h-screen bg-primary text-white px-4 sm:px-6 md:px-16 lg:px-16">
      <div className="flex flex-col md:flex-row items-stretch gap-8 min-h-[calc(100vh-6rem)]">
        {/* Left: Image */}
        <div className="relative w-full md:w-1/2 flex justify-center items-end md:items-center">
          <img
            src="Hero.png"
            alt="Wellness background"
            className="w-4/5 sm:w-3/4 md:w-full max-h-[500px] md:max-h-full object-contain"
          />
        </div>

        {/* Right: Text Content */}
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <div className="bg-black bg-opacity-50 p-4 sm:p-6 md:p-10 w-full max-w-3xl rounded-lg">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-teal-300 mb-4 drop-shadow-[2px_3px_6px_rgba(0,0,0,0.7)]">
              {t("hero.title")}
            </h1>
            <h2 className="text-xl sm:text-2xl md:text-3xl text-teal-200 mb-4 font-semibold">
              {t("hero.subtitle")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-4">
              {t("hero.paragraph1")}
            </p>
            <p className="text-base sm:text-lg md:text-xl mb-4">
              {t("hero.paragraph2")}
            </p>
            <p className="text-base sm:text-lg md:text-xl">
              {t("hero.paragraph3")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
