import { o as round2, r as num, s as round4, t as cantidadNeta } from "./format-CJ2C0P9w.mjs";
import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { a as number, n as array, o as object, r as boolean, s as string, t as _enum } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/server-Dolial--.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var _0002_erp_default = "-- RESTOBAR ERP — modelo de datos (Fase 1.2 + 2) + semilla operativa\ncreate table if not exists config (\n  parametro text primary key,\n  valor text not null,\n  descripcion text not null default ''\n);\n\ncreate table if not exists categorias (\n  id_categoria text primary key,\n  categoria text not null,\n  tipo text not null check (tipo in ('PRODUCTO', 'INSUMO')),\n  activo boolean not null default true\n);\n\ncreate table if not exists proveedores (\n  id_proveedor text primary key,\n  razon_social text not null,\n  nombre_comercial text not null,\n  documento text not null default '',\n  telefono text not null default '',\n  email text not null default '',\n  direccion text not null default '',\n  contacto text not null default '',\n  condicion_pago text not null default 'CONTADO',\n  activo boolean not null default true\n);\n\ncreate table if not exists clientes (\n  id_cliente text primary key,\n  nombre text not null,\n  documento text not null default '',\n  telefono text not null default '',\n  email text not null default '',\n  tipo_cliente text not null default 'MOSTRADOR',\n  activo boolean not null default true,\n  fecha_alta date not null default current_date\n);\n\ncreate table if not exists empleados (\n  id_empleado text primary key,\n  nombre text not null,\n  apellido text not null default '',\n  documento text not null default '',\n  cargo text not null default '',\n  telefono text not null default '',\n  fecha_ingreso date,\n  salario numeric(14, 2),\n  activo boolean not null default true\n);\n\ncreate table if not exists usuarios (\n  id_usuario text primary key,\n  usuario text not null unique,\n  nombre text not null,\n  id_empleado text references empleados (id_empleado),\n  rol text not null check (rol in ('ADMIN', 'CAJERO', 'INVENTARIO')),\n  activo boolean not null default true\n);\n\ncreate table if not exists productos (\n  id_producto text primary key,\n  sku text not null unique,\n  producto text not null,\n  id_categoria text not null references categorias (id_categoria),\n  tipo text not null default 'PRODUCTO',\n  unidad_venta text not null default 'UND',\n  precio_venta numeric(14, 4) not null default 0,\n  impuesto numeric(8, 4) not null default 0.16,\n  activo boolean not null default true,\n  fecha_alta date not null default current_date\n);\n\ncreate table if not exists insumos (\n  id_insumo text primary key,\n  sku text not null unique,\n  insumo text not null,\n  id_categoria text not null references categorias (id_categoria),\n  unidad_compra text not null default 'UND',\n  unidad_consumo text not null default 'UND',\n  factor_conversion numeric(14, 6) not null default 1,\n  costo_unitario numeric(14, 4) not null default 0,\n  stock_minimo numeric(14, 4) not null default 0,\n  stock_maximo numeric(14, 4) not null default 0,\n  activo boolean not null default true,\n  id_proveedor text references proveedores (id_proveedor)\n);\n\ncreate table if not exists recetas (\n  id_receta text primary key,\n  id_producto text not null references productos (id_producto),\n  id_insumo text not null references insumos (id_insumo),\n  cantidad numeric(14, 6) not null,\n  unidad_consumo text not null,\n  merma_pct numeric(8, 4) not null default 0,\n  unique (id_producto, id_insumo)\n);\n\ncreate table if not exists cajas (\n  id_caja text primary key,\n  fecha date not null default current_date,\n  caja text not null default 'Caja 1',\n  id_usuario_apertura text references usuarios (id_usuario),\n  hora_apertura text,\n  monto_inicial numeric(14, 2) not null default 0,\n  id_usuario_cierre text references usuarios (id_usuario),\n  hora_cierre text,\n  efectivo_esperado numeric(14, 2),\n  efectivo_contado numeric(14, 2),\n  diferencia numeric(14, 2),\n  estado text not null default 'ABIERTA' check (estado in ('ABIERTA', 'CERRADA'))\n);\n\ncreate table if not exists ventas (\n  id_venta text primary key,\n  fecha date not null default current_date,\n  hora text not null default to_char(now(), 'HH24:MI:SS'),\n  id_caja text references cajas (id_caja),\n  id_cliente text references clientes (id_cliente),\n  id_empleado text references empleados (id_empleado),\n  id_usuario text references usuarios (id_usuario),\n  subtotal numeric(14, 2) not null default 0,\n  descuento numeric(14, 2) not null default 0,\n  impuesto numeric(14, 2) not null default 0,\n  total numeric(14, 2) not null default 0,\n  forma_pago text not null default 'EFECTIVO',\n  estado text not null default 'PAGADA' check (estado in ('PAGADA', 'ANULADA'))\n);\n\ncreate table if not exists det_ventas (\n  id_detalle text primary key,\n  id_venta text not null references ventas (id_venta),\n  id_producto text not null references productos (id_producto),\n  cantidad numeric(14, 4) not null,\n  precio_unitario numeric(14, 4) not null,\n  descuento numeric(14, 2) not null default 0,\n  impuesto numeric(14, 2) not null default 0,\n  subtotal numeric(14, 2) not null default 0,\n  total numeric(14, 2) not null default 0\n);\n\ncreate table if not exists compras (\n  id_compra text primary key,\n  fecha date not null default current_date,\n  id_proveedor text not null references proveedores (id_proveedor),\n  documento text not null default '',\n  id_usuario text references usuarios (id_usuario),\n  subtotal numeric(14, 2) not null default 0,\n  impuesto numeric(14, 2) not null default 0,\n  total numeric(14, 2) not null default 0,\n  forma_pago text not null default 'CONTADO',\n  estado text not null default 'RECIBIDA' check (estado in ('RECIBIDA', 'ANULADA'))\n);\n\ncreate table if not exists det_compras (\n  id_detalle text primary key,\n  id_compra text not null references compras (id_compra),\n  id_insumo text not null references insumos (id_insumo),\n  cantidad numeric(14, 4) not null,\n  costo_unitario numeric(14, 4) not null,\n  descuento numeric(14, 2) not null default 0,\n  impuesto numeric(14, 2) not null default 0,\n  subtotal numeric(14, 2) not null default 0,\n  total numeric(14, 2) not null default 0\n);\n\ncreate table if not exists mov_inventario (\n  id_movimiento text primary key,\n  fecha date not null default current_date,\n  hora text not null default to_char(now(), 'HH24:MI:SS'),\n  id_insumo text not null references insumos (id_insumo),\n  tipo_movimiento text not null,\n  entrada numeric(14, 4) not null default 0,\n  salida numeric(14, 4) not null default 0,\n  costo_unitario numeric(14, 4) not null default 0,\n  referencia text,\n  id_usuario text references usuarios (id_usuario),\n  observacion text not null default ''\n);\n\ncreate table if not exists mov_caja (\n  id_movcaja text primary key,\n  fecha date not null default current_date,\n  hora text not null default to_char(now(), 'HH24:MI:SS'),\n  id_caja text not null references cajas (id_caja),\n  tipo text not null,\n  concepto text not null,\n  entrada numeric(14, 2) not null default 0,\n  salida numeric(14, 2) not null default 0,\n  forma_pago text not null default 'EFECTIVO',\n  referencia text,\n  id_usuario text references usuarios (id_usuario)\n);\n\ncreate table if not exists gastos (\n  id_gasto text primary key,\n  fecha date not null default current_date,\n  categoria text not null,\n  descripcion text not null,\n  proveedor text not null default '',\n  monto numeric(14, 2) not null,\n  forma_pago text not null default 'EFECTIVO',\n  id_caja text references cajas (id_caja),\n  id_usuario text references usuarios (id_usuario),\n  estado text not null default 'REGISTRADO' check (estado in ('REGISTRADO', 'ANULADO'))\n);\n\ncreate table if not exists conteos (\n  id_conteo text primary key,\n  fecha date not null default current_date,\n  id_insumo text not null references insumos (id_insumo),\n  stock_sistema numeric(14, 4) not null,\n  stock_contado numeric(14, 4) not null,\n  diferencia numeric(14, 4) not null,\n  id_usuario text references usuarios (id_usuario),\n  observacion text not null default ''\n);\n\ncreate table if not exists mermas (\n  id_merma text primary key,\n  fecha date not null default current_date,\n  id_insumo text not null references insumos (id_insumo),\n  cantidad numeric(14, 4) not null,\n  motivo text not null,\n  costo_unitario numeric(14, 4) not null,\n  costo_total numeric(14, 2) not null,\n  id_usuario text references usuarios (id_usuario)\n);\n\ncreate table if not exists log (\n  id_log text primary key,\n  fecha date not null default current_date,\n  hora text not null default to_char(now(), 'HH24:MI:SS'),\n  id_usuario text,\n  modulo text not null,\n  accion text not null,\n  referencia text,\n  descripcion text not null default ''\n);\n\ncreate index if not exists idx_productos_cat on productos (id_categoria);\ncreate index if not exists idx_insumos_cat on insumos (id_categoria);\ncreate index if not exists idx_recetas_prod on recetas (id_producto);\ncreate index if not exists idx_det_ventas_venta on det_ventas (id_venta);\ncreate index if not exists idx_det_compras_compra on det_compras (id_compra);\ncreate index if not exists idx_movinv_insumo on mov_inventario (id_insumo);\ncreate index if not exists idx_movcaja_caja on mov_caja (id_caja);\ncreate index if not exists idx_ventas_fecha on ventas (fecha);\n\ninsert into config (parametro, valor, descripcion) values\n  ('Nombre_Empresa', 'Mi Restobar', 'Nombre comercial del negocio'),\n  ('Moneda', 'USD', 'Moneda principal del sistema'),\n  ('Impuesto_Default', '0.16', 'Tasa de impuesto predeterminada'),\n  ('Decimales', '2', 'Decimales para importes'),\n  ('Prefijo_Venta', 'VEN', 'Prefijo para IDs de ventas'),\n  ('Prefijo_Compra', 'COM', 'Prefijo para IDs de compras'),\n  ('Prefijo_Producto', 'PROD', 'Prefijo para IDs de productos'),\n  ('Prefijo_Insumo', 'INS', 'Prefijo para IDs de insumos'),\n  ('Prefijo_Proveedor', 'PROV', 'Prefijo para IDs de proveedores'),\n  ('Stock_Negativo', 'NO', 'Permitir stock negativo'),\n  ('Control_Caja', 'SI', 'Activar control de caja')\non conflict (parametro) do nothing;\n\ninsert into categorias (id_categoria, categoria, tipo, activo) values\n  ('CAT001', 'Hamburguesas', 'PRODUCTO', true),\n  ('CAT002', 'Pizzas', 'PRODUCTO', true),\n  ('CAT003', 'Entradas', 'PRODUCTO', true),\n  ('CAT004', 'Platos Fuertes', 'PRODUCTO', true),\n  ('CAT005', 'Postres', 'PRODUCTO', true),\n  ('CAT006', 'Bebidas', 'PRODUCTO', true),\n  ('CAT007', 'Combos', 'PRODUCTO', true),\n  ('CAT101', 'Carnes', 'INSUMO', true),\n  ('CAT102', 'Panadería', 'INSUMO', true),\n  ('CAT103', 'Lácteos', 'INSUMO', true),\n  ('CAT104', 'Vegetales', 'INSUMO', true),\n  ('CAT105', 'Frutas', 'INSUMO', true),\n  ('CAT106', 'Salsas y Condimentos', 'INSUMO', true),\n  ('CAT107', 'Bebidas e Insumos', 'INSUMO', true),\n  ('CAT108', 'Empaques', 'INSUMO', true),\n  ('CAT109', 'Limpieza', 'INSUMO', true),\n  ('CAT110', 'Otros Insumos', 'INSUMO', true)\non conflict (id_categoria) do nothing;\n\ninsert into proveedores (id_proveedor, razon_social, nombre_comercial, condicion_pago, activo) values\n  ('PROV00001', 'Distribuidora Central', 'Distribuidora Central', 'CONTADO', true),\n  ('PROV00002', 'Panadería Local', 'Panadería Local', 'CONTADO', true),\n  ('PROV00003', 'Frigorífico Principal', 'Frigorífico Principal', 'CREDITO', true)\non conflict (id_proveedor) do nothing;\n\ninsert into clientes (id_cliente, nombre, tipo_cliente, activo) values\n  ('CLI00001', 'Consumidor Final', 'MOSTRADOR', true)\non conflict (id_cliente) do nothing;\n\ninsert into empleados (id_empleado, nombre, apellido, cargo, activo) values\n  ('EMP00001', 'Administrador', 'General', 'Administrador', true),\n  ('EMP00002', 'Cajero', 'Principal', 'Cajero', true),\n  ('EMP00003', 'Cocinero', 'Principal', 'Cocinero', true)\non conflict (id_empleado) do nothing;\n\ninsert into usuarios (id_usuario, usuario, nombre, id_empleado, rol, activo) values\n  ('USR00001', 'admin', 'Administrador', 'EMP00001', 'ADMIN', true),\n  ('USR00002', 'caja', 'Cajero', 'EMP00002', 'CAJERO', true),\n  ('USR00003', 'inventario', 'Inventario', 'EMP00003', 'INVENTARIO', true)\non conflict (id_usuario) do nothing;\n\ninsert into productos (id_producto, sku, producto, id_categoria, tipo, unidad_venta, precio_venta, impuesto, activo) values\n  ('PROD00001', 'SKU-0001', 'Hamburguesa Clásica', 'CAT001', 'PRODUCTO', 'UND', 8, 0.16, true),\n  ('PROD00002', 'SKU-0002', 'Pizza Pepperoni', 'CAT002', 'PRODUCTO', 'UND', 12, 0.16, true),\n  ('PROD00003', 'SKU-0003', 'Papas Fritas', 'CAT003', 'PRODUCTO', 'UND', 4, 0.16, true),\n  ('PROD00004', 'SKU-0004', 'Refresco', 'CAT006', 'PRODUCTO', 'UND', 2.5, 0.16, true),\n  ('PROD00005', 'SKU-0005', 'Agua Mineral', 'CAT006', 'PRODUCTO', 'UND', 1.5, 0.16, true)\non conflict (id_producto) do nothing;\n\ninsert into insumos (id_insumo, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, activo, id_proveedor) values\n  ('INS00001', 'INS-0001', 'Carne molida', 'CAT101', 'KG', 'KG', 1, 7.5, 10, 50, true, 'PROV00003'),\n  ('INS00002', 'INS-0002', 'Pan de hamburguesa', 'CAT102', 'UND', 'UND', 1, 0.4, 30, 200, true, 'PROV00002'),\n  ('INS00003', 'INS-0003', 'Queso', 'CAT103', 'KG', 'KG', 1, 8, 5, 30, true, 'PROV00001'),\n  ('INS00004', 'INS-0004', 'Papas', 'CAT104', 'KG', 'KG', 1, 1.8, 10, 50, true, 'PROV00001'),\n  ('INS00005', 'INS-0005', 'Aceite', 'CAT106', 'L', 'L', 1, 2.5, 5, 30, true, 'PROV00001')\non conflict (id_insumo) do nothing;\n\ninsert into recetas (id_receta, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct) values\n  ('REC00001', 'PROD00001', 'INS00001', 0.15, 'KG', 0),\n  ('REC00002', 'PROD00001', 'INS00002', 1, 'UND', 0),\n  ('REC00003', 'PROD00001', 'INS00003', 0.03, 'KG', 0),\n  ('REC00004', 'PROD00003', 'INS00004', 0.25, 'KG', 0.05),\n  ('REC00005', 'PROD00003', 'INS00005', 0.015, 'L', 0)\non conflict (id_receta) do nothing;\n\ninsert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion) values\n  ('MOV00001', 'INS00001', 'APERTURA', 25, 0, 7.5, 'APERTURA', 'USR00001', 'Inventario inicial'),\n  ('MOV00002', 'INS00002', 'APERTURA', 100, 0, 0.4, 'APERTURA', 'USR00001', 'Inventario inicial'),\n  ('MOV00003', 'INS00003', 'APERTURA', 10, 0, 8, 'APERTURA', 'USR00001', 'Inventario inicial'),\n  ('MOV00004', 'INS00004', 'APERTURA', 25, 0, 1.8, 'APERTURA', 'USR00001', 'Inventario inicial'),\n  ('MOV00005', 'INS00005', 'APERTURA', 12, 0, 2.5, 'APERTURA', 'USR00001', 'Inventario inicial')\non conflict (id_movimiento) do nothing;\n\ninsert into cajas (id_caja, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado) values\n  ('CAJ00001', 'Caja 1', 'USR00001', '08:00:00', 150, 'ABIERTA')\non conflict (id_caja) do nothing;\n\ninsert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario) values\n  ('MCJ00001', 'CAJ00001', 'APERTURA', 'Fondo inicial', 150, 0, 'EFECTIVO', 'CAJ00001', 'USR00001')\non conflict (id_movcaja) do nothing;\n\ninsert into log (id_log, id_usuario, modulo, accion, referencia, descripcion) values\n  ('LOG00001', 'USR00001', 'SISTEMA', 'ALTA', 'FASE2', 'Semilla de maestros e inventario de apertura')\non conflict (id_log) do nothing;\n";
/**
* Migration bookkeeping shared by the two appliers — `scripts/migrate.mjs`
* (deploy, `readdir`) and `src/lib/db.ts` (PGLite preview, `import.meta.glob`).
*
* Applied files are keyed by BASENAME, so the same file applies once no matter
* which directory it is globbed from. That is what makes the auth schema safe to
* copy from `migrations/auth/` into `migrations/` when an app turns sign-in on:
* a database that already has `0001_auth.sql` will not re-run it.
*
* Neither applier descends into subdirectories, so `migrations/auth/*.sql` is
* out of scope for both until it is copied up.
*/
/**
* The `_migrations` key for a migration path (or bare filename).
* @param {string} path
* @returns {string}
*/
function migrationName(path) {
	return path.split("/").pop() ?? path;
}
/**
* @param {string} path
* @returns {boolean}
*/
function isMigrationFile(path) {
	return path.endsWith(".sql");
}
/**
* Migrations in `paths` that are not yet in `applied`, in apply order.
* Non-`.sql` entries (a `readdir` also yields `migrations/auth/`) are dropped.
* @param {Iterable<string>} paths
* @param {Iterable<string>} applied
* @returns {Array<{ name: string, path: string }>}
*/
function pendingMigrations(paths, applied) {
	const done = new Set(applied);
	return [...paths].filter(isMigrationFile).map((path) => ({
		name: migrationName(path),
		path
	})).sort((a, b) => a.name.localeCompare(b.name)).filter(({ name }) => !done.has(name));
}
var rawDatabaseUrl = typeof process !== "undefined" ? process.env.DATABASE_URL : void 0;
var databaseUrl = rawDatabaseUrl && rawDatabaseUrl.trim() ? rawDatabaseUrl : void 0;
/**
* Active backend: real **Neon** when `DATABASE_URL` is set (deployed / configured
* sandbox), otherwise a local embedded **PGLite** (Postgres compiled to WASM) so
* the app has a working database even with nothing configured — the live preview
* included. Swap in Neon later by just setting `DATABASE_URL`; no code changes.
*/
var dbSource = databaseUrl ? "neon" : "pglite";
/**
* Init state lives on globalThis as promises: dev HMR creates new instances of
* this module, and two instances racing module-level state would open a second
* pool or run two concurrent PGLite migration passes (whose duplicate
* `_migrations` insert rejects — and would get memoized, poisoning every later
* `getSql()`). A failed init clears its slot so the next call retries.
*/
var globalRef = globalThis;
/**
* Result-type parity: Postgres sends every value as text plus a type OID — the
* JS value is the DRIVER's parsing choice, and pg and PGLite disagree (pg:
* int8 -> string, date -> local-midnight Date; PGLite: int8 -> BigInt, which
* JSON.stringify rejects, date -> UTC Date). Normalize both so preview and
* production return identical, JSON-safe shapes:
*   int8/bigint (incl. count(*)) -> number (past 2^53 loses precision — cast
*                                   `::text` if you ever need huge integers)
*   date                         -> 'YYYY-MM-DD' string
*   interval                     -> Postgres interval text
* numeric already comes back as a string on both (arbitrary precision).
*/
var OID_INT8 = 20;
var OID_DATE = 1082;
var OID_INTERVAL = 1186;
var identity = (v) => v;
/** Wrap a query runner in the tagged-template + `.query()` `Sql` surface. */
function toSql(run) {
	const sql = (async (strings, ...values) => {
		let text = strings[0];
		for (let i = 0; i < values.length; i += 1) text += `$${i + 1}${strings[i + 1]}`;
		return run(text, values);
	});
	sql.query = (text, params = []) => run(text, params);
	return sql;
}
function createNeonSql() {
	globalRef.__pgSqlPromise__ ??= (async () => {
		const { Pool, types } = await import("../_libs/pg.mjs").then((n) => n.t);
		types.setTypeParser(OID_INT8, Number);
		types.setTypeParser(OID_DATE, identity);
		types.setTypeParser(OID_INTERVAL, identity);
		const pool = new Pool({ connectionString: databaseUrl });
		return toSql(async (text, params) => {
			return (await pool.query(text, params)).rows;
		});
	})().catch((err) => {
		globalRef.__pgSqlPromise__ = void 0;
		throw err;
	});
	return globalRef.__pgSqlPromise__;
}
async function createPgliteSql() {
	globalRef.__pgliteInstance__ ??= (async () => {
		const { PGlite } = await import("../_libs/electric-sql__pglite.mjs").then((n) => n.t);
		const pg = new PGlite({ parsers: {
			[OID_INT8]: Number,
			[OID_DATE]: identity,
			[OID_INTERVAL]: identity
		} });
		await pg.waitReady;
		await pg.exec("create table if not exists _migrations (name text primary key, applied_at timestamptz not null default now())");
		return pg;
	})().catch((err) => {
		globalRef.__pgliteInstance__ = void 0;
		throw err;
	});
	const pg = await globalRef.__pgliteInstance__;
	const migrate = async () => {
		const migrations = /* #__PURE__ */ Object.assign({ "/migrations/0002_erp.sql": _0002_erp_default });
		const done = (await pg.query("select name from _migrations")).rows.map((r) => r.name);
		for (const { name, path } of pendingMigrations(Object.keys(migrations), done)) await pg.transaction(async (tx) => {
			await tx.exec(migrations[path]);
			await tx.query("insert into _migrations (name) values ($1)", [name]);
		});
	};
	const pass = (globalRef.__pgliteMigrateChain__ ?? Promise.resolve()).catch(() => void 0).then(migrate);
	globalRef.__pgliteMigrateChain__ = pass;
	await pass;
	return toSql(async (text, params) => {
		return (await pg.query(text, params)).rows;
	});
}
var sqlPromise = null;
async function createSql() {
	if (typeof window !== "undefined") throw new Error("@/lib/db is server-only — call getSql() from a createServerFn handler or a server route loader, never from client code.");
	return dbSource === "neon" ? createNeonSql() : createPgliteSql();
}
/**
* Get the shared, **server-only** SQL client. Neon when `DATABASE_URL` is set,
* otherwise the local PGLite fallback. Memoized — safe to call per request.
*
* Schema comes from `migrations/*.sql`, auto-applied before the first query on
* both backends — define tables there, never inline in server functions.
*/
function getSql() {
	sqlPromise ??= createSql().catch((err) => {
		sqlPromise = null;
		throw err;
	});
	return sqlPromise;
}
/**
* Finish DB bootstrap before the server handles traffic.
*
* - **PGLite** (preview / no `DATABASE_URL`): open the in-memory DB and apply
*   `migrations/*.sql`. Idempotent — concurrent callers share one promise.
* - **Neon**: no-op (pool is created lazily on first query).
*
* Vite `configureServer` awaits this at dev startup; production imports of this
* module kick it off immediately (see bottom of file).
*/
function ensureDbReady() {
	if (dbSource !== "pglite") return Promise.resolve();
	return getSql().then(() => void 0);
}
var globalBoot = globalThis;
if (typeof window === "undefined" && dbSource === "pglite") globalBoot.__pgBootstrapPromise__ ??= ensureDbReady().catch((err) => {
	globalBoot.__pgBootstrapPromise__ = void 0;
	console.error("[db] PGLite bootstrap failed:", err);
	throw err;
});
var operatorId = string().min(1);
var ID_SPECS = {
	PROD: {
		table: "productos",
		column: "id_producto",
		pad: 5
	},
	INS: {
		table: "insumos",
		column: "id_insumo",
		pad: 5
	},
	REC: {
		table: "recetas",
		column: "id_receta",
		pad: 5
	},
	PROV: {
		table: "proveedores",
		column: "id_proveedor",
		pad: 5
	},
	CLI: {
		table: "clientes",
		column: "id_cliente",
		pad: 5
	},
	EMP: {
		table: "empleados",
		column: "id_empleado",
		pad: 5
	},
	USR: {
		table: "usuarios",
		column: "id_usuario",
		pad: 5
	},
	CAT: {
		table: "categorias",
		column: "id_categoria",
		pad: 3
	},
	VEN: {
		table: "ventas",
		column: "id_venta",
		pad: 5
	},
	DTV: {
		table: "det_ventas",
		column: "id_detalle",
		pad: 5
	},
	COM: {
		table: "compras",
		column: "id_compra",
		pad: 5
	},
	DTC: {
		table: "det_compras",
		column: "id_detalle",
		pad: 5
	},
	MOV: {
		table: "mov_inventario",
		column: "id_movimiento",
		pad: 5
	},
	CAJ: {
		table: "cajas",
		column: "id_caja",
		pad: 5
	},
	MCJ: {
		table: "mov_caja",
		column: "id_movcaja",
		pad: 5
	},
	GST: {
		table: "gastos",
		column: "id_gasto",
		pad: 5
	},
	CNT: {
		table: "conteos",
		column: "id_conteo",
		pad: 5
	},
	MRM: {
		table: "mermas",
		column: "id_merma",
		pad: 5
	},
	LOG: {
		table: "log",
		column: "id_log",
		pad: 5
	}
};
async function nextId(sql, prefix) {
	const spec = ID_SPECS[prefix];
	const last = (await sql.query(`select ${spec.column} as id from ${spec.table} where ${spec.column} like $1 order by ${spec.column} desc limit 1`, [`${prefix}%`]))[0]?.id ?? "";
	const n = last ? Number.parseInt(last.slice(prefix.length), 10) + 1 : 1;
	return `${prefix}${String(Number.isFinite(n) ? n : 1).padStart(spec.pad, "0")}`;
}
async function writeLog(sql, input) {
	const id = await nextId(sql, "LOG");
	await sql.query(`insert into log (id_log, id_usuario, modulo, accion, referencia, descripcion)
     values ($1,$2,$3,$4,$5,$6)`, [
		id,
		input.idUsuario ?? null,
		input.modulo,
		input.accion,
		input.referencia ?? null,
		input.descripcion
	]);
}
async function configMap(sql) {
	const rows = await sql`
    select parametro, valor, descripcion from config order by parametro
  `;
	return Object.fromEntries(rows.map((r) => [r.parametro, r.valor]));
}
async function stockMap(sql) {
	const rows = await sql`
    select i.id_insumo,
           coalesce(s.stock, 0) as stock
    from insumos i
    left join (
      select id_insumo, sum(entrada) - sum(salida) as stock
      from mov_inventario
      group by id_insumo
    ) s on s.id_insumo = i.id_insumo
  `;
	return Object.fromEntries(rows.map((r) => [r.id_insumo, num(r.stock)]));
}
async function openCajaRow(sql) {
	return (await sql`
    select * from cajas where estado = 'ABIERTA' order by fecha desc, id_caja desc limit 1
  `)[0] ?? null;
}
async function efectivoCaja(sql, idCaja) {
	const rows = await sql`
    select coalesce(sum(entrada) - sum(salida), 0) as saldo
    from mov_caja
    where id_caja = ${idCaja} and forma_pago = 'EFECTIVO'
  `;
	return num(rows[0]?.saldo);
}
function mapCaja(row) {
	if (!row) return null;
	return {
		idCaja: String(row.id_caja),
		fecha: String(row.fecha ?? ""),
		caja: String(row.caja),
		idUsuarioApertura: row.id_usuario_apertura ? String(row.id_usuario_apertura) : null,
		horaApertura: row.hora_apertura ? String(row.hora_apertura) : null,
		montoInicial: num(row.monto_inicial),
		idUsuarioCierre: row.id_usuario_cierre ? String(row.id_usuario_cierre) : null,
		horaCierre: row.hora_cierre ? String(row.hora_cierre) : null,
		efectivoEsperado: row.efectivo_esperado == null ? null : num(row.efectivo_esperado),
		efectivoContado: row.efectivo_contado == null ? null : num(row.efectivo_contado),
		diferencia: row.diferencia == null ? null : num(row.diferencia),
		estado: String(row.estado)
	};
}
var getSnapshot_createServerFn_handler = createServerRpc({
	id: "bb543afd1f5ea396312e44493dce97612c5577ee72806fd95fd35034721ab660",
	name: "getSnapshot",
	filename: "src/lib/erp/server.ts"
}, (opts) => getSnapshot.__executeServer(opts));
var getSnapshot = createServerFn({ method: "GET" }).handler(getSnapshot_createServerFn_handler, async () => {
	const sql = await getSql();
	const [config, usuarios, categorias, productos, insumos, recetas, proveedores, clientes, empleados, caja, stocks, ventasHoy, serie, top, low, recent] = await Promise.all([
		sql`
      select parametro, valor, descripcion from config order by parametro
    `,
		sql`select * from usuarios order by id_usuario`,
		sql`select * from categorias order by id_categoria`,
		sql`select * from productos order by id_producto`,
		sql`select * from insumos order by id_insumo`,
		sql`select * from recetas order by id_receta`,
		sql`select * from proveedores order by id_proveedor`,
		sql`select * from clientes order by id_cliente`,
		sql`select * from empleados order by id_empleado`,
		openCajaRow(sql),
		stockMap(sql),
		sql`
      select count(*)::int as n, coalesce(sum(total),0) as total
      from ventas where fecha = current_date and estado = 'PAGADA'
    `,
		sql`
      select fecha::text as fecha, coalesce(sum(total),0) as total
      from ventas
      where estado = 'PAGADA' and fecha >= current_date - 13
      group by fecha
      order by fecha
    `,
		sql`
      select p.producto, coalesce(sum(d.cantidad),0) as cantidad, coalesce(sum(d.total),0) as total
      from det_ventas d
      join ventas v on v.id_venta = d.id_venta
      join productos p on p.id_producto = d.id_producto
      where v.estado = 'PAGADA' and v.fecha = current_date
      group by p.producto
      order by cantidad desc
      limit 5
    `,
		sql`
      select id_insumo, insumo, stock_minimo as minimo from insumos where activo = true
    `,
		sql`
      select id_venta, fecha, hora, total, estado, forma_pago
      from ventas order by fecha desc, hora desc, id_venta desc limit 8
    `
	]);
	const cfg = Object.fromEntries(config.map((r) => [r.parametro, r.valor]));
	const recetaCostos = recetas.map((r) => {
		const ins = insumos.find((i) => i.id_insumo === r.id_insumo);
		const cant = num(r.cantidad);
		const merma = num(r.merma_pct);
		const neta = cantidadNeta(cant, merma);
		const costoUnit = num(ins?.costo_unitario);
		return {
			idReceta: String(r.id_receta),
			idProducto: String(r.id_producto),
			idInsumo: String(r.id_insumo),
			insumo: String(ins?.insumo ?? r.id_insumo),
			cantidad: cant,
			unidadConsumo: String(r.unidad_consumo),
			mermaPct: merma,
			cantidadNeta: neta,
			costoUnitario: costoUnit,
			costoTotal: round4(neta * costoUnit)
		};
	});
	const costoPorProducto = {};
	for (const line of recetaCostos) costoPorProducto[line.idProducto] = (costoPorProducto[line.idProducto] ?? 0) + line.costoTotal;
	const lowStock = low.map((i) => {
		const stock = stocks[String(i.id_insumo)] ?? 0;
		return {
			idInsumo: String(i.id_insumo),
			insumo: String(i.insumo),
			stock,
			minimo: num(i.minimo)
		};
	}).filter((i) => i.stock <= i.minimo);
	const efectivo = caja ? await efectivoCaja(sql, String(caja.id_caja)) : 0;
	return {
		config: cfg,
		configRows: config,
		usuarios: usuarios.map((u) => ({
			idUsuario: String(u.id_usuario),
			usuario: String(u.usuario),
			nombre: String(u.nombre),
			idEmpleado: u.id_empleado ? String(u.id_empleado) : null,
			rol: String(u.rol),
			activo: Boolean(u.activo)
		})),
		categorias: categorias.map((c) => ({
			idCategoria: String(c.id_categoria),
			categoria: String(c.categoria),
			tipo: String(c.tipo),
			activo: Boolean(c.activo)
		})),
		productos: productos.map((p) => ({
			idProducto: String(p.id_producto),
			sku: String(p.sku),
			producto: String(p.producto),
			idCategoria: String(p.id_categoria),
			tipo: String(p.tipo),
			unidadVenta: String(p.unidad_venta),
			precioVenta: num(p.precio_venta),
			impuesto: num(p.impuesto),
			activo: Boolean(p.activo),
			fechaAlta: String(p.fecha_alta ?? ""),
			costoReceta: round4(costoPorProducto[String(p.id_producto)] ?? 0)
		})),
		insumos: insumos.map((i) => ({
			idInsumo: String(i.id_insumo),
			sku: String(i.sku),
			insumo: String(i.insumo),
			idCategoria: String(i.id_categoria),
			unidadCompra: String(i.unidad_compra),
			unidadConsumo: String(i.unidad_consumo),
			factorConversion: num(i.factor_conversion),
			costoUnitario: num(i.costo_unitario),
			stockMinimo: num(i.stock_minimo),
			stockMaximo: num(i.stock_maximo),
			activo: Boolean(i.activo),
			idProveedor: i.id_proveedor ? String(i.id_proveedor) : null,
			stock: stocks[String(i.id_insumo)] ?? 0
		})),
		recetas: recetaCostos,
		proveedores: proveedores.map((p) => ({
			idProveedor: String(p.id_proveedor),
			razonSocial: String(p.razon_social),
			nombreComercial: String(p.nombre_comercial),
			documento: String(p.documento ?? ""),
			telefono: String(p.telefono ?? ""),
			email: String(p.email ?? ""),
			direccion: String(p.direccion ?? ""),
			contacto: String(p.contacto ?? ""),
			condicionPago: String(p.condicion_pago),
			activo: Boolean(p.activo)
		})),
		clientes: clientes.map((c) => ({
			idCliente: String(c.id_cliente),
			nombre: String(c.nombre),
			documento: String(c.documento ?? ""),
			telefono: String(c.telefono ?? ""),
			email: String(c.email ?? ""),
			tipoCliente: String(c.tipo_cliente),
			activo: Boolean(c.activo)
		})),
		empleados: empleados.map((e) => ({
			idEmpleado: String(e.id_empleado),
			nombre: String(e.nombre),
			apellido: String(e.apellido ?? ""),
			documento: String(e.documento ?? ""),
			cargo: String(e.cargo ?? ""),
			telefono: String(e.telefono ?? ""),
			salario: e.salario == null ? null : num(e.salario),
			activo: Boolean(e.activo)
		})),
		caja: mapCaja(caja),
		efectivoCaja: efectivo,
		kpis: {
			ventasHoy: num(ventasHoy[0]?.n),
			totalHoy: num(ventasHoy[0]?.total),
			ticketPromedio: num(ventasHoy[0]?.n) > 0 ? round2(num(ventasHoy[0]?.total) / num(ventasHoy[0]?.n)) : 0,
			alertasStock: lowStock.length
		},
		serieVentas: serie.map((r) => ({
			fecha: r.fecha,
			total: num(r.total)
		})),
		topHoy: top.map((r) => ({
			producto: r.producto,
			cantidad: num(r.cantidad),
			total: num(r.total)
		})),
		lowStock,
		recentSales: recent.map((r) => ({
			idVenta: String(r.id_venta),
			fecha: String(r.fecha),
			hora: String(r.hora),
			total: num(r.total),
			estado: String(r.estado),
			formaPago: String(r.forma_pago)
		}))
	};
});
var getVentas_createServerFn_handler = createServerRpc({
	id: "68de1365ebaea0ae09b287e29692a3bee50fef6ec6a5a281356c5a0cb3ff8bb5",
	name: "getVentas",
	filename: "src/lib/erp/server.ts"
}, (opts) => getVentas.__executeServer(opts));
var getVentas = createServerFn({ method: "GET" }).handler(getVentas_createServerFn_handler, async () => {
	return (await (await getSql())`
    select v.*, c.nombre as cliente
    from ventas v
    left join clientes c on c.id_cliente = v.id_cliente
    order by v.fecha desc, v.hora desc, v.id_venta desc
    limit 200
  `).map((r) => ({
		idVenta: String(r.id_venta),
		fecha: String(r.fecha),
		hora: String(r.hora),
		idCaja: r.id_caja ? String(r.id_caja) : null,
		cliente: r.cliente ? String(r.cliente) : "Mostrador",
		idUsuario: r.id_usuario ? String(r.id_usuario) : null,
		subtotal: num(r.subtotal),
		descuento: num(r.descuento),
		impuesto: num(r.impuesto),
		total: num(r.total),
		formaPago: String(r.forma_pago),
		estado: String(r.estado)
	}));
});
var getVentaDetalle_createServerFn_handler = createServerRpc({
	id: "584fbac349b6fa415645c46ceea5f2c6b0a4692ab33291b49dd131e25efef5ae",
	name: "getVentaDetalle",
	filename: "src/lib/erp/server.ts"
}, (opts) => getVentaDetalle.__executeServer(opts));
var getVentaDetalle = createServerFn({ method: "POST" }).validator(object({ idVenta: string() })).handler(getVentaDetalle_createServerFn_handler, async ({ data }) => {
	return (await (await getSql())`
      select d.*, p.producto
      from det_ventas d
      join productos p on p.id_producto = d.id_producto
      where d.id_venta = ${data.idVenta}
      order by d.id_detalle
    `).map((r) => ({
		idDetalle: String(r.id_detalle),
		producto: String(r.producto),
		cantidad: num(r.cantidad),
		precioUnitario: num(r.precio_unitario),
		descuento: num(r.descuento),
		impuesto: num(r.impuesto),
		subtotal: num(r.subtotal),
		total: num(r.total)
	}));
});
var getKardex_createServerFn_handler = createServerRpc({
	id: "cf8bce3a11e5b74af4afb9765ac4e6bed65ef59242608023b18738f5332a59ee",
	name: "getKardex",
	filename: "src/lib/erp/server.ts"
}, (opts) => getKardex.__executeServer(opts));
var getKardex = createServerFn({ method: "POST" }).validator(object({ idInsumo: string().optional() })).handler(getKardex_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const rows = data.idInsumo ? await sql.query(`select m.*, i.insumo, i.unidad_consumo
           from mov_inventario m join insumos i on i.id_insumo = m.id_insumo
           where m.id_insumo = $1
           order by m.fecha, m.hora, m.id_movimiento`, [data.idInsumo]) : await sql`
          select m.*, i.insumo, i.unidad_consumo
          from mov_inventario m join insumos i on i.id_insumo = m.id_insumo
          order by m.fecha desc, m.hora desc, m.id_movimiento desc
          limit 250
        `;
	let running = 0;
	return rows.map((r) => {
		running += num(r.entrada) - num(r.salida);
		return {
			idMovimiento: String(r.id_movimiento),
			fecha: String(r.fecha),
			hora: String(r.hora),
			idInsumo: String(r.id_insumo),
			insumo: String(r.insumo),
			tipo: String(r.tipo_movimiento),
			entrada: num(r.entrada),
			salida: num(r.salida),
			saldo: round4(running),
			costoUnitario: num(r.costo_unitario),
			referencia: r.referencia ? String(r.referencia) : "",
			observacion: String(r.observacion ?? ""),
			unidad: String(r.unidad_consumo)
		};
	});
});
var getCompras_createServerFn_handler = createServerRpc({
	id: "b53b68ac2199f040645ef0916319c63c27e6dcafd3a6fb3d28ea1a5b59d1ae68",
	name: "getCompras",
	filename: "src/lib/erp/server.ts"
}, (opts) => getCompras.__executeServer(opts));
var getCompras = createServerFn({ method: "GET" }).handler(getCompras_createServerFn_handler, async () => {
	return (await (await getSql())`
    select c.*, p.nombre_comercial
    from compras c
    join proveedores p on p.id_proveedor = c.id_proveedor
    order by c.fecha desc, c.id_compra desc
    limit 200
  `).map((r) => ({
		idCompra: String(r.id_compra),
		fecha: String(r.fecha),
		proveedor: String(r.nombre_comercial),
		documento: String(r.documento ?? ""),
		subtotal: num(r.subtotal),
		impuesto: num(r.impuesto),
		total: num(r.total),
		formaPago: String(r.forma_pago),
		estado: String(r.estado)
	}));
});
var getCajaDetalle_createServerFn_handler = createServerRpc({
	id: "8c79be0b483caa21b8121ebd34485c295a4e8aab33c06acc4899c1e381e8d782",
	name: "getCajaDetalle",
	filename: "src/lib/erp/server.ts"
}, (opts) => getCajaDetalle.__executeServer(opts));
var getCajaDetalle = createServerFn({ method: "GET" }).handler(getCajaDetalle_createServerFn_handler, async () => {
	const sql = await getSql();
	const cajas = await sql`
      select * from cajas order by fecha desc, id_caja desc limit 30
    `;
	const movs = await sql`
      select * from mov_caja order by fecha desc, hora desc, id_movcaja desc limit 200
    `;
	const gastos = await sql`
      select * from gastos order by fecha desc, id_gasto desc limit 100
    `;
	return {
		cajas: cajas.map((r) => mapCaja(r)),
		movimientos: movs.map((r) => ({
			idMovCaja: String(r.id_movcaja),
			fecha: String(r.fecha),
			hora: String(r.hora),
			idCaja: String(r.id_caja),
			tipo: String(r.tipo),
			concepto: String(r.concepto),
			entrada: num(r.entrada),
			salida: num(r.salida),
			formaPago: String(r.forma_pago),
			referencia: r.referencia ? String(r.referencia) : ""
		})),
		gastos: gastos.map((r) => ({
			idGasto: String(r.id_gasto),
			fecha: String(r.fecha),
			categoria: String(r.categoria),
			descripcion: String(r.descripcion),
			proveedor: String(r.proveedor ?? ""),
			monto: num(r.monto),
			formaPago: String(r.forma_pago),
			idCaja: r.id_caja ? String(r.id_caja) : null,
			estado: String(r.estado)
		}))
	};
});
var getInventarioExtra_createServerFn_handler = createServerRpc({
	id: "61c87215552e0485cd0775f25874bcc81eb5b2b34b5b479c11c888f2202a0918",
	name: "getInventarioExtra",
	filename: "src/lib/erp/server.ts"
}, (opts) => getInventarioExtra.__executeServer(opts));
var getInventarioExtra = createServerFn({ method: "GET" }).handler(getInventarioExtra_createServerFn_handler, async () => {
	const sql = await getSql();
	const conteos = await sql`
      select c.*, i.insumo from conteos c
      join insumos i on i.id_insumo = c.id_insumo
      order by c.fecha desc, c.id_conteo desc limit 100
    `;
	const mermas = await sql`
      select m.*, i.insumo from mermas m
      join insumos i on i.id_insumo = m.id_insumo
      order by m.fecha desc, m.id_merma desc limit 100
    `;
	const log = await sql`
      select * from log order by fecha desc, hora desc, id_log desc limit 80
    `;
	return {
		conteos: conteos.map((r) => ({
			idConteo: String(r.id_conteo),
			fecha: String(r.fecha),
			insumo: String(r.insumo),
			stockSistema: num(r.stock_sistema),
			stockContado: num(r.stock_contado),
			diferencia: num(r.diferencia),
			observacion: String(r.observacion ?? "")
		})),
		mermas: mermas.map((r) => ({
			idMerma: String(r.id_merma),
			fecha: String(r.fecha),
			insumo: String(r.insumo),
			cantidad: num(r.cantidad),
			motivo: String(r.motivo),
			costoUnitario: num(r.costo_unitario),
			costoTotal: num(r.costo_total)
		})),
		log: log.map((r) => ({
			idLog: String(r.id_log),
			fecha: String(r.fecha),
			hora: String(r.hora),
			idUsuario: r.id_usuario ? String(r.id_usuario) : "",
			modulo: String(r.modulo),
			accion: String(r.accion),
			referencia: r.referencia ? String(r.referencia) : "",
			descripcion: String(r.descripcion ?? "")
		}))
	};
});
var openCaja_createServerFn_handler = createServerRpc({
	id: "5e1f5b6367c9425fc20b7c600c87401da2946bd0d7be7b501a084ae2d6fe5657",
	name: "openCaja",
	filename: "src/lib/erp/server.ts"
}, (opts) => openCaja.__executeServer(opts));
var openCaja = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	caja: string().default("Caja 1"),
	montoInicial: number().min(0)
})).handler(openCaja_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	if (await openCajaRow(sql)) throw new Error("Ya hay una caja abierta. Ciérrala antes de abrir otra.");
	const id = await nextId(sql, "CAJ");
	await sql.query(`insert into cajas (id_caja, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado)
       values ($1,$2,$3,to_char(now(),'HH24:MI:SS'),$4,'ABIERTA')`, [
		id,
		data.caja,
		data.idUsuario,
		data.montoInicial
	]);
	const mov = await nextId(sql, "MCJ");
	await sql.query(`insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
       values ($1,$2,'APERTURA','Fondo inicial',$3,0,'EFECTIVO',$1,$4)`, [
		mov,
		id,
		data.montoInicial,
		data.idUsuario
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "CAJA",
		accion: "APERTURA",
		referencia: id,
		descripcion: `Apertura ${data.caja} con ${data.montoInicial}`
	});
	return { idCaja: id };
});
var closeCaja_createServerFn_handler = createServerRpc({
	id: "d26396592915bd4831cc15f2e304725b751f0a9881c36a2768bd3af0fd0326dc",
	name: "closeCaja",
	filename: "src/lib/erp/server.ts"
}, (opts) => closeCaja.__executeServer(opts));
var closeCaja = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCaja: string(),
	efectivoContado: number().min(0)
})).handler(closeCaja_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const caja = (await sql.query(`select * from cajas where id_caja = $1`, [data.idCaja]))[0];
	if (!caja || String(caja.estado) !== "ABIERTA") throw new Error("La caja no está abierta.");
	const esperado = await efectivoCaja(sql, data.idCaja);
	const diferencia = round2(data.efectivoContado - esperado);
	await sql.query(`update cajas set id_usuario_cierre=$1, hora_cierre=to_char(now(),'HH24:MI:SS'),
        efectivo_esperado=$2, efectivo_contado=$3, diferencia=$4, estado='CERRADA'
       where id_caja=$5`, [
		data.idUsuario,
		esperado,
		data.efectivoContado,
		diferencia,
		data.idCaja
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "CAJA",
		accion: "CIERRE",
		referencia: data.idCaja,
		descripcion: `Cierre. Esperado ${esperado}, contado ${data.efectivoContado}, diferencia ${diferencia}`
	});
	return {
		esperado,
		diferencia
	};
});
var registrarVenta_createServerFn_handler = createServerRpc({
	id: "cb3ad5f28a8c620553564b0ecacad4a5d08f6bf536723eb2624620f7b8b271c9",
	name: "registrarVenta",
	filename: "src/lib/erp/server.ts"
}, (opts) => registrarVenta.__executeServer(opts));
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
})).handler(registrarVenta_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cfg = await configMap(sql);
	const caja = await openCajaRow(sql);
	if (cfg.Control_Caja === "SI" && !caja) throw new Error("No hay caja abierta. Ábrela antes de vender.");
	const products = await sql`select * from productos where activo = true`;
	const recetas = await sql`select * from recetas`;
	const insumos = await sql`select * from insumos`;
	const stocks = await stockMap(sql);
	const allowNeg = cfg.Stock_Negativo === "SI";
	const needed = {};
	const lines = data.items.map((item) => {
		const p = products.find((x) => String(x.id_producto) === item.idProducto);
		if (!p) throw new Error(`Producto ${item.idProducto} no existe.`);
		const precio = num(p.precio_venta);
		const tasa = num(p.impuesto);
		const sub = round2(item.cantidad * precio - item.descuento);
		const imp = round2(sub * tasa);
		const tot = round2(sub + imp);
		const recipe = recetas.filter((r) => String(r.id_producto) === item.idProducto);
		for (const r of recipe) {
			const neta = cantidadNeta(num(r.cantidad), num(r.merma_pct));
			const id = String(r.id_insumo);
			needed[id] = (needed[id] ?? 0) + neta * item.cantidad;
		}
		return {
			item,
			producto: String(p.producto),
			precio,
			tasa,
			sub,
			imp,
			tot,
			recipe
		};
	});
	if (!allowNeg) {
		const faltantes = [];
		for (const [id, qtyNeed] of Object.entries(needed)) {
			const ins = insumos.find((i) => String(i.id_insumo) === id);
			const have = stocks[id] ?? 0;
			if (have + 1e-9 < qtyNeed) faltantes.push(`${String(ins?.insumo ?? id)} (hay ${round4(have)}, se necesitan ${round4(qtyNeed)})`);
		}
		if (faltantes.length) throw new Error(`Stock insuficiente: ${faltantes.join("; ")}`);
	}
	const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
	const headerImp = round2(lines.reduce((a, l) => a + l.imp, 0));
	const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
	const idVenta = await nextId(sql, "VEN");
	const empleado = data.idEmpleado ?? (await sql.query(`select id_empleado from usuarios where id_usuario=$1`, [data.idUsuario]))[0]?.id_empleado ?? null;
	await sql.query(`insert into ventas (id_venta, id_caja, id_cliente, id_empleado, id_usuario, subtotal, descuento, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,0,$7,$8,$9,'PAGADA')`, [
		idVenta,
		caja ? String(caja.id_caja) : null,
		data.idCliente ?? "CLI00001",
		empleado,
		data.idUsuario,
		headerSub,
		headerImp,
		headerTot,
		data.formaPago
	]);
	for (const line of lines) {
		const idDet = await nextId(sql, "DTV");
		await sql.query(`insert into det_ventas (id_detalle, id_venta, id_producto, cantidad, precio_unitario, descuento, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`, [
			idDet,
			idVenta,
			line.item.idProducto,
			line.item.cantidad,
			line.precio,
			line.item.descuento,
			line.imp,
			line.sub,
			line.tot
		]);
	}
	for (const [idInsumo, qtyNeed] of Object.entries(needed)) {
		const ins = insumos.find((i) => String(i.id_insumo) === idInsumo);
		const idMov = await nextId(sql, "MOV");
		await sql.query(`insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'VENTA',0,$3,$4,$5,$6,'Explosion de receta')`, [
			idMov,
			idInsumo,
			round4(qtyNeed),
			num(ins?.costo_unitario),
			idVenta,
			data.idUsuario
		]);
	}
	if (caja) {
		const idMovCaja = await nextId(sql, "MCJ");
		await sql.query(`insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'VENTA',$3,$4,0,$5,$6,$7)`, [
			idMovCaja,
			String(caja.id_caja),
			`Venta ${idVenta}`,
			data.formaPago === "EFECTIVO" ? headerTot : 0,
			data.formaPago,
			idVenta,
			data.idUsuario
		]);
	}
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "VENTAS",
		accion: "ALTA",
		referencia: idVenta,
		descripcion: `Venta ${idVenta} por ${headerTot} (${data.formaPago})`
	});
	return {
		idVenta,
		total: headerTot,
		subtotal: headerSub,
		impuesto: headerImp
	};
});
var anularVenta_createServerFn_handler = createServerRpc({
	id: "87d6ef115e1630596d40141bf77f6a31f3ae3c73ebd6f98b467c63a54c3cddaf",
	name: "anularVenta",
	filename: "src/lib/erp/server.ts"
}, (opts) => anularVenta.__executeServer(opts));
var anularVenta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idVenta: string()
})).handler(anularVenta_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const venta = (await sql.query(`select * from ventas where id_venta=$1`, [data.idVenta]))[0];
	if (!venta) throw new Error("Venta no encontrada.");
	if (String(venta.estado) === "ANULADA") throw new Error("La venta ya está anulada.");
	await sql.query(`update ventas set estado='ANULADA' where id_venta=$1`, [data.idVenta]);
	const orig = await sql.query(`select * from mov_inventario where referencia=$1 and tipo_movimiento='VENTA'`, [data.idVenta]);
	for (const m of orig) {
		const idMov = await nextId(sql, "MOV");
		await sql.query(`insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'ANULACION',$3,0,$4,$5,$6,'Reverso por anulación de venta')`, [
			idMov,
			m.id_insumo,
			m.salida,
			m.costo_unitario,
			data.idVenta,
			data.idUsuario
		]);
	}
	if (venta.id_caja) {
		const idMovCaja = await nextId(sql, "MCJ");
		await sql.query(`insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'ANULACION',$3,0,$4,$5,$6,$7)`, [
			idMovCaja,
			venta.id_caja,
			`Anulación ${data.idVenta}`,
			num(venta.forma_pago === "EFECTIVO" ? venta.total : 0),
			venta.forma_pago,
			data.idVenta,
			data.idUsuario
		]);
	}
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "VENTAS",
		accion: "ANULACION",
		referencia: data.idVenta,
		descripcion: `Anulación compensatoria de ${data.idVenta}`
	});
	return { ok: true };
});
var registrarCompra_createServerFn_handler = createServerRpc({
	id: "50de196bb95938be9e055ccc480a44f3a3acf16b497e9c43dec707ec3dfa769f",
	name: "registrarCompra",
	filename: "src/lib/erp/server.ts"
}, (opts) => registrarCompra.__executeServer(opts));
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
})).handler(registrarCompra_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const stocks = await stockMap(sql);
	const insumos = await sql`select * from insumos`;
	const idCompra = await nextId(sql, "COM");
	const lines = data.items.map((item) => {
		const sub = round2(item.cantidad * item.costoUnitario);
		const imp = round2(item.impuesto);
		return {
			...item,
			sub,
			tot: round2(sub + imp)
		};
	});
	const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
	const headerImp = round2(lines.reduce((a, l) => a + l.impuesto, 0));
	const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
	await sql.query(`insert into compras (id_compra, id_proveedor, documento, id_usuario, subtotal, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'RECIBIDA')`, [
		idCompra,
		data.idProveedor,
		data.documento,
		data.idUsuario,
		headerSub,
		headerImp,
		headerTot,
		data.formaPago
	]);
	for (const line of lines) {
		const idDet = await nextId(sql, "DTC");
		await sql.query(`insert into det_compras (id_detalle, id_compra, id_insumo, cantidad, costo_unitario, descuento, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,0,$6,$7,$8)`, [
			idDet,
			idCompra,
			line.idInsumo,
			line.cantidad,
			line.costoUnitario,
			line.impuesto,
			line.sub,
			line.tot
		]);
		const have = stocks[line.idInsumo] ?? 0;
		const ins = insumos.find((i) => String(i.id_insumo) === line.idInsumo);
		const oldCost = num(ins?.costo_unitario);
		const newCost = have + line.cantidad > 0 ? round4((have * oldCost + line.cantidad * line.costoUnitario) / (have + line.cantidad)) : line.costoUnitario;
		await sql.query(`update insumos set costo_unitario=$1 where id_insumo=$2`, [newCost, line.idInsumo]);
		const idMov = await nextId(sql, "MOV");
		await sql.query(`insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'COMPRA',$3,0,$4,$5,$6,'Ingreso por compra')`, [
			idMov,
			line.idInsumo,
			line.cantidad,
			line.costoUnitario,
			idCompra,
			data.idUsuario
		]);
	}
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "COMPRAS",
		accion: "ALTA",
		referencia: idCompra,
		descripcion: `Compra ${idCompra} por ${headerTot}`
	});
	return {
		idCompra,
		total: headerTot
	};
});
var registrarMerma_createServerFn_handler = createServerRpc({
	id: "890341388cc1e72ddcde84dbc3723940956fd182f75a23a6688df884713907ab",
	name: "registrarMerma",
	filename: "src/lib/erp/server.ts"
}, (opts) => registrarMerma.__executeServer(opts));
var registrarMerma = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idInsumo: string(),
	cantidad: number().positive(),
	motivo: string().min(1)
})).handler(registrarMerma_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const cfg = await configMap(sql);
	const stocks = await stockMap(sql);
	const ins = (await sql.query(`select * from insumos where id_insumo=$1`, [data.idInsumo]))[0];
	if (!ins) throw new Error("Insumo no encontrado.");
	const have = stocks[data.idInsumo] ?? 0;
	if (cfg.Stock_Negativo !== "SI" && have < data.cantidad) throw new Error(`Stock insuficiente para merma (${round4(have)} disponible).`);
	const costo = num(ins.costo_unitario);
	const id = await nextId(sql, "MRM");
	await sql.query(`insert into mermas (id_merma, id_insumo, cantidad, motivo, costo_unitario, costo_total, id_usuario)
       values ($1,$2,$3,$4,$5,$6,$7)`, [
		id,
		data.idInsumo,
		data.cantidad,
		data.motivo,
		costo,
		round2(data.cantidad * costo),
		data.idUsuario
	]);
	const idMov = await nextId(sql, "MOV");
	await sql.query(`insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
       values ($1,$2,'MERMA',0,$3,$4,$5,$6,$7)`, [
		idMov,
		data.idInsumo,
		data.cantidad,
		costo,
		id,
		data.idUsuario,
		data.motivo
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "INVENTARIO",
		accion: "MERMA",
		referencia: id,
		descripcion: `Merma ${data.cantidad} de ${ins.insumo}`
	});
	return { id };
});
var registrarConteo_createServerFn_handler = createServerRpc({
	id: "697d0b90364a80023e0eeb06e1dc770eadbc796fae729c7db95ebe3ff79f6f63",
	name: "registrarConteo",
	filename: "src/lib/erp/server.ts"
}, (opts) => registrarConteo.__executeServer(opts));
var registrarConteo = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idInsumo: string(),
	stockContado: number().min(0),
	observacion: string().default("")
})).handler(registrarConteo_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const stocks = await stockMap(sql);
	const ins = (await sql.query(`select * from insumos where id_insumo=$1`, [data.idInsumo]))[0];
	if (!ins) throw new Error("Insumo no encontrado.");
	const sistema = stocks[data.idInsumo] ?? 0;
	const diff = round4(data.stockContado - sistema);
	const id = await nextId(sql, "CNT");
	await sql.query(`insert into conteos (id_conteo, id_insumo, stock_sistema, stock_contado, diferencia, id_usuario, observacion)
       values ($1,$2,$3,$4,$5,$6,$7)`, [
		id,
		data.idInsumo,
		sistema,
		data.stockContado,
		diff,
		data.idUsuario,
		data.observacion
	]);
	if (diff !== 0) {
		const idMov = await nextId(sql, "MOV");
		await sql.query(`insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'CONTEO',$3,$4,$5,$6,$7,$8)`, [
			idMov,
			data.idInsumo,
			diff > 0 ? diff : 0,
			diff < 0 ? -diff : 0,
			num(ins.costo_unitario),
			id,
			data.idUsuario,
			data.observacion || "Ajuste por conteo físico"
		]);
	}
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "INVENTARIO",
		accion: "CONTEO",
		referencia: id,
		descripcion: `Conteo ${ins.insumo}: sistema ${sistema}, contado ${data.stockContado}`
	});
	return {
		id,
		diferencia: diff
	};
});
var registrarGasto_createServerFn_handler = createServerRpc({
	id: "f58197c89549f6428d77e311654a8c3cf25e49e0408d3debafa1c5ff76950a63",
	name: "registrarGasto",
	filename: "src/lib/erp/server.ts"
}, (opts) => registrarGasto.__executeServer(opts));
var registrarGasto = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	categoria: string().min(1),
	descripcion: string().min(1),
	proveedor: string().default(""),
	monto: number().positive(),
	formaPago: _enum(["EFECTIVO", "TARJETA"])
})).handler(registrarGasto_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const caja = await openCajaRow(sql);
	if (data.formaPago === "EFECTIVO" && !caja) throw new Error("No hay caja abierta para registrar un gasto en efectivo.");
	const id = await nextId(sql, "GST");
	await sql.query(`insert into gastos (id_gasto, categoria, descripcion, proveedor, monto, forma_pago, id_caja, id_usuario, estado)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'REGISTRADO')`, [
		id,
		data.categoria,
		data.descripcion,
		data.proveedor,
		data.monto,
		data.formaPago,
		caja ? String(caja.id_caja) : null,
		data.idUsuario
	]);
	if (caja && data.formaPago === "EFECTIVO") {
		const idMov = await nextId(sql, "MCJ");
		await sql.query(`insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'GASTO',$3,0,$4,'EFECTIVO',$5,$6)`, [
			idMov,
			String(caja.id_caja),
			data.descripcion,
			data.monto,
			id,
			data.idUsuario
		]);
	}
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "CAJA",
		accion: "GASTO",
		referencia: id,
		descripcion: data.descripcion
	});
	return { id };
});
var upsertProducto_createServerFn_handler = createServerRpc({
	id: "5f9ed16f6f6588102802804fff5bc042b1273d3092f6b71f2c2e96988c8f7663",
	name: "upsertProducto",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertProducto.__executeServer(opts));
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
})).handler(upsertProducto_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idProducto || await nextId(sql, "PROD");
	await sql.query(`insert into productos (id_producto, sku, producto, id_categoria, unidad_venta, precio_venta, impuesto, activo)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (id_producto) do update set
         sku=excluded.sku, producto=excluded.producto, id_categoria=excluded.id_categoria,
         unidad_venta=excluded.unidad_venta, precio_venta=excluded.precio_venta,
         impuesto=excluded.impuesto, activo=excluded.activo`, [
		id,
		data.sku,
		data.producto,
		data.idCategoria,
		data.unidadVenta,
		data.precioVenta,
		data.impuesto,
		data.activo
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "MAESTROS",
		accion: data.idProducto ? "EDICION" : "ALTA",
		referencia: id,
		descripcion: `Producto ${data.producto}`
	});
	return { id };
});
var upsertInsumo_createServerFn_handler = createServerRpc({
	id: "03b66675897e6c58f5e48227ef048435dc4f69f0cfa5b4528fcc895249e75823",
	name: "upsertInsumo",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertInsumo.__executeServer(opts));
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
})).handler(upsertInsumo_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idInsumo || await nextId(sql, "INS");
	await sql.query(`insert into insumos (id_insumo, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, activo, id_proveedor)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       on conflict (id_insumo) do update set
         sku=excluded.sku, insumo=excluded.insumo, id_categoria=excluded.id_categoria,
         unidad_compra=excluded.unidad_compra, unidad_consumo=excluded.unidad_consumo,
         factor_conversion=excluded.factor_conversion, costo_unitario=excluded.costo_unitario,
         stock_minimo=excluded.stock_minimo, stock_maximo=excluded.stock_maximo,
         activo=excluded.activo, id_proveedor=excluded.id_proveedor`, [
		id,
		data.sku,
		data.insumo,
		data.idCategoria,
		data.unidadCompra,
		data.unidadConsumo,
		data.factorConversion,
		data.costoUnitario,
		data.stockMinimo,
		data.stockMaximo,
		data.activo,
		data.idProveedor || null
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "MAESTROS",
		accion: data.idInsumo ? "EDICION" : "ALTA",
		referencia: id,
		descripcion: `Insumo ${data.insumo}`
	});
	return { id };
});
var upsertReceta_createServerFn_handler = createServerRpc({
	id: "e3f1d55e243b62b902df346da48113e5ecba93955ad0f6d7b8693dec75a7c102",
	name: "upsertReceta",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertReceta.__executeServer(opts));
var upsertReceta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idReceta: string().optional(),
	idProducto: string(),
	idInsumo: string(),
	cantidad: number().positive(),
	unidadConsumo: string(),
	mermaPct: number().min(0).default(0)
})).handler(upsertReceta_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idReceta || await nextId(sql, "REC");
	if (data.idReceta) await sql.query(`update recetas set id_producto=$1, id_insumo=$2, cantidad=$3, unidad_consumo=$4, merma_pct=$5 where id_receta=$6`, [
		data.idProducto,
		data.idInsumo,
		data.cantidad,
		data.unidadConsumo,
		data.mermaPct,
		id
	]);
	else await sql.query(`insert into recetas (id_receta, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct)
         values ($1,$2,$3,$4,$5,$6)`, [
		id,
		data.idProducto,
		data.idInsumo,
		data.cantidad,
		data.unidadConsumo,
		data.mermaPct
	]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "RECETAS",
		accion: data.idReceta ? "EDICION" : "ALTA",
		referencia: id,
		descripcion: `Componente de receta ${data.idProducto}`
	});
	return { id };
});
var deleteReceta_createServerFn_handler = createServerRpc({
	id: "2e9ab206a118897c5b6fc753f86e276cf8455874a84d8cbe34e82df197ad9384",
	name: "deleteReceta",
	filename: "src/lib/erp/server.ts"
}, (opts) => deleteReceta.__executeServer(opts));
var deleteReceta = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idReceta: string()
})).handler(deleteReceta_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql.query(`delete from recetas where id_receta=$1`, [data.idReceta]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "RECETAS",
		accion: "BAJA",
		referencia: data.idReceta,
		descripcion: "Componente de receta eliminado"
	});
	return { ok: true };
});
var upsertCategoria_createServerFn_handler = createServerRpc({
	id: "250d01d973a21000411121874a64ff63d80cf6195f8bf854586a3260c4c770dc",
	name: "upsertCategoria",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertCategoria.__executeServer(opts));
var upsertCategoria = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCategoria: string().optional(),
	categoria: string().min(1),
	tipo: _enum(["PRODUCTO", "INSUMO"]),
	activo: boolean().default(true)
})).handler(upsertCategoria_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idCategoria || await nextId(sql, "CAT");
	await sql.query(`insert into categorias (id_categoria, categoria, tipo, activo)
       values ($1,$2,$3,$4)
       on conflict (id_categoria) do update set categoria=excluded.categoria, tipo=excluded.tipo, activo=excluded.activo`, [
		id,
		data.categoria,
		data.tipo,
		data.activo
	]);
	return { id };
});
var upsertProveedor_createServerFn_handler = createServerRpc({
	id: "45dfa120de879849be7000f9199448d4718c21c272c67094cad7809e67300fbb",
	name: "upsertProveedor",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertProveedor.__executeServer(opts));
var upsertProveedor = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idProveedor: string().optional(),
	razonSocial: string().min(1),
	nombreComercial: string().min(1),
	documento: string().default(""),
	telefono: string().default(""),
	condicionPago: string().default("CONTADO"),
	activo: boolean().default(true)
})).handler(upsertProveedor_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idProveedor || await nextId(sql, "PROV");
	await sql.query(`insert into proveedores (id_proveedor, razon_social, nombre_comercial, documento, telefono, condicion_pago, activo)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id_proveedor) do update set
         razon_social=excluded.razon_social, nombre_comercial=excluded.nombre_comercial,
         documento=excluded.documento, telefono=excluded.telefono,
         condicion_pago=excluded.condicion_pago, activo=excluded.activo`, [
		id,
		data.razonSocial,
		data.nombreComercial,
		data.documento,
		data.telefono,
		data.condicionPago,
		data.activo
	]);
	return { id };
});
var upsertCliente_createServerFn_handler = createServerRpc({
	id: "d7de2673aa3b6423dc4a742452192c1f30aa7835a7cf12c35a411456bd4b35b0",
	name: "upsertCliente",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertCliente.__executeServer(opts));
var upsertCliente = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idCliente: string().optional(),
	nombre: string().min(1),
	documento: string().default(""),
	telefono: string().default(""),
	tipoCliente: string().default("MOSTRADOR"),
	activo: boolean().default(true)
})).handler(upsertCliente_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idCliente || await nextId(sql, "CLI");
	await sql.query(`insert into clientes (id_cliente, nombre, documento, telefono, tipo_cliente, activo)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id_cliente) do update set
         nombre=excluded.nombre, documento=excluded.documento, telefono=excluded.telefono,
         tipo_cliente=excluded.tipo_cliente, activo=excluded.activo`, [
		id,
		data.nombre,
		data.documento,
		data.telefono,
		data.tipoCliente,
		data.activo
	]);
	return { id };
});
var upsertEmpleado_createServerFn_handler = createServerRpc({
	id: "e94ec9e64274d10bde234c7d1152279ef96e87117605c97b02ce7fe63183ea6c",
	name: "upsertEmpleado",
	filename: "src/lib/erp/server.ts"
}, (opts) => upsertEmpleado.__executeServer(opts));
var upsertEmpleado = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	idEmpleado: string().optional(),
	nombre: string().min(1),
	apellido: string().default(""),
	cargo: string().default(""),
	telefono: string().default(""),
	activo: boolean().default(true)
})).handler(upsertEmpleado_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const id = data.idEmpleado || await nextId(sql, "EMP");
	await sql.query(`insert into empleados (id_empleado, nombre, apellido, cargo, telefono, activo)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id_empleado) do update set
         nombre=excluded.nombre, apellido=excluded.apellido, cargo=excluded.cargo,
         telefono=excluded.telefono, activo=excluded.activo`, [
		id,
		data.nombre,
		data.apellido,
		data.cargo,
		data.telefono,
		data.activo
	]);
	return { id };
});
var updateConfig_createServerFn_handler = createServerRpc({
	id: "99efdd349c3b93807e493272289a174f6d973cc6d0a76c45ff3c9a76eb1a29b6",
	name: "updateConfig",
	filename: "src/lib/erp/server.ts"
}, (opts) => updateConfig.__executeServer(opts));
var updateConfig = createServerFn({ method: "POST" }).validator(object({
	idUsuario: operatorId,
	parametro: string(),
	valor: string()
})).handler(updateConfig_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql.query(`update config set valor=$1 where parametro=$2`, [data.valor, data.parametro]);
	await writeLog(sql, {
		idUsuario: data.idUsuario,
		modulo: "CONFIG",
		accion: "EDICION",
		referencia: data.parametro,
		descripcion: `${data.parametro}=${data.valor}`
	});
	return { ok: true };
});
//#endregion
export { anularVenta_createServerFn_handler, closeCaja_createServerFn_handler, deleteReceta_createServerFn_handler, getCajaDetalle_createServerFn_handler, getCompras_createServerFn_handler, getInventarioExtra_createServerFn_handler, getKardex_createServerFn_handler, getSnapshot_createServerFn_handler, getVentaDetalle_createServerFn_handler, getVentas_createServerFn_handler, openCaja_createServerFn_handler, registrarCompra_createServerFn_handler, registrarConteo_createServerFn_handler, registrarGasto_createServerFn_handler, registrarMerma_createServerFn_handler, registrarVenta_createServerFn_handler, updateConfig_createServerFn_handler, upsertCategoria_createServerFn_handler, upsertCliente_createServerFn_handler, upsertEmpleado_createServerFn_handler, upsertInsumo_createServerFn_handler, upsertProducto_createServerFn_handler, upsertProveedor_createServerFn_handler, upsertReceta_createServerFn_handler };
