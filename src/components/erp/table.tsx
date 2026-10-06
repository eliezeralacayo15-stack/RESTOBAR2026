import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function TableWrap({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[36rem] text-left text-sm">{children}</table>
    </div>
  );
}

export function THead({ columns }: { columns: string[] }) {
  return (
    <thead className="bg-surface-2 text-[11px] tracking-wide text-muted uppercase">
      <tr>
        {columns.map((c) => (
          <th key={c} className="px-3 py-2.5 font-medium whitespace-nowrap">
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function Td({
  children,
  className,
  numeric,
}: {
  children: ReactNode;
  className?: string;
  numeric?: boolean;
}) {
  return (
    <td
      className={cn(
        "border-t border-border px-3 py-2.5",
        numeric && "text-right font-mono tabular-nums",
        className,
      )}
    >
      {children}
    </td>
  );
}
