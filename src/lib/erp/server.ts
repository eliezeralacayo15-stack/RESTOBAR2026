import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { cantidadNeta, num, round2, round4 } from "./format";
import { FORMA_PAGO_IDS, mueveCaja } from "./pagos";
import type { Rol } from "./types";

type Sql = Awaited<ReturnType<typeof getSql>>;

const ID_SPECS: Record<string, { table: string; column: string; pad: number }> = {
  PROD: { table: "productos", column: "id_producto", pad: 5 },
  INS: { table: "insumos", column: "id_insumo", pad: 5 },
  REC: { table: "recetas", column: "id_receta", pad: 5 },
  PROV: { table: "proveedores", column: "id_proveedor", pad: 5 },
  CLI: { table: "clientes", column: "id_cliente", pad: 5 },
  EMP: { table: "empleados", column: "id_empleado", pad: 5 },
  CAT: { table: "categorias", column: "id_categoria", pad: 3 },
  VEN: { table: "ventas", column: "id_venta", pad: 5 },
  DTV: { table: "det_ventas", column: "id_detalle", pad: 5 },
  COM: { table: "compras", column: "id_compra", pad: 5 },
  DTC: { table: "det_compras", column: "id_detalle", pad: 5 },
  MOV: { table: "mov_inventario", column: "id_movimiento", pad: 5 },
  CAJ: { table: "cajas", column: "id_caja", pad: 5 },
  MCJ: { table: "mov_caja", column: "id_movcaja", pad: 5 },
  GST: { table: "gastos", column: "id_gasto", pad: 5 },
  CNT: { table: "conteos", column: "id_conteo", pad: 5 },
  MRM: { table: "mermas", column: "id_merma", pad: 5 },
  LOG: { table: "log", column: "id_log", pad: 5 },
};

type Tenant = {
  sql: Sql;
  userId: string;
  negocioId: string;
  rol: Rol;
  nombreMiembro: string;
  nombreNegocio: string;
};

async function nextId(sql: Sql, prefix: keyof typeof ID_SPECS, negocioId: string) {
  const spec = ID_SPECS[prefix];
  const rows = await sql.query<{ id: string }>(
    `select ${spec.column} as id from ${spec.table} where negocio_id = $1 and ${spec.column} like $2 order by ${spec.column} desc limit 1`,
    [negocioId, `${negocioId}-${prefix}%`],
  );
  const last = rows[0]?.id ?? "";
  const tail = last.slice(last.lastIndexOf("-") + 1);
  const n = tail ? Number.parseInt(tail.slice(prefix.length), 10) + 1 : 1;
  return `${negocioId}-${prefix}${String(Number.isFinite(n) ? n : 1).padStart(spec.pad, "0")}`;
}

async function loadTenant(userId: string): Promise<Tenant | null> {
  const sql = await getSql();
  const rows = await sql<{
    negocio_id: string;
    rol: Rol;
    nombre: string;
    negocio: string;
  }>`
    select m.negocio_id, m.rol, m.nombre, n.nombre as negocio
    from miembros m
    join negocios n on n.id = m.negocio_id
    where m.user_id = ${userId} and m.activo = true
    limit 1
  `;
  const row = rows[0];
  if (!row) return null;
  return {
    sql,
    userId,
    negocioId: row.negocio_id,
    rol: row.rol,
    nombreMiembro: row.nombre,
    nombreNegocio: row.negocio,
  };
}

async function tenant(userId: string): Promise<Tenant> {
  const t = await loadTenant(userId);
  if (!t) throw new Error("Todavía no hay un negocio asociado a esta cuenta.");
  return t;
}

function allow(rol: Rol, roles: Rol[]) {
  if (!roles.includes(rol)) throw new Error("Tu rol no puede hacer esta operación.");
}

async function writeLog(
  sql: Sql,
  negocioId: string,
  input: { idUsuario: string; modulo: string; accion: string; referencia?: string; descripcion: string },
) {
  const id = await nextId(sql, "LOG", negocioId);
  await sql.query(
    `insert into log (id_log, negocio_id, id_usuario, modulo, accion, referencia, descripcion)
     values ($1,$2,$3,$4,$5,$6,$7)`,
    [id, negocioId, input.idUsuario, input.modulo, input.accion, input.referencia ?? null, input.descripcion],
  );
}

async function stockMap(sql: Sql, negocioId: string) {
  const rows = await sql.query<{ id_insumo: string; stock: string | number }>(
    `select i.id_insumo, coalesce(s.stock, 0) as stock
     from insumos i
     left join (
       select id_insumo, sum(entrada) - sum(salida) as stock
       from mov_inventario where negocio_id = $1 group by id_insumo
     ) s on s.id_insumo = i.id_insumo
     where i.negocio_id = $1`,
    [negocioId],
  );
  return Object.fromEntries(rows.map((r) => [r.id_insumo, num(r.stock)]));
}

async function configMap(sql: Sql, negocioId: string) {
  const rows = await sql.query<{ parametro: string; valor: string }>(
    `select parametro, valor from config where negocio_id = $1`,
    [negocioId],
  );
  return Object.fromEntries(rows.map((r) => [r.parametro, r.valor]));
}

const optUser = z.string().optional();

export const getMe = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const users = await sql<{ email: string; name: string }>`
      select email, name from "user" where id = ${context.userId} limit 1
    `;
    const t = await loadTenant(context.userId);
    return {
      userId: context.userId,
      email: users[0]?.email ?? "",
      name: users[0]?.name ?? "",
      negocio: t
        ? {
            id: t.negocioId,
            nombre: t.nombreNegocio,
            rol: t.rol,
            nombreMiembro: t.nombreMiembro,
          }
        : null,
    };
  });

async function seedNegocio(sql: Sql, negocioId: string, userId: string) {
  const id = (local: string) => `${negocioId}-${local}`;
  const cats: [string, string, string][] = [
    ["CAT001", "Hamburguesas", "PRODUCTO"],
    ["CAT002", "Pizzas", "PRODUCTO"],
    ["CAT003", "Entradas", "PRODUCTO"],
    ["CAT004", "Platos Fuertes", "PRODUCTO"],
    ["CAT005", "Postres", "PRODUCTO"],
    ["CAT006", "Bebidas", "PRODUCTO"],
    ["CAT007", "Combos", "PRODUCTO"],
    ["CAT101", "Carnes", "INSUMO"],
    ["CAT102", "Panadería", "INSUMO"],
    ["CAT103", "Lácteos", "INSUMO"],
    ["CAT104", "Vegetales", "INSUMO"],
    ["CAT105", "Frutas", "INSUMO"],
    ["CAT106", "Salsas y Condimentos", "INSUMO"],
    ["CAT107", "Bebidas e Insumos", "INSUMO"],
    ["CAT108", "Empaques", "INSUMO"],
    ["CAT109", "Limpieza", "INSUMO"],
    ["CAT110", "Otros Insumos", "INSUMO"],
  ];
  for (const [code, nombre, tipo] of cats) {
    await sql.query(
      `insert into categorias (id_categoria, negocio_id, categoria, tipo) values ($1,$2,$3,$4)`,
      [id(code), negocioId, nombre, tipo],
    );
  }
  const provs: [string, string, string][] = [
    ["PROV00001", "Distribuidora Central", "CONTADO"],
    ["PROV00002", "Panadería Local", "CONTADO"],
    ["PROV00003", "Frigorífico Principal", "CREDITO"],
  ];
  for (const [code, nombre, pago] of provs) {
    await sql.query(
      `insert into proveedores (id_proveedor, negocio_id, razon_social, nombre_comercial, condicion_pago)
       values ($1,$2,$3,$3,$4)`,
      [id(code), negocioId, nombre, pago],
    );
  }
  await sql.query(
    `insert into clientes (id_cliente, negocio_id, nombre, tipo_cliente) values ($1,$2,'Consumidor Final','MOSTRADOR')`,
    [id("CLI00001"), negocioId],
  );
  const emps: [string, string, string, string][] = [
    ["EMP00001", "Administrador", "General", "Administrador"],
    ["EMP00002", "Cajero", "Principal", "Cajero"],
    ["EMP00003", "Cocinero", "Principal", "Cocinero"],
  ];
  for (const [code, nombre, apellido, cargo] of emps) {
    await sql.query(
      `insert into empleados (id_empleado, negocio_id, nombre, apellido, cargo) values ($1,$2,$3,$4,$5)`,
      [id(code), negocioId, nombre, apellido, cargo],
    );
  }
  const prods: [string, string, string, string, number][] = [
    ["PROD00001", "SKU-0001", "Hamburguesa Clásica", "CAT001", 8],
    ["PROD00002", "SKU-0002", "Pizza Pepperoni", "CAT002", 12],
    ["PROD00003", "SKU-0003", "Papas Fritas", "CAT003", 4],
    ["PROD00004", "SKU-0004", "Refresco", "CAT006", 2.5],
    ["PROD00005", "SKU-0005", "Agua Mineral", "CAT006", 1.5],
  ];
  for (const [code, sku, nombre, cat, precio] of prods) {
    await sql.query(
      `insert into productos (id_producto, negocio_id, sku, producto, id_categoria, precio_venta, impuesto)
       values ($1,$2,$3,$4,$5,$6,0.16)`,
      [id(code), negocioId, sku, nombre, id(cat), precio],
    );
  }
  const insumos: [string, string, string, string, string, number, number, number, string][] = [
    ["INS00001", "INS-0001", "Carne molida", "CAT101", "KG", 7.5, 10, 50, "PROV00003"],
    ["INS00002", "INS-0002", "Pan de hamburguesa", "CAT102", "UND", 0.4, 30, 200, "PROV00002"],
    ["INS00003", "INS-0003", "Queso", "CAT103", "KG", 8, 5, 30, "PROV00001"],
    ["INS00004", "INS-0004", "Papas", "CAT104", "KG", 1.8, 10, 50, "PROV00001"],
    ["INS00005", "INS-0005", "Aceite", "CAT106", "L", 2.5, 5, 30, "PROV00001"],
  ];
  for (const [code, sku, nombre, cat, unidad, costo, min, max, prov] of insumos) {
    await sql.query(
      `insert into insumos (id_insumo, negocio_id, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, id_proveedor)
       values ($1,$2,$3,$4,$5,$6,$6,1,$7,$8,$9,$10)`,
      [id(code), negocioId, sku, nombre, id(cat), unidad, costo, min, max, id(prov)],
    );
  }
  const recs: [string, string, string, number, string, number][] = [
    ["REC00001", "PROD00001", "INS00001", 0.15, "KG", 0],
    ["REC00002", "PROD00001", "INS00002", 1, "UND", 0],
    ["REC00003", "PROD00001", "INS00003", 0.03, "KG", 0],
    ["REC00004", "PROD00003", "INS00004", 0.25, "KG", 0.05],
    ["REC00005", "PROD00003", "INS00005", 0.015, "L", 0],
  ];
  for (const [code, prod, ins, cant, unidad, merma] of recs) {
    await sql.query(
      `insert into recetas (id_receta, negocio_id, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [id(code), negocioId, id(prod), id(ins), cant, unidad, merma],
    );
  }
  const opens: [string, string, number, number][] = [
    ["MOV00001", "INS00001", 25, 7.5],
    ["MOV00002", "INS00002", 100, 0.4],
    ["MOV00003", "INS00003", 10, 8],
    ["MOV00004", "INS00004", 25, 1.8],
    ["MOV00005", "INS00005", 12, 2.5],
  ];
  for (const [code, ins, qty, costo] of opens) {
    await sql.query(
      `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
       values ($1,$2,$3,'APERTURA',$4,0,$5,'APERTURA',$6,'Inventario inicial')`,
      [id(code), negocioId, id(ins), qty, costo, userId],
    );
  }
  await sql.query(
    `insert into cajas (id_caja, negocio_id, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado)
     values ($1,$2,'Caja 1',$3,'08:00:00',150,'ABIERTA')`,
    [id("CAJ00001"), negocioId, userId],
  );
  await sql.query(
    `insert into mov_caja (id_movcaja, negocio_id, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
     values ($1,$2,$3,'APERTURA','Fondo inicial',150,0,'EFECTIVO',$3,$4)`,
    [id("MCJ00001"), negocioId, id("CAJ00001"), userId],
  );
  const params: [string, string, string][] = [
    ["Nombre_Empresa", "", "Nombre comercial del negocio"],
    ["Moneda", "USD", "Moneda principal"],
    ["Impuesto_Default", "0.16", "Tasa de impuesto"],
    ["Decimales", "2", "Decimales para importes"],
    ["Stock_Negativo", "NO", "Permitir stock negativo"],
    ["Control_Caja", "SI", "Activar control de caja"],
  ];
  for (const [parametro, valor, descripcion] of params) {
    await sql.query(
      `insert into config (negocio_id, parametro, valor, descripcion) values ($1,$2,$3,$4)`,
      [negocioId, parametro, valor, descripcion],
    );
  }
}

export const createNegocio = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      nombre: z.string().min(2).max(80),
      nombrePersona: z.string().min(2).max(80),
    }),
  )
  .handler(async ({ context, data }) => {
    const existing = await loadTenant(context.userId);
    if (existing) return { id: existing.negocioId };
    const sql = await getSql();
    const id = `n${crypto.randomUUID().replace(/-/g, "").slice(0, 10)}`;
    await sql.query(`insert into negocios (id, nombre) values ($1,$2)`, [id, data.nombre.trim()]);
    await sql.query(
      `insert into miembros (user_id, negocio_id, nombre, rol) values ($1,$2,$3,'ADMIN')`,
      [context.userId, id, data.nombrePersona.trim()],
    );
    await seedNegocio(sql, id, context.userId);
    await sql.query(`update config set valor = $1 where negocio_id = $2 and parametro = 'Nombre_Empresa'`, [
      data.nombre.trim(),
      id,
    ]);
    await sql.query(`update negocios set nombre = $1 where id = $2`, [data.nombre.trim(), id]);
    return { id };
  });

export const listStaff = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN"]);
    return t.sql.query<{ user_id: string; nombre: string; rol: Rol; email: string; activo: boolean }>(
      `select m.user_id, m.nombre, m.rol, m.activo, u.email
       from miembros m join "user" u on u.id = m.user_id
       where m.negocio_id = $1 order by m.rol, m.nombre`,
      [t.negocioId],
    );
  });

export const createStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      nombre: z.string().min(2),
      email: z.string().email(),
      password: z.string().min(8),
      rol: z.enum(["ADMIN", "CAJERO", "INVENTARIO"]),
    }),
  )
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN"]);
    const { getRequestHeaders } = await import("@tanstack/react-start/server");
    const { auth } = await import("@/lib/auth/server");
    const incoming = getRequestHeaders();
    const origin = incoming.get("origin") || "http://127.0.0.1:8080";
    const req = new Request(new URL("/api/auth/sign-up/email", origin).toString(), {
      method: "POST",
      headers: { "content-type": "application/json", origin },
      body: JSON.stringify({
        name: data.nombre,
        email: data.email.trim().toLowerCase(),
        password: data.password,
      }),
    });
    const res = await auth.handler(req);
    const body = (await res.json().catch(() => ({}))) as {
      message?: string;
      user?: { id: string };
    };
    if (!res.ok || !body.user?.id) {
      throw new Error(body.message || "No se pudo crear la cuenta");
    }
    await t.sql.query(
      `insert into miembros (user_id, negocio_id, nombre, rol) values ($1,$2,$3,$4)`,
      [body.user.id, t.negocioId, data.nombre.trim(), data.rol],
    );
    await writeLog(t.sql, t.negocioId, {
      idUsuario: context.userId,
      modulo: "EQUIPO",
      accion: "ALTA",
      referencia: body.user.id,
      descripcion: `${data.nombre} como ${data.rol}`,
    });
    return { id: body.user.id };
  });

export const getSnapshot = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    const { sql, negocioId } = t;
    const [config, categorias, productos, insumos, recetas, proveedores, clientes, empleados, cajaRows, stocks, ventasHoy, serie, low, recent] =
      await Promise.all([
        sql.query<{ parametro: string; valor: string; descripcion: string }>(
          `select parametro, valor, descripcion from config where negocio_id = $1 order by parametro`,
          [negocioId],
        ),
        sql.query<Record<string, unknown>>(`select * from categorias where negocio_id = $1 order by id_categoria`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from productos where negocio_id = $1 order by id_producto`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from insumos where negocio_id = $1 order by id_insumo`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from recetas where negocio_id = $1 order by id_receta`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from proveedores where negocio_id = $1 order by id_proveedor`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from clientes where negocio_id = $1 order by id_cliente`, [negocioId]),
        sql.query<Record<string, unknown>>(`select * from empleados where negocio_id = $1 order by id_empleado`, [negocioId]),
        sql.query<Record<string, unknown>>(
          `select * from cajas where negocio_id = $1 and estado = 'ABIERTA' order by fecha desc limit 1`,
          [negocioId],
        ),
        stockMap(sql, negocioId),
        sql.query<{ n: number; total: string | number }>(
          `select count(*)::int as n, coalesce(sum(total),0) as total from ventas where negocio_id = $1 and fecha = current_date and estado = 'PAGADA'`,
          [negocioId],
        ),
        sql.query<{ fecha: string; total: string | number }>(
          `select fecha::text as fecha, coalesce(sum(total),0) as total from ventas
           where negocio_id = $1 and estado = 'PAGADA' and fecha >= current_date - 13
           group by fecha order by fecha`,
          [negocioId],
        ),
        sql.query<{ id_insumo: string; insumo: string; minimo: string | number }>(
          `select id_insumo, insumo, stock_minimo as minimo from insumos where negocio_id = $1 and activo = true`,
          [negocioId],
        ),
        sql.query<Record<string, unknown>>(
          `select id_venta, fecha, hora, total, estado, forma_pago from ventas where negocio_id = $1 order by fecha desc, hora desc limit 8`,
          [negocioId],
        ),
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
        insumo: String(ins?.insumo ?? ""),
        cantidad: cant,
        unidadConsumo: String(r.unidad_consumo),
        mermaPct: merma,
        cantidadNeta: neta,
        costoUnitario: costoUnit,
        costoTotal: round4(neta * costoUnit),
      };
    });
    const costoPorProducto: Record<string, number> = {};
    for (const line of recetaCostos) {
      costoPorProducto[line.idProducto] = (costoPorProducto[line.idProducto] ?? 0) + line.costoTotal;
    }
    const caja = cajaRows[0];
    let efectivo = 0;
    if (caja) {
      const saldo = await sql.query<{ saldo: string | number }>(
        `select coalesce(sum(entrada)-sum(salida),0) as saldo from mov_caja where negocio_id = $1 and id_caja = $2 and forma_pago in ('EFECTIVO','DIVISAS')`,
        [negocioId, caja.id_caja],
      );
      efectivo = num(saldo[0]?.saldo);
    }
    const lowStock = low
      .map((i) => ({
        idInsumo: String(i.id_insumo),
        insumo: String(i.insumo),
        stock: stocks[String(i.id_insumo)] ?? 0,
        minimo: num(i.minimo),
      }))
      .filter((i) => i.stock <= i.minimo);
    return {
      config: cfg,
      configRows: config,
      usuarios: [
        {
          idUsuario: context.userId,
          usuario: t.nombreMiembro,
          nombre: t.nombreMiembro,
          idEmpleado: null,
          rol: t.rol,
          activo: true,
        },
      ],
      categorias: categorias.map((c) => ({
        idCategoria: String(c.id_categoria),
        categoria: String(c.categoria),
        tipo: String(c.tipo) as "PRODUCTO" | "INSUMO",
        activo: Boolean(c.activo),
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
        costoReceta: round4(costoPorProducto[String(p.id_producto)] ?? 0),
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
        stock: stocks[String(i.id_insumo)] ?? 0,
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
        activo: Boolean(p.activo),
      })),
      clientes: clientes.map((c) => ({
        idCliente: String(c.id_cliente),
        nombre: String(c.nombre),
        documento: String(c.documento ?? ""),
        telefono: String(c.telefono ?? ""),
        email: String(c.email ?? ""),
        tipoCliente: String(c.tipo_cliente),
        activo: Boolean(c.activo),
      })),
      empleados: empleados.map((e) => ({
        idEmpleado: String(e.id_empleado),
        nombre: String(e.nombre),
        apellido: String(e.apellido ?? ""),
        documento: String(e.documento ?? ""),
        cargo: String(e.cargo ?? ""),
        telefono: String(e.telefono ?? ""),
        salario: e.salario == null ? null : num(e.salario),
        activo: Boolean(e.activo),
      })),
      caja: caja
        ? {
            idCaja: String(caja.id_caja),
            fecha: String(caja.fecha ?? ""),
            caja: String(caja.caja),
            montoInicial: num(caja.monto_inicial),
            efectivoEsperado: caja.efectivo_esperado == null ? null : num(caja.efectivo_esperado),
            efectivoContado: caja.efectivo_contado == null ? null : num(caja.efectivo_contado),
            diferencia: caja.diferencia == null ? null : num(caja.diferencia),
            estado: String(caja.estado) as "ABIERTA" | "CERRADA",
          }
        : null,
      efectivoCaja: efectivo,
      kpis: {
        ventasHoy: num(ventasHoy[0]?.n),
        totalHoy: num(ventasHoy[0]?.total),
        ticketPromedio: num(ventasHoy[0]?.n) > 0 ? round2(num(ventasHoy[0]?.total) / num(ventasHoy[0]?.n)) : 0,
        alertasStock: lowStock.length,
      },
      serieVentas: serie.map((r) => ({ fecha: r.fecha, total: num(r.total) })),
      lowStock,
      recentSales: recent.map((r) => ({
        idVenta: String(r.id_venta),
        fecha: String(r.fecha),
        hora: String(r.hora),
        total: num(r.total),
        estado: String(r.estado),
        formaPago: String(r.forma_pago),
      })),
      operador: { nombre: t.nombreMiembro, rol: t.rol },
    };
  });

export const getVentas = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    const rows = await t.sql.query<Record<string, unknown>>(
      `select v.*, c.nombre as cliente from ventas v
       left join clientes c on c.id_cliente = v.id_cliente
       where v.negocio_id = $1
       order by v.fecha desc, v.hora desc limit 200`,
      [t.negocioId],
    );
    return rows.map((r) => ({
      idVenta: String(r.id_venta),
      fecha: String(r.fecha),
      hora: String(r.hora),
      idCaja: r.id_caja ? String(r.id_caja) : null,
      cliente: r.cliente ? String(r.cliente) : "Mostrador",
      subtotal: num(r.subtotal),
      descuento: num(r.descuento),
      impuesto: num(r.impuesto),
      total: num(r.total),
      formaPago: String(r.forma_pago),
      estado: String(r.estado),
    }));
  });

export const getVentaDetalle = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idVenta: z.string() }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    const header = await t.sql.query<Record<string, unknown>>(
      `select * from ventas where id_venta = $1 and negocio_id = $2`,
      [data.idVenta, t.negocioId],
    );
    const lines = await t.sql.query<Record<string, unknown>>(
      `select d.*, p.producto from det_ventas d
       join productos p on p.id_producto = d.id_producto
       where d.id_venta = $1 and d.negocio_id = $2 order by d.id_detalle`,
      [data.idVenta, t.negocioId],
    );
    const cfg = await configMap(t.sql, t.negocioId);
    return {
      negocio: cfg.Nombre_Empresa || t.nombreNegocio,
      moneda: cfg.Moneda || "USD",
      venta: header[0]
        ? {
            idVenta: String(header[0].id_venta),
            fecha: String(header[0].fecha),
            hora: String(header[0].hora),
            subtotal: num(header[0].subtotal),
            impuesto: num(header[0].impuesto),
            total: num(header[0].total),
            formaPago: String(header[0].forma_pago),
            estado: String(header[0].estado),
            cajero: t.nombreMiembro,
          }
        : null,
      lines: lines.map((r) => ({
        idDetalle: String(r.id_detalle),
        producto: String(r.producto),
        cantidad: num(r.cantidad),
        precioUnitario: num(r.precio_unitario),
        descuento: num(r.descuento),
        impuesto: num(r.impuesto),
        subtotal: num(r.subtotal),
        total: num(r.total),
      })),
    };
  });

export const getKardex = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idInsumo: z.string().optional() }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    const rows = data.idInsumo
      ? await t.sql.query<Record<string, unknown>>(
          `select m.*, i.insumo, i.unidad_consumo from mov_inventario m
           join insumos i on i.id_insumo = m.id_insumo
           where m.negocio_id = $1 and m.id_insumo = $2
           order by m.fecha, m.hora, m.id_movimiento`,
          [t.negocioId, data.idInsumo],
        )
      : await t.sql.query<Record<string, unknown>>(
          `select m.*, i.insumo, i.unidad_consumo from mov_inventario m
           join insumos i on i.id_insumo = m.id_insumo
           where m.negocio_id = $1
           order by m.fecha desc, m.hora desc limit 250`,
          [t.negocioId],
        );
    return rows.map((r) => ({
      idMovimiento: String(r.id_movimiento),
      fecha: String(r.fecha),
      hora: String(r.hora),
      idInsumo: String(r.id_insumo),
      insumo: String(r.insumo),
      tipo: String(r.tipo_movimiento),
      entrada: num(r.entrada),
      salida: num(r.salida),
      saldo: 0,
      costoUnitario: num(r.costo_unitario),
      referencia: r.referencia ? String(r.referencia) : "",
      observacion: String(r.observacion ?? ""),
      unidad: String(r.unidad_consumo),
    }));
  });

export const getCompras = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    const rows = await t.sql.query<Record<string, unknown>>(
      `select c.*, p.nombre_comercial from compras c
       join proveedores p on p.id_proveedor = c.id_proveedor
       where c.negocio_id = $1 order by c.fecha desc limit 200`,
      [t.negocioId],
    );
    return rows.map((r) => ({
      idCompra: String(r.id_compra),
      fecha: String(r.fecha),
      proveedor: String(r.nombre_comercial),
      documento: String(r.documento ?? ""),
      subtotal: num(r.subtotal),
      impuesto: num(r.impuesto),
      total: num(r.total),
      formaPago: String(r.forma_pago),
      estado: String(r.estado),
    }));
  });

export const getCajaDetalle = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    const cajas = await t.sql.query<Record<string, unknown>>(
      `select * from cajas where negocio_id = $1 order by fecha desc limit 30`,
      [t.negocioId],
    );
    const movs = await t.sql.query<Record<string, unknown>>(
      `select * from mov_caja where negocio_id = $1 order by fecha desc, hora desc limit 200`,
      [t.negocioId],
    );
    const gastos = await t.sql.query<Record<string, unknown>>(
      `select * from gastos where negocio_id = $1 order by fecha desc limit 100`,
      [t.negocioId],
    );
    return {
      cajas: cajas.map((r) => ({
        idCaja: String(r.id_caja),
        fecha: String(r.fecha),
        caja: String(r.caja),
        montoInicial: num(r.monto_inicial),
        efectivoEsperado: r.efectivo_esperado == null ? null : num(r.efectivo_esperado),
        efectivoContado: r.efectivo_contado == null ? null : num(r.efectivo_contado),
        diferencia: r.diferencia == null ? null : num(r.diferencia),
        estado: String(r.estado) as "ABIERTA" | "CERRADA",
      })),
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
        referencia: r.referencia ? String(r.referencia) : "",
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
        estado: String(r.estado),
      })),
    };
  });

export const getInventarioExtra = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const t = await tenant(context.userId);
    const conteos = await t.sql.query<Record<string, unknown>>(
      `select c.*, i.insumo from conteos c join insumos i on i.id_insumo = c.id_insumo
       where c.negocio_id = $1 order by c.fecha desc limit 100`,
      [t.negocioId],
    );
    const mermas = await t.sql.query<Record<string, unknown>>(
      `select m.*, i.insumo from mermas m join insumos i on i.id_insumo = m.id_insumo
       where m.negocio_id = $1 order by m.fecha desc limit 100`,
      [t.negocioId],
    );
    const log = await t.sql.query<Record<string, unknown>>(
      `select * from log where negocio_id = $1 order by fecha desc, hora desc limit 80`,
      [t.negocioId],
    );
    return {
      conteos: conteos.map((r) => ({
        idConteo: String(r.id_conteo),
        fecha: String(r.fecha),
        insumo: String(r.insumo),
        stockSistema: num(r.stock_sistema),
        stockContado: num(r.stock_contado),
        diferencia: num(r.diferencia),
        observacion: String(r.observacion ?? ""),
      })),
      mermas: mermas.map((r) => ({
        idMerma: String(r.id_merma),
        fecha: String(r.fecha),
        insumo: String(r.insumo),
        cantidad: num(r.cantidad),
        motivo: String(r.motivo),
        costoUnitario: num(r.costo_unitario),
        costoTotal: num(r.costo_total),
      })),
      log: log.map((r) => ({
        idLog: String(r.id_log),
        fecha: String(r.fecha),
        hora: String(r.hora),
        idUsuario: r.id_usuario ? String(r.id_usuario) : "",
        modulo: String(r.modulo),
        accion: String(r.accion),
        referencia: r.referencia ? String(r.referencia) : "",
        descripcion: String(r.descripcion ?? ""),
      })),
    };
  });

export const openCaja = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, caja: z.string().default("Caja 1"), montoInicial: z.number().min(0) }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "CAJERO"]);
    const open = await t.sql.query(
      `select id_caja from cajas where negocio_id = $1 and estado = 'ABIERTA' limit 1`,
      [t.negocioId],
    );
    if (open[0]) throw new Error("Ya hay una caja abierta.");
    const id = await nextId(t.sql, "CAJ", t.negocioId);
    await t.sql.query(
      `insert into cajas (id_caja, negocio_id, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado)
       values ($1,$2,$3,$4,to_char(now(),'HH24:MI:SS'),$5,'ABIERTA')`,
      [id, t.negocioId, data.caja, context.userId, data.montoInicial],
    );
    const mov = await nextId(t.sql, "MCJ", t.negocioId);
    await t.sql.query(
      `insert into mov_caja (id_movcaja, negocio_id, id_caja, tipo, concepto, entrada, forma_pago, referencia, id_usuario)
       values ($1,$2,$3,'APERTURA','Fondo inicial',$4,'EFECTIVO',$3,$5)`,
      [mov, t.negocioId, id, data.montoInicial, context.userId],
    );
    return { idCaja: id };
  });

export const closeCaja = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idCaja: z.string(), efectivoContado: z.number().min(0) }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "CAJERO"]);
    const rows = await t.sql.query<Record<string, unknown>>(
      `select * from cajas where id_caja = $1 and negocio_id = $2`,
      [data.idCaja, t.negocioId],
    );
    if (!rows[0] || String(rows[0].estado) !== "ABIERTA") throw new Error("La caja no está abierta.");
    const saldo = await t.sql.query<{ saldo: string | number }>(
      `select coalesce(sum(entrada)-sum(salida),0) as saldo from mov_caja where id_caja = $1 and forma_pago in ('EFECTIVO','DIVISAS')`,
      [data.idCaja],
    );
    const esperado = num(saldo[0]?.saldo);
    const diferencia = round2(data.efectivoContado - esperado);
    await t.sql.query(
      `update cajas set id_usuario_cierre=$1, hora_cierre=to_char(now(),'HH24:MI:SS'),
        efectivo_esperado=$2, efectivo_contado=$3, diferencia=$4, estado='CERRADA'
       where id_caja=$5 and negocio_id=$6`,
      [context.userId, esperado, data.efectivoContado, diferencia, data.idCaja, t.negocioId],
    );
    return { esperado, diferencia };
  });

export const registrarVenta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      idUsuario: optUser,
      idEmpleado: z.string().optional(),
      idCliente: z.string().optional(),
      formaPago: z.enum(FORMA_PAGO_IDS),
      items: z.array(z.object({ idProducto: z.string(), cantidad: z.number().positive(), descuento: z.number().min(0).default(0) })).min(1),
    }),
  )
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "CAJERO"]);
    const cfg = await configMap(t.sql, t.negocioId);
    const cajaRows = await t.sql.query<Record<string, unknown>>(
      `select * from cajas where negocio_id = $1 and estado = 'ABIERTA' limit 1`,
      [t.negocioId],
    );
    const caja = cajaRows[0];
    if (cfg.Control_Caja === "SI" && !caja) throw new Error("No hay caja abierta.");
    const products = await t.sql.query<Record<string, unknown>>(
      `select * from productos where negocio_id = $1 and activo = true`,
      [t.negocioId],
    );
    const recetas = await t.sql.query<Record<string, unknown>>(
      `select * from recetas where negocio_id = $1`,
      [t.negocioId],
    );
    const insumos = await t.sql.query<Record<string, unknown>>(
      `select * from insumos where negocio_id = $1`,
      [t.negocioId],
    );
    const stocks = await stockMap(t.sql, t.negocioId);
    const needed: Record<string, number> = {};
    const lines = data.items.map((item) => {
      const p = products.find((x) => String(x.id_producto) === item.idProducto);
      if (!p) throw new Error("Producto no existe en este negocio.");
      const precio = num(p.precio_venta);
      const tasa = num(p.impuesto);
      const sub = round2(item.cantidad * precio - item.descuento);
      const imp = round2(sub * tasa);
      const tot = round2(sub + imp);
      for (const r of recetas.filter((r) => String(r.id_producto) === item.idProducto)) {
        const idInsumo = String(r.id_insumo);
        needed[idInsumo] = (needed[idInsumo] ?? 0) + cantidadNeta(num(r.cantidad), num(r.merma_pct)) * item.cantidad;
      }
      return { item, producto: String(p.producto), precio, sub, imp, tot };
    });
    if (cfg.Stock_Negativo !== "SI") {
      const faltantes: string[] = [];
      for (const [idInsumo, qtyNeed] of Object.entries(needed)) {
        const have = stocks[idInsumo] ?? 0;
        if (have + 1e-9 < qtyNeed) {
          const ins = insumos.find((i) => String(i.id_insumo) === idInsumo);
          faltantes.push(`${String(ins?.insumo ?? idInsumo)} (hay ${round4(have)}, se necesitan ${round4(qtyNeed)})`);
        }
      }
      if (faltantes.length) throw new Error(`Stock insuficiente: ${faltantes.join("; ")}`);
    }
    const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
    const headerImp = round2(lines.reduce((a, l) => a + l.imp, 0));
    const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
    const idVenta = await nextId(t.sql, "VEN", t.negocioId);
    const cliente = data.idCliente ?? (await t.sql.query<{ id_cliente: string }>(
      `select id_cliente from clientes where negocio_id = $1 order by id_cliente limit 1`,
      [t.negocioId],
    ))[0]?.id_cliente;
    await t.sql.query(
      `insert into ventas (id_venta, negocio_id, id_caja, id_cliente, id_usuario, subtotal, descuento, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,0,$7,$8,$9,'PAGADA')`,
      [idVenta, t.negocioId, caja ? String(caja.id_caja) : null, cliente ?? null, context.userId, headerSub, headerImp, headerTot, data.formaPago],
    );
    for (const line of lines) {
      const idDet = await nextId(t.sql, "DTV", t.negocioId);
      await t.sql.query(
        `insert into det_ventas (id_detalle, negocio_id, id_venta, id_producto, cantidad, precio_unitario, descuento, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)`,
        [idDet, t.negocioId, idVenta, line.item.idProducto, line.item.cantidad, line.precio, line.item.descuento, line.imp, line.sub, line.tot],
      );
    }
    for (const [idInsumo, qtyNeed] of Object.entries(needed)) {
      const ins = insumos.find((i) => String(i.id_insumo) === idInsumo);
      const idMov = await nextId(t.sql, "MOV", t.negocioId);
      await t.sql.query(
        `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,$3,'VENTA',0,$4,$5,$6,$7,'Explosion de receta')`,
        [idMov, t.negocioId, idInsumo, round4(qtyNeed), num(ins?.costo_unitario), idVenta, context.userId],
      );
    }
    if (caja) {
      const idMovCaja = await nextId(t.sql, "MCJ", t.negocioId);
      await t.sql.query(
        `insert into mov_caja (id_movcaja, negocio_id, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,$3,'VENTA',$4,$5,0,$6,$7,$8)`,
        [idMovCaja, t.negocioId, String(caja.id_caja), `Venta ${idVenta.split("-").pop()}`, mueveCaja(data.formaPago) ? headerTot : 0, data.formaPago, idVenta, context.userId],
      );
    }
    await writeLog(t.sql, t.negocioId, {
      idUsuario: context.userId,
      modulo: "VENTAS",
      accion: "ALTA",
      referencia: idVenta,
      descripcion: `Venta por ${headerTot}`,
    });
    return {
      idVenta,
      total: headerTot,
      subtotal: headerSub,
      impuesto: headerImp,
      formaPago: data.formaPago,
      negocio: cfg.Nombre_Empresa || t.nombreNegocio,
      cajero: t.nombreMiembro,
      lines: lines.map((l) => ({
        producto: l.producto,
        cantidad: l.item.cantidad,
        precio: l.precio,
        total: l.tot,
      })),
    };
  });

export const anularVenta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idVenta: z.string() }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN"]);
    const ventas = await t.sql.query<Record<string, unknown>>(
      `select * from ventas where id_venta=$1 and negocio_id=$2`,
      [data.idVenta, t.negocioId],
    );
    const venta = ventas[0];
    if (!venta) throw new Error("Venta no encontrada.");
    if (String(venta.estado) === "ANULADA") throw new Error("La venta ya está anulada.");
    await t.sql.query(`update ventas set estado='ANULADA' where id_venta=$1 and negocio_id=$2`, [data.idVenta, t.negocioId]);
    const orig = await t.sql.query<Record<string, unknown>>(
      `select * from mov_inventario where negocio_id=$1 and referencia=$2 and tipo_movimiento='VENTA'`,
      [t.negocioId, data.idVenta],
    );
    for (const m of orig) {
      const idMov = await nextId(t.sql, "MOV", t.negocioId);
      await t.sql.query(
        `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,$3,'ANULACION',$4,0,$5,$6,$7,'Reverso por anulación')`,
        [idMov, t.negocioId, m.id_insumo, m.salida, m.costo_unitario, data.idVenta, context.userId],
      );
    }
    if (venta.id_caja && mueveCaja(String(venta.forma_pago))) {
      const idMovCaja = await nextId(t.sql, "MCJ", t.negocioId);
      await t.sql.query(
        `insert into mov_caja (id_movcaja, negocio_id, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,$3,'ANULACION',$4,0,$5,$6,$7,$8)`,
        [idMovCaja, t.negocioId, venta.id_caja, `Anulación ${data.idVenta.split("-").pop()}`, num(venta.total), venta.forma_pago, data.idVenta, context.userId],
      );
    }
    return { ok: true };
  });

export const registrarCompra = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      idUsuario: optUser,
      idProveedor: z.string(),
      documento: z.string().default(""),
      formaPago: z.string().default("CONTADO"),
      items: z.array(z.object({ idInsumo: z.string(), cantidad: z.number().positive(), costoUnitario: z.number().min(0), impuesto: z.number().min(0).default(0) })).min(1),
    }),
  )
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const stocks = await stockMap(t.sql, t.negocioId);
    const insumos = await t.sql.query<Record<string, unknown>>(`select * from insumos where negocio_id=$1`, [t.negocioId]);
    const idCompra = await nextId(t.sql, "COM", t.negocioId);
    const lines = data.items.map((item) => {
      const sub = round2(item.cantidad * item.costoUnitario);
      return { ...item, sub, tot: round2(sub + item.impuesto) };
    });
    const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
    const headerImp = round2(lines.reduce((a, l) => a + l.impuesto, 0));
    const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
    await t.sql.query(
      `insert into compras (id_compra, negocio_id, id_proveedor, documento, id_usuario, subtotal, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'RECIBIDA')`,
      [idCompra, t.negocioId, data.idProveedor, data.documento, context.userId, headerSub, headerImp, headerTot, data.formaPago],
    );
    for (const line of lines) {
      const idDet = await nextId(t.sql, "DTC", t.negocioId);
      await t.sql.query(
        `insert into det_compras (id_detalle, negocio_id, id_compra, id_insumo, cantidad, costo_unitario, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [idDet, t.negocioId, idCompra, line.idInsumo, line.cantidad, line.costoUnitario, line.impuesto, line.sub, line.tot],
      );
      const have = stocks[line.idInsumo] ?? 0;
      const ins = insumos.find((i) => String(i.id_insumo) === line.idInsumo);
      const oldCost = num(ins?.costo_unitario);
      const newCost = have + line.cantidad > 0 ? round4((have * oldCost + line.cantidad * line.costoUnitario) / (have + line.cantidad)) : line.costoUnitario;
      await t.sql.query(`update insumos set costo_unitario=$1 where id_insumo=$2 and negocio_id=$3`, [newCost, line.idInsumo, t.negocioId]);
      const idMov = await nextId(t.sql, "MOV", t.negocioId);
      await t.sql.query(
        `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,$3,'COMPRA',$4,0,$5,$6,$7,'Ingreso por compra')`,
        [idMov, t.negocioId, line.idInsumo, line.cantidad, line.costoUnitario, idCompra, context.userId],
      );
    }
    return { idCompra, total: headerTot };
  });

export const registrarMerma = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idInsumo: z.string(), cantidad: z.number().positive(), motivo: z.string().min(1) }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const cfg = await configMap(t.sql, t.negocioId);
    const stocks = await stockMap(t.sql, t.negocioId);
    const ins = (await t.sql.query<Record<string, unknown>>(`select * from insumos where id_insumo=$1 and negocio_id=$2`, [data.idInsumo, t.negocioId]))[0];
    if (!ins) throw new Error("Insumo no encontrado.");
    if (cfg.Stock_Negativo !== "SI" && (stocks[data.idInsumo] ?? 0) < data.cantidad) throw new Error("Stock insuficiente para la merma.");
    const costo = num(ins.costo_unitario);
    const id = await nextId(t.sql, "MRM", t.negocioId);
    await t.sql.query(
      `insert into mermas (id_merma, negocio_id, id_insumo, cantidad, motivo, costo_unitario, costo_total, id_usuario) values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, t.negocioId, data.idInsumo, data.cantidad, data.motivo, costo, round2(data.cantidad * costo), context.userId],
    );
    const idMov = await nextId(t.sql, "MOV", t.negocioId);
    await t.sql.query(
      `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, salida, costo_unitario, referencia, id_usuario, observacion)
       values ($1,$2,$3,'MERMA',$4,$5,$6,$7,$8)`,
      [idMov, t.negocioId, data.idInsumo, data.cantidad, costo, id, context.userId, data.motivo],
    );
    return { id };
  });

export const registrarConteo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idInsumo: z.string(), stockContado: z.number().min(0), observacion: z.string().default("") }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const stocks = await stockMap(t.sql, t.negocioId);
    const ins = (await t.sql.query<Record<string, unknown>>(`select * from insumos where id_insumo=$1 and negocio_id=$2`, [data.idInsumo, t.negocioId]))[0];
    if (!ins) throw new Error("Insumo no encontrado.");
    const sistema = stocks[data.idInsumo] ?? 0;
    const diff = round4(data.stockContado - sistema);
    const id = await nextId(t.sql, "CNT", t.negocioId);
    await t.sql.query(
      `insert into conteos (id_conteo, negocio_id, id_insumo, stock_sistema, stock_contado, diferencia, id_usuario, observacion)
       values ($1,$2,$3,$4,$5,$6,$7,$8)`,
      [id, t.negocioId, data.idInsumo, sistema, data.stockContado, diff, context.userId, data.observacion],
    );
    if (diff !== 0) {
      const idMov = await nextId(t.sql, "MOV", t.negocioId);
      await t.sql.query(
        `insert into mov_inventario (id_movimiento, negocio_id, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,$3,'CONTEO',$4,$5,$6,$7,$8,$9)`,
        [idMov, t.negocioId, data.idInsumo, diff > 0 ? diff : 0, diff < 0 ? -diff : 0, num(ins.costo_unitario), id, context.userId, data.observacion || "Ajuste por conteo"],
      );
    }
    return { id, diferencia: diff };
  });

export const registrarGasto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    z.object({
      idUsuario: optUser,
      categoria: z.string().min(1),
      descripcion: z.string().min(1),
      proveedor: z.string().default(""),
      monto: z.number().positive(),
      formaPago: z.enum(["EFECTIVO", "TARJETA"]),
    }),
  )
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "CAJERO", "INVENTARIO"]);
    const caja = (await t.sql.query<Record<string, unknown>>(`select * from cajas where negocio_id=$1 and estado='ABIERTA' limit 1`, [t.negocioId]))[0];
    if (data.formaPago === "EFECTIVO" && !caja) throw new Error("No hay caja abierta para un gasto en efectivo.");
    const id = await nextId(t.sql, "GST", t.negocioId);
    await t.sql.query(
      `insert into gastos (id_gasto, negocio_id, categoria, descripcion, proveedor, monto, forma_pago, id_caja, id_usuario)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
      [id, t.negocioId, data.categoria, data.descripcion, data.proveedor, data.monto, data.formaPago, caja ? String(caja.id_caja) : null, context.userId],
    );
    if (caja && data.formaPago === "EFECTIVO") {
      const idMov = await nextId(t.sql, "MCJ", t.negocioId);
      await t.sql.query(
        `insert into mov_caja (id_movcaja, negocio_id, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,$3,'GASTO',$4,0,$5,'EFECTIVO',$6,$7)`,
        [idMov, t.negocioId, String(caja.id_caja), data.descripcion, data.monto, id, context.userId],
      );
    }
    return { id };
  });

export const upsertProducto = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idProducto: z.string().optional(), sku: z.string().min(1), producto: z.string().min(1),
    idCategoria: z.string(), unidadVenta: z.string().default("UND"), precioVenta: z.number().min(0), impuesto: z.number().min(0), activo: z.boolean().default(true),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const id = data.idProducto || (await nextId(t.sql, "PROD", t.negocioId));
    await t.sql.query(
      `insert into productos (id_producto, negocio_id, sku, producto, id_categoria, unidad_venta, precio_venta, impuesto, activo)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       on conflict (id_producto) do update set sku=excluded.sku, producto=excluded.producto, id_categoria=excluded.id_categoria,
         unidad_venta=excluded.unidad_venta, precio_venta=excluded.precio_venta, impuesto=excluded.impuesto, activo=excluded.activo`,
      [id, t.negocioId, data.sku, data.producto, data.idCategoria, data.unidadVenta, data.precioVenta, data.impuesto, data.activo],
    );
    return { id };
  });

export const upsertInsumo = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idInsumo: z.string().optional(), sku: z.string().min(1), insumo: z.string().min(1), idCategoria: z.string(),
    unidadCompra: z.string().default("UND"), unidadConsumo: z.string().default("UND"), factorConversion: z.number().positive().default(1),
    costoUnitario: z.number().min(0), stockMinimo: z.number().min(0).default(0), stockMaximo: z.number().min(0).default(0),
    idProveedor: z.string().optional().nullable(), activo: z.boolean().default(true),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const id = data.idInsumo || (await nextId(t.sql, "INS", t.negocioId));
    await t.sql.query(
      `insert into insumos (id_insumo, negocio_id, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, activo, id_proveedor)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       on conflict (id_insumo) do update set sku=excluded.sku, insumo=excluded.insumo, id_categoria=excluded.id_categoria,
         unidad_compra=excluded.unidad_compra, unidad_consumo=excluded.unidad_consumo, factor_conversion=excluded.factor_conversion,
         costo_unitario=excluded.costo_unitario, stock_minimo=excluded.stock_minimo, stock_maximo=excluded.stock_maximo,
         activo=excluded.activo, id_proveedor=excluded.id_proveedor`,
      [id, t.negocioId, data.sku, data.insumo, data.idCategoria, data.unidadCompra, data.unidadConsumo, data.factorConversion, data.costoUnitario, data.stockMinimo, data.stockMaximo, data.activo, data.idProveedor || null],
    );
    return { id };
  });

export const upsertReceta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idReceta: z.string().optional(), idProducto: z.string(), idInsumo: z.string(),
    cantidad: z.number().positive(), unidadConsumo: z.string(), mermaPct: z.number().min(0).default(0),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const id = data.idReceta || (await nextId(t.sql, "REC", t.negocioId));
    if (data.idReceta) {
      await t.sql.query(
        `update recetas set id_producto=$1, id_insumo=$2, cantidad=$3, unidad_consumo=$4, merma_pct=$5 where id_receta=$6 and negocio_id=$7`,
        [data.idProducto, data.idInsumo, data.cantidad, data.unidadConsumo, data.mermaPct, id, t.negocioId],
      );
    } else {
      await t.sql.query(
        `insert into recetas (id_receta, negocio_id, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct) values ($1,$2,$3,$4,$5,$6,$7)`,
        [id, t.negocioId, data.idProducto, data.idInsumo, data.cantidad, data.unidadConsumo, data.mermaPct],
      );
    }
    return { id };
  });

export const deleteReceta = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idReceta: z.string() }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    await t.sql.query(`delete from recetas where id_receta=$1 and negocio_id=$2`, [data.idReceta, t.negocioId]);
    return { ok: true };
  });

export const upsertCategoria = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, idCategoria: z.string().optional(), categoria: z.string().min(1), tipo: z.enum(["PRODUCTO", "INSUMO"]), activo: z.boolean().default(true) }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const id = data.idCategoria || (await nextId(t.sql, "CAT", t.negocioId));
    await t.sql.query(
      `insert into categorias (id_categoria, negocio_id, categoria, tipo, activo) values ($1,$2,$3,$4,$5)
       on conflict (id_categoria) do update set categoria=excluded.categoria, tipo=excluded.tipo, activo=excluded.activo`,
      [id, t.negocioId, data.categoria, data.tipo, data.activo],
    );
    return { id };
  });

export const upsertProveedor = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idProveedor: z.string().optional(), razonSocial: z.string().min(1), nombreComercial: z.string().min(1),
    documento: z.string().default(""), telefono: z.string().default(""), condicionPago: z.string().default("CONTADO"), activo: z.boolean().default(true),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "INVENTARIO"]);
    const id = data.idProveedor || (await nextId(t.sql, "PROV", t.negocioId));
    await t.sql.query(
      `insert into proveedores (id_proveedor, negocio_id, razon_social, nombre_comercial, documento, telefono, condicion_pago, activo)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (id_proveedor) do update set razon_social=excluded.razon_social, nombre_comercial=excluded.nombre_comercial,
         documento=excluded.documento, telefono=excluded.telefono, condicion_pago=excluded.condicion_pago, activo=excluded.activo`,
      [id, t.negocioId, data.razonSocial, data.nombreComercial, data.documento, data.telefono, data.condicionPago, data.activo],
    );
    return { id };
  });

export const upsertCliente = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idCliente: z.string().optional(), nombre: z.string().min(1), documento: z.string().default(""),
    telefono: z.string().default(""), tipoCliente: z.string().default("MOSTRADOR"), activo: z.boolean().default(true),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN", "CAJERO"]);
    const id = data.idCliente || (await nextId(t.sql, "CLI", t.negocioId));
    await t.sql.query(
      `insert into clientes (id_cliente, negocio_id, nombre, documento, telefono, tipo_cliente, activo)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id_cliente) do update set nombre=excluded.nombre, documento=excluded.documento, telefono=excluded.telefono,
         tipo_cliente=excluded.tipo_cliente, activo=excluded.activo`,
      [id, t.negocioId, data.nombre, data.documento, data.telefono, data.tipoCliente, data.activo],
    );
    return { id };
  });

export const upsertEmpleado = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({
    idUsuario: optUser, idEmpleado: z.string().optional(), nombre: z.string().min(1), apellido: z.string().default(""),
    cargo: z.string().default(""), telefono: z.string().default(""), activo: z.boolean().default(true),
  }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN"]);
    const id = data.idEmpleado || (await nextId(t.sql, "EMP", t.negocioId));
    await t.sql.query(
      `insert into empleados (id_empleado, negocio_id, nombre, apellido, cargo, telefono, activo)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id_empleado) do update set nombre=excluded.nombre, apellido=excluded.apellido, cargo=excluded.cargo,
         telefono=excluded.telefono, activo=excluded.activo`,
      [id, t.negocioId, data.nombre, data.apellido, data.cargo, data.telefono, data.activo],
    );
    return { id };
  });

export const updateConfig = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(z.object({ idUsuario: optUser, parametro: z.string(), valor: z.string() }))
  .handler(async ({ context, data }) => {
    const t = await tenant(context.userId);
    allow(t.rol, ["ADMIN"]);
    await t.sql.query(`update config set valor=$1 where negocio_id=$2 and parametro=$3`, [data.valor, t.negocioId, data.parametro]);
    if (data.parametro === "Nombre_Empresa") {
      await t.sql.query(`update negocios set nombre=$1 where id=$2`, [data.valor, t.negocioId]);
    }
    return { ok: true };
  });
