import { o as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-Cwl22AHW.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tabs-DZdwY2Vk.js
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
function TabsList({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
		className: cn("flex flex-wrap gap-1 rounded-lg bg-surface-2 p-1", className),
		...props
	});
}
function TabsTrigger({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
		className: cn("inline-flex min-h-10 items-center justify-center rounded-md px-3 text-sm text-muted", "transition-colors data-[state=active]:bg-surface data-[state=active]:text-fg", className),
		...props
	});
}
var TabsContent = Content;
//#endregion
export { TabsTrigger as i, TabsContent as n, TabsList as r, Tabs as t };
