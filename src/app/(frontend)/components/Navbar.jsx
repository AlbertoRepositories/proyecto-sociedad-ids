"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Jost } from "next/font/google";
import { apiFetch } from "../../../lib/api";

const jost = Jost({ subsets: ["latin"] });

function parseJwt(token) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const menuRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  const links = [
    { href: "/forum", label: "Forum" },
    { href: "/blog", label: "Blog" },
    { href: "/calendar", label: "Calendar" },
    { href: "/about", label: "About us" },
  ];

  useEffect(() => {
    const syncUser = () => {
      try {
        const rawUser = localStorage.getItem("currentUser");
        const token = localStorage.getItem("accessToken");

        let parsedUser = rawUser ? JSON.parse(rawUser) : null;
        const decodedToken = token ? parseJwt(token) : null;

        if (parsedUser || decodedToken) {
          setUser({ ...(decodedToken || {}), ...(parsedUser || {}) });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    syncUser();
    window.addEventListener("storage", syncUser);
    window.addEventListener("auth-change", syncUser);
    return () => {
      window.removeEventListener("storage", syncUser);
      window.removeEventListener("auth-change", syncUser);
    };
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("currentUser");
      window.dispatchEvent(new Event("auth-change"));
      setUser(null);
      setMenuOpen(false);
      router.push("/login");
    }
  };

  const displayName =
    user?.username ||
    user?.name ||
    user?.fullName ||
    user?.nombre ||
    (user?.email ? user.email.split("@")[0] : "Sin sesión activa");

  const displayEmail = user?.email || "Inicia sesión para ver tu cuenta";
  const roleLabel = user?.role || (user ? "Estudiante IDS" : "Invitado");
  const initial = user ? displayName.charAt(0).toUpperCase() : "?";

  return (
    <header className="w-full bg-[#010736]/90 backdrop-blur-md px-6 md:px-12 py-5 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-10">
        <Link
          href="/landingpage"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="shrink-0"
        >
          <img
            src="/images/racoode-logo.png"
            alt="Racoode Logo"
            className="h-12 w-auto object-contain"
          />
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[17px] font-semibold transition-colors ${
                pathname === link.href
                  ? "text-[#9FA1FF]"
                  : "text-[#FFFAEA] hover:text-[#9FA1FF]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Lado derecho: Contact Us + Botón (=) que se transforma en (X) */}
      <div className="flex items-center gap-5 relative" ref={menuRef}>
        <Link
          href="#contact"
          className="px-6 py-2 rounded-full border-2 border-[#FFFAEA] text-[#FFFAEA] text-xs md:text-sm tracking-wider uppercase hover:bg-[#FFFAEA] hover:text-[#010736] transition-colors"
        >
          Contact us
        </Link>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú de cuenta"}
          aria-expanded={menuOpen}
          className="relative w-9 h-9 flex items-center justify-center rounded-lg text-[#FFFAEA] hover:text-[#9FA1FF] hover:bg-white/5 transition-colors cursor-pointer"
        >
          <span
            className={`absolute h-[2.5px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
              menuOpen ? "rotate-45 translate-y-0" : "-translate-y-[5px]"
            }`}
          />
          <span
            className={`absolute h-[2.5px] w-6 rounded-full bg-current transition-all duration-300 ease-in-out ${
              menuOpen ? "-rotate-45 translate-y-0" : "translate-y-[5px]"
            }`}
          />
        </button>

        {menuOpen && (
          <div
            style={{ fontFamily: jost.style.fontFamily }}
            className="absolute right-0 top-14 w-80 rounded-2xl bg-[#070E4A] border border-[#9FA1FF]/40 shadow-[0_20px_50px_rgba(0,0,0,0.65)] p-4 text-[#FFFAEA] z-50"
          >
            <p className="text-xs font-medium text-[#9FA1FF] px-2 mb-2">
              Actualmente en
            </p>

            {/* Tarjeta de la cuenta activa */}
            <div className="flex items-center gap-3.5 p-3 rounded-xl border-2 border-[#9747FF] bg-[#010736]/80">
              <div className="w-12 h-12 rounded-full bg-[#9FA1FF] text-[#010736] flex items-center justify-center text-xl font-bold shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-bold text-[#FFFAEA] truncate leading-tight">
                  {displayName}
                </p>
                <p className="text-xs text-[#9FA1FF] font-medium mt-0.5">
                  {roleLabel}
                </p>
                <p className="text-xs text-[#FFFAEA]/75 truncate mt-0.5">
                  {displayEmail}
                </p>
              </div>
            </div>

            <div className="my-3 h-px bg-[#9FA1FF]/20" />

            <div className="flex flex-col gap-1">
              <Link
                href="/settings"
                onClick={() => setMenuOpen(false)}
                className="w-full text-left px-3 py-2.5 rounded-xl text-[17px] font-semibold text-[#FFFAEA] hover:bg-[#9FA1FF]/20 hover:text-[#9FA1FF] transition-colors"
              >
                Configuración
              </Link>

              {user ? (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-[17px] font-semibold text-[#FFFAEA] hover:bg-red-500/20 hover:text-red-300 transition-colors cursor-pointer"
                >
                  Salir
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-2.5 rounded-xl text-[17px] font-semibold text-[#9FA1FF] hover:bg-[#9FA1FF]/20 transition-colors"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}