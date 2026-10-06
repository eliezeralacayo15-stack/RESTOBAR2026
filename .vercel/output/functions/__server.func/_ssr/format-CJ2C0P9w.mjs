//#region node_modules/.nitro/vite/services/ssr/assets/format-CJ2C0P9w.js
function num(value) {
	if (value == null || value === "") return 0;
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : 0;
}
function round2(value) {
	return Math.round((value + Number.EPSILON) * 100) / 100;
}
function round4(value) {
	return Math.round((value + Number.EPSILON) * 1e4) / 1e4;
}
function money(value, currency = "USD") {
	return new Intl.NumberFormat("es-MX", {
		style: "currency",
		currency,
		minimumFractionDigits: 2,
		maximumFractionDigits: 2
	}).format(Number.isFinite(value) ? value : 0);
}
function qty(value, digits = 3) {
	return new Intl.NumberFormat("es-MX", {
		minimumFractionDigits: 0,
		maximumFractionDigits: digits
	}).format(Number.isFinite(value) ? value : 0);
}
function pct(value) {
	return `${new Intl.NumberFormat("es-MX", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 1
	}).format(value * 100)}%`;
}
function cantidadNeta(cantidad, mermaPct) {
	return round4(cantidad * (1 + mermaPct));
}
//#endregion
export { qty as a, pct as i, money as n, round2 as o, num as r, round4 as s, cantidadNeta as t };
