import { o as __toESM } from "../_runtime.mjs";
import { n as money, o as round2 } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Trash2, d as Plus, p as Minus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { b as registrarVenta, f as getSnapshot, n as useSession, o as cn, r as Button } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
import { n as CardContent, t as Card } from "./card-DjnnSF1V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-29YSJKsM.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function PosPage() {
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const [cat, setCat] = (0, import_react.useState)("TODAS");
	const [cart, setCart] = (0, import_react.useState)([]);
	const [payOpen, setPayOpen] = (0, import_react.useState)(false);
	const [forma, setForma] = (0, import_react.useState)("EFECTIVO");
	const [ticket, setTicket] = (0, import_react.useState)(null);
	const data = snap.data;
	const cats = (data?.categorias ?? []).filter((c) => c.tipo === "PRODUCTO" && c.activo);
	const products = (data?.productos ?? []).filter((p) => p.activo);
	const visible = cat === "TODAS" ? products : products.filter((p) => p.idCategoria === cat);
	const totals = (0, import_react.useMemo)(() => {
		const subtotal = round2(cart.reduce((a, l) => a + l.precio * l.cantidad, 0));
		const impuesto = round2(cart.reduce((a, l) => a + l.precio * l.cantidad * l.impuesto, 0));
		return {
			subtotal,
			impuesto,
			total: round2(subtotal + impuesto)
		};
	}, [cart]);
	function add(p) {
		setCart((prev) => {
			if (prev.find((l) => l.idProducto === p.idProducto)) return prev.map((l) => l.idProducto === p.idProducto ? {
				...l,
				cantidad: l.cantidad + 1
			} : l);
			return [...prev, {
				idProducto: p.idProducto,
				producto: p.producto,
				precio: p.precioVenta,
				impuesto: p.impuesto,
				cantidad: 1
			}];
		});
	}
	const sell = useMutation({
		mutationFn: async () => {
			if (!operator) throw new Error("Sin operador");
			return registrarVenta({ data: {
				idUsuario: operator.idUsuario,
				idEmpleado: operator.idEmpleado ?? void 0,
				formaPago: forma,
				items: cart.map((l) => ({
					idProducto: l.idProducto,
					cantidad: l.cantidad,
					descuento: 0
				}))
			} });
		},
		onSuccess: (res) => {
			toast.success(`Ticket ${res.idVenta} cobrado`);
			setTicket(res);
			setCart([]);
			setPayOpen(false);
			qc.invalidateQueries({ queryKey: ["erp"] });
			qc.invalidateQueries({ queryKey: ["ventas"] });
		},
		onError: (err) => toast.error(err.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Cargando carta…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 4 — Ventas",
			title: "Punto de venta",
			subtitle: data.caja ? `${data.caja.caja} abierta · ${money(data.efectivoCaja)}` : "No hay caja abierta. Ábrela en Caja para poder cobrar."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mb-4 flex gap-2 overflow-x-auto pb-1",
				children: ["TODAS", ...cats.map((c) => c.idCategoria)].map((id) => {
					const label = id === "TODAS" ? "Todas" : cats.find((c) => c.idCategoria === id)?.categoria;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCat(id),
						className: cn("h-10 shrink-0 rounded-full border px-4 text-sm", cat === id ? "border-primary bg-primary text-primary-foreground" : "border-border text-muted hover:text-fg"),
						children: label
					}, id);
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-3 sm:grid-cols-3",
				children: visible.map((p) => {
					const catName = cats.find((c) => c.idCategoria === p.idCategoria)?.categoria ?? "";
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => add(p),
						className: "rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:border-primary/40 hover:bg-surface-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-wide text-muted uppercase",
								children: catName
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-medium",
								children: p.producto
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display mt-3 text-xl tabular-nums",
								children: money(p.precioVenta)
							}),
							p.costoReceta > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 font-mono text-[11px] text-subtle",
								children: ["Costo ", money(p.costoReceta)]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								className: "mt-2",
								tone: "neutral",
								children: "Sin receta"
							})
						]
					}, p.idProducto);
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "h-fit lg:sticky lg:top-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
					className: "pt-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] tracking-wide text-muted uppercase",
							children: "Ticket"
						}),
						cart.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 text-sm text-muted",
							children: "Toca un producto para armar la comanda."
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-3 space-y-3",
							children: cart.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex items-start justify-between gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm",
									children: l.producto
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-mono text-[11px] text-muted",
									children: money(l.precio)
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-9",
											onClick: () => setCart((prev) => prev.map((x) => x.idProducto === l.idProducto ? {
												...x,
												cantidad: x.cantidad - 1
											} : x).filter((x) => x.cantidad > 0)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "size-3.5" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "w-6 text-center tabular-nums",
											children: l.cantidad
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											variant: "ghost",
											size: "icon",
											className: "size-9",
											onClick: () => setCart((prev) => prev.map((x) => x.idProducto === l.idProducto ? {
												...x,
												cantidad: x.cantidad + 1
											} : x)),
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" })
										})
									]
								})]
							}, l.idProducto))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-1 border-t border-border pt-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "Subtotal",
									value: money(totals.subtotal)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Row, {
									label: "IVA",
									value: money(totals.impuesto)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-2 text-base",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-display text-2xl tabular-nums",
										children: money(totals.total)
									})]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "flex-1",
								disabled: cart.length === 0,
								onClick: () => setCart([]),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), " Limpiar"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "flex-1",
								disabled: cart.length === 0 || !data.caja,
								onClick: () => setPayOpen(true),
								children: "Cobrar"
							})]
						})
					]
				})
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: payOpen,
			onOpenChange: setPayOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Cobrar ", money(totals.total)] }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-xs text-muted",
					children: "Forma de pago"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: forma,
					onChange: (e) => setForma(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "EFECTIVO",
						children: "Efectivo"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "TARJETA",
						children: "Tarjeta"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					disabled: sell.isPending,
					onClick: () => sell.mutate(),
					children: sell.isPending ? "Registrando…" : "Confirmar cobro"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!ticket,
			onOpenChange: () => setTicket(null),
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Ticket cobrado" }) }), ticket ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-2 text-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono",
						children: ticket.idVenta
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl",
						children: money(ticket.total)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted",
						children: "Inventario descontado por receta. Movimiento de caja registrado."
					})
				]
			}) : null] })
		})
	] });
}
function Row({ label, value }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex justify-between text-muted",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "tabular-nums text-fg",
			children: value
		})]
	});
}
//#endregion
export { PosPage as component };
