import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-Cwl22AHW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/table-C62me81j.js
var import_jsx_runtime = require_jsx_runtime();
function TableWrap({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto rounded-lg border border-border",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
			className: "w-full min-w-[36rem] text-left text-sm",
			children
		})
	});
}
function THead({ columns }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
		className: "bg-surface-2 text-[11px] tracking-wide text-muted uppercase",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", { children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
			className: "px-3 py-2.5 font-medium whitespace-nowrap",
			children: c
		}, c)) })
	});
}
function Td({ children, className, numeric }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
		className: cn("border-t border-border px-3 py-2.5", numeric && "text-right font-mono tabular-nums", className),
		children
	});
}
//#endregion
export { TableWrap as n, Td as r, THead as t };
