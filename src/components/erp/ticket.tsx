import { money } from "@/lib/erp/format";
import { labelPago } from "@/lib/erp/pagos";

export type TicketData = {
  negocio: string;
  idVenta: string;
  fecha?: string;
  hora?: string;
  formaPago: string;
  cajero?: string;
  subtotal: number;
  impuesto: number;
  total: number;
  lines: { producto: string; cantidad: number; total: number }[];
};

export function TicketSheet({ ticket }: { ticket: TicketData }) {
  const local = ticket.idVenta.includes("-")
    ? ticket.idVenta.slice(ticket.idVenta.lastIndexOf("-") + 1)
    : ticket.idVenta;
  return (
    <div className="ticket-print mx-auto w-full max-w-xs bg-fg px-4 py-5 text-bg">
      <p className="text-center font-display text-2xl">{ticket.negocio}</p>
      <p className="mt-1 text-center font-mono text-xs">{local}</p>
      <p className="text-center text-xs">
        {ticket.fecha ?? ""} {ticket.hora ?? ""}
      </p>
      <div className="my-3 h-px bg-bg/20" />
      <ul className="space-y-1 text-sm">
        {ticket.lines.map((l, i) => (
          <li key={i} className="flex justify-between gap-3">
            <span>
              {l.cantidad} × {l.producto}
            </span>
            <span className="tabular-nums">{money(l.total)}</span>
          </li>
        ))}
      </ul>
      <div className="my-3 h-px bg-bg/20" />
      <div className="space-y-1 text-sm">
        <Row label="Subtotal" value={money(ticket.subtotal)} />
        <Row label="Impuesto" value={money(ticket.impuesto)} />
        <div className="flex justify-between font-display text-xl">
          <span>Total</span>
          <span className="tabular-nums">{money(ticket.total)}</span>
        </div>
      </div>
      <p className="mt-3 text-center text-xs">
        {labelPago(ticket.formaPago)}
        {ticket.cajero ? ` · ${ticket.cajero}` : ""}
      </p>
      <p className="mt-2 text-center text-xs">Gracias por su visita</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span className="tabular-nums">{value}</span>
    </div>
  );
}
