import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth/client";
import { emailAuth } from "@/lib/erp/email-auth";
import { createNegocio } from "@/lib/erp/server";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [mode, setMode] = useState<"entrar" | "crear">("entrar");
  const [nombreNegocio, setNombreNegocio] = useState("Mi Restobar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    try {
      if (mode === "crear") {
        await emailAuth("sign-up", { email, password, name: nombre });
        await authClient.getSession();
        await createNegocio({ data: { nombre: nombreNegocio, nombrePersona: nombre } });
      } else {
        await emailAuth("sign-in", { email, password });
        await authClient.getSession();
      }
      window.location.assign("/");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "No se pudo entrar");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-bg px-4 py-12 text-fg">
      <form onSubmit={submit} className="w-full max-w-md rounded-xl border border-border bg-surface p-6">
        <p className="text-[11px] tracking-[0.22em] text-muted uppercase">RESTOBAR ERP</p>
        <h1 className="font-display mt-2 text-3xl">
          {mode === "crear" ? "Crear tu negocio" : "Entrar"}
        </h1>
        <p className="mt-2 text-sm text-muted">
          Cada cuenta ve solo su local. El administrador crea cajeros e inventario con su propia clave.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Button type="button" variant={mode === "entrar" ? "default" : "secondary"} onClick={() => setMode("entrar")}>
            Ya tengo cuenta
          </Button>
          <Button type="button" variant={mode === "crear" ? "default" : "secondary"} onClick={() => setMode("crear")}>
            Registrar negocio
          </Button>
        </div>
        <div className="mt-5 space-y-3">
          {mode === "crear" ? (
            <>
              <div>
                <Label>Nombre del negocio</Label>
                <Input value={nombreNegocio} onChange={(e) => setNombreNegocio(e.target.value)} required />
              </div>
              <div>
                <Label>Tu nombre</Label>
                <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
              </div>
            </>
          ) : null}
          <div>
            <Label>Correo</Label>
            <Input type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <Label>Contraseña</Label>
            <Input type="password" autoComplete={mode === "crear" ? "new-password" : "current-password"} minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : mode === "crear" ? "Crear y entrar" : "Entrar"}
          </Button>
        </div>
      </form>
    </main>
  );
}
