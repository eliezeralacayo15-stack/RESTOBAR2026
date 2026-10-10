-- Aísla cada negocio. La semilla anterior era de desarrollo y no se entrega a nadie.
drop table if exists log cascade;
drop table if exists mermas cascade;
drop table if exists conteos cascade;
drop table if exists gastos cascade;
drop table if exists mov_caja cascade;
drop table if exists mov_inventario cascade;
drop table if exists det_compras cascade;
drop table if exists compras cascade;
drop table if exists det_ventas cascade;
drop table if exists ventas cascade;
drop table if exists cajas cascade;
drop table if exists recetas cascade;
drop table if exists insumos cascade;
drop table if exists productos cascade;
drop table if exists usuarios cascade;
drop table if exists empleados cascade;
drop table if exists clientes cascade;
drop table if exists proveedores cascade;
drop table if exists categorias cascade;
drop table if exists config cascade;

create table if not exists negocios (
  id text primary key,
  nombre text not null,
  created_at timestamptz not null default now()
);

create table if not exists miembros (
  user_id text primary key,
  negocio_id text not null references negocios (id),
  nombre text not null,
  rol text not null check (rol in ('ADMIN', 'CAJERO', 'INVENTARIO')),
  activo boolean not null default true
);

create table if not exists config (
  negocio_id text not null references negocios (id),
  parametro text not null,
  valor text not null,
  descripcion text not null default '',
  primary key (negocio_id, parametro)
);

create table if not exists categorias (
  id_categoria text primary key,
  negocio_id text not null references negocios (id),
  categoria text not null,
  tipo text not null check (tipo in ('PRODUCTO', 'INSUMO')),
  activo boolean not null default true
);

create table if not exists proveedores (
  id_proveedor text primary key,
  negocio_id text not null references negocios (id),
  razon_social text not null,
  nombre_comercial text not null,
  documento text not null default '',
  telefono text not null default '',
  email text not null default '',
  direccion text not null default '',
  contacto text not null default '',
  condicion_pago text not null default 'CONTADO',
  activo boolean not null default true
);

create table if not exists clientes (
  id_cliente text primary key,
  negocio_id text not null references negocios (id),
  nombre text not null,
  documento text not null default '',
  telefono text not null default '',
  email text not null default '',
  tipo_cliente text not null default 'MOSTRADOR',
  activo boolean not null default true,
  fecha_alta date not null default current_date
);

create table if not exists empleados (
  id_empleado text primary key,
  negocio_id text not null references negocios (id),
  nombre text not null,
  apellido text not null default '',
  documento text not null default '',
  cargo text not null default '',
  telefono text not null default '',
  fecha_ingreso date,
  salario numeric(14, 2),
  activo boolean not null default true
);

create table if not exists productos (
  id_producto text primary key,
  negocio_id text not null references negocios (id),
  sku text not null,
  producto text not null,
  id_categoria text not null references categorias (id_categoria),
  tipo text not null default 'PRODUCTO',
  unidad_venta text not null default 'UND',
  precio_venta numeric(14, 4) not null default 0,
  impuesto numeric(8, 4) not null default 0.16,
  activo boolean not null default true,
  fecha_alta date not null default current_date,
  unique (negocio_id, sku)
);

create table if not exists insumos (
  id_insumo text primary key,
  negocio_id text not null references negocios (id),
  sku text not null,
  insumo text not null,
  id_categoria text not null references categorias (id_categoria),
  unidad_compra text not null default 'UND',
  unidad_consumo text not null default 'UND',
  factor_conversion numeric(14, 6) not null default 1,
  costo_unitario numeric(14, 4) not null default 0,
  stock_minimo numeric(14, 4) not null default 0,
  stock_maximo numeric(14, 4) not null default 0,
  activo boolean not null default true,
  id_proveedor text references proveedores (id_proveedor),
  unique (negocio_id, sku)
);

create table if not exists recetas (
  id_receta text primary key,
  negocio_id text not null references negocios (id),
  id_producto text not null references productos (id_producto),
  id_insumo text not null references insumos (id_insumo),
  cantidad numeric(14, 6) not null,
  unidad_consumo text not null,
  merma_pct numeric(8, 4) not null default 0,
  unique (negocio_id, id_producto, id_insumo)
);

create table if not exists cajas (
  id_caja text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  caja text not null default 'Caja 1',
  id_usuario_apertura text,
  hora_apertura text,
  monto_inicial numeric(14, 2) not null default 0,
  id_usuario_cierre text,
  hora_cierre text,
  efectivo_esperado numeric(14, 2),
  efectivo_contado numeric(14, 2),
  diferencia numeric(14, 2),
  estado text not null default 'ABIERTA' check (estado in ('ABIERTA', 'CERRADA'))
);

create table if not exists ventas (
  id_venta text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_caja text references cajas (id_caja),
  id_cliente text references clientes (id_cliente),
  id_empleado text references empleados (id_empleado),
  id_usuario text,
  subtotal numeric(14, 2) not null default 0,
  descuento numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  forma_pago text not null default 'EFECTIVO',
  estado text not null default 'PAGADA' check (estado in ('PAGADA', 'ANULADA'))
);

create table if not exists det_ventas (
  id_detalle text primary key,
  negocio_id text not null references negocios (id),
  id_venta text not null references ventas (id_venta),
  id_producto text not null references productos (id_producto),
  cantidad numeric(14, 4) not null,
  precio_unitario numeric(14, 4) not null,
  descuento numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  subtotal numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0
);

create table if not exists compras (
  id_compra text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  id_proveedor text not null references proveedores (id_proveedor),
  documento text not null default '',
  id_usuario text,
  subtotal numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  forma_pago text not null default 'CONTADO',
  estado text not null default 'RECIBIDA' check (estado in ('RECIBIDA', 'ANULADA'))
);

create table if not exists det_compras (
  id_detalle text primary key,
  negocio_id text not null references negocios (id),
  id_compra text not null references compras (id_compra),
  id_insumo text not null references insumos (id_insumo),
  cantidad numeric(14, 4) not null,
  costo_unitario numeric(14, 4) not null,
  descuento numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  subtotal numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0
);

create table if not exists mov_inventario (
  id_movimiento text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_insumo text not null references insumos (id_insumo),
  tipo_movimiento text not null,
  entrada numeric(14, 4) not null default 0,
  salida numeric(14, 4) not null default 0,
  costo_unitario numeric(14, 4) not null default 0,
  referencia text,
  id_usuario text,
  observacion text not null default ''
);

create table if not exists mov_caja (
  id_movcaja text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_caja text not null references cajas (id_caja),
  tipo text not null,
  concepto text not null,
  entrada numeric(14, 2) not null default 0,
  salida numeric(14, 2) not null default 0,
  forma_pago text not null default 'EFECTIVO',
  referencia text,
  id_usuario text
);

create table if not exists gastos (
  id_gasto text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  categoria text not null,
  descripcion text not null,
  proveedor text not null default '',
  monto numeric(14, 2) not null,
  forma_pago text not null default 'EFECTIVO',
  id_caja text references cajas (id_caja),
  id_usuario text,
  estado text not null default 'REGISTRADO' check (estado in ('REGISTRADO', 'ANULADO'))
);

create table if not exists conteos (
  id_conteo text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  id_insumo text not null references insumos (id_insumo),
  stock_sistema numeric(14, 4) not null,
  stock_contado numeric(14, 4) not null,
  diferencia numeric(14, 4) not null,
  id_usuario text,
  observacion text not null default ''
);

create table if not exists mermas (
  id_merma text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  id_insumo text not null references insumos (id_insumo),
  cantidad numeric(14, 4) not null,
  motivo text not null,
  costo_unitario numeric(14, 4) not null,
  costo_total numeric(14, 2) not null,
  id_usuario text
);

create table if not exists log (
  id_log text primary key,
  negocio_id text not null references negocios (id),
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_usuario text,
  modulo text not null,
  accion text not null,
  referencia text,
  descripcion text not null default ''
);

create index if not exists idx_miembros_negocio on miembros (negocio_id);
create index if not exists idx_productos_neg on productos (negocio_id);
create index if not exists idx_insumos_neg on insumos (negocio_id);
create index if not exists idx_ventas_neg on ventas (negocio_id, fecha);
create index if not exists idx_movinv_neg on mov_inventario (negocio_id, id_insumo);
