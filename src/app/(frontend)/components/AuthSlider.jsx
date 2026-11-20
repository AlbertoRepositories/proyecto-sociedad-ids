"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "../../../lib/api";
import Button from "./ui/Button";
import { Input } from "./ui/Input";
import Card from "./ui/Card";
import Alert from "./ui/Alert";

export default function AuthSlider({ initialMode = "login" }) {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");
  const [prevInitialMode, setPrevInitialMode] = useState(initialMode);

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

  if (initialMode !== prevInitialMode) {
    setPrevInitialMode(initialMode);
    setIsSignUp(initialMode === "register");
  }

  const switchMode = (targetMode) => {
    const goSignUp = targetMode === "register";
    setIsSignUp(goSignUp);
    setLoginError("");
    setRegError("");
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", goSignUp ? "/register" : "/login");
    }
  };

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
      const { password, token: _t, accessToken: _at, ...safeUser } = userObj;
      void password;
      void _t;
      void _at;
      localStorage.setItem("currentUser", JSON.stringify(safeUser));
    }

    window.dispatchEvent(new Event("auth-change"));
    router.push("/landingpage");
    router.refresh();
  };

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
      <Card className="relative w-full max-w-[960px] min-h-[600px] overflow-hidden">
        {/* PANEL 1: FORMULARIO CREAR CUENTA */}
        <div
          className={`w-full md:w-1/2 h-full md:absolute md:top-0 md:left-0 transition-all duration-700 ease-in-out flex flex-col justify-center px-8 sm:px-12 py-10 ${
            isSignUp
              ? "opacity-100 z-20 md:translate-x-full pointer-events-auto"
              : "opacity-0 z-10 md:translate-x-0 pointer-events-none hidden md:flex"
          }`}
        >
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
            <h1 className="font-jost text-3xl sm:text-4xl font-semibold text-[#FFFAEA] text-center">
              Crea tu Cuenta
            </h1>
            <p className="text-sm text-[#9FA1FF] text-center mb-2">
              Únete a la comunidad de Desarrollo de Software
            </p>

            <Input
              label="Usuario"
              type="text"
              required
              value={regUsername}
              onChange={(e) => setRegUsername(e.target.value)}
              placeholder="Tu nombre de usuario"
            />

            <Input
              label="Correo institucional o personal"
              type="email"
              required
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              placeholder="ejemplo@iteso.mx"
            />

            <Input
              label="Contraseña"
              type="password"
              required
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Alert type="error">{regError}</Alert>

            <Button
              type="submit"
              variant="primary"
              loading={regLoading}
              className="w-full mt-2"
            >
              {regLoading ? "Creando cuenta..." : "Registrar"}
            </Button>

            <p className="md:hidden text-center text-sm text-[#FFFAEA]/80 mt-2">
              ¿Ya tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => switchMode("login")}
                className="text-[#9FA1FF] font-semibold underline cursor-pointer"
              >
                Inicia sesión
              </button>
            </p>
          </form>
        </div>

        {/* PANEL 2: FORMULARIO INICIAR SESIÓN */}
        <div
          className={`w-full md:w-1/2 h-full md:absolute md:top-0 md:left-0 transition-all duration-700 ease-in-out flex flex-col justify-center px-8 sm:px-12 py-10 ${
            isSignUp
              ? "opacity-0 z-10 md:translate-x-full pointer-events-none hidden md:flex"
              : "opacity-100 z-20 md:translate-x-0 pointer-events-auto"
          }`}
        >
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <h1 className="font-jost text-3xl sm:text-4xl font-semibold text-[#FFFAEA] text-center">
              Iniciar Sesión
            </h1>
            <p className="text-sm text-[#9FA1FF] text-center mb-2">
              Ingresa tus credenciales para continuar
            </p>

            <Input
              label="Correo electrónico"
              type="email"
              required
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              placeholder="ejemplo@iteso.mx"
            />

            <Input
              label="Contraseña"
              type="password"
              required
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              placeholder="••••••••"
            />

            <Alert type="error">{loginError}</Alert>

            <Button
              type="submit"
              variant="secondary"
              loading={loginLoading}
              className="w-full mt-2"
            >
              {loginLoading ? "Ingresando..." : "Iniciar sesión"}
            </Button>

            <p className="md:hidden text-center text-sm text-[#FFFAEA]/80 mt-2">
              ¿Aún no tienes cuenta?{" "}
              <button
                type="button"
                onClick={() => switchMode("register")}
                className="text-[#9FA1FF] font-semibold underline cursor-pointer"
              >
                Regístrate aquí
              </button>
            </p>
          </form>
        </div>

        {/* PANEL 3: OVERLAY DESLIZANTE */}
        <div
          className={`hidden md:block absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-30 ${
            isSignUp ? "-translate-x-full" : "translate-x-0"
          }`}
        >
          <div
            className={`relative -left-full h-full w-[200%] bg-gradient-to-br from-[#9747FF] via-[#4C35DE] to-[#010736] text-[#FFFAEA] transition-transform duration-700 ease-in-out ${
              isSignUp ? "translate-x-1/2" : "translate-x-0"
            }`}
          >
            <div
              className={`absolute top-0 left-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-0" : "-translate-x-[20%]"
              }`}
            >
              <Image
                src="/images/raccoon-phone.png"
                alt="Mapache Racoode"
                width={160}
                height={160}
                className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
              />
              <h2 className="font-jost text-3xl font-bold mb-2">
                ¡Bienvenido de vuelta!
              </h2>
              <p className="text-sm text-[#FFFAEA]/90 mb-6 leading-relaxed">
                Si ya te habías registrado antes, inicia sesión con tu cuenta.
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => switchMode("login")}
              >
                Inicia sesión
              </Button>
            </div>

            <div
              className={`absolute top-0 right-0 w-1/2 h-full flex flex-col items-center justify-center text-center px-10 transition-transform duration-700 ease-in-out ${
                isSignUp ? "translate-x-[20%]" : "translate-x-0"
              }`}
            >
              <Image
                src="/images/raccoon-lights.png"
                alt="Mapache Racoode"
                width={160}
                height={160}
                className="w-40 h-40 object-contain mb-4 drop-shadow-lg"
              />
              <h2 className="font-jost text-3xl font-bold mb-2">
                ¡Hola, Coder!
              </h2>
              <p className="text-sm text-[#FFFAEA]/90 mb-6 leading-relaxed">
                Crea tu cuenta para enterarte de eventos, talleres y publicaciones de IDS.
              </p>
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => switchMode("register")}
              >
                Registrar
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}