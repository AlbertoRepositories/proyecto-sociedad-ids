"use client";

import { useState, useEffect } from "react";
import Blobatar from "../components/Blobatar";
import { apiFetch } from "../../../lib/api";
import Button from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import Card from "../components/ui/Card";
import Alert from "../components/ui/Alert";

export default function SettingsPage() {
  const [user, setUser] = useState(null);
  const [seed, setSeed] = useState("racoode");
  const [username, setUsername] = useState("");
  const [statusMsg, setStatusMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    const loadProfile = async () => {
      // 1. Caché local tras montar en el cliente
      try {
        const raw = localStorage.getItem("currentUser");
        if (raw && active) {
          const parsed = JSON.parse(raw);
          setUser(parsed);
          setUsername(parsed.username || parsed.name || "");
          setSeed(parsed.seed || parsed.email || parsed.username || "racoode");
        }
      } catch {
        // Ignorar errores de parseo
      }

      // 2. Sincroniza con Supabase
      const res = await apiFetch("/api/users/me", { method: "GET" });
      if (!active) return;

      if (res.success && res.data) {
        const dbUser = res.data;
        setUser(dbUser);
        setUsername(dbUser.username || dbUser.name || "");
        setSeed(dbUser.seed || dbUser.email || dbUser.username || "racoode");

        localStorage.setItem("currentUser", JSON.stringify(dbUser));
        window.dispatchEvent(new Event("auth-change"));
      }
    };

    loadProfile();
    return () => {
      active = false;
    };
  }, []);

  const handleRandomize = () => {
    const randomSeed = `racoode-${Math.random().toString(36).substring(2, 9)}`;
    setSeed(randomSeed);
    setStatusMsg({ type: "", text: "" });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: "", text: "" });

    const trimmedSeed = seed.trim();
    const trimmedUsername = username.trim();

    if (trimmedSeed) {
      const seedRes = await apiFetch("/api/users/me/seed", {
        method: "PATCH",
        body: JSON.stringify({ seed: trimmedSeed }),
      });

      if (!seedRes.success) {
        setSaving(false);
        setStatusMsg({
          type: "error",
          text: seedRes.error || "No fue posible guardar los cambios.",
        });
        return;
      }
    }

    if (trimmedUsername && trimmedUsername !== user?.username) {
      const userRes = await apiFetch("/api/users/me/username", {
        method: "PATCH",
        body: JSON.stringify({ newUsername: trimmedUsername }),
      });

      if (!userRes.success) {
        setSaving(false);
        setStatusMsg({
          type: "error",
          text:
            userRes.error ||
            "La seed se guardó, pero no se pudo actualizar el usuario.",
        });
        return;
      }
    }

    const updatedUser = {
      ...(user || {}),
      username: trimmedUsername || user?.username,
      seed: trimmedSeed || user?.seed,
    };

    localStorage.setItem("currentUser", JSON.stringify(updatedUser));
    setUser(updatedUser);
    window.dispatchEvent(new Event("auth-change"));

    setSaving(false);
    setStatusMsg({
      type: "success",
      text: "¡Listo! Tus cambios se han guardado con éxito.",
    });
  };

  return (
    <div className="flex-1 w-full px-6 py-14 flex items-center justify-center">
      <Card className="w-full max-w-2xl p-8 md:p-10">
        <h1 className="font-jost text-3xl md:text-4xl font-bold text-[#FFFAEA] mb-2">
          Configuración de Cuenta
        </h1>
        <p className="text-sm text-[#9FA1FF] mb-8">
          Personaliza tu Blobatar interactivo y cómo te ven los demás en el foro y blog.
        </p>

        <form onSubmit={handleSave} className="space-y-6">
          <Card variant="deep" className="flex flex-col sm:flex-row items-center gap-6 p-6">
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
                <Input
                  type="text"
                  value={seed}
                  onChange={(e) => {
                    setSeed(e.target.value);
                    setStatusMsg({ type: "", text: "" });
                  }}
                  placeholder="Escribe cualquier palabra..."
                  wrapperClassName="flex-1"
                  className="py-2.5"
                />
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleRandomize}
                  className="rounded-xl shrink-0"
                >
                  Aleatorizar
                </Button>
              </div>
              <p className="text-xs text-[#FFFAEA]/65">
                Cada palabra o código genera un personaje único que aparecerá en tu menú, publicaciones y comentarios.
              </p>
            </div>
          </Card>

          <Input
            label="Nombre de usuario"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Alert type={statusMsg.type || "info"}>{statusMsg.text}</Alert>

          <div className="flex justify-end">
            <Button type="submit" variant="secondary" loading={saving}>
              {saving ? "Guardando..." : "Guardar cambios"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}