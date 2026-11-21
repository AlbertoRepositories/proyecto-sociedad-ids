"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCalendar,
  FiMapPin,
} from "react-icons/fi";
import Button from "./ui/Button";
import Card from "./ui/Card";

function formatSmartDate(dateString) {
  if (!dateString) return null;

  const eventDate = new Date(dateString);
  if (Number.isNaN(eventDate.getTime())) return null;

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDayStart = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );

  const formatted = new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(eventDate);

  const isUpcoming = eventDayStart >= todayStart;

  return {
    isUpcoming,
    label: isUpcoming
      ? `Evento próximo: ${formatted}`
      : `Evento situado el ${formatted}`,
  };
}

export default function BlogCloseUpModal({ post, onClose }) {
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    if (post) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [post, onClose]);

  if (!post) return null;

  const images =
    Array.isArray(post.imageUrls) && post.imageUrls.length > 0
      ? post.imageUrls
      : ["/images/evento.webp"];

  const dateInfo = formatSmartDate(post.eventStartDate || post.publishedAt);
  const currentImage = images[activeImgIndex] || images[0];

  const nextImage = () => {
    setActiveImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setActiveImgIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#010736]/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
    >
      <Card
        variant="dark"
        className="relative w-full max-w-4xl p-6 sm:p-10 text-[#FFFAEA] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar detalle"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-[#9747FF] text-[#FFFAEA] flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        {/* Contenedor principal en 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Columna izquierda: Imagen principal */}
          <div className="md:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden border border-[#9FA1FF]/25 shadow-lg bg-[#010736]">
              <Image
                src={currentImage}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 360px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Columna derecha: Título, Fecha inteligente, Texto completo y Botón */}
          <div className="md:col-span-7 flex flex-col justify-between h-full">
            <div>
              <h2
                id="blog-modal-title"
                className="font-lalezar text-4xl sm:text-5xl text-[#9FA1FF] leading-tight pr-10"
              >
                {post.title}
              </h2>

              {/* Fecha inteligente */}
              {dateInfo && (
                <div className="mt-2 inline-flex items-center gap-2 font-jost text-sm sm:text-base font-medium text-[#FFFAEA]/85">
                  <FiCalendar className="w-4 h-4 text-[#9FA1FF]" />
                  <span>{dateInfo.label}</span>
                </div>
              )}

              {post.location && (
                <div className="mt-1 flex items-center gap-2 font-jost text-sm text-[#FFFAEA]/75">
                  <FiMapPin className="w-4 h-4 text-[#9FA1FF]" />
                  <span>{post.location}</span>
                </div>
              )}

              {/* Contenido completo del post */}
              <div className="mt-6 font-jost text-base sm:text-[17px] leading-relaxed text-[#FFFAEA] whitespace-pre-line max-h-[260px] overflow-y-auto pr-2">
                {post.content}
              </div>
            </div>

            {/* Acción inferior: Próximo evento -> Calendario */}
            <div className="mt-8 pt-4 border-t border-[#9FA1FF]/20 flex flex-wrap items-center justify-between gap-4">
              {dateInfo?.isUpcoming ? (
                <Button
                  href="/calendar"
                  variant="primary"
                  size="sm"
                  onClick={onClose}
                  className="font-jost"
                >
                  <FiCalendar className="w-4 h-4" />
                  <span>Próximo evento</span>
                </Button>
              ) : (
                <span className="font-jost text-xs uppercase tracking-wider text-[#FFFAEA]/50">
                  Archivo histórico Racoode
                </span>
              )}

              {post.registrationUrl && (
                <Button
                  href={post.registrationUrl}
                  variant="secondary"
                  size="sm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-jost"
                >
                  Registro / Más info ↗
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Carrusel inferior de imágenes adicionales */}
        {images.length > 1 && (
          <div className="mt-8 pt-6 border-t border-[#9FA1FF]/20">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={prevImage}
                aria-label="Imagen anterior"
                className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-[#9747FF] flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {images.map((imgUrl, idx) => (
                  <button
                    key={`${imgUrl}-${idx}`}
                    type="button"
                    onClick={() => setActiveImgIndex(idx)}
                    className={`relative w-24 h-20 sm:w-28 sm:h-24 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      activeImgIndex === idx
                        ? "border-[#9747FF] scale-105 shadow-md"
                        : "border-transparent opacity-65 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={imgUrl}
                      alt={`${post.title} vista ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={nextImage}
                aria-label="Siguiente imagen"
                className="w-9 h-9 shrink-0 rounded-full bg-white/10 hover:bg-[#9747FF] flex items-center justify-center transition-colors cursor-pointer"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}