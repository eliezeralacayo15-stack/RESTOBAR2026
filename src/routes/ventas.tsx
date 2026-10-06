import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { money } from "@/lib/erp/format";
import { anularVenta, getVentaDetalle, getVentas } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/ventas")({ component: VentasPage });

function VentasPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["ventas"], queryFn: () => getVentas() });
  const [open, setOpen] = useState<string | null>(null);
  const det = useQuery({
    queryKey: ["venta", open],
    queryFn: () => getVentaDetalle({ data: { idVenta: open! } }),
    enabled: !!open,
  });

  const voidSale = useMutation({
    mutationFn: (idVenta: string) =>
      anularVenta({ data: { idVenta, idUsuario: operator!.idUsuario } }),
    onSuccess: () => {
      toast.success("Venta anulada con movimiento compensatorio");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        kicker="Transacciones"
        title="Ventas"
        subtitle="Histórico. Las ventas no se borran: se anulan con reverso de inventario y caja."
      />
      <TableWrap>
        <THead
          columns={["ID", "Fecha", "Cliente", "Pago", "Total", "Estado", ""]}
        />
        <tbody>
          {(list.data ?? []).map((v) => (
            <tr key={v.idVenta} className="hover:bg-surface-2/50">
              <Td className="font-mono text-xs">{v.idVenta}</Td>
              <Td>
                {v.fecha} {v.hora}
              </Td>
              <Td>{v.cliente}</Td>
              <Td>{v.formaPago}</Td>
              <Td numeric>{money(v.total)}</Td>
              <Td>
                <Badge tone={v.estado === "PAGADA" ? "success" : "danger"}>
                  {v.estado}
                </Badge>
              </Td>
              <Td>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setOpen(v.idVenta)}>
                    Detalle
                  </Button>
                  {v.estado === "PAGADA" ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => voidSale.mutate(v.idVenta)}
                    >
                      Anular
                    </Button>
                  ) : null}
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      {open && (
        <div className="mt-4 rounded-xl border border-border bg-surface p-4">
          <p className="mb-2 font-mono text-sm">{open}</p>
          <ul className="space-y-1 text-sm">
            {(det.data ?? []).map((l) => (
              <li key={l.idDetalle} className="flex justify-between">
                <span>
                  {l.cantidad} × {l.producto}
                </span>
                <span className="tabular-nums">{money(l.total)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
