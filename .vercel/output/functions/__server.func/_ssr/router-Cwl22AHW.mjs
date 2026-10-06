import { o as __toESM } from "../_runtime.mjs";
import { n as money } from "./format-CJ2C0P9w.mjs";
import { o as require_jsx_runtime, r as Slot, s as require_react } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useRouter, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { a as number, c as union, i as literal, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { _ as ChartColumn, c as Shield, f as Package, g as ChefHat, h as LayoutDashboard, i as TriangleAlert, l as Settings, m as Menu, n as Wallet, o as Store, r as UtensilsCrossed, s as ShoppingBag, t as X, u as Receipt, v as BookOpen } from "../_libs/lucide-react.mjs";
import { n as useQuery, r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Ct2YUv2-.js
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var operatorId = string().min(1);
var getSnapshot = createServerFn({ method: "GET" }).handler(createSsrRpc("bb543afd1f5ea396312e44493dce97612c5577ee72806fd95fd35034721ab660"));
var getVentas = createServerFn({ method: "GET" }).handler(createSsrRpc("68de1365ebaea0ae09b287e29692a3bee50fef6ec6a5a281356c5a0cb3ff8bb5"));
var getVentaDetalle = createServerFn({ method: "POST" }).validator(object({ idVenta: string() })).handler(createSsrRpc("584fbac349b6fa415645c46ceea5f2c6b0a4692ab33291b49dd131e25efef5ae"));
var getKardex = createServerFn({ method: "POST" }).validator(object({ idInsumo: string().optional() })).handler(createSsrRpc("cf8bce3a11e5b74af4afb9765ac4e6bed65ef59242608023b18738f5332a59ee"));
var getCompras = createServerFn({ method: "GET" }).handler(createSsrRpc("b53b68ac2199f040645ef0916319c63c27e6dcafd3a6fb3d28ea1a5b59d1ae68"));
var getCajaDetalle = createServerFn({ method: "GET" }).handler(createSsrRpc("8c79be0b483caa21b8121ebd34485c295a4e8aab33c06acc4899c1e381e8d782"));
var getInventarioExtra = createServerFn({ method: "GET" }).handler(createSsrRpc("61c87215552e0485cd0775f25874bcc81eb5b2b34b5b479c11c888f2202a0918"));
var openCaja = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	caja: string().default("Caja 1"),
	montoInicial: number().min(0)
})).handler(createSsrRpc("5e1f5b6367c9425fc20b7c600c87401da2946bd0d7be7b501a084ae2d6fe5657"));
var closeCaja = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCaja: string(),
	efectivoContado: number().min(0)
})).handler(createSsrRpc("d26396592915bd4831cc15f2e304725b751f0a9881c36a2768bd3af0fd0326dc"));
var registrarVenta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idEmpleado: string().optional(),
	idCliente: string().optional(),
	formaPago: _enum(["EFECTIVO", "TARJETA"]),
	items: array(object({
		idProducto: string(),
		cantidad: number().positive(),
		descuento: number().min(0).default(0)
	})).min(1)
})).handler(createSsrRpc("cb3ad5f28a8c620553564b0ecacad4a5d08f6bf536723eb2624620f7b8b271c9"));
var anularVenta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idVenta: string()
})).handler(createSsrRpc("87d6ef115e1630596d40141bf77f6a31f3ae3c73ebd6f98b467c63a54c3cddaf"));
var registrarCompra = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idProveedor: string(),
	documento: string().default(""),
	formaPago: string().default("CONTADO"),
	items: array(object({
		idInsumo: string(),
		cantidad: number().positive(),
		costoUnitario: number().min(0),
		impuesto: number().min(0).default(0)
	})).min(1)
})).handler(createSsrRpc("50de196bb95938be9e055ccc480a44f3a3acf16b497e9c43dec707ec3dfa769f"));
var registrarMerma = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idInsumo: string(),
	cantidad: number().positive(),
	motivo: string().min(1)
})).handler(createSsrRpc("890341388cc1e72ddcde84dbc3723940956fd182f75a23a6688df884713907ab"));
var registrarConteo = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idInsumo: string(),
	stockContado: number().min(0),
	observacion: string().default("")
})).handler(createSsrRpc("697d0b90364a80023e0eeb06e1dc770eadbc796fae729c7db95ebe3ff79f6f63"));
var registrarGasto = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	categoria: string().min(1),
	descripcion: string().min(1),
	proveedor: string().default(""),
	monto: number().positive(),
	formaPago: _enum(["EFECTIVO", "TARJETA"])
})).handler(createSsrRpc("f58197c89549f6428d77e311654a8c3cf25e49e0408d3debafa1c5ff76950a63"));
var upsertProducto = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idProducto: string().optional(),
	sku: string().min(1),
	producto: string().min(1),
	idCategoria: string(),
	unidadVenta: string().default("UND"),
	precioVenta: number().min(0),
	impuesto: number().min(0),
	activo: boolean().default(true)
})).handler(createSsrRpc("5f9ed16f6f6588102802804fff5bc042b1273d3092f6b71f2c2e96988c8f7663"));
var upsertInsumo = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idInsumo: string().optional(),
	sku: string().min(1),
	insumo: string().min(1),
	idCategoria: string(),
	unidadCompra: string().default("UND"),
	unidadConsumo: string().default("UND"),
	factorConversion: number().positive().default(1),
	costoUnitario: number().min(0),
	stockMinimo: number().min(0).default(0),
	stockMaximo: number().min(0).default(0),
	idProveedor: string().optional().nullable(),
	activo: boolean().default(true)
})).handler(createSsrRpc("03b66675897e6c58f5e48227ef048435dc4f69f0cfa5b4528fcc895249e75823"));
var upsertReceta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idReceta: string().optional(),
	idProducto: string(),
	idInsumo: string(),
	cantidad: number().positive(),
	unidadConsumo: string(),
	mermaPct: number().min(0).default(0)
})).handler(createSsrRpc("e3f1d55e243b62b902df346da48113e5ecba93955ad0f6d7b8693dec75a7c102"));
var deleteReceta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idReceta: string()
})).handler(createSsrRpc("2e9ab206a118897c5b6fc753f86e276cf8455874a84d8cbe34e82df197ad9384"));
var upsertCategoria = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCategoria: string().optional(),
	categoria: string().min(1),
	tipo: _enum(["PRODUCTO", "INSUMO"]),
	activo: boolean().default(true)
})).handler(createSsrRpc("250d01d973a21000411121874a64ff63d80cf6195f8bf854586a3260c4c770dc"));
var upsertProveedor = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idProveedor: string().optional(),
	razonSocial: string().min(1),
	nombreComercial: string().min(1),
	documento: string().default(""),
	telefono: string().default(""),
	condicionPago: string().default("CONTADO"),
	activo: boolean().default(true)
})).handler(createSsrRpc("45dfa120de879849be7000f9199448d4718c21c272c67094cad7809e67300fbb"));
var upsertCliente = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCliente: string().optional(),
	nombre: string().min(1),
	documento: string().default(""),
	telefono: string().default(""),
	tipoCliente: string().default("MOSTRADOR"),
	activo: boolean().default(true)
})).handler(createSsrRpc("d7de2673aa3b6423dc4a742452192c1f30aa7835a7cf12c35a411456bd4b35b0"));
var upsertEmpleado = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idEmpleado: string().optional(),
	nombre: string().min(1),
	apellido: string().default(""),
	cargo: string().default(""),
	telefono: string().default(""),
	activo: boolean().default(true)
})).handler(createSsrRpc("e94ec9e64274d10bde234c7d1152279ef96e87117605c97b02ce7fe63183ea6c"));
var updateConfig = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	parametro: string(),
	valor: string()
})).handler(createSsrRpc("99efdd349c3b93807e493272289a174f6d973cc6d0a76c45ff3c9a76eb1a29b6"));
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cwl22AHW.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/70 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:bg-primary/90",
			secondary: "bg-surface-2 text-fg border border-border hover:bg-surface",
			outline: "border border-border bg-transparent text-fg hover:bg-surface-2",
			ghost: "text-fg hover:bg-surface-2",
			destructive: "bg-destructive text-fg hover:bg-destructive/90"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "left", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-bg/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex h-full w-[min(20rem,88vw)] flex-col border-border bg-surface", side === "left" ? "top-0 left-0 border-r" : "top-0 right-0 border-l", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-2 text-muted hover:bg-surface-2 hover:text-fg",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Cerrar"
			})]
		})]
	})] });
}
var useSession = create()(persist((set) => ({
	operator: null,
	setOperator: (operator) => set({ operator }),
	clearOperator: () => set({ operator: null })
}), { name: "restobar-erp-session" }));
var ROLE_MODULES = {
	ADMIN: [
		"dashboard",
		"pos",
		"ventas",
		"compras",
		"inventario",
		"recetas",
		"caja",
		"gastos",
		"maestros",
		"reportes",
		"config"
	],
	CAJERO: [
		"dashboard",
		"pos",
		"ventas",
		"caja"
	],
	INVENTARIO: [
		"dashboard",
		"compras",
		"inventario",
		"recetas",
		"gastos",
		"maestros",
		"reportes"
	]
};
var ICONS = {
	ADMIN: Shield,
	CAJERO: Wallet,
	INVENTARIO: ChefHat
};
var COPY = {
	ADMIN: "Operación completa, maestros y reportes.",
	CAJERO: "Punto de venta, tickets y control de caja.",
	INVENTARIO: "Kardex, compras, recetas y mermas."
};
function OperatorGate() {
	const setOperator = useSession((s) => s.setOperator);
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	const empresa = snap.data?.config.Nombre_Empresa ?? "Mi Restobar";
	const users = (snap.data?.usuarios ?? []).filter((u) => u.activo);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg px-4 py-12 text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] tracking-[0.28em] text-muted uppercase",
				children: "RESTOBAR ERP"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display mt-3 text-4xl tracking-tight sm:text-5xl",
				children: empresa
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-md text-center text-sm text-muted",
				children: "Continúa el trabajo de Fase 2. Elige operador para entrar al servicio."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-3",
				children: users.map((u) => {
					const Icon = ICONS[u.rol];
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setOperator(u),
						className: "rounded-xl border border-border bg-surface p-5 text-left transition-colors hover:border-primary/40 hover:bg-surface-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-5 text-primary" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-4 font-display text-xl",
								children: u.nombre
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] tracking-wide text-subtle uppercase",
								children: u.rol
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: COPY[u.rol]
							})
						]
					}, u.idUsuario);
				})
			})
		]
	});
}
var NAV = [
	{
		id: "dashboard",
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		id: "pos",
		to: "/pos",
		label: "Punto de venta",
		icon: UtensilsCrossed
	},
	{
		id: "ventas",
		to: "/ventas",
		label: "Ventas",
		icon: Receipt
	},
	{
		id: "compras",
		to: "/compras",
		label: "Compras",
		icon: ShoppingBag
	},
	{
		id: "inventario",
		to: "/inventario",
		label: "Inventario",
		icon: Package
	},
	{
		id: "recetas",
		to: "/recetas",
		label: "Recetas",
		icon: ChefHat
	},
	{
		id: "caja",
		to: "/caja",
		label: "Caja",
		icon: Wallet
	},
	{
		id: "gastos",
		to: "/gastos",
		label: "Gastos",
		icon: BookOpen
	},
	{
		id: "maestros",
		to: "/maestros",
		label: "Maestros",
		icon: Store
	},
	{
		id: "reportes",
		to: "/reportes",
		label: "Reportes",
		icon: ChartColumn
	},
	{
		id: "config",
		to: "/configuracion",
		label: "Configuración",
		icon: Settings
	}
];
function NavLinks({ rol, onNavigate }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const allowed = ROLE_MODULES[rol];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col gap-0.5",
		children: NAV.filter((item) => allowed.includes(item.id)).map((item) => {
			const active = item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
			const Icon = item.icon;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.to,
				onClick: onNavigate,
				className: cn("flex min-h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors", active ? "bg-surface-2 text-fg" : "text-muted hover:bg-surface-2/70 hover:text-fg"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
			}, item.id);
		})
	});
}
function AppShell({ children }) {
	const operator = useSession((s) => s.operator);
	const clear = useSession((s) => s.clearOperator);
	const [open, setOpen] = (0, import_react.useState)(false);
	const snap = useQuery({
		queryKey: ["erp"],
		queryFn: () => getSnapshot()
	});
	if (!operator) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OperatorGate, {});
	const empresa = snap.data?.config.Nombre_Empresa ?? "Mi Restobar";
	const caja = snap.data?.caja;
	const efectivo = snap.data?.efectivoCaja ?? 0;
	const sidebar = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex h-full flex-col",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "px-4 pt-6 pb-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] tracking-[0.22em] text-muted uppercase",
					children: "RESTOBAR ERP"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display mt-1 text-xl text-fg",
					children: empresa
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex-1 overflow-y-auto px-2 pb-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavLinks, {
					rol: operator.rol,
					onNavigate: () => setOpen(false)
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-t border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Operador"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-fg",
						children: operator.nombre
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] tracking-wide text-subtle uppercase",
						children: operator.rol
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted",
							children: caja ? `Caja ${money(efectivo)}` : "Sin caja"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "sm",
							onClick: clear,
							children: "Salir"
						})]
					})
				]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
			className: "fixed inset-y-0 left-0 hidden w-60 border-r border-border bg-surface lg:block",
			children: sidebar
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "lg:pl-60",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur-sm lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						size: "icon",
						onClick: () => setOpen(true),
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] tracking-[0.18em] text-muted uppercase",
						children: "RESTOBAR"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: empresa
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
					open,
					onOpenChange: setOpen,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
						side: "left",
						children: sidebar
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "px-4 py-6 sm:px-6 lg:px-8",
					children
				})
			]
		})]
	});
}
var styles_default = "/assets/styles-DsdXoC2h.css";
var APP_NAME = "RESTOBAR ERP";
function Providers({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		staleTime: 4e3,
		retry: 1
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "top-center",
			toastOptions: { className: "bg-surface text-fg border-border" }
		})]
	});
}
var Route$11 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "theme-color",
				content: "#0c0b0a"
			},
			{
				name: "description",
				content: "Sistema integral de gestión operativa y financiera para restobar."
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Figtree:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=IBM+Plex+Mono:wght@400;500&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "es",
		className: "antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Providers, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	})
});
var $$splitComponentImporter$10 = () => import("./routes-PYwgGMTm.mjs");
var Route$10 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./caja-BtR0PtpV.mjs");
var Route$9 = createFileRoute("/caja")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./compras-Bo_4W-Ll.mjs");
var Route$8 = createFileRoute("/compras")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./configuracion-Ddx7x9fa.mjs");
var Route$7 = createFileRoute("/configuracion")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./gastos-DKg3E04l.mjs");
var Route$6 = createFileRoute("/gastos")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./inventario-DNE6r_wn.mjs");
var Route$5 = createFileRoute("/inventario")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./maestros-CGQ7LHXQ.mjs");
var Route$4 = createFileRoute("/maestros")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./pos-29YSJKsM.mjs");
var Route$3 = createFileRoute("/pos")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./recetas--W7uYlIq.mjs");
var Route$2 = createFileRoute("/recetas")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./reportes-DwkvK8jn.mjs");
var Route$1 = createFileRoute("/reportes")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./ventas-DH-9NGGz.mjs");
var Route = createFileRoute("/ventas")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$10.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$11
	}),
	CajaRoute: Route$9.update({
		id: "/caja",
		path: "/caja",
		getParentRoute: () => Route$11
	}),
	ComprasRoute: Route$8.update({
		id: "/compras",
		path: "/compras",
		getParentRoute: () => Route$11
	}),
	ConfiguracionRoute: Route$7.update({
		id: "/configuracion",
		path: "/configuracion",
		getParentRoute: () => Route$11
	}),
	GastosRoute: Route$6.update({
		id: "/gastos",
		path: "/gastos",
		getParentRoute: () => Route$11
	}),
	InventarioRoute: Route$5.update({
		id: "/inventario",
		path: "/inventario",
		getParentRoute: () => Route$11
	}),
	MaestrosRoute: Route$4.update({
		id: "/maestros",
		path: "/maestros",
		getParentRoute: () => Route$11
	}),
	PosRoute: Route$3.update({
		id: "/pos",
		path: "/pos",
		getParentRoute: () => Route$11
	}),
	RecetasRoute: Route$2.update({
		id: "/recetas",
		path: "/recetas",
		getParentRoute: () => Route$11
	}),
	ReportesRoute: Route$1.update({
		id: "/reportes",
		path: "/reportes",
		getParentRoute: () => Route$11
	}),
	VentasRoute: Route.update({
		id: "/ventas",
		path: "/ventas",
		getParentRoute: () => Route$11
	})
};
var routeTree = Route$11._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { upsertCliente as C, upsertProveedor as D, upsertProducto as E, upsertReceta as O, upsertCategoria as S, upsertInsumo as T, registrarConteo as _, closeCaja as a, registrarVenta as b, getCajaDetalle as c, getKardex as d, getSnapshot as f, registrarCompra as g, openCaja as h, anularVenta as i, getCompras as l, getVentas as m, useSession as n, cn as o, getVentaDetalle as p, Button as r, deleteReceta as s, router_exports as t, getInventarioExtra as u, registrarGasto as v, upsertEmpleado as w, updateConfig as x, registrarMerma as y };
