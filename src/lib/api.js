export async function apiFetch(url, options = {}) {
  try {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken") || localStorage.getItem("token")
        : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token && token !== "undefined" && token !== "null"
        ? { Authorization: `Bearer ${token}` }
        : {}),
      ...options.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data?.message || data?.error || "Error en la solicitud",
      };
    }

    return data;
  } catch (err) {
    return {
      success: false,
      error: err?.message || "Error de conexión con el servidor",
    };
  }
}