import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { c as getCajaDetalle, n as useSession, r as Button, v as registrarGasto } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/gastos-DKg3E04l.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function GastosPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const det = useQuery({
		queryKey: ["caja"],
		queryFn: () => getCajaDetalle()
	});
	const [open, setOpen] = (0, import_react.useState)(false);
	const [categoria, setCategoria] = (0, import_react.useState)("Servicios");
	const [descripcion, setDescripcion] = (0, import_react.useState)("");
	const [monto, setMonto] = (0, import_react.useState)("");
	const [forma, setForma] = (0, import_react.useState)("EFECTIVO");
	const save = useMutation({
		mutationFn: () => registrarGasto({ data: {
			idUsuario: operator.idUsuario,
			categoria,
			descripcion,
			monto: Number(monto),
			formaPago: forma,
			proveedor: ""
		} }),
		onSuccess: () => {
			toast.success("Gasto registrado");
			setOpen(false);
			setDescripcion("");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Finanzas",
			title: "Gastos",
			subtitle: "Los gastos en efectivo salen de la caja abierta.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: () => setOpen(true),
				children: "Nuevo gasto"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
			"ID",
			"Fecha",
			"Categoría",
			"Descripción",
			"Monto",
			"Pago",
			"Estado"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (det.data?.gastos ?? []).map((g) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: g.idGasto
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: g.fecha }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: g.categoria }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: g.descripcion }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: money(g.monto)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: g.formaPago }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: g.estado })
		] }, g.idGasto)) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open,
			onOpenChange: setOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Registrar gasto" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Categoría" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: categoria,
					onChange: (e) => setCategoria(e.target.value),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Servicios" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Alquiler" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Limpieza" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Mantenimiento" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "Otros" })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Descripción"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: descripcion,
					onChange: (e) => setDescripcion(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Monto"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: monto,
					onChange: (e) => setMonto(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Pago"
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
					onClick: () => save.mutate(),
					children: "Guardar"
				})
			] })
		})
	] });
}
//#endregion
export { GastosPage as component };
