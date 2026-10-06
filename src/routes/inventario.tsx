import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Badge } from "@/components/ui/badge";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { money, qty } from "@/lib/erp/format";
import {
  getInventarioExtra,
  getKardex,
  getSnapshot,
  registrarConteo,
  registrarMerma,
} from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/inventario")({
  component: InventarioPage,
});

function InventarioPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const extra = useQuery({
    queryKey: ["inv-extra"],
    queryFn: () => getInventarioExtra(),
  });
  const kardex = useQuery({
    queryKey: ["kardex"],
    queryFn: () => getKardex({ data: {} }),
  });
  const [mermaOpen, setMermaOpen] = useState(false);
  const [conteoOpen, setConteoOpen] = useState(false);
  const [idInsumo, setIdInsumo] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [motivo, setMotivo] = useState("Rotura");
  const [contado, setContado] = useState("");

  const merma = useMutation({
    mutationFn: () =>
      registrarMerma({
        data: {
          idUsuario: operator!.idUsuario,
          idInsumo,
          cantidad: Number(cantidad),
          motivo,
        },
      }),
    onSuccess: () => {
      toast.success("Merma registrada en Kardex");
      setMermaOpen(false);
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const conteo = useMutation({
    mutationFn: () =>
      registrarConteo({
        data: {
          idUsuario: operator!.idUsuario,
          idInsumo,
          stockContado: Number(contado),
          observacion: "Conteo físico",
        },
      }),
    onSuccess: (r) => {
      toast.success(`Conteo OK. Diferencia ${r.diferencia}`);
      setConteoOpen(false);
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const insumos = snap.data?.insumos ?? [];

  return (
    <div>
      <PageHeader
        kicker="Fase 3 — Inventario"
        title="Kardex"
        subtitle="El stock nunca se escribe a mano. Sale de MOV_INVENTARIO: compras, ventas, mermas y conteos."
        actions={
          <>
            <Button variant="secondary" onClick={() => setConteoOpen(true)}>
              Conteo
            </Button>
            <Button onClick={() => setMermaOpen(true)}>Merma</Button>
          </>
        }
      />
      <Tabs defaultValue="stock">
        <TabsList>
          <TabsTrigger value="stock">Stock</TabsTrigger>
          <TabsTrigger value="kardex">Movimientos</TabsTrigger>
          <TabsTrigger value="conteos">Conteos</TabsTrigger>
          <TabsTrigger value="mermas">Mermas</TabsTrigger>
        </TabsList>
        <TabsContent value="stock" className="mt-4">
          <TableWrap>
            <THead
              columns={[
                "ID",
                "Insumo",
                "Stock",
                "Mín",
                "Máx",
                "Costo",
                "Unidad",
                "Estado",
              ]}
            />
            <tbody>
              {insumos.map((i) => {
                const alert = i.stock <= i.stockMinimo;
                return (
                  <tr key={i.idInsumo}>
                    <Td className="font-mono text-xs">{i.idInsumo}</Td>
                    <Td>{i.insumo}</Td>
                    <Td numeric className={alert ? "text-warning" : ""}>
                      {qty(i.stock)}
                    </Td>
                    <Td numeric>{qty(i.stockMinimo)}</Td>
                    <Td numeric>{qty(i.stockMaximo)}</Td>
                    <Td numeric>{money(i.costoUnitario)}</Td>
                    <Td>{i.unidadConsumo}</Td>
                    <Td>
                      <Badge tone={alert ? "warning" : "success"}>
                        {alert ? "Bajo mínimo" : "OK"}
                      </Badge>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </TableWrap>
        </TabsContent>
        <TabsContent value="kardex" className="mt-4">
          <TableWrap>
            <THead
              columns={[
                "ID",
                "Fecha",
                "Insumo",
                "Tipo",
                "Entrada",
                "Salida",
                "Ref",
              ]}
            />
            <tbody>
              {(kardex.data ?? []).map((m) => (
                <tr key={m.idMovimiento}>
                  <Td className="font-mono text-xs">{m.idMovimiento}</Td>
                  <Td>
                    {m.fecha} {m.hora}
                  </Td>
                  <Td>{m.insumo}</Td>
                  <Td>{m.tipo}</Td>
                  <Td numeric>{qty(m.entrada)}</Td>
                  <Td numeric>{qty(m.salida)}</Td>
                  <Td className="font-mono text-xs">{m.referencia}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>
        <TabsContent value="conteos" className="mt-4">
          <TableWrap>
            <THead
              columns={["ID", "Fecha", "Insumo", "Sistema", "Contado", "Dif"]}
            />
            <tbody>
              {(extra.data?.conteos ?? []).map((c) => (
                <tr key={c.idConteo}>
                  <Td className="font-mono text-xs">{c.idConteo}</Td>
                  <Td>{c.fecha}</Td>
                  <Td>{c.insumo}</Td>
                  <Td numeric>{qty(c.stockSistema)}</Td>
                  <Td numeric>{qty(c.stockContado)}</Td>
                  <Td numeric>{qty(c.diferencia)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>
        <TabsContent value="mermas" className="mt-4">
          <TableWrap>
            <THead
              columns={["ID", "Fecha", "Insumo", "Cantidad", "Motivo", "Costo"]}
            />
            <tbody>
              {(extra.data?.mermas ?? []).map((m) => (
                <tr key={m.idMerma}>
                  <Td className="font-mono text-xs">{m.idMerma}</Td>
                  <Td>{m.fecha}</Td>
                  <Td>{m.insumo}</Td>
                  <Td numeric>{qty(m.cantidad)}</Td>
                  <Td>{m.motivo}</Td>
                  <Td numeric>{money(m.costoTotal)}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>
      </Tabs>

      <Dialog open={mermaOpen} onOpenChange={setMermaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar merma</DialogTitle>
          </DialogHeader>
          <Label>Insumo</Label>
          <NativeSelect value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)}>
            <option value="">Seleccionar</option>
            {insumos.map((i) => (
              <option key={i.idInsumo} value={i.idInsumo}>
                {i.insumo}
              </option>
            ))}
          </NativeSelect>
          <Label className="mt-2 block">Cantidad</Label>
          <Input value={cantidad} onChange={(e) => setCantidad(e.target.value)} type="number" />
          <Label className="mt-2 block">Motivo</Label>
          <Input value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          <Button className="mt-4 w-full" onClick={() => merma.mutate()}>
            Guardar merma
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={conteoOpen} onOpenChange={setConteoOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Conteo físico</DialogTitle>
          </DialogHeader>
          <p className="mb-3 text-sm text-muted">
            La diferencia genera un ajuste en el Kardex. No se edita el stock a mano.
          </p>
          <Label>Insumo</Label>
          <NativeSelect value={idInsumo} onChange={(e) => setIdInsumo(e.target.value)}>
            <option value="">Seleccionar</option>
            {insumos.map((i) => (
              <option key={i.idInsumo} value={i.idInsumo}>
                {i.insumo} (sistema {qty(i.stock)})
              </option>
            ))}
          </NativeSelect>
          <Label className="mt-2 block">Stock contado</Label>
          <Input value={contado} onChange={(e) => setContado(e.target.value)} type="number" />
          <Button className="mt-4 w-full" onClick={() => conteo.mutate()}>
            Registrar conteo
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
