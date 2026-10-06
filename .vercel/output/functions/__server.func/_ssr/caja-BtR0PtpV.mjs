import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as closeCaja, c as getCajaDetalle, f as getSnapshot, h as openCaja, n as useSession, r as Button } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
import { n as CardContent, t as Card } from "./card-DjnnSF1V.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/caja-BtR0PtpV.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CajaPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const det = useQuery({
		queryKey: ["caja"],
		queryFn: () => getCajaDetalle()
	});
	const [openAmt, setOpenAmt] = (0, import_react.useState)("150");
	const [countAmt, setCountAmt] = (0, import_react.useState)("");
	const [closeOpen, setCloseOpen] = (0, import_react.useState)(false);
	const openMut = useMutation({
		mutationFn: () => openCaja({ data: {
			idUsuario: operator.idUsuario,
			caja: "Caja 1",
			montoInicial: Number(openAmt)
		} }),
		onSuccess: () => {
			toast.success("Caja abierta");
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const closeMut = useMutation({
		mutationFn: () => closeCaja({ data: {
			idUsuario: operator.idUsuario,
			idCaja: snap.data.caja.idCaja,
			efectivoContado: Number(countAmt)
		} }),
		onSuccess: (r) => {
			toast.success(`Cerrada. Diferencia ${money(r.diferencia)}`);
			setCloseOpen(false);
			qc.invalidateQueries();
		},
		onError: (e) => toast.error(e.message)
	});
	const caja = snap.data?.caja;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 5 — Caja",
			title: "Control de caja",
			subtitle: "Una caja abierta a la vez. El efectivo esperado sale de los movimientos, no se edita."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
			className: "mb-6",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs tracking-wide text-muted uppercase",
						children: "Estado"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display mt-1 text-3xl",
						children: caja ? "Abierta" : "Cerrada"
					}),
					caja ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted",
						children: [
							caja.caja,
							" · fondo ",
							money(caja.montoInicial),
							" · efectivo",
							" ",
							money(snap.data?.efectivoCaja ?? 0)
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Abre caja para vender en efectivo y registrar gastos."
					})
				] }), caja ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => setCloseOpen(true),
					children: "Cerrar caja"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						className: "w-32",
						type: "number",
						value: openAmt,
						onChange: (e) => setOpenAmt(e.target.value)
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => openMut.mutate(),
						children: "Abrir"
					})]
				})]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mb-3 text-xl",
			children: "Movimientos"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
			"ID",
			"Fecha",
			"Tipo",
			"Concepto",
			"Entrada",
			"Salida",
			"Pago"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (det.data?.movimientos ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: m.idMovCaja
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
				m.fecha,
				" ",
				m.hora
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.tipo }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.concepto }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: money(m.entrada)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: money(m.salida)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: m.formaPago })
		] }, m.idMovCaja)) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display mt-8 mb-3 text-xl",
			children: "Turnos"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
			"ID",
			"Fecha",
			"Fondo",
			"Esperado",
			"Contado",
			"Dif",
			"Estado"
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: (det.data?.cajas ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				className: "font-mono text-xs",
				children: c.idCaja
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.fecha }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: money(c.montoInicial)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: c.efectivoEsperado == null ? "—" : money(c.efectivoEsperado)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: c.efectivoContado == null ? "—" : money(c.efectivoContado)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
				numeric: true,
				children: c.diferencia == null ? "—" : money(c.diferencia)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				tone: c.estado === "ABIERTA" ? "success" : "neutral",
				children: c.estado
			}) })
		] }, c.idCaja)) })] }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: closeOpen,
			onOpenChange: setCloseOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cierre de caja" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						"Esperado ",
						money(snap.data?.efectivoCaja ?? 0),
						". Cuenta el efectivo real."
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Efectivo contado" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: countAmt,
					onChange: (e) => setCountAmt(e.target.value)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => closeMut.mutate(),
					children: "Confirmar cierre"
				})
			] })
		})
	] });
}
//#endregion
export { CajaPage as component };
