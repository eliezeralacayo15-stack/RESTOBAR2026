const BEARER_KEY = "grok-auth.bearer-token";

export async function emailAuth(
  mode: "sign-in" | "sign-up",
  body: { email: string; password: string; name?: string },
): Promise<{ user?: { id: string; email: string; name: string } }> {
  const res = await fetch(`/api/auth/${mode}/email`, {
    method: "POST",
    credentials: "include",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json().catch(() => ({}))) as {
    message?: string;
    user?: { id: string; email: string; name: string };
  };
  if (!res.ok) {
    const raw = data.message || "";
    const message = raw.includes("already exists")
      ? "Ese correo ya tiene cuenta. Entra con tu contraseña."
      : raw.includes("Invalid email or password") || raw.includes("Invalid password")
        ? "Correo o contraseña incorrectos."
        : raw || "No se pudo completar el acceso";
    throw new Error(message);
  }
  const token = res.headers.get("set-auth-token");
  if (token) sessionStorage.setItem(BEARER_KEY, token);
  return data;
}
