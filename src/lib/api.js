export async function apiFetch(url, options = {}) {
  try {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

    const headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
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
        error: data?.error || data?.message || "Error en la solicitud",
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