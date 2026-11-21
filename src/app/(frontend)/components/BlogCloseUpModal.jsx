"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiCalendar, FiX, FiChevronLeft, FiChevronRight, FiMapPin, FiExternalLink } from "react-icons/fi";

function formatEventStatus(eventStartDate) {
  if (!eventStartDate) return null;
  const eventDate = new Date(eventStartDate);
  if (Number.isNaN(eventDate.getTime())) return null;

  const now = new Date();
  // Comparamos por día calendario
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const eventDayStart = new Date(
    eventDate.getFullYear(),
    eventDate.getMonth(),
    eventDate.getDate()
  );

  const formatted = eventDate.toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const isUpcoming = eventDayStart >= todayStart;

  return {
    isUpcoming,
    label: isUpcoming
      ? `Evento próximo: ${formatted}`
      : `Evento situado el ${formatted}`,
  };
}

export default function BlogCloseUpModal({ post, onClose }) {
  const images =
    post?.imageUrls && post.imageUrls.length > 0
      ? post.imageUrls
      : ["/images/raccoon-party.webp"];

  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    setActiveImgIndex(0);
  }, [post]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  const eventStatus = formatEventStatus(post.eventStartDate);
  const extraImages = images.slice(1);

  const handlePrev = () => {
    setActiveImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-[#010736]/92 backdrop-blur-md overflow-y-auto flex items-center justify-center p-4 sm:p-8"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl bg-[#010736] border border-[#FFFAEA]/20 rounded-3xl p-6 sm:p-10 shadow-2xl my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          aria-label="Cerrar detalle"
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-[#FFFAEA]/10 hover:bg-[#9747FF] text-[#FFFAEA] flex items-center justify-center transition-colors cursor-pointer"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* COLUMNA IZQUIERDA: Imagen principal en grande */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-zinc-900 border border-[#FFFAEA]/15 shadow-lg">
              <Image
                src={images[activeImgIndex]}
                alt={post.title}
                fill
                sizes="(max-width: 1024px) 100vw, 420px"
                className="object-cover"
                priority
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    aria-label="Imagen anterior"
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#010736]/75 hover:bg-[#9747FF] text-[#FFFAEA] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FiChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    aria-label="Siguiente imagen"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-[#010736]/75 hover:bg-[#9747FF] text-[#FFFAEA] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* COLUMNA DERECHA: Título, fecha + icono calendario, texto y carrusel */}
          <div className="lg:col-span-7 flex flex-col justify-between h-full">
            <div>
              <h2 className="font-lalezar text-5xl sm:text-6xl leading-[0.92] text-[#9747FF] uppercase pr-8">
                {post.title}
              </h2>

              {/* Fecha del evento + Ícono de calendario si es próximo */}
              {eventStatus && (
                <div className="flex flex-wrap items-center gap-3 mt-2 mb-6">
                  <span className="font-jost text-lg sm:text-xl font-bold text-[#FFFAEA]">
                    {eventStatus.label}
                  </span>

                  {eventStatus.isUpcoming && (
                    <Link
                      href={
                        post.calendarId
                          ? `/calendar?event=${post.calendarId}`
                          : "/calendar"
                      }
                      title="Ver evento en el calendario"
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9747FF]/20 hover:bg-[#9747FF] border border-[#9747FF] text-[#FFFAEA] text-sm font-jost font-semibold transition-colors"
                    >
                      <FiCalendar className="w-4 h-4" />
                      <span>Ver en calendario</span>
                    </Link>
                  )}
                </div>
              )}

              {/* Ubicación opcional */}
              {post.location && (
                <p className="inline-flex items-center gap-1.5 text-sm font-jost text-[#9FA1FF] mb-4">
                  <FiMapPin className="w-4 h-4 shrink-0" />
                  <span>{post.location}</span>
                </p>
              )}

              {/* Cuerpo completo del post */}
              <div className="font-jost text-base sm:text-lg leading-relaxed text-[#FFFAEA]/95 whitespace-pre-line space-y-4">
                {post.content}
              </div>

              {/* Enlace de registro si existe */}
              {post.registrationUrl && (
                <div className="mt-6">
                  <a
                    href={post.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#9747FF] hover:bg-[#8232eb] text-[#FFFAEA] font-jost font-semibold text-sm transition-colors"
                  >
                    <span>Registro / Más información</span>
                    <FiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
            </div>

            {/* CARRUSEL DE IMÁGENES ADICIONALES (como la 4ta imagen de Figma) */}
            {extraImages.length > 0 && (
              <div className="mt-8 pt-6 border-t border-[#FFFAEA]/10">
                <p className="font-jost text-xs uppercase tracking-wider text-[#9FA1FF] mb-3">
                  Galería del evento ({images.length} fotos)
                </p>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  {images.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImgIndex(idx)}
                      className={`relative h-28 sm:h-32 shrink-0 rounded-xl overflow-hidden border-2 transition-all snap-start cursor-pointer ${
                        idx === 0 ? "w-24 sm:w-28" : "w-36 sm:w-44"
                      } ${
                        activeImgIndex === idx
                          ? "border-[#9747FF] scale-[1.02]"
                          : "border-transparent opacity-75 hover:opacity-100"
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Foto ${idx + 1} de ${post.title}`}
                        fill
                        sizes="180px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}