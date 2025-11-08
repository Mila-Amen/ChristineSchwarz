import React from "react";
import { useTranslation } from "react-i18next";

export default function About() {
  const { t } = useTranslation();

  return (
    <section className="pt-24 pb-16 px-6 md:px-24 bg-primary text-white space-y-16">
      <div className="flex flex-col md:flex-row items-center gap-20 mt-10 ">
        <img
          src="About1.jpg"
          alt="Christine in her earlier career"
          className="w-60 md:w-80  rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("about.section1.title")}
          </h2>
          <p className="text-lg leading-relaxed">{t("about.section1.text")}</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row-reverse items-center gap-10">
        <img
          src="About2.jpg"
          alt="Christine in nature"
          className="w-full md:w-1/2 rounded-xl shadow-lg transform transition-transform duration-300 hover:scale-105"
        />
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t("about.section2.title")}
          </h2>
          <p className="text-lg leading-relaxed">{t("about.section2.text")}</p>
        </div>
      </div>
    </section>
  );
}
