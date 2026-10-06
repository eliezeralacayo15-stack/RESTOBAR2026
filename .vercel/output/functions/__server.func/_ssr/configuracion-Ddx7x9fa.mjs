import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { f as getSnapshot, n as useSession, u as getInventarioExtra, x as updateConfig } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-DjnnSF1V.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/configuracion-Ddx7x9fa.js
var import_jsx_runtime = require_jsx_runtime();
var RULES = [
	"Cada registro transaccional tiene una clave primaria única.",
	"Las relaciones se realizan mediante IDs, nunca por nombres.",
	"Una FK debe existir previamente en su tabla maestra.",
	"Las transacciones históricas no se eliminan: se anulan con movimientos compensatorios.",
	"El stock no se escribe a mano: se deriva del Kardex MOV_INVENTARIO.",
	"El costo de una receta se deriva de RECETAS + costo vigente del INSUMO.",
	"Los totales de cabecera deben cuadrar con sus detalles.",
	"Los reportes y el dashboard son de solo lectura.",
	"ID_Usuario identifica quién ejecutó la operación; ID_Empleado al trabajador.",
	"Las tablas de detalle dependen de su cabecera mediante FK."
];
function ConfigPage() {
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
	const save = useMutation({
		mutationFn: (payload) => updateConfig({ data: {
			...payload,
			idUsuario: operator.idUsuario
		} }),
		onSuccess: () => {
			toast.success("Configuración actualizada");
			qc.invalidateQueries({ queryKey: ["erp"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const rows = snap.data?.configRows ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Arquitectura",
			title: "Configuración",
			subtitle: "Los mismos parámetros de la hoja CONFIG. El Excel de Fase 1–2 sigue disponible como referencia.",
			actions: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/RESTOBAR_ERP.xlsx",
				className: "inline-flex h-11 items-center rounded-md border border-border px-4 text-sm",
				children: "Descargar Excel original"
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 lg:grid-cols-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Parámetros" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-3",
				children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-xs text-muted",
						children: [r.parametro, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "ml-2 text-subtle",
							children: r.descripcion
						})]
					}), r.parametro === "Stock_Negativo" || r.parametro === "Control_Caja" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						value: r.valor,
						onChange: (e) => save.mutate({
							parametro: r.parametro,
							valor: e.target.value
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "SI",
							children: "SI"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "NO",
							children: "NO"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						defaultValue: r.valor,
						onBlur: (e) => {
							if (e.target.value !== r.valor) save.mutate({
								parametro: r.parametro,
								valor: e.target.value
							});
						}
					})]
				}, r.parametro))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Reglas fundamentales" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-decimal space-y-2 pl-5 text-sm text-muted",
				children: RULES.map((rule) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: rule }, rule))
			}) })] })]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "mt-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Log de auditoría" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
				"ID",
				"Fecha",
				"Módulo",
				"Acción",
				"Ref",
				"Descripción"
			] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (extra.data?.log ?? []).map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: l.idLog
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
					l.fecha,
					" ",
					l.hora
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.modulo }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.accion }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
					className: "font-mono text-xs",
					children: l.referencia
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: l.descripcion })
			] }, l.idLog)) })] }) })]
		})
	] });
}
//#endregion
export { ConfigPage as component };
