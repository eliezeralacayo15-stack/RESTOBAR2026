import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as anularVenta, m as getVentas, n as useSession, p as getVentaDetalle, r as Button } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ventas-DH-9NGGz.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function VentasPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["ventas"],
		queryFn: () => getVentas()
	});
	const [open, setOpen] = (0, import_react.useState)(null);
	const det = useQuery({
		queryKey: ["venta", open],
		queryFn: () => getVentaDetalle({ data: { idVenta: open } }),
		enabled: !!open
	});
	const voidSale = useMutation({
		mutationFn: (idVenta) => anularVenta({ data: {
			idVenta,
			idUsuario: operator.idUsuario
		} }),
		onSuccess: () => {
			toast.success("Venta anulada con movimiento compensatorio");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Transacciones",
			title: "Ventas",
			subtitle: "Histórico. Las ventas no se borran: se anulan con reverso de inventario y caja."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
			"ID",
			"Fecha",
			"Cliente",
			"Pago",
			"Total",
			"Estado",
			""
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data ?? []).map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "hover:bg-surface-2/50",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: v.idVenta
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
					v.fecha,
					" ",
					v.hora
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: v.cliente }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: v.formaPago }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					numeric: true,
					children: money(v.total)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					tone: v.estado === "PAGADA" ? "success" : "danger",
					children: v.estado
				}) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => setOpen(v.idVenta),
						children: "Detalle"
					}), v.estado === "PAGADA" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "sm",
						onClick: () => voidSale.mutate(v.idVenta),
						children: "Anular"
					}) : null]
				}) })
			]
		}, v.idVenta)) })] }),
		open && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-4 rounded-xl border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-2 font-mono text-sm",
				children: open
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-1 text-sm",
				children: (det.data ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						l.cantidad,
						" × ",
						l.producto
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: money(l.total)
					})]
				}, l.idDetalle))
			})]
		})
	] });
}
//#endregion
export { VentasPage as component };
