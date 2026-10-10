export const FORMAS_PAGO = [
  { id: "EFECTIVO", label: "Efectivo", caja: true },
  { id: "PAGO_MOVIL", label: "Pago móvil", caja: false },
  { id: "PUNTO", label: "Punto", caja: false },
  { id: "DIVISAS", label: "Divisas USD", caja: true },
  { id: "BIOPAGO", label: "Bio pago", caja: false },
  { id: "USDT", label: "USDT", caja: false },
] as const;

export type FormaPago = (typeof FORMAS_PAGO)[number]["id"];

export const FORMA_PAGO_IDS = FORMAS_PAGO.map((p) => p.id) as [
  FormaPago,
  ...FormaPago[],
];

export function labelPago(id: string) {
  return FORMAS_PAGO.find((p) => p.id === id)?.label ?? id;
}

export function mueveCaja(id: string) {
  return FORMAS_PAGO.some((p) => p.id === id && p.caja);
}
