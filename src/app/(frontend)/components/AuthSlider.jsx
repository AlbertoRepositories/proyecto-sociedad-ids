"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "../../../lib/api";

export default function AuthSlider({ initialMode = "login" }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");

  // Estados para Login
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  // Estados para Register
  const [regUsername, setRegUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regLoading, setRegLoading] = useState(false);

  // Sincroniza si cambia el prop inicial
  useEffect(() => {
    setIsSignUp(initialMode === "register");
  }, [initialMode]);

  // Alterna panel y actualiza la URL sin recargar la página
  const switchMode = (targetMode) => {
    const goSignUp = targetMode === "register";
    setIsSignUp(goSignUp);
    setLoginError("");
    setRegError("");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", goSignUp ? "/register" : "/login");
    }
  };

  // Guarda la sesión en localStorage y notifica al Navbar
  const saveSessionAndRedirect = (res, fallbackUser) => {
    const token =
      res.token ||
      res.accessToken ||
      res.data?.token ||
      res.data?.accessToken;

    const userObj =
      res.user ||
      res.data?.user ||
      (res.email || res.username ? res : fallbackUser);

    if (token) {
      localStorage.setItem("accessToken", token);
    }
    if (userObj) {
      localStorage.setItem("currentUser", JSON.stringify(userObj));
    }

    window.dispatchEvent(new Event("auth-change"));
    router.push("/landingpage");
    router.refresh();
  };

  // Submit de Iniciar Sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);

    const res = await apiFetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: loginEmail, password: loginPassword }),
    });

    setLoginLoading(false);

    if (!res.success) {
      setLoginError(res.error || "Correo o contraseña incorrectos");
      return;
    }

    saveSessionAndRedirect(res, { email: loginEmail });
  };

  // Submit de Registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setRegError("");
    setRegLoading(true);

    const res = await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        username: regUsername,
        email: regEmail,
        password: regPassword,
      }),
    });

    setRegLoading(false);

    if (!res.success) {
      setRegError(res.error || "No se pudo crear la cuenta");
      return;
    }

    saveSessionAndRedirect(res, {
      username: regUsername,
      email: regEmail,
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      {/* Contenedor Principal con tamaño fijo en desktop y responsivo en móvil */}
      <div className="relative w-full max-w-[960px] min-h-[600px] bg-[#070E4A] border border-[#9FA1FF]/25 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden">
        
        {/* =========================================================
            PANEL 1: FORMULARIO CREAR CUENTA (SIGN UP)
           ========================================================= */}
        <div
          className={`w-full md:w-1/2 h-full md:absolute md:top-0 md:left-0 transition-all duration-700 ease-in-out flex flex-col justify-center px-8 sm:px-12 py-10 ${
            isSignUp
              ? "opacity-100 z-20 md:translate-x-full pointer-events-auto"
              : "opacity-0 z-10 md:translate-x-0 pointer-events-none hidden md:flex"
          }`}
        >
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <h1
              className="text-3xl sm:text-4xl font-semibold text-[#FFFAEA] text-center"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Crea tu Cuenta
            </h1>
            <p className="text-sm text-[#9FA1FF] text-center mb-2">
              Únete a la comunidad de Desarrollo de Software
            </p>

            <div>
              <label className="block text-sm font-medium text-[#FFFAEA] mb-1">
                Usuario
              </label>
              <input
                type="text"
                required
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="Tu nombre de usuario"
                className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/15 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFAEA] mb-1">
                Correo institucional o personal
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ejemplo@iteso.mx"
                className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/15 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFAEA] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/15 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF]"
              />
            </div>

            {regError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/50 text-red-200 text-sm">
                {regError}
              </div>
            )}

            <button
              type="submit"
              disabled={regLoading}
              className="mt-2 w-full py-3 rounded-full bg-[#9747FF] hover:bg-[#a966ff] text-[#FFFAEA] font-semibold tracking-wide transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {regLoading ? "Creando cuenta..." : "Registrar"}
            </button>

            {/* Botón de cambio solo visible en pantallas móviles */}
            <p className="md:hidden text-center text-sm text-[#FFFAEA]/80 mt-2">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-[#9FA1FF] font-semibold underline"
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>

        {/* =========================================================
            PANEL 2: FORMULARIO INICIAR SESIÓN (SIGN IN)
           ========================================================= */}
        <div
          className={`w-full md:w-1/2 h-full md:absolute md:top-0 md:left-0 transition-all duration-700 ease-in-out flex flex-col justify-center px-8 sm:px-12 py-10 ${
            isSignUp
              ? "opacity-0 z-10 md:translate-x-full pointer-events-none hidden md:flex"
              : "opacity-100 z-20 md:translate-x-0 pointer-events-auto"
          }`}
        >
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <h1
              className="text-3xl sm:text-4xl font-semibold text-[#FFFAEA] text-center"
              style={{ fontFamily: "var(--font-jost)" }}
            >
              Iniciar Sesión
            </h1>
            <p className="text-sm text-[#9FA1FF] text-center mb-2">
              Ingresa tus credenciales para continuar
            </p>

            <div>
              <label className="block text-sm font-medium text-[#FFFAEA] mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="ejemplo@iteso.mx"
                className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/15 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFAEA] mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/15 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF]"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-xl bg-red-500/20 border border-red-400/50 text-red-200 text-sm">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="mt-2 w-full py-3 rounded-full bg-[#9FA1FF] hover:bg-white text-[#010736] font-semibold tracking-wide transition-transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {loginLoading ? "Ingresando..." : "Iniciar sesión"}
            </button>

            {/* Botón de cambio solo visible en pantallas móviles */}
            <p className="md:hidden text-center text-sm text-[#FFFAEA]/80 mt-2">
              ¿Aún no tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-[#9FA1FF] font-semibold underline"
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        </div>

        {/* =========================================================
            PANEL 3: OVERLAY DESLIZANTE (SOLO DESKTOP md+)
           ========================================================= */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30 ${
            isSignUp ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          {/* Doble ancho interior que se desliza en dirección contraria */}
          <div
            className={`relative -left-full h-full w-[200%] bg-gradient-to-br from-[#9747FF] via-[#4C35DE] to-[#010736] text-[#FFFAEA] transition-transform duration-700 ease-in-out ${
              isSignUp ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            {/* Mitad Izquierda del Overlay (se ve cuando isSignUp === true) */}
            <div
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <img
                src="/images/raccoon-phone.png"
                alt="Mapache Racoode"
                className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
              />
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                ¡Bienvenido de vuelta!
              </h2>
              <p className="text-sm text-[#FFFAEA]/90 mb-6 leading-relaxed">
                Si ya te habías registrado antes, inicia sesión con tu cuenta.
              </p>
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="px-10 py-3 rounded-full border-2 border-[#FFFAEA] bg-transparent text-[#FFFAEA] font-semibold uppercase text-xs tracking-widest hover:bg-[#FFFAEA] hover:text-[#010736] transition-all active:scale-95 cursor-pointer"
              >
                Inicia sesión
              </button>
            </div>

            {/* Mitad Derecha del Overlay (se ve cuando isSignUp === false) */}
            <div
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <img
                src="/images/raccoon-lights.png"
                alt="Mapache Racoode"
                className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
              />
              <h2
                className="text-3xl font-bold mb-2"
                style={{ fontFamily: "var(--font-jost)" }}
              >
                ¡Hola, Coder!
              </h2>
              <p className="text-sm text-[#FFFAEA]/90 mb-6 leading-relaxed">
                Crea tu cuenta para enterarte de eventos, talleres y publicaciones de IDS.
              </p>
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="px-10 py-3 rounded-full border-2 border-[#FFFAEA] bg-transparent text-[#FFFAEA] font-semibold uppercase text-xs tracking-widest hover:bg-[#FFFAEA] hover:text-[#010736] transition-all active:scale-95 cursor-pointer"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}