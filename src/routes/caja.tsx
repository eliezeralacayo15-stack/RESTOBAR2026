import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { money } from "@/lib/erp/format";
import { labelPago } from "@/lib/erp/pagos";
import { closeCaja, getCajaDetalle, getSnapshot, openCaja } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/caja")({ component: CajaPage });

function CajaPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const det = useQuery({ queryKey: ["caja"], queryFn: () => getCajaDetalle() });
  const [openAmt, setOpenAmt] = useState("150");
  const [countAmt, setCountAmt] = useState("");
  const [closeOpen, setCloseOpen] = useState(false);

  const openMut = useMutation({
    mutationFn: () =>
      openCaja({
        data: {
          idUsuario: operator!.idUsuario,
          caja: "Caja 1",
          montoInicial: Number(openAmt),
        },
      }),
    onSuccess: () => {
      toast.success("Caja abierta");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const closeMut = useMutation({
    mutationFn: () =>
      closeCaja({
        data: {
          idUsuario: operator!.idUsuario,
          idCaja: snap.data!.caja!.idCaja,
          efectivoContado: Number(countAmt),
        },
      }),
    onSuccess: (r) => {
      toast.success(`Cerrada. Diferencia ${money(r.diferencia)}`);
      setCloseOpen(false);
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const caja = snap.data?.caja;

  return (
    <div>
      <PageHeader
        kicker="Fase 5 — Caja"
        title="Control de caja"
        subtitle="Una caja abierta a la vez. El efectivo esperado sale de los movimientos, no se edita."
      />
      <Card className="mb-6">
        <CardContent className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs tracking-wide text-muted uppercase">Estado</p>
            <p className="font-display mt-1 text-3xl">
              {caja ? "Abierta" : "Cerrada"}
            </p>
            {caja ? (
              <p className="text-sm text-muted">
                {caja.caja} · fondo {money(caja.montoInicial)} · efectivo{" "}
                {money(snap.data?.efectivoCaja ?? 0)}
              </p>
            ) : (
              <p className="text-sm text-muted">
                Abre caja para vender en efectivo y registrar gastos.
              </p>
            )}
          </div>
          {caja ? (
            <Button onClick={() => setCloseOpen(true)}>Cerrar caja</Button>
          ) : (
            <div className="flex gap-2">
              <Input
                className="w-32"
                type="number"
                value={openAmt}
                onChange={(e) => setOpenAmt(e.target.value)}
              />
              <Button onClick={() => openMut.mutate()}>Abrir</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <h2 className="font-display mb-3 text-xl">Movimientos</h2>
      <TableWrap>
        <THead
          columns={["ID", "Fecha", "Tipo", "Concepto", "Entrada", "Salida", "Pago"]}
        />
        <tbody>
          {(det.data?.movimientos ?? []).map((m) => (
            <tr key={m.idMovCaja}>
              <Td className="font-mono text-xs">{m.idMovCaja}</Td>
              <Td>
                {m.fecha} {m.hora}
              </Td>
              <Td>{m.tipo}</Td>
              <Td>{m.concepto}</Td>
              <Td numeric>{money(m.entrada)}</Td>
              <Td numeric>{money(m.salida)}</Td>
              <Td>{labelPago(m.formaPago)}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <h2 className="font-display mt-8 mb-3 text-xl">Turnos</h2>
      <TableWrap>
        <THead
          columns={["ID", "Fecha", "Fondo", "Esperado", "Contado", "Dif", "Estado"]}
        />
        <tbody>
          {(det.data?.cajas ?? []).map((c) => (
            <tr key={c.idCaja}>
              <Td className="font-mono text-xs">{c.idCaja}</Td>
              <Td>{c.fecha}</Td>
              <Td numeric>{money(c.montoInicial)}</Td>
              <Td numeric>
                {c.efectivoEsperado == null ? "—" : money(c.efectivoEsperado)}
              </Td>
              <Td numeric>
                {c.efectivoContado == null ? "—" : money(c.efectivoContado)}
              </Td>
              <Td numeric>{c.diferencia == null ? "—" : money(c.diferencia)}</Td>
              <Td>
                <Badge tone={c.estado === "ABIERTA" ? "success" : "neutral"}>
                  {c.estado}
                </Badge>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>

      <Dialog open={closeOpen} onOpenChange={setCloseOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cierre de caja</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted">
            Esperado {money(snap.data?.efectivoCaja ?? 0)}. Cuenta el efectivo real.
          </p>
          <Label>Efectivo contado</Label>
          <Input
            type="number"
            value={countAmt}
            onChange={(e) => setCountAmt(e.target.value)}
          />
          <Button className="mt-4 w-full" onClick={() => closeMut.mutate()}>
            Confirmar cierre
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
