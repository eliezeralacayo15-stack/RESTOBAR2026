import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NativeSelect } from "@/components/ui/native-select";
import { TicketSheet } from "@/components/erp/ticket";
import { money, round2 } from "@/lib/erp/format";
import { getSnapshot, registrarVenta } from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";
import { FORMAS_PAGO, type FormaPago } from "@/lib/erp/pagos";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/pos")({ component: PosPage });

type CartLine = {
  idProducto: string;
  producto: string;
  precio: number;
  impuesto: number;
  cantidad: number;
};

function PosPage() {
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const [cat, setCat] = useState("TODAS");
  const [cart, setCart] = useState<CartLine[]>([]);
  const [payOpen, setPayOpen] = useState(false);
  const [forma, setForma] = useState<FormaPago>("EFECTIVO");
  const [ticket, setTicket] = useState<{
    idVenta: string;
    total: number;
    subtotal: number;
    impuesto: number;
    formaPago: string;
    negocio: string;
    cajero: string;
    lines: { producto: string; cantidad: number; total: number }[];
  } | null>(null);

  const data = snap.data;
  const cats = (data?.categorias ?? []).filter(
    (c) => c.tipo === "PRODUCTO" && c.activo,
  );
  const products = (data?.productos ?? []).filter((p) => p.activo);
  const visible =
    cat === "TODAS" ? products : products.filter((p) => p.idCategoria === cat);

  const totals = useMemo(() => {
    const subtotal = round2(cart.reduce((a, l) => a + l.precio * l.cantidad, 0));
    const impuesto = round2(
      cart.reduce((a, l) => a + l.precio * l.cantidad * l.impuesto, 0),
    );
    return { subtotal, impuesto, total: round2(subtotal + impuesto) };
  }, [cart]);

  function add(p: (typeof products)[number]) {
    setCart((prev) => {
      const found = prev.find((l) => l.idProducto === p.idProducto);
      if (found) {
        return prev.map((l) =>
          l.idProducto === p.idProducto ? { ...l, cantidad: l.cantidad + 1 } : l,
        );
      }
      return [
        ...prev,
        {
          idProducto: p.idProducto,
          producto: p.producto,
          precio: p.precioVenta,
          impuesto: p.impuesto,
          cantidad: 1,
        },
      ];
    });
  }

  const sell = useMutation({
    mutationFn: async () => {
      if (!operator) throw new Error("Sin operador");
      return registrarVenta({
        data: {
          idUsuario: operator.idUsuario,
          idEmpleado: operator.idEmpleado ?? undefined,
          formaPago: forma,
          items: cart.map((l) => ({
            idProducto: l.idProducto,
            cantidad: l.cantidad,
            descuento: 0,
          })),
        },
      });
    },
    onSuccess: (res) => {
      toast.success(`Ticket ${res.idVenta} cobrado`);
      setTicket(res);
      setCart([]);
      setPayOpen(false);
      void qc.invalidateQueries({ queryKey: ["erp"] });
      void qc.invalidateQueries({ queryKey: ["ventas"] });
    },
    onError: (err: Error) => toast.error(err.message),
  });

  if (!data) return <p className="text-muted">Cargando carta…</p>;

  return (
    <div>
      <PageHeader
        kicker="Fase 4 — Ventas"
        title="Punto de venta"
        subtitle={
          data.caja
            ? `${data.caja.caja} abierta · ${money(data.efectivoCaja)}`
            : "No hay caja abierta. Ábrela en Caja para poder cobrar."
        }
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div>
          <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
            {["TODAS", ...cats.map((c) => c.idCategoria)].map((id) => {
              const label =
                id === "TODAS"
                  ? "Todas"
                  : cats.find((c) => c.idCategoria === id)?.categoria;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setCat(id)}
                  className={cn(
                    "h-10 shrink-0 rounded-full border px-4 text-sm",
                    cat === id
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border text-muted hover:text-fg",
                  )}
                >
                  {label}
                </button>
              );
            })}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {visible.map((p) => {
              const catName =
                cats.find((c) => c.idCategoria === p.idCategoria)?.categoria ??
                "";
              return (
                <button
                  key={p.idProducto}
                  type="button"
                  onClick={() => add(p)}
                  className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary/40 hover:bg-surface-2"
                >
                  <p className="text-[11px] tracking-wide text-muted uppercase">
                    {catName}
                  </p>
                  <p className="mt-1 font-medium">{p.producto}</p>
                  <p className="font-display mt-3 text-xl tabular-nums">
                    {money(p.precioVenta)}
                  </p>
                  {p.costoReceta > 0 ? (
                    <p className="mt-1 font-mono text-[11px] text-subtle">
                      Costo {money(p.costoReceta)}
                    </p>
                  ) : (
                    <Badge className="mt-2" tone="neutral">
                      Sin receta
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <Card className="h-fit lg:sticky lg:top-6">
          <CardContent className="pt-5">
            <p className="text-[11px] tracking-wide text-muted uppercase">
              Ticket
            </p>
            {cart.length === 0 ? (
              <p className="mt-4 text-sm text-muted">
                Toca un producto para armar la comanda.
              </p>
            ) : (
              <ul className="mt-3 space-y-3">
                {cart.map((l) => (
                  <li key={l.idProducto} className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm">{l.producto}</p>
                      <p className="font-mono text-[11px] text-muted">
                        {money(l.precio)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          setCart((prev) =>
                            prev
                              .map((x) =>
                                x.idProducto === l.idProducto
                                  ? { ...x, cantidad: x.cantidad - 1 }
                                  : x,
                              )
                              .filter((x) => x.cantidad > 0),
                          )
                        }
                      >
                        <Minus className="size-3.5" />
                      </Button>
                      <span className="w-6 text-center tabular-nums">
                        {l.cantidad}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-9"
                        onClick={() =>
                          setCart((prev) =>
                            prev.map((x) =>
                              x.idProducto === l.idProducto
                                ? { ...x, cantidad: x.cantidad + 1 }
                                : x,
                            ),
                          )
                        }
                      >
                        <Plus className="size-3.5" />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-5 space-y-1 border-t border-border pt-4 text-sm">
              <Row label="Subtotal" value={money(totals.subtotal)} />
              <Row label="IVA" value={money(totals.impuesto)} />
              <div className="flex justify-between pt-2 text-base">
                <span>Total</span>
                <span className="font-display text-2xl tabular-nums">
                  {money(totals.total)}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost"
                className="flex-1"
                disabled={cart.length === 0}
                onClick={() => setCart([])}
              >
                <Trash2 className="size-4" /> Limpiar
              </Button>
              <Button
                className="flex-1"
                disabled={cart.length === 0 || !data.caja}
                onClick={() => setPayOpen(true)}
              >
                Cobrar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={payOpen} onOpenChange={setPayOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cobrar {money(totals.total)}</DialogTitle>
          </DialogHeader>
          <label className="text-xs text-muted">Forma de pago</label>
          <NativeSelect
            value={forma}
            onChange={(e) => setForma(e.target.value as FormaPago)}
          >
            {FORMAS_PAGO.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </NativeSelect>
          <Button
            className="mt-4 w-full"
            disabled={sell.isPending}
            onClick={() => sell.mutate()}
          >
            {sell.isPending ? "Registrando…" : "Confirmar cobro"}
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={!!ticket} onOpenChange={() => setTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket cobrado</DialogTitle>
          </DialogHeader>
          {ticket ? (
            <>
              <TicketSheet ticket={ticket} />
              <Button className="mt-4 w-full" onClick={() => window.print()}>
                Imprimir ticket
              </Button>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between text-muted">
      <span>{label}</span>
      <span className="tabular-nums text-fg">{value}</span>
    </div>
  );
}
