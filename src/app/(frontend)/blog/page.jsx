"use client";

import { useState, useEffect } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import BlogPostCard, { resolveCardVariant } from "../components/BlogPostCard";
import BlogCloseUpModal from "../components/BlogCloseUpModal";

// Cuadrícula exacta de 9 tarjetas de tu diseño (3x3) usando tus imágenes de /public/images
// Nota: Si tus archivos son .png en vez de .webp, cambia la extensión aquí.
const POST_TEMPLATES = {
  logro: {
    title: "ICPC",
    content:
      "Nuestros compañeros de Ingeniería en Desarrollo de Software representaron a Racoode en el Campeonato Regional CDMX del ICPC, avanzando a semifinales con un desempeño sobresaliente.",
    publicationType: "BLOG",
    cardVariant: "magazine",
    eventStartDate: "2026-11-18T10:00:00.000Z",
    eventEndDate: "2026-11-18T18:00:00.000Z",
    location: "Campeonato CDMX",
    imageUrls: ["/images/logro.webp", "/images/hania.webp", "/images/oscar.webp"],
  },
  evento: {
    title: "Posada navideña",
    content:
      "Acompáñanos a cerrar el semestre en la posada oficial de Racoode este 27 de noviembre. Habrá comida, dinámicas, premios y convivencia con toda la comunidad de IDS.",
    publicationType: "EVENT",
    cardVariant: "poster",
    eventStartDate: "2026-11-27T18:00:00.000Z",
    eventEndDate: "2026-11-27T22:00:00.000Z",
    location: "Explanada ITESO",
    imageUrls: ["/images/evento.webp", "/images/hania.webp", "/images/oscar.webp"],
  },
  anuncio: {
    title: "SOFTWARE IN TECH",
    content:
      "Conferencia magistral sobre inteligencia artificial aplicada, robótica y arquitectura de software moderno este 27 de noviembre.",
    publicationType: "NEWS",
    cardVariant: "editorial",
    eventStartDate: "2026-11-27T16:00:00.000Z",
    eventEndDate: "2026-11-27T19:00:00.000Z",
    location: "Auditorio D1",
    imageUrls: ["/images/anuncio.webp"],
  },
  empleo: {
    title: "Google Jobs — Intern",
    content:
      "Somos una empresa de tecnología que se guía por grandes valores que promueven un ambiente sano e innovador. Inicia tu carrera profesional con nuestro programa de internships.",
    publicationType: "NEWS",
    cardVariant: "internship",
    eventStartDate: "2026-12-10T09:00:00.000Z",
    eventEndDate: "2026-12-10T23:59:00.000Z",
    location: "CDMX / Híbrido",
    registrationUrl: "https://careers.google.com",
    imageUrls: ["/images/empleo.webp"],
  },
};

const DEMO_POSTS = [
  // Fila 1: Logro | Evento | Anuncio
  { id: "demo-1", ...POST_TEMPLATES.logro },
  { id: "demo-2", ...POST_TEMPLATES.evento },
  { id: "demo-3", ...POST_TEMPLATES.anuncio },
  // Fila 2: Empleo | Anuncio | Logro
  { id: "demo-4", ...POST_TEMPLATES.empleo },
  { id: "demo-5", ...POST_TEMPLATES.anuncio },
  { id: "demo-6", ...POST_TEMPLATES.logro },
  // Fila 3: Evento | Logro | Empleo
  { id: "demo-7", ...POST_TEMPLATES.evento },
  { id: "demo-8", ...POST_TEMPLATES.logro },
  { id: "demo-9", ...POST_TEMPLATES.empleo },
];

const FILTERS = [
  { id: "all", label: "Todos" },
  { id: "magazine", label: "Logros" },
  { id: "poster", label: "Eventos" },
  { id: "internship", label: "Empleo" },
  { id: "editorial", label: "Anuncios" },
];

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    cardStyle: "poster",
    publicationType: "EVENT",
    eventStartDate: "",
    eventEndDate: "",
    location: "",
    registrationUrl: "",
    imageUrlsText: "",
  });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const role = String(parsed?.role || parsed?.type || "").toUpperCase();
        if (role === "ADMINISTRATOR" || role === "ADMIN") {
          setIsAdmin(true);
        }
      }
    } catch {
      setIsAdmin(false);
    }

    fetchPosts();
  }, []);

  async function fetchPosts() {
    setLoading(true);
    try {
      const res = await fetch("/api/blog", {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const dbItems = Array.isArray(json.data) ? json.data : [];
        // Muestra los posts reales publicados + la cuadrícula completa de 9 ejemplos
        setPosts([...dbItems, ...DEMO_POSTS]);
      } else {
        setPosts(DEMO_POSTS);
      }
    } catch {
      setPosts(DEMO_POSTS);
    } finally {
      setLoading(false);
    }
  }

  function handleSelectPost(post) {
    setSelectedPost(post);
    if (!String(post.id).startsWith("demo-")) {
      fetch(`/api/blog/${post.id}/view`, {
        method: "POST",
        credentials: "include",
      }).catch(() => {});
    }
  }

  async function handleCreatePost(e) {
    e.preventDefault();
    setFormError("");
    setSubmitting(true);

    try {
      const imageUrls = formData.imageUrlsText
        .split("\n")
        .map((url) => url.trim())
        .filter(Boolean);

      const startIso = formData.eventStartDate
        ? new Date(formData.eventStartDate).toISOString()
        : new Date().toISOString();

      const endIso = formData.eventEndDate
        ? new Date(formData.eventEndDate).toISOString()
        : startIso;

      const finalTitle =
        formData.cardStyle === "internship" &&
        !`${formData.title} ${formData.content}`
          .toLowerCase()
          .match(/intern|empleo|vacante|jobs/)
          ? `${formData.title} (Intern)`
          : formData.title;

      // --- AQUÍ VA LA VALIDACIÓN DE DUPLICADOS ---
      const mainCover = imageUrls[0];
      const isDuplicate = posts.some(
        (p) =>
          !String(p.id).startsWith("demo-") &&
          (p.title.trim().toLowerCase() === finalTitle.trim().toLowerCase() ||
            (mainCover && p.imageUrls?.[0] === mainCover))
      );

      if (isDuplicate) {
        setFormError("Ya existe una publicación con ese mismo título o imagen de portada.");
        setSubmitting(false);
        return;
      }
      // ------------------------------------------

      const res = await fetch("/api/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: finalTitle,
          content: formData.content,
          publicationType: formData.publicationType,
          eventStartDate: startIso,
          eventEndDate: endIso,
          location: formData.location || null,
          registrationUrl: formData.registrationUrl || null,
          imageUrls,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        setFormError(json.error || "No se pudo publicar el post.");
        return;
      }

      setShowCreateModal(false);
      setFormData({
        title: "",
        content: "",
        cardStyle: "poster",
        publicationType: "EVENT",
        eventStartDate: "",
        eventEndDate: "",
        location: "",
        registrationUrl: "",
        imageUrlsText: "",
      });
      await fetchPosts();
    } catch {
      setFormError("Error de red al publicar el post.");
    } finally {
      setSubmitting(false);
    }
  }

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => resolveCardVariant(p) === activeFilter);

  return (
    <main className="w-full min-h-screen bg-[#010736] text-[#FFFAEA] py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-5 md:px-10">
        {/* Cabecera y barra de filtros */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="font-lalezar text-5xl sm:text-6xl leading-none text-[#FFFAEA]">
              Blog <span className="text-[#9FA1FF]">Racoode</span>
            </h1>
            <p className="font-jost text-base sm:text-lg text-[#FFFAEA]/80 mt-2">
              Anuncios, logros, eventos y oportunidades de la sociedad
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {FILTERS.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-1.5 rounded-full font-jost text-sm font-semibold transition-colors cursor-pointer ${
                  activeFilter === filter.id
                    ? "bg-[#9747FF] text-[#FFFAEA]"
                    : "bg-[#FFFAEA]/10 text-[#FFFAEA]/80 hover:bg-[#FFFAEA]/20"
                }`}
              >
                {filter.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFFAEA] text-[#010736] hover:bg-[#9FA1FF] font-jost text-sm font-bold transition-colors cursor-pointer ml-1"
              >
                <FiPlus className="w-4 h-4" />
                <span>Nuevo Post</span>
              </button>
            )}
          </div>
        </div>

        {/* Cuadrícula de tarjetas (3x3 en escritorio, responsiva en móvil/tablet) */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <div
                key={n}
                className="w-full max-w-[330px] h-[395px] mx-auto rounded-2xl bg-[#FFFAEA]/5 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {filteredPosts.map((post) => (
              <BlogPostCard
                key={post.id}
                post={post}
                onSelect={handleSelectPost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Close-Up del post */}
      <BlogCloseUpModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Modal de creación (Solo Administrador) */}
      {isAdmin && showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-[#010736]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="relative w-full max-w-xl bg-[#010736] border border-[#9FA1FF]/40 rounded-3xl p-6 sm:p-8 shadow-2xl my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCreateModal(false)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#FFFAEA]/10 hover:bg-[#9747FF] flex items-center justify-center cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="font-lalezar text-4xl text-[#9FA1FF] mb-1">
              Publicar en el Blog
            </h2>
            <p className="font-jost text-sm text-[#FFFAEA]/75 mb-6">
              Sube la imagen diseñada del póster y completa la información.
            </p>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/20 border border-red-400 text-sm font-jost text-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleCreatePost} className="space-y-4 font-jost">
              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                  Tipo de publicación
                </label>
                <select
                  value={formData.cardStyle}
                  onChange={(e) => {
                    const style = e.target.value;
                    const mappedType =
                      style === "poster"
                        ? "EVENT"
                        : style === "magazine"
                        ? "BLOG"
                        : "NEWS";

                    setFormData({
                      ...formData,
                      cardStyle: style,
                      publicationType: mappedType,
                    });
                  }}
                  className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                >
                  <option value="poster" className="bg-[#010736]">
                    Evento (Reverso verde)
                  </option>
                  <option value="magazine" className="bg-[#010736]">
                    Logro (Reverso morado)
                  </option>
                  <option value="internship" className="bg-[#010736]">
                    Empleo / Intern (Reverso crema)
                  </option>
                  <option value="editorial" className="bg-[#010736]">
                    Anuncio (Reverso morado)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                  Título
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="Ej. Posada navideña / ICPC"
                  className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                    Fecha inicio evento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventStartDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventStartDate: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                    Fecha fin evento
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.eventEndDate}
                    onChange={(e) =>
                      setFormData({ ...formData, eventEndDate: e.target.value })
                    }
                    className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                  Descripción completa
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  placeholder="Detalle que se muestra al girar la tarjeta y en el Close-Up..."
                  className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-[#9FA1FF] mb-1">
                  URLs de imágenes (una por línea — primera es el póster, las demás van al carrusel)
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.imageUrlsText}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrlsText: e.target.value })
                  }
                  placeholder="/images/evento.webp"
                  className="w-full rounded-xl bg-[#FFFAEA]/10 border border-[#FFFAEA]/20 px-3.5 py-2.5 text-[#FFFAEA] focus:outline-none focus:border-[#9747FF]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-5 py-2.5 rounded-full bg-[#FFFAEA]/10 hover:bg-[#FFFAEA]/20 text-sm font-semibold cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 rounded-full bg-[#9747FF] hover:bg-[#8232eb] text-sm font-bold disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Publicando..." : "Publicar Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}