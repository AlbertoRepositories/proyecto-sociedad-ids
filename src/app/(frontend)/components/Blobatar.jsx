"use client";

import { useMemo, useState, useEffect, useRef } from "react";

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const PALETTES = [
  { bg: "#9FA1FF", eye: "#010736" }, // Lavanda Racoode
  { bg: "#9747FF", eye: "#FFFAEA" }, // Morado Racoode
  { bg: "#FFFAEA", eye: "#010736" }, // Crema Racoode
  { bg: "#FF7A7A", eye: "#010736" }, // Coral
  { bg: "#38BDF8", eye: "#010736" }, // Azul cielo
  { bg: "#4ADE80", eye: "#010736" }, // Verde menta
  { bg: "#FBBF24", eye: "#010736" }, // Amarillo mostaza
  { bg: "#F472B6", eye: "#010736" }, // Rosa chicle
  { bg: "#2DD4BF", eye: "#010736" }, // Turquesa
  { bg: "#FB923C", eye: "#010736" }, // Naranja suave
  { bg: "#C084FC", eye: "#010736" }, // Lila claro
  { bg: "#A3E635", eye: "#010736" }, // Lima
];

// 12 siluetas variadas como en blobatar.dev
const BLOB_SHAPES = [
  // 0. Círculo orgánico
  "M50,12 C73,11 88,27 88,50 C88,73 73,89 50,88 C27,89 12,73 12,50 C12,27 27,11 50,12 Z",
  // 1. Gota / Lágrima
  "M50,10 C62,28 84,48 84,66 C84,82 69,90 50,90 C31,90 16,82 16,66 C16,48 38,28 50,10 Z",
  // 2. Triángulo redondeado
  "M50,12 C60,12 88,64 86,76 C84,86 66,88 50,88 C34,88 16,86 14,76 C12,64 40,12 50,12 Z",
  // 3. Cuadrado suave inclinado (squircle)
  "M46,12 C72,10 84,18 87,44 C90,70 82,84 54,87 C28,90 16,82 13,56 C10,30 20,14 46,12 Z",
  // 4. Frijolito / Pastilla ancha
  "M50,24 C74,24 90,34 90,52 C90,70 74,80 50,80 C26,80 10,70 10,52 C10,34 26,24 50,24 Z",
  // 5. Nubecita esponjosa
  "M34,26 C42,16 58,16 66,26 C80,26 90,36 88,50 C92,64 82,78 66,78 C58,86 42,86 34,78 C18,78 8,64 12,50 C10,36 20,26 34,26 Z",
  // 6. Hexágono suave
  "M50,11 L82,29 C86,32 87,36 87,42 L87,58 C87,64 86,68 82,71 L50,89 L18,71 C14,68 13,64 13,58 L13,42 C13,36 14,32 18,29 Z",
  // 7. Fantasmita alargado
  "M50,11 C72,11 84,26 84,52 C84,78 72,91 50,91 C28,91 16,78 16,52 C16,26 28,11 50,11 Z",
  // 8. Rombo / Diamante redondeado
  "M50,10 C62,10 90,38 90,50 C90,62 62,90 50,90 C38,90 10,62 10,50 C10,38 38,10 50,10 Z",
  // 9. Estrellita / Virus simpático con piquitos
  "M50,10 L58,22 L74,17 L74,33 L88,41 L80,55 L88,69 L72,74 L68,89 L52,82 L36,89 L32,74 L16,69 L24,55 L16,41 L30,33 L30,17 L46,22 Z",
  // 10. Blob con orejitas / chipote lateral
  "M50,14 C68,14 82,26 84,42 C91,44 93,54 84,58 C81,76 67,88 50,88 C33,88 18,75 16,56 C14,34 30,14 50,14 Z",
  // 11. Piedrita asimétrica
  "M42,13 C68,11 88,28 86,52 C84,76 64,89 40,86 C20,83 11,66 14,44 C17,24 24,15 42,13 Z",
];

export default function Blobatar({
  seed = "racoode-guest",
  size = 48,
  interactive = false,
  onClick,
  className = "",
}) {
  const svgRef = useRef(null);
  const [blink, setBlink] = useState(false);
  const [squish, setSquish] = useState(false);
  const [pupilOffset, setPupilOffset] = useState({ x: 0, y: 0 });

  const avatar = useMemo(() => {
    const h = hashString(String(seed || "racoode"));
    const palette = PALETTES[h % PALETTES.length];
    const shape = BLOB_SHAPES[(h >> 4) % BLOB_SHAPES.length];
    const eyeStyle = (h >> 8) % 7; // 7 expresiones de ojitos como en la imagen
    const tilt = ((h >> 12) % 15) - 7; // ligera inclinación orgánica (-7° a +7°)

    return { palette, shape, eyeStyle, tilt };
  }, [seed]);

  // Parpadeo natural aleatorio
  useEffect(() => {
    let timeoutId;
    const scheduleBlink = () => {
      const nextDelay = 2400 + Math.random() * 3400;
      timeoutId = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, nextDelay);
    };
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // Seguimiento suave de ojos al cursor
  useEffect(() => {
    if (!interactive) return;

    const handleMouseMove = (e) => {
      if (!svgRef.current) return;
      const rect = svgRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(3, Math.hypot(dx, dy) / 35);

      setPupilOffset({
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [interactive]);

  const handleClick = (e) => {
    setSquish(true);
    setTimeout(() => setSquish(false), 260);
    if (onClick) onClick(e);
  };

  const { palette, shape, eyeStyle, tilt } = avatar;

  return (
    <svg
      ref={svgRef}
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={handleClick}
      style={{
        transform: squish
          ? `rotate(${tilt}deg) scale(1.14, 0.86)`
          : `rotate(${tilt}deg) scale(1, 1)`,
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`shrink-0 select-none ${
        interactive || onClick ? "cursor-pointer hover:scale-105" : ""
      } ${className}`}
      aria-label={`Avatar de ${seed}`}
    >
      {/* Silueta principal */}
      <path d={shape} fill={palette.bg} />

      {/* Ojos minimalistas estilo blobatar.dev */}
      {blink ? (
        <g stroke={palette.eye} strokeWidth="4" strokeLinecap="round">
          <line x1="34" y1="53" x2="43" y2="53" />
          <line x1="57" y1="53" x2="66" y2="53" />
        </g>
      ) : (
        <g
          stroke={palette.eye}
          fill={palette.eye}
          strokeLinecap="round"
          style={{
            transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            transition: "transform 0.08s ease-out",
          }}
        >
          {/* 0: Rayitas verticales clásicas (| |) */}
          {eyeStyle === 0 && (
            <g strokeWidth="5.2" fill="none">
              <line x1="39" y1="45" x2="39" y2="58" />
              <line x1="61" y1="45" x2="61" y2="58" />
            </g>
          )}

          {/* 1: Rayitas inclinadas hacia adentro (\ /) */}
          {eyeStyle === 1 && (
            <g strokeWidth="4.5" fill="none">
              <line x1="35" y1="49" x2="43" y2="54" />
              <line x1="65" y1="49" x2="57" y2="54" />
            </g>
          )}

          {/* 2: Un ojo abierto y otro guiñando (| -) */}
          {eyeStyle === 2 && (
            <g strokeWidth="5" fill="none">
              <line x1="39" y1="45" x2="39" y2="57" />
              <line x1="56" y1="52" x2="65" y2="52" />
            </g>
          )}

          {/* 3: Puntitos chiquitos separados (. .) */}
          {eyeStyle === 3 && (
            <g stroke="none">
              <circle cx="38" cy="52" r="3" />
              <circle cx="62" cy="52" r="3" />
            </g>
          )}

          {/* 4: Rayitas inclinadas hacia afuera (/ \) */}
          {eyeStyle === 4 && (
            <g strokeWidth="4.8" fill="none">
              <line x1="41" y1="45" x2="36" y2="58" />
              <line x1="59" y1="45" x2="64" y2="58" />
            </g>
          )}

          {/* 5: Rayitas horizontales dormilonas (- -) */}
          {eyeStyle === 5 && (
            <g strokeWidth="4.8" fill="none">
              <line x1="34" y1="52" x2="43" y2="52" />
              <line x1="57" y1="52" x2="66" y2="52" />
            </g>
          )}

          {/* 6: Un ojo grande y otro chiquito (O .) */}
          {eyeStyle === 6 && (
            <g stroke="none">
              <ellipse cx="38" cy="51" rx="4.2" ry="6" />
              <circle cx="61" cy="52" r="3.2" />
            </g>
          )}
        </g>
      )}
    </svg>
  );
}