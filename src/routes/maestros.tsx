import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { money } from "@/lib/erp/format";
import {
  getSnapshot,
  upsertCategoria,
  upsertCliente,
  upsertEmpleado,
  upsertInsumo,
  upsertProducto,
  upsertProveedor,
} from "@/lib/erp/server";
import { useSession } from "@/lib/erp/session";

export const Route = createFileRoute("/maestros")({ component: MaestrosPage });

function MaestrosPage() {
  const operator = useSession((s) => s.operator);
  const qc = useQueryClient();
  const snap = useQuery({ queryKey: ["erp"], queryFn: () => getSnapshot() });
  const data = snap.data;
  const uid = operator?.idUsuario;
  if (!data || !uid) return <p className="text-muted">Cargando maestros…</p>;
  const invalidate = () => void qc.invalidateQueries({ queryKey: ["erp"] });

  const [prodOpen, setProdOpen] = useState(false);
  const [insOpen, setInsOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [provOpen, setProvOpen] = useState(false);
  const [cliOpen, setCliOpen] = useState(false);
  const [empOpen, setEmpOpen] = useState(false);

  const [prod, setProd] = useState({
    sku: "",
    producto: "",
    idCategoria: "CAT001",
    precioVenta: "0",
    impuesto: "0.16",
  });
  const [ins, setIns] = useState({
    sku: "",
    insumo: "",
    idCategoria: "CAT101",
    unidadConsumo: "KG",
    costoUnitario: "0",
    stockMinimo: "0",
    stockMaximo: "0",
    idProveedor: "",
  });
  const [cat, setCat] = useState({
    categoria: "",
    tipo: "PRODUCTO" as "PRODUCTO" | "INSUMO",
  });
  const [prov, setProv] = useState({
    razonSocial: "",
    nombreComercial: "",
    condicionPago: "CONTADO",
  });
  const [cli, setCli] = useState({ nombre: "", tipoCliente: "MOSTRADOR" });
  const [emp, setEmp] = useState({ nombre: "", apellido: "", cargo: "" });

  const mProd = useMutation({
    mutationFn: () =>
      upsertProducto({
        data: {
          idUsuario: uid,
          sku: prod.sku,
          producto: prod.producto,
          idCategoria: prod.idCategoria,
          precioVenta: Number(prod.precioVenta),
          impuesto: Number(prod.impuesto),
          unidadVenta: "UND",
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Producto guardado");
      setProdOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mIns = useMutation({
    mutationFn: () =>
      upsertInsumo({
        data: {
          idUsuario: uid,
          sku: ins.sku,
          insumo: ins.insumo,
          idCategoria: ins.idCategoria,
          unidadCompra: ins.unidadConsumo,
          unidadConsumo: ins.unidadConsumo,
          factorConversion: 1,
          costoUnitario: Number(ins.costoUnitario),
          stockMinimo: Number(ins.stockMinimo),
          stockMaximo: Number(ins.stockMaximo),
          idProveedor: ins.idProveedor || null,
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Insumo guardado");
      setInsOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mCat = useMutation({
    mutationFn: () =>
      upsertCategoria({
        data: {
          idUsuario: uid,
          categoria: cat.categoria,
          tipo: cat.tipo,
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Categoría guardada");
      setCatOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mProv = useMutation({
    mutationFn: () =>
      upsertProveedor({
        data: {
          idUsuario: uid,
          razonSocial: prov.razonSocial,
          nombreComercial: prov.nombreComercial || prov.razonSocial,
          condicionPago: prov.condicionPago,
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Proveedor guardado");
      setProvOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mCli = useMutation({
    mutationFn: () =>
      upsertCliente({
        data: {
          idUsuario: uid,
          nombre: cli.nombre,
          tipoCliente: cli.tipoCliente,
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Cliente guardado");
      setCliOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });
  const mEmp = useMutation({
    mutationFn: () =>
      upsertEmpleado({
        data: {
          idUsuario: uid,
          nombre: emp.nombre,
          apellido: emp.apellido,
          cargo: emp.cargo,
          activo: true,
        },
      }),
    onSuccess: () => {
      toast.success("Empleado guardado");
      setEmpOpen(false);
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!data) return <p className="text-muted">Cargando maestros…</p>;

  return (
    <div>
      <PageHeader
        kicker="Fase 2 — Maestros"
        title="Catálogos"
        subtitle="Los mismos IDs del Excel. Activo/inactivo en lugar de borrar, para no romper FKs."
      />
      <Tabs defaultValue="productos">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="insumos">Insumos</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="proveedores">Proveedores</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
          <TabsTrigger value="empleados">Empleados</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setProdOpen(true)}>Nuevo producto</Button>
          </div>
          <TableWrap>
            <THead
              columns={["ID", "SKU", "Producto", "Categoría", "Precio", "Costo", "Activo"]}
            />
            <tbody>
              {data.productos.map((p) => (
                <tr key={p.idProducto}>
                  <Td className="font-mono text-xs">{p.idProducto}</Td>
                  <Td>{p.sku}</Td>
                  <Td>{p.producto}</Td>
                  <Td>
                    {data.categorias.find((c) => c.idCategoria === p.idCategoria)
                      ?.categoria}
                  </Td>
                  <Td numeric>{money(p.precioVenta)}</Td>
                  <Td numeric>{p.costoReceta ? money(p.costoReceta) : "—"}</Td>
                  <Td>
                    <Badge tone={p.activo ? "success" : "neutral"}>
                      {p.activo ? "SI" : "NO"}
                    </Badge>
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>

        <TabsContent value="insumos" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setInsOpen(true)}>Nuevo insumo</Button>
          </div>
          <TableWrap>
            <THead
              columns={["ID", "Insumo", "Stock", "Costo", "Unidad", "Proveedor"]}
            />
            <tbody>
              {data.insumos.map((i) => (
                <tr key={i.idInsumo}>
                  <Td className="font-mono text-xs">{i.idInsumo}</Td>
                  <Td>{i.insumo}</Td>
                  <Td numeric>{i.stock}</Td>
                  <Td numeric>{money(i.costoUnitario)}</Td>
                  <Td>{i.unidadConsumo}</Td>
                  <Td>
                    {data.proveedores.find((p) => p.idProveedor === i.idProveedor)
                      ?.nombreComercial ?? "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>

        <TabsContent value="categorias" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setCatOpen(true)}>Nueva categoría</Button>
          </div>
          <TableWrap>
            <THead columns={["ID", "Categoría", "Tipo", "Activo"]} />
            <tbody>
              {data.categorias.map((c) => (
                <tr key={c.idCategoria}>
                  <Td className="font-mono text-xs">{c.idCategoria}</Td>
                  <Td>{c.categoria}</Td>
                  <Td>{c.tipo}</Td>
                  <Td>{c.activo ? "SI" : "NO"}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>

        <TabsContent value="proveedores" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setProvOpen(true)}>Nuevo proveedor</Button>
          </div>
          <TableWrap>
            <THead columns={["ID", "Comercial", "Razón social", "Pago"]} />
            <tbody>
              {data.proveedores.map((p) => (
                <tr key={p.idProveedor}>
                  <Td className="font-mono text-xs">{p.idProveedor}</Td>
                  <Td>{p.nombreComercial}</Td>
                  <Td>{p.razonSocial}</Td>
                  <Td>{p.condicionPago}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>

        <TabsContent value="clientes" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setCliOpen(true)}>Nuevo cliente</Button>
          </div>
          <TableWrap>
            <THead columns={["ID", "Nombre", "Tipo"]} />
            <tbody>
              {data.clientes.map((c) => (
                <tr key={c.idCliente}>
                  <Td className="font-mono text-xs">{c.idCliente}</Td>
                  <Td>{c.nombre}</Td>
                  <Td>{c.tipoCliente}</Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>

        <TabsContent value="empleados" className="mt-4">
          <div className="mb-3 flex justify-end">
            <Button onClick={() => setEmpOpen(true)}>Nuevo empleado</Button>
          </div>
          <TableWrap>
            <THead columns={["ID", "Nombre", "Cargo", "Usuario"]} />
            <tbody>
              {data.empleados.map((e) => (
                <tr key={e.idEmpleado}>
                  <Td className="font-mono text-xs">{e.idEmpleado}</Td>
                  <Td>
                    {e.nombre} {e.apellido}
                  </Td>
                  <Td>{e.cargo}</Td>
                  <Td>
                    {data.usuarios.find((u) => u.idEmpleado === e.idEmpleado)
                      ?.usuario ?? "—"}
                  </Td>
                </tr>
              ))}
            </tbody>
          </TableWrap>
        </TabsContent>
      </Tabs>

      <Dialog open={prodOpen} onOpenChange={setProdOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Producto</DialogTitle>
          </DialogHeader>
          <Label>SKU</Label>
          <Input value={prod.sku} onChange={(e) => setProd({ ...prod, sku: e.target.value })} />
          <Label className="mt-2 block">Nombre</Label>
          <Input
            value={prod.producto}
            onChange={(e) => setProd({ ...prod, producto: e.target.value })}
          />
          <Label className="mt-2 block">Categoría</Label>
          <NativeSelect
            value={prod.idCategoria}
            onChange={(e) => setProd({ ...prod, idCategoria: e.target.value })}
          >
            {data.categorias
              .filter((c) => c.tipo === "PRODUCTO")
              .map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>
                  {c.categoria}
                </option>
              ))}
          </NativeSelect>
          <Label className="mt-2 block">Precio</Label>
          <Input
            type="number"
            value={prod.precioVenta}
            onChange={(e) => setProd({ ...prod, precioVenta: e.target.value })}
          />
          <Button className="mt-4 w-full" onClick={() => mProd.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={insOpen} onOpenChange={setInsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insumo</DialogTitle>
          </DialogHeader>
          <Label>SKU</Label>
          <Input value={ins.sku} onChange={(e) => setIns({ ...ins, sku: e.target.value })} />
          <Label className="mt-2 block">Nombre</Label>
          <Input
            value={ins.insumo}
            onChange={(e) => setIns({ ...ins, insumo: e.target.value })}
          />
          <Label className="mt-2 block">Categoría</Label>
          <NativeSelect
            value={ins.idCategoria}
            onChange={(e) => setIns({ ...ins, idCategoria: e.target.value })}
          >
            {data.categorias
              .filter((c) => c.tipo === "INSUMO")
              .map((c) => (
                <option key={c.idCategoria} value={c.idCategoria}>
                  {c.categoria}
                </option>
              ))}
          </NativeSelect>
          <Label className="mt-2 block">Unidad</Label>
          <Input
            value={ins.unidadConsumo}
            onChange={(e) => setIns({ ...ins, unidadConsumo: e.target.value })}
          />
          <Label className="mt-2 block">Costo unitario</Label>
          <Input
            type="number"
            value={ins.costoUnitario}
            onChange={(e) => setIns({ ...ins, costoUnitario: e.target.value })}
          />
          <Button className="mt-4 w-full" onClick={() => mIns.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={catOpen} onOpenChange={setCatOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Categoría</DialogTitle>
          </DialogHeader>
          <Label>Nombre</Label>
          <Input
            value={cat.categoria}
            onChange={(e) => setCat({ ...cat, categoria: e.target.value })}
          />
          <Label className="mt-2 block">Tipo</Label>
          <NativeSelect
            value={cat.tipo}
            onChange={(e) =>
              setCat({ ...cat, tipo: e.target.value as "PRODUCTO" | "INSUMO" })
            }
          >
            <option value="PRODUCTO">PRODUCTO</option>
            <option value="INSUMO">INSUMO</option>
          </NativeSelect>
          <Button className="mt-4 w-full" onClick={() => mCat.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={provOpen} onOpenChange={setProvOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Proveedor</DialogTitle>
          </DialogHeader>
          <Label>Razón social</Label>
          <Input
            value={prov.razonSocial}
            onChange={(e) => setProv({ ...prov, razonSocial: e.target.value })}
          />
          <Label className="mt-2 block">Nombre comercial</Label>
          <Input
            value={prov.nombreComercial}
            onChange={(e) =>
              setProv({ ...prov, nombreComercial: e.target.value })
            }
          />
          <Button className="mt-4 w-full" onClick={() => mProv.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={cliOpen} onOpenChange={setCliOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cliente</DialogTitle>
          </DialogHeader>
          <Label>Nombre</Label>
          <Input
            value={cli.nombre}
            onChange={(e) => setCli({ ...cli, nombre: e.target.value })}
          />
          <Button className="mt-4 w-full" onClick={() => mCli.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>

      <Dialog open={empOpen} onOpenChange={setEmpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Empleado</DialogTitle>
          </DialogHeader>
          <Label>Nombre</Label>
          <Input
            value={emp.nombre}
            onChange={(e) => setEmp({ ...emp, nombre: e.target.value })}
          />
          <Label className="mt-2 block">Apellido</Label>
          <Input
            value={emp.apellido}
            onChange={(e) => setEmp({ ...emp, apellido: e.target.value })}
          />
          <Label className="mt-2 block">Cargo</Label>
          <Input
            value={emp.cargo}
            onChange={(e) => setEmp({ ...emp, cargo: e.target.value })}
          />
          <Button className="mt-4 w-full" onClick={() => mEmp.mutate()}>
            Guardar
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
