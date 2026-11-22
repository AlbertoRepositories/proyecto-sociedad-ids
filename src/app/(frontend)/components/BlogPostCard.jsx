"use client";

import Image from "next/image";
import { FiTrash2 } from "react-icons/fi";

export function resolveCardVariant(post) {
  if (post.cardVariant) return post.cardVariant;

  const type = String(post.publicationType || "").toUpperCase();
  const text = `${post.title || ""} ${post.content || ""}`.toLowerCase();

  if (
    text.includes("intern") ||
    text.includes("empleo") ||
    text.includes("vacante") ||
    text.includes("jobs")
  ) {
    return "internship";
  }

  if (type === "BLOG") return "magazine";
  if (type === "EVENT") return "poster";
  return "editorial";
}

export default function BlogPostCard({ post, onSelect, isAdmin, onDelete }) {
  const variant = resolveCardVariant(post);
  const coverImage = post.imageUrls?.[0] || "/images/evento.webp";

  const backTheme = {
    magazine: "bg-[#9747FF]/90 text-[#FFFAEA]",
    poster: "bg-[#22A947]/90 text-[#FFFAEA]",
    internship: "bg-[#FFFAEA]/95 text-[#010736]",
    editorial: "bg-[#9747FF]/90 text-[#FFFAEA]",
  }[variant];

  function handleDeleteClick(e) {
    e.stopPropagation();
    if (onDelete) onDelete(post);
  }

  return (
    <article
      onClick={() => onSelect(post)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(post);
        }
      }}
      className="group perspective-1000 relative w-full max-w-[330px] h-[395px] mx-auto cursor-pointer focus:outline-none"
    >
      {/* Botón eliminar flotante (solo visible para Admin) */}
      {isAdmin && (
        <button
          type="button"
          onClick={handleDeleteClick}
          title="Eliminar publicación"
          aria-label={`Eliminar ${post.title}`}
          className="absolute top-3 right-3 z-30 w-9 h-9 rounded-full bg-red-600/90 hover:bg-red-500 text-white shadow-lg flex items-center justify-center opacity-90 hover:opacity-100 transition-all cursor-pointer"
        >
          <FiTrash2 className="w-4 h-4" />
        </button>
      )}

      <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180 group-focus-visible:rotate-y-180 rounded-2xl shadow-xl">
        {/* ================= CARA FRONTAL (ARTE COMPLETO) ================= */}
        <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden border border-[#FFFAEA]/25 bg-[#010736]">
          <Image
            src={coverImage}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 330px"
            className="object-cover"
          />
        </div>

        {/* ================= CARA TRASERA (HOVER FLIP) ================= */}
        <div
          className={`absolute inset-0 backface-hidden rotate-y-180 rounded-2xl overflow-hidden border border-[#FFFAEA]/30 ${backTheme}`}
        >
          {/* Imagen de fondo sutil debajo del color translúcido */}
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="330px"
            className="object-cover opacity-20 mix-blend-luminosity pointer-events-none"
          />

          <div className="relative z-10 w-full h-full p-7 flex flex-col justify-between">
            {/* Encabezado alineado en una sola línea */}
            <div className="flex items-center justify-between gap-2 text-xs font-jost font-bold uppercase tracking-wider opacity-85 pr-9">
              <span className="whitespace-nowrap">
                {variant === "magazine" && "Logro"}
                {variant === "poster" && "Evento"}
                {variant === "internship" && "Empleo"}
                {variant === "editorial" && "Anuncio"}
              </span>
              <span className="whitespace-nowrap">Clic para abrir ↗</span>
            </div>

            {/* Extracto centrado */}
            <div className="my-auto py-4">
              <p className="font-jost text-sm font-semibold leading-relaxed line-clamp-6">
                {post.content}
              </p>
            </div>

            {/* Espacio inferior limpio */}
            <div className="h-6" />
          </div>
        </div>
      </div>
    </article>
  );
}