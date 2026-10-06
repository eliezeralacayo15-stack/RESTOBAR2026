import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  ChefHat,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/erp/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { money, pct } from "@/lib/erp/format";
import { getSnapshot } from "@/lib/erp/server";

export const Route = createFileRoute("/")({ component: Dashboard });

function Dashboard() {
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const data = snap.data;
  if (!data) {
    return <p className="text-muted">Cargando servicio…</p>;
  }

  const costed = data.productos.filter((p) => p.costoReceta > 0);

  return (
    <div>
      <PageHeader
        kicker="Servicio de hoy"
        title={data.config.Nombre_Empresa}
        subtitle="Arquitectura del Excel, ya operando: maestros, recetas con costeo, kardex, ventas y caja."
        actions={
          <Button asChild>
            <Link to="/pos">
              Punto de venta <ArrowRight className="size-4" />
            </Link>
          </Button>
        }
      />

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Ventas de hoy" value={String(data.kpis.ventasHoy)} hint={money(data.kpis.totalHoy)} />
        <Kpi label="Ticket promedio" value={money(data.kpis.ticketPromedio)} hint="Tickets pagados" />
        <Kpi
          label="Caja"
          value={data.caja ? money(data.efectivoCaja) : "Cerrada"}
          hint={data.caja ? data.caja.caja : "Abre caja para vender"}
        />
        <Kpi
          label="Alertas de stock"
          value={String(data.kpis.alertasStock)}
          hint="En o bajo mínimo"
          warn={data.kpis.alertasStock > 0}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Ventas 14 días</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            {data.serieVentas.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.serieVentas}>
                  <XAxis dataKey="fecha" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
                      color: "var(--color-fg)",
                    }}
                    formatter={(v) => money(Number(v))}
                  />
                  <Bar dataKey="total" fill="var(--color-primary)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Costeo de recetas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {costed.length === 0 ? (
              <p className="text-sm text-muted">Define recetas para ver margen.</p>
            ) : (
              costed.map((p) => {
                const margin = p.precioVenta > 0 ? 1 - p.costoReceta / p.precioVenta : 0;
                return (
                  <div key={p.idProducto} className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm">{p.producto}</p>
                      <p className="font-mono text-[11px] text-muted">
                        Costo {money(p.costoReceta)} · Precio {money(p.precioVenta)}
                      </p>
                    </div>
                    <Badge tone={margin > 0.5 ? "success" : "warning"}>{pct(margin)}</Badge>
                  </div>
                );
              })
            )}
            <Button variant="outline" size="sm" asChild>
              <Link to="/recetas">
                <ChefHat className="size-4" /> Ver recetas
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stock bajo mínimo</CardTitle>
            {data.lowStock.length > 0 ? (
              <AlertTriangle className="size-4 text-warning" />
            ) : null}
          </CardHeader>
          <CardContent>
            {data.lowStock.length === 0 ? (
              <p className="text-sm text-muted">Sin alertas. El kardex está por encima del mínimo.</p>
            ) : (
              <ul className="space-y-2">
                {data.lowStock.map((i) => (
                  <li key={i.idInsumo} className="flex justify-between text-sm">
                    <span>{i.insumo}</span>
                    <span className="font-mono text-warning">
                      {i.stock} / mín {i.minimo}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Últimos tickets</CardTitle>
          </CardHeader>
          <CardContent>
            {data.recentSales.length === 0 ? (
              <div className="text-sm text-muted">
                Aún no hay ventas.{" "}
                <Link to="/pos" className="text-fg underline-offset-2 hover:underline">
                  Abrir punto de venta
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {data.recentSales.map((s) => (
                  <li key={s.idVenta} className="flex justify-between text-sm">
                    <span className="font-mono text-muted">{s.idVenta}</span>
                    <span className="tabular-nums">{money(s.total)}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Button variant="secondary" asChild>
          <Link to="/pos">
            <UtensilsCrossed className="size-4" /> Vender
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/caja">
            <Wallet className="size-4" /> Caja
          </Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link to="/inventario">
            Inventario
          </Link>
        </Button>
      </div>
    </div>
  );
}

function Kpi({
  label,
  value,
  hint,
  warn,
}: {
  label: string;
  value: string;
  hint: string;
  warn?: boolean;
}) {
  return (
    <Card>
      <CardContent className="pt-5">
        <p className="text-[11px] tracking-wide text-muted uppercase">{label}</p>
        <p className="font-display mt-2 text-3xl tabular-nums">{value}</p>
        <p className={`mt-1 text-xs ${warn ? "text-warning" : "text-subtle"}`}>{hint}</p>
      </CardContent>
    </Card>
  );
}

function EmptyChart() {
  return (
    <div className="flex h-full items-center justify-center text-sm text-muted">
      Todavía no hay ventas registradas. El gráfico se llena solo.
    </div>
  );
}
