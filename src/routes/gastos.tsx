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
import { getCajaDetalle, registrarGasto } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/gastos")({ component: GastosPage });

function GastosPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const det = useQuery({ queryKey: ["caja"], queryFn: () => getCajaDetalle() });
  const [open, setOpen] = useState(false);
  const [categoria, setCategoria] = useState("Servicios");
  const [descripcion, setDescripcion] = useState("");
  const [monto, setMonto] = useState("");
  const [forma, setForma] = useState<"EFECTIVO" | "TARJETA">("EFECTIVO");

  const save = useMutation({
    mutationFn: () =>
      registrarGasto({
        data: {
          idUsuario: operator!.idUsuario,
          categoria,
          descripcion,
          monto: Number(monto),
          formaPago: forma,
          proveedor: "",
        },
      }),
    onSuccess: () => {
      toast.success("Gasto registrado");
      setOpen(false);
      setDescripcion("");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        kicker="Finanzas"
        title="Gastos"
        subtitle="Los gastos en efectivo salen de la caja abierta."
        actions={<Button onClick={() => setOpen(true)}>Nuevo gasto</Button>}
      />
      <TableWrap>
        <THead
          columns={["ID", "Fecha", "Categoría", "Descripción", "Monto", "Pago", "Estado"]}
        />
        <tbody>
          {(det.data?.gastos ?? []).map((g) => (
            <tr key={g.idGasto}>
              <Td className="font-mono text-xs">{g.idGasto}</Td>
              <Td>{g.fecha}</Td>
              <Td>{g.categoria}</Td>
              <Td>{g.descripcion}</Td>
              <Td numeric>{money(g.monto)}</Td>
              <Td>{g.formaPago}</Td>
              <Td>{g.estado}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar gasto</DialogTitle>
          </DialogHeader>
          <Label>Categoría</Label>
          <NativeSelect
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option>Servicios</option>
            <option>Alquiler</option>
            <option>Limpieza</option>
            <option>Mantenimiento</option>
            <option>Otros</option>
          </NativeSelect>
          <Label className="mt-2 block">Descripción</Label>
          <Input value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
          <Label className="mt-2 block">Monto</Label>
          <Input type="number" value={monto} onChange={(e) => setMonto(e.target.value)} />
          <Label className="mt-2 block">Pago</Label>
          <NativeSelect
            value={forma}
            onChange={(e) => setForma(e.target.value as "EFECTIVO" | "TARJETA")}
          >
            <option value="EFECTIVO">Efectivo</option>
            <option value="TARJETA">Tarjeta</option>
          </NativeSelect>
          <Button className="mt-4 w-full" onClick={() => save.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
