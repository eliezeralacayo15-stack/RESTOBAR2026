import { useQuery } from "@tanstack/react-query";
import { ChefHat, Shield, Wallet } from "lucide-react";
import { getSnapshot } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";
import type { Operator, Rol } from "@/lib/erp/types";

const ICONS: Record<Rol, typeof Shield> = {
  ADMIN: Shield,
  CAJERO: Wallet,
  INVENTARIO: ChefHat,
};

const COPY: Record<Rol, string> = {
  ADMIN: "Operación completa, maestros y reportes.",
  CAJERO: "Punto de venta, tickets y control de caja.",
  INVENTARIO: "Kardex, compras, recetas y mermas.",
};

const FALLBACK_USERS: Operator[] = [
  {
    idUsuario: "USR00001",
    usuario: "admin",
    nombre: "Administrador",
    idEmpleado: "EMP00001",
    rol: "ADMIN",
    activo: true,
  },
  {
    idUsuario: "USR00002",
    usuario: "caja",
    nombre: "Cajero",
    idEmpleado: "EMP00002",
    rol: "CAJERO",
    activo: true,
  },
  {
    idUsuario: "USR00003",
    usuario: "inventario",
    nombre: "Inventario",
    idEmpleado: "EMP00003",
    rol: "INVENTARIO",
    activo: true,
  },
];

export function OperatorGate() {
  const setOperator = useSession((s) => s.setOperator);
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const empresa = snap.data?.config.Nombre_Empresa ?? "Mi Restobar";
  const users = (snap.data?.usuarios ?? FALLBACK_USERS).filter((u) => u.activo);

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12 text-fg">
      <p className="text-[11px] tracking-[0.28em] text-muted uppercase">
        RESTOBAR ERP
      </p>
      <h1 className="font-display mt-3 text-4xl tracking-tight sm:text-5xl">
        {empresa}
      </h1>
      <p className="mt-3 max-w-md text-center text-sm text-muted">
        Continúa el trabajo de Fase 2. Elige operador para entrar al servicio.
      </p>
      <div className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3">
        {users.map((u) => {
          const Icon = ICONS[u.rol];
          return (
            <button
              key={u.idUsuario}
              type="button"
              onClick={() => setOperator(u)}
              className="rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface-2"
            >
              <Icon className="size-5 text-primary" />
              <p className="mt-4 font-display text-xl">{u.nombre}</p>
              <p className="text-[11px] tracking-wide text-subtle uppercase">
                {u.rol}
              </p>
              <p className="mt-2 text-sm text-muted">{COPY[u.rol]}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
