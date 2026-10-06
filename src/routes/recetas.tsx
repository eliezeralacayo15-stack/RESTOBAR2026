import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { money, pct, qty } from "@/lib/erp/format";
import { deleteReceta, getSnapshot, upsertReceta } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/recetas")({ component: RecetasPage });

function RecetasPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const [idProducto, setIdProducto] = useState("");
  const [open, setOpen] = useState(false);
  const [idInsumo, setIdInsumo] = useState("");
  const [cantidad, setCantidad] = useState("0.1");
  const [merma, setMerma] = useState("0");

  const data = snap.data;
  const grouped = useMemo(() => {
    if (!data) return [];
    return data.productos.map((p) => {
      const lines = data.recetas.filter((r) => r.idProducto === p.idProducto);
      return { producto: p, lines, costo: p.costoReceta };
    });
  }, [data]);

  const save = useMutation({
    mutationFn: () => {
      const ins = data?.insumos.find((i) => i.idInsumo === idInsumo);
      return upsertReceta({
        data: {
          idUsuario: operator!.idUsuario,
          idProducto,
          idInsumo,
          cantidad: Number(cantidad),
          unidadConsumo: ins?.unidadConsumo ?? "UND",
          mermaPct: Number(merma),
        },
      });
    },
    onSuccess: () => {
      toast.success("Componente agregado");
      setOpen(false);
      void qc.invalidateQueries({ queryKey: ["erp"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (idReceta: string) =>
      deleteReceta({ data: { idUsuario: operator!.idUsuario, idReceta } }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["erp"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!data) return <p className="text-muted">Cargando recetas…</p>;

  return (
    <div>
      <PageHeader
        kicker="Fase 2 — Costeo"
        title="Recetas"
        subtitle="Cantidad neta = cantidad × (1 + merma). Costo = neta × costo vigente del insumo. No se duplica un insumo en la misma receta."
        actions={
          <Button
            onClick={() => {
              setIdProducto(data.productos[0]?.idProducto ?? "");
              setOpen(true);
            }}
          >
            Agregar componente
          </Button>
        }
      />

      <div className="grid gap-4">
        {grouped.map(({ producto, lines, costo }) => {
          const margin =
            producto.precioVenta > 0 ? 1 - costo / producto.precioVenta : 0;
          return (
            <Card key={producto.idProducto}>
              <CardHeader className="flex flex-row items-start justify-between gap-3">
                <div>
                  <CardTitle>{producto.producto}</CardTitle>
                  <p className="mt-1 font-mono text-xs text-muted">
                    {producto.idProducto} · {producto.sku}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted">Costo receta</p>
                  <p className="font-display text-2xl tabular-nums">{money(costo)}</p>
                  {costo > 0 ? (
                    <Badge tone={margin > 0.45 ? "success" : "warning"}>
                      Margen {pct(margin)}
                    </Badge>
                  ) : (
                    <Badge>Sin receta</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {lines.length === 0 ? (
                  <p className="text-sm text-muted">
                    Este producto se puede vender, pero no descuenta inventario hasta que tenga receta.
                  </p>
                ) : (
                  <TableWrap>
                    <THead
                      columns={[
                        "Insumo",
                        "Cantidad",
                        "Merma",
                        "Neta",
                        "Costo und.",
                        "Costo total",
                        "",
                      ]}
                    />
                    <tbody>
                      {lines.map((l) => (
                        <tr key={l.idReceta}>
                          <Td>{l.insumo}</Td>
                          <Td numeric>
                            {qty(l.cantidad)} {l.unidadConsumo}
                          </Td>
                          <Td numeric>{pct(l.mermaPct)}</Td>
                          <Td numeric>{qty(l.cantidadNeta)}</Td>
                          <Td numeric>{money(l.costoUnitario)}</Td>
                          <Td numeric>{money(l.costoTotal)}</Td>
                          <Td>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => remove.mutate(l.idReceta)}
                            >
                              Quitar
                            </Button>
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </TableWrap>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Componente de receta</DialogTitle>
          </DialogHeader>
          <Label>Producto</Label>
          <NativeSelect
            value={idProducto}
            onChange={(e) => setIdProducto(e.target.value)}
          >
            {data.productos.map((p) => (
              <option key={p.idProducto} value={p.idProducto}>
                {p.producto}
              </option>
            ))}
          </NativeSelect>
          <Label className="mt-2 block">Insumo</Label>
          <NativeSelect value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)}>
            <option value="">Seleccionar</option>
            {data.insumos.map((i) => (
              <option key={i.idInsumo} value={i.idInsumo}>
                {i.insumo}
              </option>
            ))}
          </NativeSelect>
          <Label className="mt-2 block">Cantidad</Label>
          <Input
            type="number"
            step="0.001"
            value={cantidad}
            onChange={(e) => setCantidad(e.target.value)}
          />
          <Label className="mt-2 block">Merma (0.05 = 5%)</Label>
          <Input
            type="number"
            step="0.01"
            value={merma}
            onChange={(e) => setMerma(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={() => save.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
