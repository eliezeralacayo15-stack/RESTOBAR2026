import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PageHeader } from "@/components/erp/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { money, pct } from "@/lib/erp/format";
import { labelPago } from "@/lib/erp/pagos";
import { getSnapshot, getVentas } from "@/lib/erp/server";

export const Route = createFileRoute("/reportes")({ component: ReportesPage });

function ReportesPage() {
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const ventas = useQuery({ queryKey: ["ventas"], queryFn: () => getVentas() });
  const data = snap.data;
  if (!data) return <p className="text-muted">Cargando reportes…</p>;

  const pagadas = (ventas.data ?? []).filter((v) => v.estado === "PAGADA");
  const total = pagadas.reduce((a, v) => a + v.total, 0);

  return (
    <div>
      <PageHeader
        kicker="Fase 7 — Análisis"
        title="Reportes"
        subtitle="Solo lectura. La fuente de verdad sigue siendo transacciones + maestros."
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Ventas recientes</CardTitle>
          </CardHeader>
          <CardContent className="h-56">
            {data.serieVentas.length === 0 ? (
              <p className="text-sm text-muted">Sin movimientos de venta todavía.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.serieVentas}>
                  <XAxis dataKey="fecha" tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <YAxis tick={{ fill: "var(--color-muted)", fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-surface-2)",
                      border: "1px solid var(--color-border)",
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
            <CardTitle>Rentabilidad de carta</CardTitle>
          </CardHeader>
          <CardContent>
            <TableWrap>
              <THead columns={["Producto", "Precio", "Costo", "Margen"]} />
              <tbody>
                {data.productos.map((p) => {
                  const m = p.precioVenta > 0 && p.costoReceta > 0
                    ? 1 - p.costoReceta / p.precioVenta
                    : null;
                  return (
                    <tr key={p.idProducto}>
                      <Td>{p.producto}</Td>
                      <Td numeric>{money(p.precioVenta)}</Td>
                      <Td numeric>
                        {p.costoReceta > 0 ? money(p.costoReceta) : "—"}
                      </Td>
                      <Td numeric>{m == null ? "Sin receta" : pct(m)}</Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrap>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>
            Histórico de tickets · {pagadas.length} pagados · {money(total)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TableWrap>
            <THead columns={["ID", "Fecha", "Pago", "Total", "Estado"]} />
            <tbody>
              {pagadas.slice(0, 30).map((v) => (
                <tr key={v.idVenta}>
                  <Td className="font-mono text-xs">{v.idVenta}</Td>
                  <Td>
                    {v.fecha} {v.hora}
                  </Td>
                  <Td>{labelPago(v.formaPago)}</Td>
                  <Td numeric>{money(v.total)}</Td>
                  <Td>{v.estado}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </CardContent>
      </Card>
    </div>
  );
}
