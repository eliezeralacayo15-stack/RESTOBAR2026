import { o as __toESM } from "../_runtime.mjs";
import { a as qty, n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as registrarConteo, d as getKardex, f as getSnapshot, n as useSession, r as Button, u as getInventarioExtra, y as registrarMerma } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DZdwY2Vk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventario-DNE6r_wn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function InventarioPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const extra = useQuery({
		queryKey: ["inv-extra"],
		queryFn: () => getInventarioExtra()
	});
	const kardex = useQuery({
		queryKey: ["kardex"],
		queryFn: () => getKardex({ data: {} })
	});
	const [mermaOpen, setMermaOpen] = (0, import_react.useState)(false);
	const [conteoOpen, setConteoOpen] = (0, import_react.useState)(false);
	const [idInsumo, setIdInsumo] = (0, import_react.useState)("");
	const [cantidad, setCantidad] = (0, import_react.useState)("");
	const [motivo, setMotivo] = (0, import_react.useState)("Rotura");
	const [contado, setContado] = (0, import_react.useState)("");
	const merma = useMutation({
		mutationFn: () => registrarMerma({ data: {
			idUsuario: operator.idUsuario,
			idInsumo,
			cantidad: Number(cantidad),
			motivo
		} }),
		onSuccess: () => {
			toast.success("Merma registrada en Kardex");
			setMermaOpen(false);
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const conteo = useMutation({
		mutationFn: () => registrarConteo({ data: {
			idUsuario: operator.idUsuario,
			idInsumo,
			stockContado: Number(contado),
			observacion: "Conteo físico"
		} }),
		onSuccess: (r) => {
			toast.success(`Conteo OK. Diferencia ${r.diferencia}`);
			setConteoOpen(false);
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const insumos = snap.data?.insumos ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 3 — Inventario",
			title: "Kardex",
			subtitle: "El stock nunca se escribe a mano. Sale de MOV_INVENTARIO: compras, ventas, mermas y conteos.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "secondary",
				onClick: () => setConteoOpen(true),
				children: "Conteo"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setMermaOpen(true),
				children: "Merma"
			})] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "stock",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "stock",
						children: "Stock"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "kardex",
						children: "Movimientos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "conteos",
						children: "Conteos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "mermas",
						children: "Mermas"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "stock",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Insumo",
						"Stock",
						"Mín",
						"Máx",
						"Costo",
						"Unidad",
						"Estado"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: insumos.map((i) => {
						const alert = i.stock <= i.stockMinimo;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								className: "font-mono text-xs",
								children: i.idInsumo
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: i.insumo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								numeric: true,
								className: alert ? "text-warning" : "",
								children: qty(i.stock)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								numeric: true,
								children: qty(i.stockMinimo)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								numeric: true,
								children: qty(i.stockMaximo)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
								numeric: true,
								children: money(i.costoUnitario)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: i.unidadConsumo }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								tone: alert ? "warning" : "success",
								children: alert ? "Bajo mínimo" : "OK"
							}) })
						] }, i.idInsumo);
					}) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "kardex",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Fecha",
						"Insumo",
						"Tipo",
						"Entrada",
						"Salida",
						"Ref"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (kardex.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: m.idMovimiento
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
							m.fecha,
							" ",
							m.hora
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.insumo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.tipo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(m.entrada)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(m.salida)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: m.referencia
						})
					] }, m.idMovimiento)) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "conteos",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Fecha",
						"Insumo",
						"Sistema",
						"Contado",
						"Dif"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (extra.data?.conteos ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: c.idConteo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.fecha }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.insumo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(c.stockSistema)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(c.stockContado)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(c.diferencia)
						})
					] }, c.idConteo)) })] })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
					value: "mermas",
					className: "mt-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Fecha",
						"Insumo",
						"Cantidad",
						"Motivo",
						"Costo"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (extra.data?.mermas ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: m.idMerma
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.fecha }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.insumo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: qty(m.cantidad)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.motivo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: money(m.costoTotal)
						})
					] }, m.idMerma)) })] })
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: mermaOpen,
			onOpenChange: setMermaOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar merma" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Insumo" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: idInsumo,
					onChange: (e) => setIdInsumo(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Seleccionar"
					}), insumos.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: i.idInsumo,
						children: i.insumo
					}, i.idInsumo))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Cantidad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: cantidad,
					onChange: (e) => setCantidad(e.target.value),
					type: "number"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Motivo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: motivo,
					onChange: (e) => setMotivo(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => merma.mutate(),
					children: "Guardar merma"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: conteoOpen,
			onOpenChange: setConteoOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Conteo físico" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-3 text-sm text-muted",
					children: "La diferencia genera un ajuste en el Kardex. No se edita el stock a mano."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Insumo" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: idInsumo,
					onChange: (e) => setIdInsumo(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Seleccionar"
					}), insumos.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
						value: i.idInsumo,
						children: [
							i.insumo,
							" (sistema ",
							qty(i.stock),
							")"
						]
					}, i.idInsumo))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Stock contado"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: contado,
					onChange: (e) => setContado(e.target.value),
					type: "number"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => conteo.mutate(),
					children: "Registrar conteo"
				})
			] })
		})
	] });
}
//#endregion
export { InventarioPage as component };
