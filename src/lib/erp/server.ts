import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { cantidadNeta, num, round2, round4 } from "./format";

type Sql = Awaited<ReturnType<typeof getSql>>;

const operatorId = z.string().min(1);

const ID_SPECS: Record<string, { table: string; column: string; pad: number }> =
  {
    PROD: { table: "productos", column: "id_producto", pad: 5 },
    INS: { table: "insumos", column: "id_insumo", pad: 5 },
    REC: { table: "recetas", column: "id_receta", pad: 5 },
    PROV: { table: "proveedores", column: "id_proveedor", pad: 5 },
    CLI: { table: "clientes", column: "id_cliente", pad: 5 },
    EMP: { table: "empleados", column: "id_empleado", pad: 5 },
    USR: { table: "usuarios", column: "id_usuario", pad: 5 },
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

async function nextId(sql: Sql, prefix: keyof typeof ID_SPECS): Promise<string> {
  const spec = ID_SPECS[prefix];
  const rows = await sql.query<{ id: string }>(
    `select ${spec.column} as id from ${spec.table} where ${spec.column} like $1 order by ${spec.column} desc limit 1`,
    [`${prefix}%`],
  );
  const last = rows[0]?.id ?? "";
  const n = last ? Number.parseInt(last.slice(prefix.length), 10) + 1 : 1;
  return `${prefix}${String(Number.isFinite(n) ? n : 1).padStart(spec.pad, "0")}`;
}

async function writeLog(
  sql: Sql,
  input: {
    idUsuario?: string | null;
    modulo: string;
    accion: string;
    referencia?: string;
    descripcion: string;
  },
) {
  const id = await nextId(sql, "LOG");
  await sql.query(
    `insert into log (id_log, id_usuario, modulo, accion, referencia, descripcion)
     values ($1,$2,$3,$4,$5,$6)`,
    [
      id,
      input.idUsuario ?? null,
      input.modulo,
      input.accion,
      input.referencia ?? null,
      input.descripcion,
    ],
  );
}

async function configMap(sql: Sql): Promise<Record<string, string>> {
  const rows = await sql<{ parametro: string; valor: string; descripcion: string }>`
    select parametro, valor, descripcion from config order by parametro
  `;
  return Object.fromEntries(rows.map((r) => [r.parametro, r.valor]));
}

async function stockMap(sql: Sql): Promise<Record<string, number>> {
  const rows = await sql<{ id_insumo: string; stock: string | number }>`
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

async function openCajaRow(sql: Sql) {
  const rows = await sql<Record<string, unknown>>`
    select * from cajas where estado = 'ABIERTA' order by fecha desc, id_caja desc limit 1
  `;
  return rows[0] ?? null;
}

async function efectivoCaja(sql: Sql, idCaja: string): Promise<number> {
  const rows = await sql<{ saldo: string | number }>`
    select coalesce(sum(entrada) - sum(salida), 0) as saldo
    from mov_caja
    where id_caja = ${idCaja} and forma_pago = 'EFECTIVO'
  `;
  return num(rows[0]?.saldo);
}

function mapCaja(row: Record<string, unknown> | null) {
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
    estado: String(row.estado) as "ABIERTA" | "CERRADA",
  };
}

export const getSnapshot = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const [
    config,
    usuarios,
    categorias,
    productos,
    insumos,
    recetas,
    proveedores,
    clientes,
    empleados,
    caja,
    stocks,
    ventasHoy,
    serie,
    top,
    low,
    recent,
  ] = await Promise.all([
    sql<{ parametro: string; valor: string; descripcion: string }>`
      select parametro, valor, descripcion from config order by parametro
    `,
    sql<Record<string, unknown>>`select * from usuarios order by id_usuario`,
    sql<Record<string, unknown>>`select * from categorias order by id_categoria`,
    sql<Record<string, unknown>>`select * from productos order by id_producto`,
    sql<Record<string, unknown>>`select * from insumos order by id_insumo`,
    sql<Record<string, unknown>>`select * from recetas order by id_receta`,
    sql<Record<string, unknown>>`select * from proveedores order by id_proveedor`,
    sql<Record<string, unknown>>`select * from clientes order by id_cliente`,
    sql<Record<string, unknown>>`select * from empleados order by id_empleado`,
    openCajaRow(sql),
    stockMap(sql),
    sql<{ n: number; total: string | number }>`
      select count(*)::int as n, coalesce(sum(total),0) as total
      from ventas where fecha = current_date and estado = 'PAGADA'
    `,
    sql<{ fecha: string; total: string | number }>`
      select fecha::text as fecha, coalesce(sum(total),0) as total
      from ventas
      where estado = 'PAGADA' and fecha >= current_date - 13
      group by fecha
      order by fecha
    `,
    sql<{ producto: string; cantidad: string | number; total: string | number }>`
      select p.producto, coalesce(sum(d.cantidad),0) as cantidad, coalesce(sum(d.total),0) as total
      from det_ventas d
      join ventas v on v.id_venta = d.id_venta
      join productos p on p.id_producto = d.id_producto
      where v.estado = 'PAGADA' and v.fecha = current_date
      group by p.producto
      order by cantidad desc
      limit 5
    `,
    sql<{ id_insumo: string; insumo: string; minimo: string | number }>`
      select id_insumo, insumo, stock_minimo as minimo from insumos where activo = true
    `,
    sql<Record<string, unknown>>`
      select id_venta, fecha, hora, total, estado, forma_pago
      from ventas order by fecha desc, hora desc, id_venta desc limit 8
    `,
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
      costoTotal: round4(neta * costoUnit),
    };
  });

  const costoPorProducto: Record<string, number> = {};
  for (const line of recetaCostos) {
    costoPorProducto[line.idProducto] =
      (costoPorProducto[line.idProducto] ?? 0) + line.costoTotal;
  }

  const lowStock = low
    .map((i) => {
      const stock = stocks[String(i.id_insumo)] ?? 0;
      return {
        idInsumo: String(i.id_insumo),
        insumo: String(i.insumo),
        stock,
        minimo: num(i.minimo),
      };
    })
    .filter((i) => i.stock <= i.minimo);

  const efectivo = caja ? await efectivoCaja(sql, String(caja.id_caja)) : 0;

  return {
    config: cfg,
    configRows: config,
    usuarios: usuarios.map((u) => ({
      idUsuario: String(u.id_usuario),
      usuario: String(u.usuario),
      nombre: String(u.nombre),
      idEmpleado: u.id_empleado ? String(u.id_empleado) : null,
      rol: String(u.rol) as "ADMIN" | "CAJERO" | "INVENTARIO",
      activo: Boolean(u.activo),
    })),
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
    caja: mapCaja(caja),
    efectivoCaja: efectivo,
    kpis: {
      ventasHoy: num(ventasHoy[0]?.n),
      totalHoy: num(ventasHoy[0]?.total),
      ticketPromedio:
        num(ventasHoy[0]?.n) > 0
          ? round2(num(ventasHoy[0]?.total) / num(ventasHoy[0]?.n))
          : 0,
      alertasStock: lowStock.length,
    },
    serieVentas: serie.map((r) => ({ fecha: r.fecha, total: num(r.total) })),
    topHoy: top.map((r) => ({
      producto: r.producto,
      cantidad: num(r.cantidad),
      total: num(r.total),
    })),
    lowStock,
    recentSales: recent.map((r) => ({
      idVenta: String(r.id_venta),
      fecha: String(r.fecha),
      hora: String(r.hora),
      total: num(r.total),
      estado: String(r.estado),
      formaPago: String(r.forma_pago),
    })),
  };
});

export const getVentas = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select v.*, c.nombre as cliente
    from ventas v
    left join clientes c on c.id_cliente = v.id_cliente
    order by v.fecha desc, v.hora desc, v.id_venta desc
    limit 200
  `;
  return rows.map((r) => ({
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
    estado: String(r.estado),
  }));
});

export const getVentaDetalle = createServerFn({ method: "POST" })
  .validator(z.object({ idVenta: z.string() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const lines = await sql<Record<string, unknown>>`
      select d.*, p.producto
      from det_ventas d
      join productos p on p.id_producto = d.id_producto
      where d.id_venta = ${data.idVenta}
      order by d.id_detalle
    `;
    return lines.map((r) => ({
      idDetalle: String(r.id_detalle),
      producto: String(r.producto),
      cantidad: num(r.cantidad),
      precioUnitario: num(r.precio_unitario),
      descuento: num(r.descuento),
      impuesto: num(r.impuesto),
      subtotal: num(r.subtotal),
      total: num(r.total),
    }));
  });

export const getKardex = createServerFn({ method: "POST" })
  .validator(z.object({ idInsumo: z.string().optional() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = data.idInsumo
      ? await sql.query<Record<string, unknown>>(
          `select m.*, i.insumo, i.unidad_consumo
           from mov_inventario m join insumos i on i.id_insumo = m.id_insumo
           where m.id_insumo = $1
           order by m.fecha, m.hora, m.id_movimiento`,
          [data.idInsumo],
        )
      : await sql<Record<string, unknown>>`
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
        unidad: String(r.unidad_consumo),
      };
    });
  });

export const getCompras = createServerFn({ method: "GET" }).handler(async () => {
  const sql = await getSql();
  const rows = await sql<Record<string, unknown>>`
    select c.*, p.nombre_comercial
    from compras c
    join proveedores p on p.id_proveedor = c.id_proveedor
    order by c.fecha desc, c.id_compra desc
    limit 200
  `;
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

export const getCajaDetalle = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    const cajas = await sql<Record<string, unknown>>`
      select * from cajas order by fecha desc, id_caja desc limit 30
    `;
    const movs = await sql<Record<string, unknown>>`
      select * from mov_caja order by fecha desc, hora desc, id_movcaja desc limit 200
    `;
    const gastos = await sql<Record<string, unknown>>`
      select * from gastos order by fecha desc, id_gasto desc limit 100
    `;
    return {
      cajas: cajas.map((r) => mapCaja(r)!),
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
  },
);

export const getInventarioExtra = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    const conteos = await sql<Record<string, unknown>>`
      select c.*, i.insumo from conteos c
      join insumos i on i.id_insumo = c.id_insumo
      order by c.fecha desc, c.id_conteo desc limit 100
    `;
    const mermas = await sql<Record<string, unknown>>`
      select m.*, i.insumo from mermas m
      join insumos i on i.id_insumo = m.id_insumo
      order by m.fecha desc, m.id_merma desc limit 100
    `;
    const log = await sql<Record<string, unknown>>`
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
  },
);

export const openCaja = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      caja: z.string().default("Caja 1"),
      montoInicial: z.number().min(0),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const existing = await openCajaRow(sql);
    if (existing) throw new Error("Ya hay una caja abierta. Ciérrala antes de abrir otra.");
    const id = await nextId(sql, "CAJ");
    await sql.query(
      `insert into cajas (id_caja, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado)
       values ($1,$2,$3,to_char(now(),'HH24:MI:SS'),$4,'ABIERTA')`,
      [id, data.caja, data.idUsuario, data.montoInicial],
    );
    const mov = await nextId(sql, "MCJ");
    await sql.query(
      `insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
       values ($1,$2,'APERTURA','Fondo inicial',$3,0,'EFECTIVO',$1,$4)`,
      [mov, id, data.montoInicial, data.idUsuario],
    );
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "CAJA",
      accion: "APERTURA",
      referencia: id,
      descripcion: `Apertura ${data.caja} con ${data.montoInicial}`,
    });
    return { idCaja: id };
  });

export const closeCaja = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idCaja: z.string(),
      efectivoContado: z.number().min(0),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const rows = await sql.query<Record<string, unknown>>(
      `select * from cajas where id_caja = $1`,
      [data.idCaja],
    );
    const caja = rows[0];
    if (!caja || String(caja.estado) !== "ABIERTA") {
      throw new Error("La caja no está abierta.");
    }
    const esperado = await efectivoCaja(sql, data.idCaja);
    const diferencia = round2(data.efectivoContado - esperado);
    await sql.query(
      `update cajas set id_usuario_cierre=$1, hora_cierre=to_char(now(),'HH24:MI:SS'),
        efectivo_esperado=$2, efectivo_contado=$3, diferencia=$4, estado='CERRADA'
       where id_caja=$5`,
      [data.idUsuario, esperado, data.efectivoContado, diferencia, data.idCaja],
    );
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "CAJA",
      accion: "CIERRE",
      referencia: data.idCaja,
      descripcion: `Cierre. Esperado ${esperado}, contado ${data.efectivoContado}, diferencia ${diferencia}`,
    });
    return { esperado, diferencia };
  });

export const registrarVenta = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idEmpleado: z.string().optional(),
      idCliente: z.string().optional(),
      formaPago: z.enum(["EFECTIVO", "TARJETA"]),
      items: z
        .array(
          z.object({
            idProducto: z.string(),
            cantidad: z.number().positive(),
            descuento: z.number().min(0).default(0),
          }),
        )
        .min(1),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cfg = await configMap(sql);
    const caja = await openCajaRow(sql);
    if (cfg.Control_Caja === "SI" && !caja) {
      throw new Error("No hay caja abierta. Ábrela antes de vender.");
    }
    const products = await sql<Record<string, unknown>>`select * from productos where activo = true`;
    const recetas = await sql<Record<string, unknown>>`select * from recetas`;
    const insumos = await sql<Record<string, unknown>>`select * from insumos`;
    const stocks = await stockMap(sql);
    const allowNeg = cfg.Stock_Negativo === "SI";

    const needed: Record<string, number> = {};
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
        recipe,
      };
    });

    if (!allowNeg) {
      const faltantes: string[] = [];
      for (const [id, qtyNeed] of Object.entries(needed)) {
        const ins = insumos.find((i) => String(i.id_insumo) === id);
        const have = stocks[id] ?? 0;
        if (have + 1e-9 < qtyNeed) {
          faltantes.push(
            `${String(ins?.insumo ?? id)} (hay ${round4(have)}, se necesitan ${round4(qtyNeed)})`,
          );
        }
      }
      if (faltantes.length) {
        throw new Error(`Stock insuficiente: ${faltantes.join("; ")}`);
      }
    }

    const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
    const headerImp = round2(lines.reduce((a, l) => a + l.imp, 0));
    const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
    const idVenta = await nextId(sql, "VEN");
    const empleado =
      data.idEmpleado ??
      (
        await sql.query<{ id_empleado: string }>(
          `select id_empleado from usuarios where id_usuario=$1`,
          [data.idUsuario],
        )
      )[0]?.id_empleado ??
      null;

    await sql.query(
      `insert into ventas (id_venta, id_caja, id_cliente, id_empleado, id_usuario, subtotal, descuento, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,0,$7,$8,$9,'PAGADA')`,
      [
        idVenta,
        caja ? String(caja.id_caja) : null,
        data.idCliente ?? "CLI00001",
        empleado,
        data.idUsuario,
        headerSub,
        headerImp,
        headerTot,
        data.formaPago,
      ],
    );

    for (const line of lines) {
      const idDet = await nextId(sql, "DTV");
      await sql.query(
        `insert into det_ventas (id_detalle, id_venta, id_producto, cantidad, precio_unitario, descuento, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
        [
          idDet,
          idVenta,
          line.item.idProducto,
          line.item.cantidad,
          line.precio,
          line.item.descuento,
          line.imp,
          line.sub,
          line.tot,
        ],
      );
    }

    for (const [idInsumo, qtyNeed] of Object.entries(needed)) {
      const ins = insumos.find((i) => String(i.id_insumo) === idInsumo);
      const idMov = await nextId(sql, "MOV");
      await sql.query(
        `insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'VENTA',0,$3,$4,$5,$6,'Explosion de receta')`,
        [
          idMov,
          idInsumo,
          round4(qtyNeed),
          num(ins?.costo_unitario),
          idVenta,
          data.idUsuario,
        ],
      );
    }

    if (caja) {
      const idMovCaja = await nextId(sql, "MCJ");
      await sql.query(
        `insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'VENTA',$3,$4,0,$5,$6,$7)`,
        [
          idMovCaja,
          String(caja.id_caja),
          `Venta ${idVenta}`,
          data.formaPago === "EFECTIVO" ? headerTot : 0,
          data.formaPago,
          idVenta,
          data.idUsuario,
        ],
      );
    }

    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "VENTAS",
      accion: "ALTA",
      referencia: idVenta,
      descripcion: `Venta ${idVenta} por ${headerTot} (${data.formaPago})`,
    });

    return { idVenta, total: headerTot, subtotal: headerSub, impuesto: headerImp };
  });

export const anularVenta = createServerFn({ method: "POST" })
  .validator(z.object({ idUsuario: operatorId, idVenta: z.string() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    const ventas = await sql.query<Record<string, unknown>>(
      `select * from ventas where id_venta=$1`,
      [data.idVenta],
    );
    const venta = ventas[0];
    if (!venta) throw new Error("Venta no encontrada.");
    if (String(venta.estado) === "ANULADA") throw new Error("La venta ya está anulada.");
    await sql.query(`update ventas set estado='ANULADA' where id_venta=$1`, [data.idVenta]);
    const orig = await sql.query<Record<string, unknown>>(
      `select * from mov_inventario where referencia=$1 and tipo_movimiento='VENTA'`,
      [data.idVenta],
    );
    for (const m of orig) {
      const idMov = await nextId(sql, "MOV");
      await sql.query(
        `insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'ANULACION',$3,0,$4,$5,$6,'Reverso por anulación de venta')`,
        [
          idMov,
          m.id_insumo,
          m.salida,
          m.costo_unitario,
          data.idVenta,
          data.idUsuario,
        ],
      );
    }
    if (venta.id_caja) {
      const idMovCaja = await nextId(sql, "MCJ");
      await sql.query(
        `insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'ANULACION',$3,0,$4,$5,$6,$7)`,
        [
          idMovCaja,
          venta.id_caja,
          `Anulación ${data.idVenta}`,
          num(venta.forma_pago === "EFECTIVO" ? venta.total : 0),
          venta.forma_pago,
          data.idVenta,
          data.idUsuario,
        ],
      );
    }
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "VENTAS",
      accion: "ANULACION",
      referencia: data.idVenta,
      descripcion: `Anulación compensatoria de ${data.idVenta}`,
    });
    return { ok: true };
  });

export const registrarCompra = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idProveedor: z.string(),
      documento: z.string().default(""),
      formaPago: z.string().default("CONTADO"),
      items: z
        .array(
          z.object({
            idInsumo: z.string(),
            cantidad: z.number().positive(),
            costoUnitario: z.number().min(0),
            impuesto: z.number().min(0).default(0),
          }),
        )
        .min(1),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const stocks = await stockMap(sql);
    const insumos = await sql<Record<string, unknown>>`select * from insumos`;
    const idCompra = await nextId(sql, "COM");
    const lines = data.items.map((item) => {
      const sub = round2(item.cantidad * item.costoUnitario);
      const imp = round2(item.impuesto);
      return { ...item, sub, tot: round2(sub + imp) };
    });
    const headerSub = round2(lines.reduce((a, l) => a + l.sub, 0));
    const headerImp = round2(lines.reduce((a, l) => a + l.impuesto, 0));
    const headerTot = round2(lines.reduce((a, l) => a + l.tot, 0));
    await sql.query(
      `insert into compras (id_compra, id_proveedor, documento, id_usuario, subtotal, impuesto, total, forma_pago, estado)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'RECIBIDA')`,
      [
        idCompra,
        data.idProveedor,
        data.documento,
        data.idUsuario,
        headerSub,
        headerImp,
        headerTot,
        data.formaPago,
      ],
    );
    for (const line of lines) {
      const idDet = await nextId(sql, "DTC");
      await sql.query(
        `insert into det_compras (id_detalle, id_compra, id_insumo, cantidad, costo_unitario, descuento, impuesto, subtotal, total)
         values ($1,$2,$3,$4,$5,0,$6,$7,$8)`,
        [
          idDet,
          idCompra,
          line.idInsumo,
          line.cantidad,
          line.costoUnitario,
          line.impuesto,
          line.sub,
          line.tot,
        ],
      );
      const have = stocks[line.idInsumo] ?? 0;
      const ins = insumos.find((i) => String(i.id_insumo) === line.idInsumo);
      const oldCost = num(ins?.costo_unitario);
      const newCost =
        have + line.cantidad > 0
          ? round4(
              (have * oldCost + line.cantidad * line.costoUnitario) /
                (have + line.cantidad),
            )
          : line.costoUnitario;
      await sql.query(`update insumos set costo_unitario=$1 where id_insumo=$2`, [
        newCost,
        line.idInsumo,
      ]);
      const idMov = await nextId(sql, "MOV");
      await sql.query(
        `insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'COMPRA',$3,0,$4,$5,$6,'Ingreso por compra')`,
        [
          idMov,
          line.idInsumo,
          line.cantidad,
          line.costoUnitario,
          idCompra,
          data.idUsuario,
        ],
      );
    }
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "COMPRAS",
      accion: "ALTA",
      referencia: idCompra,
      descripcion: `Compra ${idCompra} por ${headerTot}`,
    });
    return { idCompra, total: headerTot };
  });

export const registrarMerma = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idInsumo: z.string(),
      cantidad: z.number().positive(),
      motivo: z.string().min(1),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const cfg = await configMap(sql);
    const stocks = await stockMap(sql);
    const ins = (
      await sql.query<Record<string, unknown>>(
        `select * from insumos where id_insumo=$1`,
        [data.idInsumo],
      )
    )[0];
    if (!ins) throw new Error("Insumo no encontrado.");
    const have = stocks[data.idInsumo] ?? 0;
    if (cfg.Stock_Negativo !== "SI" && have < data.cantidad) {
      throw new Error(`Stock insuficiente para merma (${round4(have)} disponible).`);
    }
    const costo = num(ins.costo_unitario);
    const id = await nextId(sql, "MRM");
    await sql.query(
      `insert into mermas (id_merma, id_insumo, cantidad, motivo, costo_unitario, costo_total, id_usuario)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [id, data.idInsumo, data.cantidad, data.motivo, costo, round2(data.cantidad * costo), data.idUsuario],
    );
    const idMov = await nextId(sql, "MOV");
    await sql.query(
      `insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
       values ($1,$2,'MERMA',0,$3,$4,$5,$6,$7)`,
      [idMov, data.idInsumo, data.cantidad, costo, id, data.idUsuario, data.motivo],
    );
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "INVENTARIO",
      accion: "MERMA",
      referencia: id,
      descripcion: `Merma ${data.cantidad} de ${ins.insumo}`,
    });
    return { id };
  });

export const registrarConteo = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idInsumo: z.string(),
      stockContado: z.number().min(0),
      observacion: z.string().default(""),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const stocks = await stockMap(sql);
    const ins = (
      await sql.query<Record<string, unknown>>(
        `select * from insumos where id_insumo=$1`,
        [data.idInsumo],
      )
    )[0];
    if (!ins) throw new Error("Insumo no encontrado.");
    const sistema = stocks[data.idInsumo] ?? 0;
    const diff = round4(data.stockContado - sistema);
    const id = await nextId(sql, "CNT");
    await sql.query(
      `insert into conteos (id_conteo, id_insumo, stock_sistema, stock_contado, diferencia, id_usuario, observacion)
       values ($1,$2,$3,$4,$5,$6,$7)`,
      [id, data.idInsumo, sistema, data.stockContado, diff, data.idUsuario, data.observacion],
    );
    if (diff !== 0) {
      const idMov = await nextId(sql, "MOV");
      await sql.query(
        `insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion)
         values ($1,$2,'CONTEO',$3,$4,$5,$6,$7,$8)`,
        [
          idMov,
          data.idInsumo,
          diff > 0 ? diff : 0,
          diff < 0 ? -diff : 0,
          num(ins.costo_unitario),
          id,
          data.idUsuario,
          data.observacion || "Ajuste por conteo físico",
        ],
      );
    }
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "INVENTARIO",
      accion: "CONTEO",
      referencia: id,
      descripcion: `Conteo ${ins.insumo}: sistema ${sistema}, contado ${data.stockContado}`,
    });
    return { id, diferencia: diff };
  });

export const registrarGasto = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      categoria: z.string().min(1),
      descripcion: z.string().min(1),
      proveedor: z.string().default(""),
      monto: z.number().positive(),
      formaPago: z.enum(["EFECTIVO", "TARJETA"]),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const caja = await openCajaRow(sql);
    if (data.formaPago === "EFECTIVO" && !caja) {
      throw new Error("No hay caja abierta para registrar un gasto en efectivo.");
    }
    const id = await nextId(sql, "GST");
    await sql.query(
      `insert into gastos (id_gasto, categoria, descripcion, proveedor, monto, forma_pago, id_caja, id_usuario, estado)
       values ($1,$2,$3,$4,$5,$6,$7,$8,'REGISTRADO')`,
      [
        id,
        data.categoria,
        data.descripcion,
        data.proveedor,
        data.monto,
        data.formaPago,
        caja ? String(caja.id_caja) : null,
        data.idUsuario,
      ],
    );
    if (caja && data.formaPago === "EFECTIVO") {
      const idMov = await nextId(sql, "MCJ");
      await sql.query(
        `insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario)
         values ($1,$2,'GASTO',$3,0,$4,'EFECTIVO',$5,$6)`,
        [idMov, String(caja.id_caja), data.descripcion, data.monto, id, data.idUsuario],
      );
    }
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "CAJA",
      accion: "GASTO",
      referencia: id,
      descripcion: data.descripcion,
    });
    return { id };
  });

export const upsertProducto = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idProducto: z.string().optional(),
      sku: z.string().min(1),
      producto: z.string().min(1),
      idCategoria: z.string(),
      unidadVenta: z.string().default("UND"),
      precioVenta: z.number().min(0),
      impuesto: z.number().min(0),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idProducto || (await nextId(sql, "PROD"));
    await sql.query(
      `insert into productos (id_producto, sku, producto, id_categoria, unidad_venta, precio_venta, impuesto, activo)
       values ($1,$2,$3,$4,$5,$6,$7,$8)
       on conflict (id_producto) do update set
         sku=excluded.sku, producto=excluded.producto, id_categoria=excluded.id_categoria,
         unidad_venta=excluded.unidad_venta, precio_venta=excluded.precio_venta,
         impuesto=excluded.impuesto, activo=excluded.activo`,
      [
        id,
        data.sku,
        data.producto,
        data.idCategoria,
        data.unidadVenta,
        data.precioVenta,
        data.impuesto,
        data.activo,
      ],
    );
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "MAESTROS",
      accion: data.idProducto ? "EDICION" : "ALTA",
      referencia: id,
      descripcion: `Producto ${data.producto}`,
    });
    return { id };
  });

export const upsertInsumo = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idInsumo: z.string().optional(),
      sku: z.string().min(1),
      insumo: z.string().min(1),
      idCategoria: z.string(),
      unidadCompra: z.string().default("UND"),
      unidadConsumo: z.string().default("UND"),
      factorConversion: z.number().positive().default(1),
      costoUnitario: z.number().min(0),
      stockMinimo: z.number().min(0).default(0),
      stockMaximo: z.number().min(0).default(0),
      idProveedor: z.string().optional().nullable(),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idInsumo || (await nextId(sql, "INS"));
    await sql.query(
      `insert into insumos (id_insumo, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, activo, id_proveedor)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       on conflict (id_insumo) do update set
         sku=excluded.sku, insumo=excluded.insumo, id_categoria=excluded.id_categoria,
         unidad_compra=excluded.unidad_compra, unidad_consumo=excluded.unidad_consumo,
         factor_conversion=excluded.factor_conversion, costo_unitario=excluded.costo_unitario,
         stock_minimo=excluded.stock_minimo, stock_maximo=excluded.stock_maximo,
         activo=excluded.activo, id_proveedor=excluded.id_proveedor`,
      [
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
        data.idProveedor || null,
      ],
    );
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "MAESTROS",
      accion: data.idInsumo ? "EDICION" : "ALTA",
      referencia: id,
      descripcion: `Insumo ${data.insumo}`,
    });
    return { id };
  });

export const upsertReceta = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idReceta: z.string().optional(),
      idProducto: z.string(),
      idInsumo: z.string(),
      cantidad: z.number().positive(),
      unidadConsumo: z.string(),
      mermaPct: z.number().min(0).default(0),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idReceta || (await nextId(sql, "REC"));
    if (data.idReceta) {
      await sql.query(
        `update recetas set id_producto=$1, id_insumo=$2, cantidad=$3, unidad_consumo=$4, merma_pct=$5 where id_receta=$6`,
        [
          data.idProducto,
          data.idInsumo,
          data.cantidad,
          data.unidadConsumo,
          data.mermaPct,
          id,
        ],
      );
    } else {
      await sql.query(
        `insert into recetas (id_receta, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct)
         values ($1,$2,$3,$4,$5,$6)`,
        [
          id,
          data.idProducto,
          data.idInsumo,
          data.cantidad,
          data.unidadConsumo,
          data.mermaPct,
        ],
      );
    }
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "RECETAS",
      accion: data.idReceta ? "EDICION" : "ALTA",
      referencia: id,
      descripcion: `Componente de receta ${data.idProducto}`,
    });
    return { id };
  });

export const deleteReceta = createServerFn({ method: "POST" })
  .validator(z.object({ idUsuario: operatorId, idReceta: z.string() }))
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`delete from recetas where id_receta=$1`, [data.idReceta]);
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "RECETAS",
      accion: "BAJA",
      referencia: data.idReceta,
      descripcion: "Componente de receta eliminado",
    });
    return { ok: true };
  });

export const upsertCategoria = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idCategoria: z.string().optional(),
      categoria: z.string().min(1),
      tipo: z.enum(["PRODUCTO", "INSUMO"]),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idCategoria || (await nextId(sql, "CAT"));
    await sql.query(
      `insert into categorias (id_categoria, categoria, tipo, activo)
       values ($1,$2,$3,$4)
       on conflict (id_categoria) do update set categoria=excluded.categoria, tipo=excluded.tipo, activo=excluded.activo`,
      [id, data.categoria, data.tipo, data.activo],
    );
    return { id };
  });

export const upsertProveedor = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idProveedor: z.string().optional(),
      razonSocial: z.string().min(1),
      nombreComercial: z.string().min(1),
      documento: z.string().default(""),
      telefono: z.string().default(""),
      condicionPago: z.string().default("CONTADO"),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idProveedor || (await nextId(sql, "PROV"));
    await sql.query(
      `insert into proveedores (id_proveedor, razon_social, nombre_comercial, documento, telefono, condicion_pago, activo)
       values ($1,$2,$3,$4,$5,$6,$7)
       on conflict (id_proveedor) do update set
         razon_social=excluded.razon_social, nombre_comercial=excluded.nombre_comercial,
         documento=excluded.documento, telefono=excluded.telefono,
         condicion_pago=excluded.condicion_pago, activo=excluded.activo`,
      [
        id,
        data.razonSocial,
        data.nombreComercial,
        data.documento,
        data.telefono,
        data.condicionPago,
        data.activo,
      ],
    );
    return { id };
  });

export const upsertCliente = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idCliente: z.string().optional(),
      nombre: z.string().min(1),
      documento: z.string().default(""),
      telefono: z.string().default(""),
      tipoCliente: z.string().default("MOSTRADOR"),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idCliente || (await nextId(sql, "CLI"));
    await sql.query(
      `insert into clientes (id_cliente, nombre, documento, telefono, tipo_cliente, activo)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id_cliente) do update set
         nombre=excluded.nombre, documento=excluded.documento, telefono=excluded.telefono,
         tipo_cliente=excluded.tipo_cliente, activo=excluded.activo`,
      [id, data.nombre, data.documento, data.telefono, data.tipoCliente, data.activo],
    );
    return { id };
  });

export const upsertEmpleado = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      idEmpleado: z.string().optional(),
      nombre: z.string().min(1),
      apellido: z.string().default(""),
      cargo: z.string().default(""),
      telefono: z.string().default(""),
      activo: z.boolean().default(true),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    const id = data.idEmpleado || (await nextId(sql, "EMP"));
    await sql.query(
      `insert into empleados (id_empleado, nombre, apellido, cargo, telefono, activo)
       values ($1,$2,$3,$4,$5,$6)
       on conflict (id_empleado) do update set
         nombre=excluded.nombre, apellido=excluded.apellido, cargo=excluded.cargo,
         telefono=excluded.telefono, activo=excluded.activo`,
      [id, data.nombre, data.apellido, data.cargo, data.telefono, data.activo],
    );
    return { id };
  });

export const updateConfig = createServerFn({ method: "POST" })
  .validator(
    z.object({
      idUsuario: operatorId,
      parametro: z.string(),
      valor: z.string(),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`update config set valor=$1 where parametro=$2`, [
      data.valor,
      data.parametro,
    ]);
    await writeLog(sql, {
      idUsuario: data.idUsuario,
      modulo: "CONFIG",
      accion: "EDICION",
      referencia: data.parametro,
      descripcion: `${data.parametro}=${data.valor}`,
    });
    return { ok: true };
  });
