import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-Cwl22AHW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-D71D5L7Q.js
var import_jsx_runtime = require_jsx_runtime();
function Badge({ className, tone = "neutral", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide", tone === "neutral" && "bg-surface-2 text-muted", tone === "success" && "bg-success/15 text-success", tone === "warning" && "bg-warning/15 text-warning", tone === "danger" && "bg-destructive/15 text-destructive", tone === "accent" && "bg-primary/10 text-primary", className),
		...props
	});
}
//#endregion
export { Badge as t };
