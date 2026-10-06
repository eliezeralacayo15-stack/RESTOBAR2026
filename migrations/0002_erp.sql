-- RESTOBAR ERP — modelo de datos (Fase 1.2 + 2) + semilla operativa
create table if not exists config (
  parametro text primary key,
  valor text not null,
  descripcion text not null default ''
);

create table if not exists categorias (
  id_categoria text primary key,
  categoria text not null,
  tipo text not null check (tipo in ('PRODUCTO', 'INSUMO')),
  activo boolean not null default true
);

create table if not exists proveedores (
  id_proveedor text primary key,
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
  nombre text not null,
  apellido text not null default '',
  documento text not null default '',
  cargo text not null default '',
  telefono text not null default '',
  fecha_ingreso date,
  salario numeric(14, 2),
  activo boolean not null default true
);

create table if not exists usuarios (
  id_usuario text primary key,
  usuario text not null unique,
  nombre text not null,
  id_empleado text references empleados (id_empleado),
  rol text not null check (rol in ('ADMIN', 'CAJERO', 'INVENTARIO')),
  activo boolean not null default true
);

create table if not exists productos (
  id_producto text primary key,
  sku text not null unique,
  producto text not null,
  id_categoria text not null references categorias (id_categoria),
  tipo text not null default 'PRODUCTO',
  unidad_venta text not null default 'UND',
  precio_venta numeric(14, 4) not null default 0,
  impuesto numeric(8, 4) not null default 0.16,
  activo boolean not null default true,
  fecha_alta date not null default current_date
);

create table if not exists insumos (
  id_insumo text primary key,
  sku text not null unique,
  insumo text not null,
  id_categoria text not null references categorias (id_categoria),
  unidad_compra text not null default 'UND',
  unidad_consumo text not null default 'UND',
  factor_conversion numeric(14, 6) not null default 1,
  costo_unitario numeric(14, 4) not null default 0,
  stock_minimo numeric(14, 4) not null default 0,
  stock_maximo numeric(14, 4) not null default 0,
  activo boolean not null default true,
  id_proveedor text references proveedores (id_proveedor)
);

create table if not exists recetas (
  id_receta text primary key,
  id_producto text not null references productos (id_producto),
  id_insumo text not null references insumos (id_insumo),
  cantidad numeric(14, 6) not null,
  unidad_consumo text not null,
  merma_pct numeric(8, 4) not null default 0,
  unique (id_producto, id_insumo)
);

create table if not exists cajas (
  id_caja text primary key,
  fecha date not null default current_date,
  caja text not null default 'Caja 1',
  id_usuario_apertura text references usuarios (id_usuario),
  hora_apertura text,
  monto_inicial numeric(14, 2) not null default 0,
  id_usuario_cierre text references usuarios (id_usuario),
  hora_cierre text,
  efectivo_esperado numeric(14, 2),
  efectivo_contado numeric(14, 2),
  diferencia numeric(14, 2),
  estado text not null default 'ABIERTA' check (estado in ('ABIERTA', 'CERRADA'))
);

create table if not exists ventas (
  id_venta text primary key,
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_caja text references cajas (id_caja),
  id_cliente text references clientes (id_cliente),
  id_empleado text references empleados (id_empleado),
  id_usuario text references usuarios (id_usuario),
  subtotal numeric(14, 2) not null default 0,
  descuento numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  forma_pago text not null default 'EFECTIVO',
  estado text not null default 'PAGADA' check (estado in ('PAGADA', 'ANULADA'))
);

create table if not exists det_ventas (
  id_detalle text primary key,
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
  fecha date not null default current_date,
  id_proveedor text not null references proveedores (id_proveedor),
  documento text not null default '',
  id_usuario text references usuarios (id_usuario),
  subtotal numeric(14, 2) not null default 0,
  impuesto numeric(14, 2) not null default 0,
  total numeric(14, 2) not null default 0,
  forma_pago text not null default 'CONTADO',
  estado text not null default 'RECIBIDA' check (estado in ('RECIBIDA', 'ANULADA'))
);

create table if not exists det_compras (
  id_detalle text primary key,
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
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_insumo text not null references insumos (id_insumo),
  tipo_movimiento text not null,
  entrada numeric(14, 4) not null default 0,
  salida numeric(14, 4) not null default 0,
  costo_unitario numeric(14, 4) not null default 0,
  referencia text,
  id_usuario text references usuarios (id_usuario),
  observacion text not null default ''
);

create table if not exists mov_caja (
  id_movcaja text primary key,
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_caja text not null references cajas (id_caja),
  tipo text not null,
  concepto text not null,
  entrada numeric(14, 2) not null default 0,
  salida numeric(14, 2) not null default 0,
  forma_pago text not null default 'EFECTIVO',
  referencia text,
  id_usuario text references usuarios (id_usuario)
);

create table if not exists gastos (
  id_gasto text primary key,
  fecha date not null default current_date,
  categoria text not null,
  descripcion text not null,
  proveedor text not null default '',
  monto numeric(14, 2) not null,
  forma_pago text not null default 'EFECTIVO',
  id_caja text references cajas (id_caja),
  id_usuario text references usuarios (id_usuario),
  estado text not null default 'REGISTRADO' check (estado in ('REGISTRADO', 'ANULADO'))
);

create table if not exists conteos (
  id_conteo text primary key,
  fecha date not null default current_date,
  id_insumo text not null references insumos (id_insumo),
  stock_sistema numeric(14, 4) not null,
  stock_contado numeric(14, 4) not null,
  diferencia numeric(14, 4) not null,
  id_usuario text references usuarios (id_usuario),
  observacion text not null default ''
);

create table if not exists mermas (
  id_merma text primary key,
  fecha date not null default current_date,
  id_insumo text not null references insumos (id_insumo),
  cantidad numeric(14, 4) not null,
  motivo text not null,
  costo_unitario numeric(14, 4) not null,
  costo_total numeric(14, 2) not null,
  id_usuario text references usuarios (id_usuario)
);

create table if not exists log (
  id_log text primary key,
  fecha date not null default current_date,
  hora text not null default to_char(now(), 'HH24:MI:SS'),
  id_usuario text,
  modulo text not null,
  accion text not null,
  referencia text,
  descripcion text not null default ''
);

create index if not exists idx_productos_cat on productos (id_categoria);
create index if not exists idx_insumos_cat on insumos (id_categoria);
create index if not exists idx_recetas_prod on recetas (id_producto);
create index if not exists idx_det_ventas_venta on det_ventas (id_venta);
create index if not exists idx_det_compras_compra on det_compras (id_compra);
create index if not exists idx_movinv_insumo on mov_inventario (id_insumo);
create index if not exists idx_movcaja_caja on mov_caja (id_caja);
create index if not exists idx_ventas_fecha on ventas (fecha);

insert into config (parametro, valor, descripcion) values
  ('Nombre_Empresa', 'Mi Restobar', 'Nombre comercial del negocio'),
  ('Moneda', 'USD', 'Moneda principal del sistema'),
  ('Impuesto_Default', '0.16', 'Tasa de impuesto predeterminada'),
  ('Decimales', '2', 'Decimales para importes'),
  ('Prefijo_Venta', 'VEN', 'Prefijo para IDs de ventas'),
  ('Prefijo_Compra', 'COM', 'Prefijo para IDs de compras'),
  ('Prefijo_Producto', 'PROD', 'Prefijo para IDs de productos'),
  ('Prefijo_Insumo', 'INS', 'Prefijo para IDs de insumos'),
  ('Prefijo_Proveedor', 'PROV', 'Prefijo para IDs de proveedores'),
  ('Stock_Negativo', 'NO', 'Permitir stock negativo'),
  ('Control_Caja', 'SI', 'Activar control de caja')
on conflict (parametro) do nothing;

insert into categorias (id_categoria, categoria, tipo, activo) values
  ('CAT001', 'Hamburguesas', 'PRODUCTO', true),
  ('CAT002', 'Pizzas', 'PRODUCTO', true),
  ('CAT003', 'Entradas', 'PRODUCTO', true),
  ('CAT004', 'Platos Fuertes', 'PRODUCTO', true),
  ('CAT005', 'Postres', 'PRODUCTO', true),
  ('CAT006', 'Bebidas', 'PRODUCTO', true),
  ('CAT007', 'Combos', 'PRODUCTO', true),
  ('CAT101', 'Carnes', 'INSUMO', true),
  ('CAT102', 'Panadería', 'INSUMO', true),
  ('CAT103', 'Lácteos', 'INSUMO', true),
  ('CAT104', 'Vegetales', 'INSUMO', true),
  ('CAT105', 'Frutas', 'INSUMO', true),
  ('CAT106', 'Salsas y Condimentos', 'INSUMO', true),
  ('CAT107', 'Bebidas e Insumos', 'INSUMO', true),
  ('CAT108', 'Empaques', 'INSUMO', true),
  ('CAT109', 'Limpieza', 'INSUMO', true),
  ('CAT110', 'Otros Insumos', 'INSUMO', true)
on conflict (id_categoria) do nothing;

insert into proveedores (id_proveedor, razon_social, nombre_comercial, condicion_pago, activo) values
  ('PROV00001', 'Distribuidora Central', 'Distribuidora Central', 'CONTADO', true),
  ('PROV00002', 'Panadería Local', 'Panadería Local', 'CONTADO', true),
  ('PROV00003', 'Frigorífico Principal', 'Frigorífico Principal', 'CREDITO', true)
on conflict (id_proveedor) do nothing;

insert into clientes (id_cliente, nombre, tipo_cliente, activo) values
  ('CLI00001', 'Consumidor Final', 'MOSTRADOR', true)
on conflict (id_cliente) do nothing;

insert into empleados (id_empleado, nombre, apellido, cargo, activo) values
  ('EMP00001', 'Administrador', 'General', 'Administrador', true),
  ('EMP00002', 'Cajero', 'Principal', 'Cajero', true),
  ('EMP00003', 'Cocinero', 'Principal', 'Cocinero', true)
on conflict (id_empleado) do nothing;

insert into usuarios (id_usuario, usuario, nombre, id_empleado, rol, activo) values
  ('USR00001', 'admin', 'Administrador', 'EMP00001', 'ADMIN', true),
  ('USR00002', 'caja', 'Cajero', 'EMP00002', 'CAJERO', true),
  ('USR00003', 'inventario', 'Inventario', 'EMP00003', 'INVENTARIO', true)
on conflict (id_usuario) do nothing;

insert into productos (id_producto, sku, producto, id_categoria, tipo, unidad_venta, precio_venta, impuesto, activo) values
  ('PROD00001', 'SKU-0001', 'Hamburguesa Clásica', 'CAT001', 'PRODUCTO', 'UND', 8, 0.16, true),
  ('PROD00002', 'SKU-0002', 'Pizza Pepperoni', 'CAT002', 'PRODUCTO', 'UND', 12, 0.16, true),
  ('PROD00003', 'SKU-0003', 'Papas Fritas', 'CAT003', 'PRODUCTO', 'UND', 4, 0.16, true),
  ('PROD00004', 'SKU-0004', 'Refresco', 'CAT006', 'PRODUCTO', 'UND', 2.5, 0.16, true),
  ('PROD00005', 'SKU-0005', 'Agua Mineral', 'CAT006', 'PRODUCTO', 'UND', 1.5, 0.16, true)
on conflict (id_producto) do nothing;

insert into insumos (id_insumo, sku, insumo, id_categoria, unidad_compra, unidad_consumo, factor_conversion, costo_unitario, stock_minimo, stock_maximo, activo, id_proveedor) values
  ('INS00001', 'INS-0001', 'Carne molida', 'CAT101', 'KG', 'KG', 1, 7.5, 10, 50, true, 'PROV00003'),
  ('INS00002', 'INS-0002', 'Pan de hamburguesa', 'CAT102', 'UND', 'UND', 1, 0.4, 30, 200, true, 'PROV00002'),
  ('INS00003', 'INS-0003', 'Queso', 'CAT103', 'KG', 'KG', 1, 8, 5, 30, true, 'PROV00001'),
  ('INS00004', 'INS-0004', 'Papas', 'CAT104', 'KG', 'KG', 1, 1.8, 10, 50, true, 'PROV00001'),
  ('INS00005', 'INS-0005', 'Aceite', 'CAT106', 'L', 'L', 1, 2.5, 5, 30, true, 'PROV00001')
on conflict (id_insumo) do nothing;

insert into recetas (id_receta, id_producto, id_insumo, cantidad, unidad_consumo, merma_pct) values
  ('REC00001', 'PROD00001', 'INS00001', 0.15, 'KG', 0),
  ('REC00002', 'PROD00001', 'INS00002', 1, 'UND', 0),
  ('REC00003', 'PROD00001', 'INS00003', 0.03, 'KG', 0),
  ('REC00004', 'PROD00003', 'INS00004', 0.25, 'KG', 0.05),
  ('REC00005', 'PROD00003', 'INS00005', 0.015, 'L', 0)
on conflict (id_receta) do nothing;

insert into mov_inventario (id_movimiento, id_insumo, tipo_movimiento, entrada, salida, costo_unitario, referencia, id_usuario, observacion) values
  ('MOV00001', 'INS00001', 'APERTURA', 25, 0, 7.5, 'APERTURA', 'USR00001', 'Inventario inicial'),
  ('MOV00002', 'INS00002', 'APERTURA', 100, 0, 0.4, 'APERTURA', 'USR00001', 'Inventario inicial'),
  ('MOV00003', 'INS00003', 'APERTURA', 10, 0, 8, 'APERTURA', 'USR00001', 'Inventario inicial'),
  ('MOV00004', 'INS00004', 'APERTURA', 25, 0, 1.8, 'APERTURA', 'USR00001', 'Inventario inicial'),
  ('MOV00005', 'INS00005', 'APERTURA', 12, 0, 2.5, 'APERTURA', 'USR00001', 'Inventario inicial')
on conflict (id_movimiento) do nothing;

insert into cajas (id_caja, caja, id_usuario_apertura, hora_apertura, monto_inicial, estado) values
  ('CAJ00001', 'Caja 1', 'USR00001', '08:00:00', 150, 'ABIERTA')
on conflict (id_caja) do nothing;

insert into mov_caja (id_movcaja, id_caja, tipo, concepto, entrada, salida, forma_pago, referencia, id_usuario) values
  ('MCJ00001', 'CAJ00001', 'APERTURA', 'Fondo inicial', 150, 0, 'EFECTIVO', 'CAJ00001', 'USR00001')
on conflict (id_movcaja) do nothing;

insert into log (id_log, id_usuario, modulo, accion, referencia, descripcion) values
  ('LOG00001', 'USR00001', 'SISTEMA', 'ALTA', 'FASE2', 'Semilla de maestros e inventario de apertura')
on conflict (id_log) do nothing;
