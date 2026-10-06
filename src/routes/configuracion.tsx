import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { getInventarioExtra, getSnapshot, updateConfig } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/configuracion")({
  component: ConfigPage,
});

const RULES = [
  "Cada registro transaccional tiene una clave primaria única.",
  "Las relaciones se realizan mediante IDs, nunca por nombres.",
  "Una FK debe existir previamente en su tabla maestra.",
  "Las transacciones históricas no se eliminan: se anulan con movimientos compensatorios.",
  "El stock no se escribe a mano: se deriva del Kardex MOV_INVENTARIO.",
  "El costo de una receta se deriva de RECETAS + costo vigente del INSUMO.",
  "Los totales de cabecera deben cuadrar con sus detalles.",
  "Los reportes y el dashboard son de solo lectura.",
  "ID_Usuario identifica quién ejecutó la operación; ID_Empleado al trabajador.",
  "Las tablas de detalle dependen de su cabecera mediante FK.",
];

function ConfigPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const extra = useQuery({
    queryKey: ["inv-extra"],
    queryFn: () => getInventarioExtra(),
  });

  const save = useMutation({
    mutationFn: (payload: { parametro: string; valor: string }) =>
      updateConfig({
        data: { ...payload, idUsuario: operator!.idUsuario },
      }),
    onSuccess: () => {
      toast.success("Configuración actualizada");
      void qc.invalidateQueries({ queryKey: ["erp"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const rows = snap.data?.configRows ?? [];

  return (
    <div>
      <PageHeader
        kicker="Arquitectura"
        title="Configuración"
        subtitle="Los mismos parámetros de la hoja CONFIG. El Excel de Fase 1–2 sigue disponible como referencia."
        actions={
          <a
            href="/RESTOBAR_ERP.xlsx"
            className="inline-flex h-11 items-center rounded-md border border-border px-4 text-sm"
          >
            Descargar Excel original
          </a>
        }
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parámetros</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {rows.map((r) => (
              <div key={r.parametro} className="grid gap-1">
                <label className="text-xs text-muted">
                  {r.parametro}
                  <span className="ml-2 text-subtle">{r.descripcion}</span>
                </label>
                {r.parametro === "Stock_Negativo" || r.parametro === "Control_Caja" ? (
                  <NativeSelect
                    value={r.valor}
                    onChange={(e) =>
                      save.mutate({ parametro: r.parametro, valor: e.target.value })
                    }
                  >
                    <option value="SI">SI</option>
                    <option value="NO">NO</option>
                  </NativeSelect>
                ) : (
                  <Input
                    defaultValue={r.valor}
                    onBlur={(e) => {
                      if (e.target.value !== r.valor) {
                        save.mutate({
                          parametro: r.parametro,
                          valor: e.target.value,
                        });
                      }
                    }}
                  />
                )}
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reglas fundamentales</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal space-y-2 pl-5 text-sm text-muted">
              {RULES.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Log de auditoría</CardTitle>
        </CardHeader>
        <CardContent>
          <TableWrap>
            <THead
              columns={["ID", "Fecha", "Módulo", "Acción", "Ref", "Descripción"]}
            />
            <tbody>
              {(extra.data?.log ?? []).map((l) => (
                <tr key={l.idLog}>
                  <Td className="font-mono text-xs">{l.idLog}</Td>
                  <Td>
                    {l.fecha} {l.hora}
                  </Td>
                  <Td>{l.modulo}</Td>
                  <Td>{l.accion}</Td>
                  <Td className="font-mono text-xs">{l.referencia}</Td>
                  <Td>{l.descripcion}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </CardContent>
      </Card>
    </div>
  );
}
