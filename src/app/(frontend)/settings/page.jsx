"use client";

import { useState, useEffect } from "react";
import { Jost, Inter } from "next/font/google";
import Blobatar from "../components/Blobatar";
import { apiFetch } from "../../../lib/api";

const jost = Jost({ subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"] });

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [seed, setSeed] = useState("");
  const [username, setUsername] = useState("");
  const [savedMsg, setSavedMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("currentUser");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(parsed);
        setUsername(parsed.username || parsed.name || "");
        setSeed(parsed.avatarSeed || parsed.email || parsed.username || "racoode");
      }
    } catch {}
  }, []);

  const handleRandomize = () => {
    const randomSeed = `racoode-${Math.random().toString(36).substring(2, 9)}`;
    setSeed(randomSeed);
    setSavedMsg("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSavedMsg("");

    const updatedUser = {
      ...(user || {}),
      username,
      avatarSeed: seed,
    };

    // Intenta guardar en tu backend si existe endpoint de perfil
    await apiFetch("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify({ username, avatarSeed: seed }),
    }).catch(() => {});

    // Guarda localmente y actualiza el Navbar al instante
    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event("auth-change"));

    setSaving(false);
    setSavedMsg("¡Tu Blobatar y perfil se guardaron correctamente!");
  };

  return (
    <main
      style={{ fontFamily: inter.style.fontFamily }}
      className="min-h-[80vh] w-full bg-[#010736] text-[#FFFAEA] px-6 py-14 flex items-center justify-center"
    >
      <div className="w-full max-w-2xl rounded-3xl bg-[#070E4A] border border-[#9FA1FF]/30 p-8 md:p-10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h1
          style={{ fontFamily: jost.style.fontFamily }}
          className="text-3xl md:text-4xl font-bold text-[#FFFAEA] mb-2"
        >
          Configuración de Cuenta
        </h1>
        <p className="text-sm text-[#9FA1FF] mb-8">
          Personaliza tu Blobatar interactivo y cómo te ven los demás en el foro y blog.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Vista previa interactiva del Blobatar */}
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-[#010736]/80 border border-[#9747FF]/60">
            <div className="relative flex flex-col items-center">
              <Blobatar
                seed={seed}
                size={128}
                interactive={true}
                onClick={handleRandomize}
                className="rounded-full bg-[#070E4A] p-2 shadow-[0_0_30px_rgba(151,71,255,0.35)]"
              />
              <span className="text-[11px] text-[#9FA1FF] mt-2">
                Haz clic en él o mueve el cursor
              </span>
            </div>

            <div className="flex-1 w-full space-y-3">
              <label className="block text-sm font-medium text-[#FFFAEA]">
                Semilla (Seed) de tu Blobatar
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={seed}
                  onChange={(e) => {
                    setSeed(e.target.value);
                    setSavedMsg("");
                  }}
                  placeholder="Escribe cualquier palabra..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#FFFAEA]/10 border border-[#9FA1FF]/30 text-[#FFFAEA] focus:outline-none focus:border-[#9FA1FF]"
                />
                <button
                  type="button"
                  onClick={handleRandomize}
                  className="px-4 py-2.5 rounded-xl bg-[#9747FF] hover:bg-[#a966ff] text-[#FFFAEA] text-sm font-semibold transition-transform active:scale-95 cursor-pointer shrink-0"
                >
                  Aleatorizar
                </button>
              </div>
              <p className="text-xs text-[#FFFAEA]/65">
                Cada palabra o código genera un personaje único que aparecerá en tu menú, publicaciones y comentarios.
              </p>
            </div>
          </div>

          {/* Nombre de usuario */}
          <div>
            <label className="block text-sm font-medium text-[#FFFAEA] mb-1.5">
              Nombre de usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/10 border border-[#9FA1FF]/30 text-[#FFFAEA] focus:outline-none focus:border-[#9FA1FF]"
            />
          </div>

          {savedMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/50 text-emerald-200 text-sm">
              {savedMsg}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-8 py-3 rounded-full bg-[#9FA1FF] hover:bg-white text-[#010736] font-semibold tracking-wide transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}