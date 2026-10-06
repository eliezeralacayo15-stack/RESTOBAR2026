import { i as pct, n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { f as getSnapshot, m as getVentas } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DjnnSF1V.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reportes-DwkvK8jn.js
var import_jsx_runtime = require_jsx_runtime();
function ReportesPage() {
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const ventas = useQuery({
		queryKey: ["ventas"],
		queryFn: () => getVentas()
	});
	const data = snap.data;
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Cargando reportes…"
	});
	const pagadas = (ventas.data ?? []).filter((v) => v.estado === "PAGADA");
	const total = pagadas.reduce((a, v) => a + v.total, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 7 — Análisis",
			title: "Reportes",
			subtitle: "Solo lectura. La fuente de verdad sigue siendo transacciones + maestros."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Ventas recientes" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-56",
				children: data.serieVentas.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Sin movimientos de venta todavía."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
						data: data.serieVentas,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
								dataKey: "fecha",
								tick: {
									fill: "var(--color-muted)",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { tick: {
								fill: "var(--color-muted)",
								fontSize: 11
							} }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
								contentStyle: {
									background: "var(--color-surface-2)",
									border: "1px solid var(--color-border)"
								},
								formatter: (v) => money(Number(v))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
								dataKey: "total",
								fill: "var(--color-primary)",
								radius: [
									4,
									4,
									0,
									0
								]
							})
						]
					})
				})
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Rentabilidad de carta" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
				"Producto",
				"Precio",
				"Costo",
				"Margen"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.productos.map((p) => {
				const m = p.precioVenta > 0 && p.costoReceta > 0 ? 1 - p.costoReceta / p.precioVenta : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.producto }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: money(p.precioVenta)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: p.costoReceta > 0 ? money(p.costoReceta) : "—"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
						numeric: true,
						children: m == null ? "Sin receta" : pct(m)
					})
				] }, p.idProducto);
			}) })] }) })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardTitle, { children: [
				"Histórico de tickets · ",
				pagadas.length,
				" pagados · ",
				money(total)
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
				"ID",
				"Fecha",
				"Pago",
				"Total",
				"Estado"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: pagadas.slice(0, 30).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: v.idVenta
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
					v.fecha,
					" ",
					v.hora
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: v.formaPago }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					numeric: true,
					children: money(v.total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: v.estado })
			] }, v.idVenta)) })] }) })]
		})
	] });
}
//#endregion
export { ReportesPage as component };
