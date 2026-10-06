import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { money } from "@/lib/erp/format";
import { getCompras, getSnapshot, registrarCompra } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/compras")({ component: ComprasPage });

function ComprasPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["compras"], queryFn: () => getCompras() });
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const [open, setOpen] = useState(false);
  const [idProveedor, setIdProveedor] = useState("");
  const [documento, setDocumento] = useState("");
  const [idInsumo, setIdInsumo] = useState("");
  const [cantidad, setCantidad] = useState("1");
  const [costo, setCosto] = useState("0");
  const [lines, setLines] = useState<
    { idInsumo: string; nombre: string; cantidad: number; costoUnitario: number }[]
  >([]);

  const save = useMutation({
    mutationFn: () =>
      registrarCompra({
        data: {
          idUsuario: operator!.idUsuario,
          idProveedor,
          documento,
          items: lines.map((l) => ({
            idInsumo: l.idInsumo,
            cantidad: l.cantidad,
            costoUnitario: l.costoUnitario,
            impuesto: 0,
          })),
        },
      }),
    onSuccess: (res) => {
      toast.success(`Compra ${res.idCompra} recibida`);
      setOpen(false);
      setLines([]);
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const insumos = snap.data?.insumos ?? [];
  const proveedores = snap.data?.proveedores ?? [];

  return (
    <div>
      <PageHeader
        kicker="Fase 4 — Compras"
        title="Compras"
        subtitle="Cada recepción entra al Kardex y actualiza el costo promedio del insumo."
        actions={<Button onClick={() => setOpen(true)}>Nueva compra</Button>}
      />
      <TableWrap>
        <THead columns={["ID", "Fecha", "Proveedor", "Documento", "Total", "Estado"]} />
        <tbody>
          {(list.data ?? []).map((c) => (
            <tr key={c.idCompra}>
              <Td className="font-mono text-xs">{c.idCompra}</Td>
              <Td>{c.fecha}</Td>
              <Td>{c.proveedor}</Td>
              <Td>{c.documento || "—"}</Td>
              <Td numeric>{money(c.total)}</Td>
              <Td>{c.estado}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Recepción de compra</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div>
              <Label>Proveedor</Label>
              <NativeSelect
                value={idProveedor}
                onChange={(e) => setIdProveedor(e.target.value)}
              >
                <option value="">Seleccionar</option>
                {proveedores.map((p) => (
                  <option key={p.idProveedor} value={p.idProveedor}>
                    {p.nombreComercial}
                  </option>
                ))}
              </NativeSelect>
            </div>
            <div>
              <Label>Documento</Label>
              <Input value={documento} onChange={(e) => setDocumento(e.target.value)} />
            </div>
            <div className="grid grid-cols-3 gap-2">
              <NativeSelect
                className="col-span-3"
                value={idInsumo}
                onChange={(e) => {
                  setIdInsumo(e.target.value);
                  const ins = insumos.find((i) => i.idInsumo === e.target.value);
                  if (ins) setCosto(String(ins.costoUnitario));
                }}
              >
                <option value="">Insumo</option>
                {insumos.map((i) => (
                  <option key={i.idInsumo} value={i.idInsumo}>
                    {i.insumo}
                  </option>
                ))}
              </NativeSelect>
              <Input
                type="number"
                value={cantidad}
                onChange={(e) => setCantidad(e.target.value)}
              />
              <Input
                type="number"
                value={costo}
                onChange={(e) => setCosto(e.target.value)}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  const ins = insumos.find((i) => i.idInsumo === idInsumo);
                  if (!ins) return;
                  setLines((prev) => [
                    ...prev,
                    {
                      idInsumo,
                      nombre: ins.insumo,
                      cantidad: Number(cantidad),
                      costoUnitario: Number(costo),
                    },
                  ]);
                }}
              >
                Añadir
              </Button>
            </div>
            <ul className="text-sm">
              {lines.map((l, i) => (
                <li key={i} className="flex justify-between">
                  <span>
                    {l.cantidad} × {l.nombre}
                  </span>
                  <span className="tabular-nums">
                    {money(l.cantidad * l.costoUnitario)}
                  </span>
                </li>
              ))}
            </ul>
            <Button
              disabled={!idProveedor || lines.length === 0 || save.isPending}
              onClick={() => save.mutate()}
            >
              Registrar recepción
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
