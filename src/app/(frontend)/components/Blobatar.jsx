"use client";

import { useMemo, useState, useEffect, useRef, useSyncExternalStore } from "react";

function hashString(str) {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

const PALETTES = [
  { bg: "#9FA1FF", eye: "#010736", stroke: "#010736" }, // Lavanda Racoode
  { bg: "#9747FF", eye: "#FFFAEA", stroke: "#FFFAEA" }, // Morado Racoode
  { bg: "#FFFAEA", eye: "#010736", stroke: "#9FA1FF" }, // Crema Racoode
  { bg: "#FF7A7A", eye: "#010736", stroke: "#010736" }, // Coral
  { bg: "#38BDF8", eye: "#010736", stroke: "#010736" }, // Azul cielo
  { bg: "#4ADE80", eye: "#010736", stroke: "#010736" }, // Verde menta
  { bg: "#FBBF24", eye: "#010736", stroke: "#010736" }, // Amarillo mostaza
  { bg: "#F472B6", eye: "#010736", stroke: "#010736" }, // Rosa chicle
  { bg: "#2DD4BF", eye: "#010736", stroke: "#010736" }, // Turquesa
  { bg: "#FB923C", eye: "#010736", stroke: "#010736" }, // Naranja suave
  { bg: "#C084FC", eye: "#010736", stroke: "#010736" }, // Lila claro
  { bg: "#A3E635", eye: "#010736", stroke: "#010736" }, // Lima
];

const BLOB_SHAPES = [
  { d: "M50,12 C73,11 88,27 88,50 C88,73 73,89 50,88 C27,89 12,73 12,50 C12,27 27,11 50,12 Z", eyeY: 0 },
  { d: "M50,10 C62,28 84,48 84,66 C84,82 69,90 50,90 C31,90 16,82 16,66 C16,48 38,28 50,10 Z", eyeY: 10 },
  { d: "M50,14 C60,14 88,64 86,76 C84,86 66,88 50,88 C34,88 16,86 14,76 C12,64 40,14 50,14 Z", eyeY: 12 },
  { d: "M46,12 C72,10 84,18 87,44 C90,70 82,84 54,87 C28,90 16,82 13,56 C10,30 20,14 46,12 Z", eyeY: 0 },
  { d: "M50,24 C74,24 90,34 90,52 C90,70 74,80 50,80 C26,80 10,70 10,52 C10,34 26,24 50,24 Z", eyeY: 0 },
  { d: "M34,26 C42,16 58,16 66,26 C80,26 90,36 88,50 C92,64 82,78 66,78 C58,86 42,86 34,78 C18,78 8,64 12,50 C10,36 20,26 34,26 Z", eyeY: 0 },
  { d: "M50,11 L82,29 C86,32 87,36 87,42 L87,58 C87,64 86,68 82,71 L50,89 L18,71 C14,68 13,64 13,58 L13,42 C13,36 14,32 18,29 Z", eyeY: 0 },
  { d: "M50,11 C72,11 84,26 84,52 C84,78 72,91 50,91 C28,91 16,78 16,52 C16,26 28,11 50,11 Z", eyeY: -3 },
  { d: "M50,10 C62,10 90,38 90,50 C90,62 62,90 50,90 C38,90 10,62 10,50 C10,38 38,10 50,10 Z", eyeY: 0 },
  { d: "M50,10 L58,22 L74,17 L74,33 L88,41 L80,55 L88,69 L72,74 L68,89 L52,82 L36,89 L32,74 L16,69 L24,55 L16,41 L30,33 L30,17 L46,22 Z", eyeY: 0 },
  { d: "M50,14 C68,14 82,26 84,42 C91,44 93,54 84,58 C81,76 67,88 50,88 C33,88 18,75 16,56 C14,34 30,14 50,14 Z", eyeY: 0 },
  { d: "M42,13 C68,11 88,28 86,52 C84,76 64,89 40,86 C20,83 11,66 14,44 C17,24 24,15 42,13 Z", eyeY: 0 },
  { d: "M24,16 L38,28 C46,26 54,26 62,28 L76,16 L82,42 C86,52 84,72 72,82 C60,90 40,90 28,82 C16,72 14,52 18,42 Z", eyeY: 5 },
  { d: "M50,30 C42,14 14,16 14,42 C14,64 38,80 50,90 C62,80 86,64 86,42 C86,16 58,14 50,30 Z", eyeY: 3 },
  { d: "M50,12 C72,12 84,28 84,52 L84,84 Q75,76 67,84 Q58,76 50,84 Q42,76 33,84 Q25,76 16,84 L16,52 C16,28 28,12 50,12 Z", eyeY: -3 },
  { d: "M16,32 L30,44 L50,22 L70,44 L84,32 L82,74 C80,84 68,88 50,88 C32,88 20,84 18,74 Z", eyeY: 11 },
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

  // Evita diferencias entre SSR y cliente sin causar renders en cascada
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const activeSeed = mounted ? String(seed || "racoode") : "racoode";

  const avatar = useMemo(() => {
    const h = hashString(activeSeed);
    const palette = PALETTES[h % PALETTES.length];
    const shapeObj = BLOB_SHAPES[(h >>> 4) % BLOB_SHAPES.length] || BLOB_SHAPES[0];
    const eyeStyle = (h >>> 8) % 7;
    const tilt = ((h >>> 12) % 13) - 6;

    return {
      palette,
      shape: shapeObj.d,
      eyeY: shapeObj.eyeY,
      eyeStyle,
      tilt,
    };
  }, [activeSeed]);

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
      const distance = Math.min(2.8, Math.hypot(dx, dy) / 35);

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

  const { palette, shape, eyeY, eyeStyle, tilt } = avatar;

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
      aria-label={`Avatar de ${activeSeed}`}
    >
      <path
        d={shape}
        fill={palette.bg}
        stroke={palette.stroke}
        strokeOpacity="0.25"
        strokeWidth="2"
      />

      <g transform={`translate(0, ${eyeY})`}>
        {blink ? (
          <g stroke={palette.eye} strokeWidth="4.2" strokeLinecap="round">
            <line x1="34" y1="52" x2="43" y2="52" />
            <line x1="57" y1="52" x2="66" y2="52" />
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
            {eyeStyle === 0 && (
              <g strokeWidth="5.4" fill="none">
                <line x1="39" y1="45" x2="39" y2="58" />
                <line x1="61" y1="45" x2="61" y2="58" />
              </g>
            )}
            {eyeStyle === 1 && (
              <g strokeWidth="4.8" fill="none">
                <line x1="35" y1="48" x2="43" y2="54" />
                <line x1="65" y1="48" x2="57" y2="54" />
              </g>
            )}
            {eyeStyle === 2 && (
              <g strokeWidth="5.2" fill="none">
                <line x1="39" y1="45" x2="39" y2="57" />
                <line x1="56" y1="52" x2="65" y2="52" />
              </g>
            )}
            {eyeStyle === 3 && (
              <g stroke="none">
                <circle cx="38" cy="52" r="3.8" />
                <circle cx="62" cy="52" r="3.8" />
              </g>
            )}
            {eyeStyle === 4 && (
              <g strokeWidth="5" fill="none">
                <line x1="41" y1="45" x2="36" y2="58" />
                <line x1="59" y1="45" x2="64" y2="58" />
              </g>
            )}
            {eyeStyle === 5 && (
              <g strokeWidth="5" fill="none">
                <line x1="34" y1="52" x2="43" y2="52" />
                <line x1="57" y1="52" x2="66" y2="52" />
              </g>
            )}
            {eyeStyle === 6 && (
              <g stroke="none">
                <ellipse cx="38" cy="51" rx="4.4" ry="6.2" />
                <circle cx="61" cy="52" r="3.6" />
              </g>
            )}
          </g>
        )}
      </g>
    </svg>
  );
}