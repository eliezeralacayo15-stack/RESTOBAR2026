import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as getSnapshot, g as registrarCompra, l as getCompras, n as useSession, r as Button } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compras-Bo_4W-Ll.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ComprasPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const list = useQuery({
		queryKey: ["compras"],
		queryFn: () => getCompras()
	});
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [idProveedor, setIdProveedor] = (0, import_react.useState)("");
	const [documento, setDocumento] = (0, import_react.useState)("");
	const [idInsumo, setIdInsumo] = (0, import_react.useState)("");
	const [cantidad, setCantidad] = (0, import_react.useState)("1");
	const [costo, setCosto] = (0, import_react.useState)("0");
	const [lines, setLines] = (0, import_react.useState)([]);
	const save = useMutation({
		mutationFn: () => registrarCompra({ data: {
			idUsuario: operator.idUsuario,
			idProveedor,
			documento,
			items: lines.map((l) => ({
				idInsumo: l.idInsumo,
				cantidad: l.cantidad,
				costoUnitario: l.costoUnitario,
				impuesto: 0
			}))
		} }),
		onSuccess: (res) => {
			toast.success(`Compra ${res.idCompra} recibida`);
			setOpen(false);
			setLines([]);
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const insumos = snap.data?.insumos ?? [];
	const proveedores = snap.data?.proveedores ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 4 — Compras",
			title: "Compras",
			subtitle: "Cada recepción entra al Kardex y actualiza el costo promedio del insumo.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Nueva compra"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
			"ID",
			"Fecha",
			"Proveedor",
			"Documento",
			"Total",
			"Estado"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (list.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: c.idCompra
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.fecha }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.proveedor }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.documento || "—" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: money(c.total)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.estado })
		] }, c.idCompra)) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Recepción de compra" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Proveedor" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: idProveedor,
							onChange: (e) => setIdProveedor(e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Seleccionar"
							}), proveedores.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: p.idProveedor,
								children: p.nombreComercial
							}, p.idProveedor))]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Documento" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: documento,
							onChange: (e) => setDocumento(e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-3 gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
									className: "col-span-3",
									value: idInsumo,
									onChange: (e) => {
										setIdInsumo(e.target.value);
										const ins = insumos.find((i) => i.idInsumo === e.target.value);
										if (ins) setCosto(String(ins.costoUnitario));
									},
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "",
										children: "Insumo"
									}), insumos.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: i.idInsumo,
										children: i.insumo
									}, i.idInsumo))]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: cantidad,
									onChange: (e) => setCantidad(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "number",
									value: costo,
									onChange: (e) => setCosto(e.target.value)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									variant: "secondary",
									onClick: () => {
										const ins = insumos.find((i) => i.idInsumo === idInsumo);
										if (!ins) return;
										setLines((prev) => [...prev, {
											idInsumo,
											nombre: ins.insumo,
											cantidad: Number(cantidad),
											costoUnitario: Number(costo)
										}]);
									},
									children: "Añadir"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "text-sm",
							children: lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
								className: "flex justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									l.cantidad,
									" × ",
									l.nombre
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular-nums",
									children: money(l.cantidad * l.costoUnitario)
								})]
							}, i))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: !idProveedor || lines.length === 0 || save.isPending,
							onClick: () => save.mutate(),
							children: "Registrar recepción"
						})
					]
				})]
			})
		})
	] });
}
//#endregion
export { ComprasPage as component };
