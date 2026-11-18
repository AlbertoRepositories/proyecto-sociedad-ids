"use client";

import Link from "next/link";
import { Lalezar, Jost } from "next/font/google";
import HeroCanvas from "../components/HeroCanvas";

const lalezar = Lalezar({ weight: "400", subsets: ["latin"] });
const jost = Jost({ subsets: ["latin"] });

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
    imgStyle: { width: "229px", height: "229px" },
  },
  {
    title: "Énterate de lo\nnuevo",
    href: "/blog",
    image: "/images/raccoon-shocked.png",
    imgStyle: { width: "178px", height: "178px", marginBottom: "24px" },
  },
  {
    title: "Cuéntanos algo\nsobre ti",
    href: "/forum",
    image: "/images/raccoon-interested.png",
    imgStyle: { width: "226px", height: "226px" },
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
    <div
      style={{
        width: "100%",
        backgroundColor: "#010736",
        color: "#FFFAEA",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes slideHorizontalLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes slideHorizontalRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes dashBorderMove {
          to { stroke-dashoffset: -36; }
        }
        .racoode-track-left {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
          animation: slideHorizontalLeft 26s linear infinite;
        }
        .racoode-track-right {
          display: flex !important;
          flex-direction: row !important;
          flex-wrap: nowrap !important;
          width: max-content !important;
          animation: slideHorizontalRight 30s linear infinite;
        }
        .racoode-marquee:hover .racoode-track-left,
        .racoode-marquee:hover .racoode-track-right {
          animation-play-state: paused;
        }
        .racoode-card-item {
          transition: transform 0.3s ease;
        }
        .racoode-card-item:hover {
          transform: translateY(-6px);
        }
        .racoode-card-item:hover .racoode-card-dash {
          stroke: #FFFAEA !important;
          animation: dashBorderMove 0.8s linear infinite;
        }
      `}</style>

      {/* 1. HERO CON ANIMACIÓN REACTIVA AL MOUSE (Ajustado al alto real de pantalla) */}
      <section
        style={{
          position: "relative",
          width: "100%",
          height: "calc(100dvh - 88px)",
          minHeight: "480px",
          maxHeight: "820px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        <HeroCanvas />

        <div
          style={{
            position: "relative",
            zIndex: 10,
            width: "100%",
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "0 clamp(20px, 4vw, 41px) clamp(24px, 4vh, 40px) clamp(20px, 4vw, 41px)",
            pointerEvents: "none",
          }}
        >
          <h1
            style={{
              fontFamily: lalezar.style.fontFamily,
              fontSize: "clamp(64px, 10.5vw, 130px)",
              lineHeight: 0.88,
              fontWeight: 400,
              color: "#FFFAEA",
              margin: 0,
            }}
          >
            Racoode
          </h1>
          <p
            style={{
              fontFamily: lalezar.style.fontFamily,
              fontSize: "clamp(18px, 2.4vw, 25px)",
              lineHeight: 1.2,
              fontWeight: 400,
              color: "#FFFAEA",
              marginTop: "6px",
              marginBottom: 0,
            }}
          >
            Sociedad de estudiantes de Ingeniería en Desarrollo de Software
          </p>
        </div>
      </section>

      {/* 2. CINTA CARRUSEL INFINITO HORIZONTAL */}
      <section
        className="racoode-marquee"
        style={{
          width: "100%",
          height: "58px",
          backgroundColor: "#9FA1FF",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          overflow: "hidden",
        }}
      >
        <div
          className="racoode-track-left"
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "nowrap",
            alignItems: "center",
            width: "max-content",
          }}
        >
          {[...MARQUEE_WORDS, ...MARQUEE_WORDS, ...MARQUEE_WORDS].map(
            (word, idx) => (
              <span
                key={`${word}-${idx}`}
                style={{
                  display: "inline-block",
                  fontFamily: lalezar.style.fontFamily,
                  fontSize: "clamp(24px, 3vw, 30px)",
                  lineHeight: "39px",
                  fontWeight: 400,
                  color: "#FFFAEA",
                  margin: "0 clamp(24px, 3.5vw, 42px)",
                  whiteSpace: "nowrap",
                  userSelect: "none",
                }}
              >
                {word}
              </span>
            )
          )}
        </div>
      </section>

      {/* 3. "UNA SOCIEDAD DISEÑADA PARA TI" + 3 TARJETAS */}
      <section
        style={{
          width: "100%",
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "clamp(48px, 6vw, 70px) clamp(20px, 4vw, 41px) clamp(56px, 7vw, 80px) clamp(20px, 4vw, 41px)",
        }}
      >
        <div
          style={{
            maxWidth: "762px",
            margin: "0 auto clamp(40px, 5vw, 65px) auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: lalezar.style.fontFamily,
              fontSize: "clamp(34px, 5vw, 50px)",
              lineHeight: 1.15,
              fontWeight: 400,
              color: "#FFFAEA",
              margin: 0,
            }}
          >
            Una sociedad{" "}
            <span style={{ color: "#9FA1FF" }}>diseñada para ti</span>
          </h2>
          <p
            style={{
              fontFamily: jost.style.fontFamily,
              fontSize: "clamp(18px, 2.6vw, 30px)",
              lineHeight: 1.3,
              fontWeight: 400,
              color: "#FFFAEA",
              marginTop: "8px",
              marginBottom: 0,
            }}
          >
            Acompañamiento, soluciones y experiencias para vivir tu universidad
            al máximo
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: "clamp(24px, 3.5vw, 45px)",
          }}
        >
          {CARDS.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="racoode-card-item"
              style={{
                position: "relative",
                width: "min(355px, 100%)",
                height: "376px",
                backgroundColor: "#9FA1FF",
                borderRadius: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
                paddingTop: "35px",
                overflow: "hidden",
                textDecoration: "none",
              }}
            >
              <svg
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  pointerEvents: "none",
                  zIndex: 20,
                }}
              >
                <rect
                  className="racoode-card-dash"
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

              <h3
                style={{
                  position: "relative",
                  zIndex: 10,
                  fontFamily: lalezar.style.fontFamily,
                  fontSize: "clamp(38px, 4.5vw, 50px)",
                  lineHeight: 1,
                  fontWeight: 400,
                  color: "#FFFAEA",
                  textAlign: "center",
                  whiteSpace: "pre-line",
                  margin: 0,
                  padding: "0 12px",
                }}
              >
                {card.title}
              </h3>

              <img
                src={card.image}
                alt={card.title.replace("\n", " ")}
                style={{
                  position: "relative",
                  zIndex: 10,
                  objectFit: "contain",
                  objectPosition: "bottom",
                  ...card.imgStyle,
                }}
              />
            </Link>
          ))}
        </div>
      </section>

      {/* 4. "CONOCE AL EQUIPO" + CARRUSEL HORIZONTAL DE 2 FILAS */}
      <section
        style={{
          width: "100%",
          padding: "clamp(30px, 4vw, 40px) 0 clamp(70px, 8vw, 110px) 0",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            marginBottom: "clamp(36px, 4.5vw, 55px)",
            padding: "0 24px",
          }}
        >
          <h2
            style={{
              fontFamily: lalezar.style.fontFamily,
              fontSize: "clamp(36px, 5vw, 50px)",
              lineHeight: 1.15,
              fontWeight: 400,
              color: "#FFFAEA",
              margin: 0,
            }}
          >
            Conoce al equipo
          </h2>
          <Link
            href="/about"
            style={{
              marginTop: "10px",
              height: "41px",
              padding: "0 22px",
              backgroundColor: "#FFFAEA",
              borderRadius: "100px",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: jost.style.fontFamily,
              fontSize: "20px",
              fontWeight: 600,
              color: "#8183E6",
              textDecoration: "none",
            }}
          >
            About us
          </Link>
        </div>

        <div
          className="racoode-marquee"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Fila 1 horizontal */}
          <div
            className="racoode-track-left"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "24px",
              width: "max-content",
            }}
          >
            {[...TEAM_ROW_1, ...TEAM_ROW_1, ...TEAM_ROW_1].map((src, i) => (
              <div
                key={`r1-${i}`}
                style={{
                  width: "245px",
                  height: "180px",
                  flexShrink: 0,
                  display: "inline-block",
                }}
              >
                <img
                  src={src}
                  alt={`Equipo Racoode ${i + 1}`}
                  style={{
                    width: "245px",
                    height: "180px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Fila 2 horizontal */}
          <div
            className="racoode-track-right"
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "nowrap",
              alignItems: "center",
              gap: "24px",
              width: "max-content",
            }}
          >
            {[...TEAM_ROW_2, ...TEAM_ROW_2, ...TEAM_ROW_2].map((src, i) => (
              <div
                key={`r2-${i}`}
                style={{
                  width: "245px",
                  height: "180px",
                  flexShrink: 0,
                  display: "inline-block",
                }}
              >
                <img
                  src={src}
                  alt={`Equipo Racoode ${i + 1}`}
                  style={{
                    width: "245px",
                    height: "180px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}