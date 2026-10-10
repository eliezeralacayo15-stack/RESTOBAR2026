import { Link, Navigate, useRouterState } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  BarChart3,
  ChefHat,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingBag,
  Store,
  Users,
  UtensilsCrossed,
  Wallet,
  BookOpen,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createNegocio, getMe, getSnapshot } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";
import { ROLE_MODULES, type Rol } from "@/lib/erp/types";
import { money } from "@/lib/erp/format";
import { cn } from "@/lib/utils";

const NAV = [
  { id: "dashboard", to: "/", label: "Dashboard", icon: LayoutDashboard },
  { id: "pos", to: "/pos", label: "Punto de venta", icon: UtensilsCrossed },
  { id: "ventas", to: "/ventas", label: "Ventas", icon: Receipt },
  { id: "compras", to: "/compras", label: "Compras", icon: ShoppingBag },
  { id: "inventario", to: "/inventario", label: "Inventario", icon: Package },
  { id: "recetas", to: "/recetas", label: "Recetas", icon: ChefHat },
  { id: "caja", to: "/caja", label: "Caja", icon: Wallet },
  { id: "gastos", to: "/gastos", label: "Gastos", icon: BookOpen },
  { id: "maestros", to: "/maestros", label: "Maestros", icon: Store },
  { id: "equipo", to: "/equipo", label: "Equipo", icon: Users },
  { id: "reportes", to: "/reportes", label: "Reportes", icon: BarChart3 },
  { id: "config", to: "/configuracion", label: "Configuración", icon: Settings },
] as const;

function NavLinks({
  rol,
  onNavigate,
}: {
  rol: Rol;
  onNavigate?: () => void;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const allowed = ROLE_MODULES[rol];
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.filter((item) => allowed.includes(item.id)).map((item) => {
        const active =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.id}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-surface-2 text-fg"
                : "text-muted hover:bg-surface-2/70 hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

function Onboarding({ defaultName }: { defaultName: string }) {
  const qc = useQueryClient();
  const [nombre, setNombre] = useState("Mi Restobar");
  const [persona, setPersona] = useState(defaultName);
  const save = useMutation({
    mutationFn: () =>
      createNegocio({ data: { nombre, nombrePersona: persona || nombre } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["me"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-4 text-fg">
      <form
        className="w-full max-w-md space-y-4 rounded-xl border border-border bg-surface p-6"
        onSubmit={(e) => {
          e.preventDefault();
          save.mutate();
        }}
      >
        <p className="text-[11px] tracking-[0.22em] text-muted uppercase">
          Tu local
        </p>
        <h1 className="font-display text-3xl">Completa el negocio</h1>
        <div>
          <Label>Nombre del negocio</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <Label>Tu nombre</Label>
          <Input value={persona} onChange={(e) => setPersona(e.target.value)} required />
        </div>
        <Button type="submit" className="w-full" disabled={save.isPending}>
          {save.isPending ? "Creando…" : "Abrir el local"}
        </Button>
      </form>
    </main>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const { user, isPending } = useCurrentUserState();
  const operator = useSession((s) => s.operator);
  const setOperator = useSession((s) => s.setOperator);
  const [open, setOpen] = useState(false);
  const me = useQuery({
    queryKey: ["me"],
    queryFn: () => getMe(),
    enabled: !!user,
  });
  const snap = useQuery({
    queryKey: ["erp"],
    queryFn: () => getSnapshot(),
    enabled: !!me.data?.negocio,
  });

  useEffect(() => {
    if (!me.data?.negocio) return;
    setOperator({
      idUsuario: me.data.userId,
      usuario: me.data.email,
      nombre: me.data.negocio.nombreMiembro,
      idEmpleado: null,
      rol: me.data.negocio.rol,
      activo: true,
    });
  }, [me.data, setOperator]);

  if (pathname === "/login") {
    if (isPending || (user && (me.isPending || me.isLoading))) {
      return (
        <div className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">
          Abriendo tu local…
        </div>
      );
    }
    if (user && me.data?.negocio) return <Navigate to="/" />;
    if (user && me.data && !me.data.negocio) {
      return <Onboarding defaultName={me.data.name} />;
    }
    return <>{children}</>;
  }

  if (isPending || (user && me.isPending)) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">
        Cargando el servicio…
      </div>
    );
  }
  if (!user) return <Navigate to="/login" />;
  if (!me.data?.negocio) return <Onboarding defaultName={me.data?.name ?? ""} />;
  if (
    !operator ||
    operator.idUsuario !== me.data.userId ||
    operator.rol !== me.data.negocio.rol
  ) {
    return (
      <div className="grid min-h-dvh place-items-center bg-bg text-sm text-muted">
        Abriendo el local…
      </div>
    );
  }

  const empresa = snap.data?.config.Nombre_Empresa || me.data.negocio.nombre;
  const caja = snap.data?.caja;
  const efectivo = snap.data?.efectivoCaja ?? 0;

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-4 pt-6 pb-5">
        <p className="text-[11px] tracking-[0.22em] text-muted uppercase">
          RESTOBAR ERP
        </p>
        <p className="font-display mt-1 text-xl text-fg">{empresa}</p>
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4">
        <NavLinks rol={operator.rol} onNavigate={() => setOpen(false)} />
      </div>
      <div className="border-t border-border p-4">
        <p className="text-xs text-muted">Operador</p>
        <p className="text-sm text-fg">{operator.nombre}</p>
        <p className="text-[11px] tracking-wide text-subtle uppercase">
          {operator.rol}
        </p>
        <div className="mt-3 flex items-center justify-between gap-2">
          <span className="text-xs text-muted">
            {caja ? `Caja ${money(efectivo)}` : "Sin caja"}
          </span>
          <UserButton />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-surface lg:block">
        {sidebar}
      </aside>
      <div className="lg:pl-60">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur-sm lg:hidden">
          <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div>
            <p className="text-[10px] tracking-[0.18em] text-muted uppercase">
              RESTOBAR
            </p>
            <p className="text-sm font-medium">{empresa}</p>
          </div>
        </header>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="left">{sidebar}</SheetContent>
        </Sheet>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
