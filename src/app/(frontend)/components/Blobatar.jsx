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
  { bg: "#9FA1FF", eye: "#010736", cheek: "#9747FF" },
  { bg: "#9747FF", eye: "#FFFAEA", cheek: "#9FA1FF" },
  { bg: "#FFFAEA", eye: "#010736", cheek: "#9FA1FF" },
  { bg: "#6C63FF", eye: "#FFFAEA", cheek: "#FFB3C6" },
  { bg: "#38BDF8", eye: "#010736", cheek: "#9747FF" },
  { bg: "#C084FC", eye: "#010736", cheek: "#FFFAEA" },
];

const BLOB_SHAPES = [
  "M50,12 C72,10 88,26 88,50 C88,74 72,90 50,88 C28,90 12,74 12,50 C12,26 28,10 50,12 Z",
  "M52,10 C75,14 90,32 86,54 C82,76 66,90 46,88 C24,86 10,70 13,48 C16,26 29,6 52,10 Z",
  "M48,11 C70,8 89,25 87,49 C85,73 70,89 48,89 C26,89 11,72 13,48 C15,24 26,14 48,11 Z",
  "M50,13 C74,13 87,29 88,52 C89,75 71,88 49,88 C27,88 11,73 12,50 C13,27 26,13 50,13 Z",
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
    const shape = BLOB_SHAPES[(h >> 3) % BLOB_SHAPES.length];
    const eyeType = (h >> 6) % 3;
    const mouthType = (h >> 9) % 3;
    const hasAntenna = ((h >> 12) % 2) === 1;

    return { palette, shape, eyeType, mouthType, hasAntenna };
  }, [seed]);

  // Parpadeo natural aleatorio
  useEffect(() => {
    let timeoutId;
    const scheduleBlink = () => {
      const nextDelay = 2500 + Math.random() * 3500;
      timeoutId = setTimeout(() => {
        setBlink(true);
        setTimeout(() => setBlink(false), 150);
        scheduleBlink();
      }, nextDelay);
    };
    scheduleBlink();
    return () => clearTimeout(timeoutId);
  }, []);

  // Seguimiento suave del cursor cuando interactive={true}
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
      const distance = Math.min(2.5, Math.hypot(dx, dy) / 40);

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
    setTimeout(() => setSquish(false), 280);
    if (onClick) onClick(e);
  };

  const { palette, shape, eyeType, mouthType, hasAntenna } = avatar;

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
        transform: squish ? "scale(1.14, 0.86)" : "scale(1, 1)",
        transition: "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
      }}
      className={`shrink-0 select-none ${
        interactive || onClick ? "cursor-pointer hover:scale-105" : ""
      } ${className}`}
      aria-label={`Avatar de ${seed}`}
    >
      {/* Antena con ligero balanceo */}
      {hasAntenna && (
        <g>
          <path
            d="M50 14 Q54 4 62 6"
            stroke={palette.bg}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="63" cy="6" r="4" fill="#9747FF" />
        </g>
      )}

      {/* Cuerpo Blob */}
      <path d={shape} fill={palette.bg} />

      {/* Mejillas */}
      <ellipse cx="29" cy="57" rx="5.5" ry="3.2" fill={palette.cheek} opacity="0.55" />
      <ellipse cx="71" cy="57" rx="5.5" ry="3.2" fill={palette.cheek} opacity="0.55" />

      {/* Ojos (con parpadeo y movimiento de pupila) */}
      {blink ? (
        <g stroke={palette.eye} strokeWidth="3.5" strokeLinecap="round">
          <line x1="32" y1="47" x2="42" y2="47" />
          <line x1="58" y1="47" x2="68" y2="47" />
        </g>
      ) : (
        <g
          style={{
            transform: `translate(${pupilOffset.x}px, ${pupilOffset.y}px)`,
            transition: "transform 0.08s ease-out",
          }}
        >
          {eyeType === 0 && (
            <g fill={palette.eye}>
              <circle cx="37" cy="47" r="4.5" />
              <circle cx="63" cy="47" r="4.5" />
              <circle cx="38.5" cy="45.5" r="1.4" fill="#FFFFFF" />
              <circle cx="64.5" cy="45.5" r="1.4" fill="#FFFFFF" />
            </g>
          )}
          {eyeType === 1 && (
            <g stroke={palette.eye} strokeWidth="3.8" strokeLinecap="round" fill="none">
              <path d="M32 49 Q37 42 42 49" />
              <path d="M58 49 Q63 42 68 49" />
            </g>
          )}
          {eyeType === 2 && (
            <g>
              <circle cx="37" cy="47" r="6.5" fill="#FFFFFF" />
              <circle cx="63" cy="47" r="6.5" fill="#FFFFFF" />
              <circle cx="38" cy="47" r="3.5" fill={palette.eye} />
              <circle cx="64" cy="47" r="3.5" fill={palette.eye} />
            </g>
          )}
        </g>
      )}

      {/* Boca */}
      {mouthType === 0 && (
        <path
          d="M42 58 Q50 66 58 58"
          stroke={palette.eye}
          strokeWidth="3.5"
          strokeLinecap="round"
          fill="none"
        />
      )}
      {mouthType === 1 && <circle cx="50" cy="60" r="4" fill={palette.eye} />}
      {mouthType === 2 && (
        <path
          d="M41 58 Q45.5 63 50 58 Q54.5 63 59 58"
          stroke={palette.eye}
          strokeWidth="3.2"
          strokeLinecap="round"
          fill="none"
        />
      )}
    </svg>
  );
}