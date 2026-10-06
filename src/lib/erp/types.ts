export type Rol = "ADMIN" | "CAJERO" | "INVENTARIO";

export type Operator = {
  idUsuario: string;
  usuario: string;
  nombre: string;
  idEmpleado: string | null;
  rol: Rol;
  activo: boolean;
};

export const ROLE_MODULES: Record<Rol, string[]> = {
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
    "config",
  ],
  CAJERO: ["dashboard", "pos", "ventas", "caja"],
  INVENTARIO: [
    "dashboard",
    "compras",
    "inventario",
    "recetas",
    "gastos",
    "maestros",
    "reportes",
  ],
};
