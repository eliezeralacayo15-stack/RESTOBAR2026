import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as upsertCliente, D as upsertProveedor, E as upsertProducto, S as upsertCategoria, T as upsertInsumo, f as getSnapshot, n as useSession, r as Button, w as upsertEmpleado } from "./router-Cwl22AHW.mjs";
import { t as PageHeader } from "./page-header-Db4DzyQG.mjs";
import { n as TableWrap, r as Td, t as THead } from "./table-C62me81j.mjs";
import { t as Badge } from "./badge-D71D5L7Q.mjs";
import { i as DialogTitle, n as DialogContent, r as DialogHeader, t as Dialog } from "./dialog-xKIkeBjg.mjs";
import { t as Input } from "./input-18mpQrTY.mjs";
import { t as Label } from "./label-CJ55ueIK.mjs";
import { t as NativeSelect } from "./native-select-D-jvJk_M.mjs";
import { i as TabsTrigger, n as TabsContent, r as TabsList, t as Tabs } from "./tabs-DZdwY2Vk.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maestros-CGQ7LHXQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MaestrosPage() {
	const operator = useSession((s) => s.operator);
	const qc = useQueryClient();
	const data = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	}).data;
	const uid = operator?.idUsuario;
	if (!data || !uid) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Cargando maestros…"
	});
	const invalidate = () => void qc.invalidateQueries({ queryKey: ["erp"] });
	const [prodOpen, setProdOpen] = (0, import_react.useState)(false);
	const [insOpen, setInsOpen] = (0, import_react.useState)(false);
	const [catOpen, setCatOpen] = (0, import_react.useState)(false);
	const [provOpen, setProvOpen] = (0, import_react.useState)(false);
	const [cliOpen, setCliOpen] = (0, import_react.useState)(false);
	const [empOpen, setEmpOpen] = (0, import_react.useState)(false);
	const [prod, setProd] = (0, import_react.useState)({
		sku: "",
		producto: "",
		idCategoria: "CAT001",
		precioVenta: "0",
		impuesto: "0.16"
	});
	const [ins, setIns] = (0, import_react.useState)({
		sku: "",
		insumo: "",
		idCategoria: "CAT101",
		unidadConsumo: "KG",
		costoUnitario: "0",
		stockMinimo: "0",
		stockMaximo: "0",
		idProveedor: ""
	});
	const [cat, setCat] = (0, import_react.useState)({
		categoria: "",
		tipo: "PRODUCTO"
	});
	const [prov, setProv] = (0, import_react.useState)({
		razonSocial: "",
		nombreComercial: "",
		condicionPago: "CONTADO"
	});
	const [cli, setCli] = (0, import_react.useState)({
		nombre: "",
		tipoCliente: "MOSTRADOR"
	});
	const [emp, setEmp] = (0, import_react.useState)({
		nombre: "",
		apellido: "",
		cargo: ""
	});
	const mProd = useMutation({
		mutationFn: () => upsertProducto({ data: {
			idUsuario: uid,
			sku: prod.sku,
			producto: prod.producto,
			idCategoria: prod.idCategoria,
			precioVenta: Number(prod.precioVenta),
			impuesto: Number(prod.impuesto),
			unidadVenta: "UND",
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Producto guardado");
			setProdOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const mIns = useMutation({
		mutationFn: () => upsertInsumo({ data: {
			idUsuario: uid,
			sku: ins.sku,
			insumo: ins.insumo,
			idCategoria: ins.idCategoria,
			unidadCompra: ins.unidadConsumo,
			unidadConsumo: ins.unidadConsumo,
			factorConversion: 1,
			costoUnitario: Number(ins.costoUnitario),
			stockMinimo: Number(ins.stockMinimo),
			stockMaximo: Number(ins.stockMaximo),
			idProveedor: ins.idProveedor || null,
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Insumo guardado");
			setInsOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const mCat = useMutation({
		mutationFn: () => upsertCategoria({ data: {
			idUsuario: uid,
			categoria: cat.categoria,
			tipo: cat.tipo,
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Categoría guardada");
			setCatOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const mProv = useMutation({
		mutationFn: () => upsertProveedor({ data: {
			idUsuario: uid,
			razonSocial: prov.razonSocial,
			nombreComercial: prov.nombreComercial || prov.razonSocial,
			condicionPago: prov.condicionPago,
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Proveedor guardado");
			setProvOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const mCli = useMutation({
		mutationFn: () => upsertCliente({ data: {
			idUsuario: uid,
			nombre: cli.nombre,
			tipoCliente: cli.tipoCliente,
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Cliente guardado");
			setCliOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	const mEmp = useMutation({
		mutationFn: () => upsertEmpleado({ data: {
			idUsuario: uid,
			nombre: emp.nombre,
			apellido: emp.apellido,
			cargo: emp.cargo,
			activo: true
		} }),
		onSuccess: () => {
			toast.success("Empleado guardado");
			setEmpOpen(false);
			invalidate();
		},
		onError: (e) => toast.error(e.message)
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-muted",
		children: "Cargando maestros…"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
			kicker: "Fase 2 — Maestros",
			title: "Catálogos",
			subtitle: "Los mismos IDs del Excel. Activo/inactivo en lugar de borrar, para no romper FKs."
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
			defaultValue: "productos",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "productos",
						children: "Productos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "insumos",
						children: "Insumos"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "categorias",
						children: "Categorías"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "proveedores",
						children: "Proveedores"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "clientes",
						children: "Clientes"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
						value: "empleados",
						children: "Empleados"
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "productos",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setProdOpen(true),
							children: "Nuevo producto"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"SKU",
						"Producto",
						"Categoría",
						"Precio",
						"Costo",
						"Activo"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.productos.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: p.idProducto
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.sku }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.producto }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: data.categorias.find((c) => c.idCategoria === p.idCategoria)?.categoria }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: money(p.precioVenta)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: p.costoReceta ? money(p.costoReceta) : "—"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							tone: p.activo ? "success" : "neutral",
							children: p.activo ? "SI" : "NO"
						}) })
					] }, p.idProducto)) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "insumos",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setInsOpen(true),
							children: "Nuevo insumo"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Insumo",
						"Stock",
						"Costo",
						"Unidad",
						"Proveedor"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.insumos.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: i.idInsumo
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: i.insumo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: i.stock
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							numeric: true,
							children: money(i.costoUnitario)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: i.unidadConsumo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: data.proveedores.find((p) => p.idProveedor === i.idProveedor)?.nombreComercial ?? "—" })
					] }, i.idInsumo)) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "categorias",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setCatOpen(true),
							children: "Nueva categoría"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Categoría",
						"Tipo",
						"Activo"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.categorias.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: c.idCategoria
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.categoria }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.tipo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.activo ? "SI" : "NO" })
					] }, c.idCategoria)) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "proveedores",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setProvOpen(true),
							children: "Nuevo proveedor"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Comercial",
						"Razón social",
						"Pago"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.proveedores.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: p.idProveedor
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.nombreComercial }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.razonSocial }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: p.condicionPago })
					] }, p.idProveedor)) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "clientes",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setCliOpen(true),
							children: "Nuevo cliente"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Nombre",
						"Tipo"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.clientes.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: c.idCliente
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.nombre }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: c.tipoCliente })
					] }, c.idCliente)) })] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsContent, {
					value: "empleados",
					className: "mt-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-3 flex justify-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => setEmpOpen(true),
							children: "Nuevo empleado"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableWrap, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(THead, { columns: [
						"ID",
						"Nombre",
						"Cargo",
						"Usuario"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: data.empleados.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, {
							className: "font-mono text-xs",
							children: e.idEmpleado
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Td, { children: [
							e.nombre,
							" ",
							e.apellido
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: e.cargo }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Td, { children: data.usuarios.find((u) => u.idEmpleado === e.idEmpleado)?.usuario ?? "—" })
					] }, e.idEmpleado)) })] })]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: prodOpen,
			onOpenChange: setProdOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Producto" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: prod.sku,
					onChange: (e) => setProd({
						...prod,
						sku: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Nombre"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: prod.producto,
					onChange: (e) => setProd({
						...prod,
						producto: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Categoría"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: prod.idCategoria,
					onChange: (e) => setProd({
						...prod,
						idCategoria: e.target.value
					}),
					children: data.categorias.filter((c) => c.tipo === "PRODUCTO").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.idCategoria,
						children: c.categoria
					}, c.idCategoria))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Precio"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: prod.precioVenta,
					onChange: (e) => setProd({
						...prod,
						precioVenta: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mProd.mutate(),
					children: "Guardar"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: insOpen,
			onOpenChange: setInsOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Insumo" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "SKU" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: ins.sku,
					onChange: (e) => setIns({
						...ins,
						sku: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Nombre"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: ins.insumo,
					onChange: (e) => setIns({
						...ins,
						insumo: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Categoría"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: ins.idCategoria,
					onChange: (e) => setIns({
						...ins,
						idCategoria: e.target.value
					}),
					children: data.categorias.filter((c) => c.tipo === "INSUMO").map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: c.idCategoria,
						children: c.categoria
					}, c.idCategoria))
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Unidad"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: ins.unidadConsumo,
					onChange: (e) => setIns({
						...ins,
						unidadConsumo: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Costo unitario"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					type: "number",
					value: ins.costoUnitario,
					onChange: (e) => setIns({
						...ins,
						costoUnitario: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mIns.mutate(),
					children: "Guardar"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: catOpen,
			onOpenChange: setCatOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Categoría" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nombre" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: cat.categoria,
					onChange: (e) => setCat({
						...cat,
						categoria: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Tipo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
					value: cat.tipo,
					onChange: (e) => setCat({
						...cat,
						tipo: e.target.value
					}),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "PRODUCTO",
						children: "PRODUCTO"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "INSUMO",
						children: "INSUMO"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mCat.mutate(),
					children: "Guardar"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: provOpen,
			onOpenChange: setProvOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Proveedor" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Razón social" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: prov.razonSocial,
					onChange: (e) => setProv({
						...prov,
						razonSocial: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Nombre comercial"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: prov.nombreComercial,
					onChange: (e) => setProv({
						...prov,
						nombreComercial: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mProv.mutate(),
					children: "Guardar"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: cliOpen,
			onOpenChange: setCliOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Cliente" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nombre" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: cli.nombre,
					onChange: (e) => setCli({
						...cli,
						nombre: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mCli.mutate(),
					children: "Guardar"
				})
			] })
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: empOpen,
			onOpenChange: setEmpOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Empleado" }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Nombre" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: emp.nombre,
					onChange: (e) => setEmp({
						...emp,
						nombre: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Apellido"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: emp.apellido,
					onChange: (e) => setEmp({
						...emp,
						apellido: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					className: "mt-2 block",
					children: "Cargo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
					value: emp.cargo,
					onChange: (e) => setEmp({
						...emp,
						cargo: e.target.value
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "mt-4 w-full",
					onClick: () => mEmp.mutate(),
					children: "Guardar"
				})
			] })
		})
	] });
}
//#endregion
export { MaestrosPage as component };
