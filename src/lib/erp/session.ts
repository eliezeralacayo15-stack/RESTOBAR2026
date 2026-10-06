import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Operator } from "./types";

type SessionState = {
  operator: Operator | null;
  setOperator: (operator: Operator) => void;
  clearOperator: () => void;
};

export const useSession = create<SessionState>()(
  persist(
    (set) => ({
      operator: null,
      setOperator: (operator) => set({ operator }),
      clearOperator: () => set({ operator: null }),
    }),
    { name: "restobar-erp-session" },
  ),
);
