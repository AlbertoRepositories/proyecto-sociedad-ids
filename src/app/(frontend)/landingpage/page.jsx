"use client";

import Link from "next/link";
import Image from "next/image";
import HeroCanvas from "../components/HeroCanvas";
import Button from "../components/ui/Button";

const MARQUEE_WORDS = [
  "Racoode",
  "Software",
  "Debug",
  "Dorx",
  "Cherry-pick",
  "Mongosh",
  "GitHub",
];

const CARDS = [
  {
    title: "Próximos\neventos",
    href: "/calendar",
    image: "/images/raccoon-party.png",
    width: 229,
    height: 229,
    imgClass: "w-[229px] h-[229px]",
  },
  {
    title: "Énterate de lo\nnuevo",
    href: "/blog",
    image: "/images/raccoon-shocked.png",
    width: 178,
    height: 178,
    imgClass: "w-[178px] h-[178px] mb-6",
  },
  {
    title: "Cuéntanos algo\nsobre ti",
    href: "/forum",
    image: "/images/raccoon-interested.png",
    width: 226,
    height: 226,
    imgClass: "w-[226px] h-[226px]",
  },
];

const TEAM_ROW_1 = [
  "/images/yesh_yo.png",
  "/images/vic.png",
  "/images/yesh_sarah_vic_yo.png",
  "/images/sarah.png",
  "/images/yesh_sarah_yo.png",
];

const TEAM_ROW_2 = [
  "/images/yesh.png",
  "/images/hania.png",
  "/images/vero_oscar.png",
  "/images/oscar.png",
  "/images/vero.png",
];

export default function LandingPage() {
  return (
    <div className="w-full bg-[#010736] text-[#FFFAEA] overflow-x-hidden">
      {/* 1. HERO */}
      <section className="relative w-full h-[calc(100dvh-88px)] min-h-[480px] max-h-[820px] flex flex-col justify-end overflow-hidden">
        <HeroCanvas />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-10 pb-6 md:pb-10 pointer-events-none">
          <h1 className="font-lalezar text-[clamp(64px,10.5vw,130px)] leading-[0.88] font-normal text-[#FFFAEA]">
            Racoode
          </h1>
          <p className="font-lalezar text-[clamp(18px,2.4vw,25px)] leading-tight font-normal text-[#FFFAEA] mt-1.5">
            Sociedad de estudiantes de Ingeniería en Desarrollo de Software
          </p>
        </div>
      </section>

      {/* 2. MARQUEE INFINITO */}
      <section className="group w-full h-[58px] bg-[#9FA1FF] flex items-center overflow-hidden">
        <div className="flex flex-nowrap items-center w-max animate-marquee-left">
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map(
            (word, idx) => (
              <span
                key={`${word}-${idx}`}
                className="inline-block font-lalezar text-[clamp(24px,3vw,30px)] leading-none text-[#FFFAEA] mx-6 md:mx-10 whitespace-nowrap select-none"
              >
                {word}
              </span>
            )
          )}
        </div>
      </section>

      {/* 3. TARJETAS PRINCIPALES */}
      <section className="w-full max-w-7xl mx-auto px-5 md:px-10 py-14 md:py-20">
        <div className="max-w-3xl mx-auto mb-10 md:mb-16 text-center">
          <h2 className="font-lalezar text-[clamp(34px,5vw,50px)] leading-tight font-normal text-[#FFFAEA]">
            Una sociedad{" "}
            <span className="text-[#9FA1FF]">diseñada para ti</span>
          </h2>
          <p className="font-jost text-[clamp(18px,2.6vw,30px)] leading-snug text-[#FFFAEA] mt-2">
            Acompañamiento, soluciones y experiencias para vivir tu universidad
            al máximo
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-6 md:gap-11">
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group relative w-full max-w-[355px] h-[376px] bg-[#9FA1FF] rounded-[15px] flex flex-col items-center justify-between pt-9 overflow-hidden transition-transform duration-300 hover:-translate-y-1.5"
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-20">
                <rect
                  className="animate-dash-march transition-colors duration-200"
                  x="2"
                  y="2"
                  width="calc(100% - 4px)"
                  height="calc(100% - 4px)"
                  rx="15"
                  ry="15"
                  fill="none"
                  stroke="#9747FF"
                  strokeWidth="6"
                  strokeDasharray="10 8"
                />
              </svg>

              <h3 className="relative z-10 font-lalezar text-[clamp(38px,4.5vw,50px)] leading-none font-normal text-[#FFFAEA] text-center whitespace-pre-line px-3">
                {card.title}
              </h3>

              <Image
                src={card.image}
                alt={card.title.replace("\n", " ")}
                width={card.width}
                height={card.height}
                className={`relative z-10 object-contain object-bottom ${card.imgClass}`}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 4. CONOCE AL EQUIPO */}
      <section className="w-full pt-8 pb-20 md:pb-28">
        <div className="flex flex-col items-center text-center mb-10 md:mb-14 px-6">
          <h2 className="font-lalezar text-[clamp(36px,5vw,50px)] leading-tight font-normal text-[#FFFAEA]">
            Conoce al equipo
          </h2>
          <Button href="/about" variant="cream" className="mt-2.5 text-lg">
            About us
          </Button>
        </div>

        <div className="group flex flex-col gap-6 w-full overflow-hidden">
          <div className="flex flex-nowrap items-center gap-6 w-max animate-marquee-left">
            {[...TEAM_ROW_1, ...TEAM_ROW_1, ...TEAM_ROW_1].map((src, i) => (
              <div key={`r1-${i}`} className="w-[245px] h-[180px] shrink-0">
                <Image
                  src={src}
                  alt={`Equipo Racoode ${i + 1}`}
                  width={245}
                  height={180}
                  className="w-[245px] h-[180px] object-contain block"
                />
              </div>
            ))}
          </div>

          <div className="flex flex-nowrap items-center gap-6 w-max animate-marquee-right">
            {[...TEAM_ROW_2, ...TEAM_ROW_2, ...TEAM_ROW_2].map((src, i) => (
              <div key={`r2-${i}`} className="w-[245px] h-[180px] shrink-0">
                <Image
                  src={src}
                  alt={`Equipo Racoode ${i + 1}`}
                  width={245}
                  height={180}
                  className="w-[245px] h-[180px] object-contain block"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}