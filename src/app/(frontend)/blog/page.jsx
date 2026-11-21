"use client";

import { useState, useEffect, useSyncExternalStore } from "react";
import { FiPlus, FiX } from "react-icons/fi";
import BlogPostCard, { resolveCardVariant } from "../components/BlogPostCard";
import BlogCloseUpModal from "../components/BlogCloseUpModal";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Card from "../components/ui/Card";
import { Input, Textarea } from "../components/ui/Input";

// Cambia a false en producción para mostrar solo los posts reales de la base de datos
const SHOW_DEMO_POSTS = true;

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

function subscribeToStorage(callback) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getIsAdminSnapshot() {
  try {
    const storedUser = localStorage.getItem("currentUser");
    if (!storedUser) return false;
    const parsed = JSON.parse(storedUser);
    const role = String(parsed?.role || parsed?.type || "").toUpperCase();
    return role === "ADMINISTRATOR" || role === "ADMIN";
  } catch {
    return false;
  }
}

function getIsAdminServerSnapshot() {
  return false;
}

export default function BlogPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedPost, setSelectedPost] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const isAdmin = useSyncExternalStore(
    subscribeToStorage,
    getIsAdminSnapshot,
    getIsAdminServerSnapshot
  );

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

  async function reloadPosts() {
    try {
      const res = await fetch("/api/blog", {
        credentials: "include",
      });
      if (res.ok) {
        const json = await res.json();
        const dbItems = Array.isArray(json.data) ? json.data : [];
        setPosts(SHOW_DEMO_POSTS ? [...dbItems, ...DEMO_POSTS] : dbItems);
      } else {
        setPosts(SHOW_DEMO_POSTS ? DEMO_POSTS : []);
      }
    } catch {
      setPosts(SHOW_DEMO_POSTS ? DEMO_POSTS : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let isMounted = true;

    fetch("/api/blog", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!isMounted) return;
        const dbItems = Array.isArray(json?.data) ? json.data : [];
        setPosts(SHOW_DEMO_POSTS ? [...dbItems, ...DEMO_POSTS] : dbItems);
      })
      .catch(() => {
        if (isMounted) setPosts(SHOW_DEMO_POSTS ? DEMO_POSTS : []);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

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

      const mainCover = imageUrls[0];
      const isDuplicate = posts.some(
        (p) =>
          !String(p.id).startsWith("demo-") &&
          (p.title.trim().toLowerCase() === finalTitle.trim().toLowerCase() ||
            (mainCover && p.imageUrls?.[0] === mainCover))
      );

      if (isDuplicate) {
        setFormError(
          "Ya existe una publicación con ese mismo título o imagen de portada."
        );
        setSubmitting(false);
        return;
      }

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
      await reloadPosts();
    } catch {
      setFormError("Error de red al publicar el post.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeletePost(post) {
    const confirmed = window.confirm(
      `¿Seguro que deseas eliminar "${post.title}"? Esta acción no se puede deshacer.`
    );
    if (!confirmed) return;

    if (String(post.id).startsWith("demo-")) {
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      if (selectedPost?.id === post.id) setSelectedPost(null);
      return;
    }

    try {
      const res = await fetch(`/api/blog/${post.id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await res.json();

      if (!res.ok || !json.success) {
        alert(json.error || "No se pudo eliminar la publicación.");
        return;
      }

      setPosts((prev) => prev.filter((p) => p.id !== post.id));
      if (selectedPost?.id === post.id) setSelectedPost(null);
    } catch {
      alert("Error de red al intentar eliminar la publicación.");
    }
  }

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => resolveCardVariant(p) === activeFilter);

  return (
    <section className="w-full py-12 md:py-16">
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
              <Button
                key={filter.id}
                type="button"
                size="sm"
                variant={activeFilter === filter.id ? "primary" : "ghost"}
                onClick={() => setActiveFilter(filter.id)}
                className="font-jost"
              >
                {filter.label}
              </Button>
            ))}

            {isAdmin && (
              <Button
                type="button"
                size="sm"
                variant="cream"
                onClick={() => setShowCreateModal(true)}
                className="font-jost text-[#010736] ml-1"
              >
                <FiPlus className="w-4 h-4" />
                <span>Nuevo Post</span>
              </Button>
            )}
          </div>
        </div>

        {/* Cuadrícula de tarjetas */}
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
                isAdmin={isAdmin}
                onDelete={handleDeletePost}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal Close-Up del post */}
      <BlogCloseUpModal
        key={selectedPost?.id ?? "closed"}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />

      {/* Modal de creación (Solo Administrador) */}
      {isAdmin && showCreateModal && (
        <div
          className="fixed inset-0 z-50 bg-[#010736]/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowCreateModal(false)}
        >
          <Card
            variant="dark"
            className="relative w-full max-w-xl p-6 sm:p-8 my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              aria-label="Cerrar formulario"
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-[#9747FF] flex items-center justify-center transition-colors cursor-pointer"
            >
              <FiX className="w-5 h-5" />
            </button>

            <h2 className="font-lalezar text-4xl text-[#9FA1FF] mb-1">
              Publicar en el Blog
            </h2>
            <p className="font-jost text-sm text-[#FFFAEA]/75 mb-6">
              Sube la imagen diseñada del póster y completa la información.
            </p>

            <Alert type="error" className="mb-4 font-jost">
              {formError}
            </Alert>

            <form onSubmit={handleCreatePost} className="space-y-4 font-jost">
              <div>
                <label className="block text-sm font-medium text-[#FFFAEA] mb-1.5">
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
                  className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/10 border border-[#9FA1FF]/30 text-[#FFFAEA] focus:outline-none focus:border-[#9FA1FF] transition-colors"
                >
                  <option value="poster" className="bg-[#070E4A]">
                    Evento (Reverso verde)
                  </option>
                  <option value="magazine" className="bg-[#070E4A]">
                    Logro (Reverso morado)
                  </option>
                  <option value="internship" className="bg-[#070E4A]">
                    Empleo / Intern (Reverso crema)
                  </option>
                  <option value="editorial" className="bg-[#070E4A]">
                    Anuncio (Reverso morado)
                  </option>
                </select>
              </div>

              <Input
                label="Título"
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Ej. Posada navideña / ICPC"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Fecha inicio evento"
                  type="date"
                  required
                  value={formData.eventStartDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventStartDate: e.target.value })
                  }
                />
                <Input
                  label="Fecha fin evento"
                  type="date"
                  required
                  value={formData.eventEndDate}
                  onChange={(e) =>
                    setFormData({ ...formData, eventEndDate: e.target.value })
                  }
                />
              </div>

              <Textarea
                label="Descripción completa"
                rows={4}
                required
                value={formData.content}
                onChange={(e) =>
                  setFormData({ ...formData, content: e.target.value })
                }
                placeholder="Detalle que se muestra al girar la tarjeta y en el Close-Up..."
              />

              <Textarea
                label="URLs de imágenes (una por línea — primera es el póster, las demás van al carrusel)"
                rows={2}
                required
                value={formData.imageUrlsText}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrlsText: e.target.value })
                }
                placeholder="/images/evento.webp"
              />

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  loading={submitting}
                >
                  {submitting ? "Publicando..." : "Publicar Post"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </section>
  );
}