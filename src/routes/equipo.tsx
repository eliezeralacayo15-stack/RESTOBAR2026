import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/erp/page-header";
import { TableWrap, THead, Td } from "@/components/erp/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NativeSelect } from "@/components/ui/native-select";
import { createStaff, listStaff } from "@/lib/erp/server";
import type { Rol } from "@/lib/erp/types";

export const Route = createFileRoute("/equipo")({ component: EquipoPage });

function EquipoPage() {
  const qc = useQueryClient();
  const list = useQuery({ queryKey: ["staff"], queryFn: () => listStaff() });
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState<Rol>("CAJERO");

  const create = useMutation({
    mutationFn: () => createStaff({ data: { nombre, email, password, rol } }),
    onSuccess: () => {
      toast.success("Usuario creado. Ya puede entrar con su correo y clave.");
      setNombre("");
      setEmail("");
      setPassword("");
      void qc.invalidateQueries({ queryKey: ["staff"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div>
      <PageHeader
        kicker="Acceso"
        title="Equipo"
        subtitle="Cada persona entra con su correo y contraseña. El rol limita lo que puede hacer."
      />
      <form
        className="mb-6 grid gap-3 rounded-xl border border-border bg-surface p-4 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault();
          create.mutate();
        }}
      >
        <div>
          <Label>Nombre</Label>
          <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </div>
        <div>
          <Label>Correo</Label>
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <Label>Contraseña</Label>
          <Input
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Rol</Label>
          <NativeSelect value={rol} onChange={(e) => setRol(e.target.value as Rol)}>
            <option value="ADMIN">Administrador</option>
            <option value="CAJERO">Cajero</option>
            <option value="INVENTARIO">Inventario</option>
          </NativeSelect>
        </div>
        <Button type="submit" disabled={create.isPending} className="sm:col-span-2">
          {create.isPending ? "Creando…" : "Crear usuario"}
        </Button>
      </form>
      <TableWrap>
        <THead columns={["Nombre", "Correo", "Rol"]} />
        <tbody>
          {(list.data ?? []).map((u) => (
            <tr key={u.user_id}>
              <Td>{u.nombre}</Td>
              <Td>{u.email}</Td>
              <Td>{u.rol}</Td>
            </tr>
          ))}
        </tbody>
      </TableWrap>
    </div>
  );
}
