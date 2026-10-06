import { Link, useRouterState } from "@tanstack/react-router";
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
  UtensilsCrossed,
  Wallet,
  BookOpen,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { getSnapshot } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";
import { ROLE_MODULES, type Rol } from "@/lib/erp/types";
import { money } from "@/lib/erp/format";
import { cn } from "@/lib/utils";
import { OperatorGate } from "./operator-gate";

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

export function AppShell({ children }: { children: ReactNode }) {
  const operator = useSession((s) => s.operator);
  const clear = useSession((s) => s.clearOperator);
  const [open, setOpen] = useState(false);
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });

  if (!operator) return <OperatorGate />;

  const empresa = snap.data?.config.Nombre_Empresa ?? "Mi Restobar";
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
          <Button variant="ghost" size="sm" onClick={clear}>
            Salir
          </Button>
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
