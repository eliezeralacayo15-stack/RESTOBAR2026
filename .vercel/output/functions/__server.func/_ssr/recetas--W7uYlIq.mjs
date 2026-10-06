import { o as __toESM } from "../_runtime.mjs";
import { a as qty, i as pct, n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as upsertReceta, f as getSnapshot, n as useSession, r as Button, s as deleteReceta } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DjnnSF1V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recetas--W7uYlIq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RecetasPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const [idProducto, setIdProducto] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [idInsumo, setIdInsumo] = (0, import_react.useState)("");
	const [cantidad, setCantidad] = (0, import_react.useState)("0.1");
	const [merma, setMerma] = (0, import_react.useState)("0");
	const data = snap.data;
	const grouped = (0, import_react.useMemo)(() => {
		if (!data) return [];
		return data.productos.map((p) => {
			return {
				producto: p,
				lines: data.recetas.filter((r) => r.idProducto === p.idProducto),
				costo: p.costoReceta
			};
		});
	}, [data]);
	const save = useMutation({
		mutationFn: () => {
			const ins = data?.insumos.find((i) => i.idInsumo === idInsumo);
			return upsertReceta({ data: {
				idUsuario: operator.idUsuario,
				idProducto,
				idInsumo,
				cantidad: Number(cantidad),
				unidadConsumo: ins?.unidadConsumo ?? "UND",
				mermaPct: Number(merma)
			} });
		},
		onSuccess: () => {
			toast.success("Componente agregado");
			setOpen(false);
			qc.invalidateQueries({ queryKey: ["erp"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (idReceta) => deleteReceta({ data: {
			idUsuario: operator.idUsuario,
			idReceta
		} }),
		onSuccess: () => {
			qc.invalidateQueries({ queryKey: ["erp"] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Cargando recetas…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 2 — Costeo",
			title: "Recetas",
			subtitle: "Cantidad neta = cantidad × (1 + merma). Costo = neta × costo vigente del insumo. No se duplica un insumo en la misma receta.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => {
					setIdProducto(data.productos[0]?.idProducto ?? "");
					setOpen(true);
				},
				children: "Agregar componente"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid gap-4",
			children: grouped.map(({ producto, lines, costo }) => {
				const margin = producto.precioVenta > 0 ? 1 - costo / producto.precioVenta : 0;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
					className: "flex flex-row items-start justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: producto.producto }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 font-mono text-xs text-muted",
						children: [
							producto.idProducto,
							" · ",
							producto.sku
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Costo receta"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-2xl tabular-nums",
								children: money(costo)
							}),
							costo > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								tone: margin > .45 ? "success" : "warning",
								children: ["Margen ", pct(margin)]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "Sin receta" })
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: lines.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Este producto se puede vender, pero no descuenta inventario hasta que tenga receta."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
					"Insumo",
					"Cantidad",
					"Merma",
					"Neta",
					"Costo und.",
					"Costo total",
					""
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.insumo }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, {
						numeric: true,
						children: [
							qty(l.cantidad),
							" ",
							l.unidadConsumo
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: pct(l.mermaPct)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: qty(l.cantidadNeta)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: money(l.costoUnitario)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: money(l.costoTotal)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => remove.mutate(l.idReceta),
						children: "Quitar"
					}) })
				] }, l.idReceta)) })] }) })] }, producto.idProducto);
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Componente de receta" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Producto" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: idProducto,
					onChange: (e) => setIdProducto(e.target.value),
					children: data.productos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: p.idProducto,
						children: p.producto
					}, p.idProducto))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Insumo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: idInsumo,
					onChange: (e) => setIdInsumo(e.target.value),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Seleccionar"
					}), data.insumos.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: i.idInsumo,
						children: i.insumo
					}, i.idInsumo))]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Cantidad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.001",
					value: cantidad,
					onChange: (e) => setCantidad(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Merma (0.05 = 5%)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					step: "0.01",
					value: merma,
					onChange: (e) => setMerma(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => save.mutate(),
					children: "Guardar"
				})
			] })
		})
	] });
}
//#endregion
export { RecetasPage as component };
