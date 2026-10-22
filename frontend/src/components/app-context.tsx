import { createContext, useContext, useState, type ReactNode } from "react";

interface Ctx {
  addOpen: boolean;
  setAddOpen: (v: boolean) => void;
  importOpen: boolean;
  setImportOpen: (v: boolean) => void;
}
const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [addOpen, setAddOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  return <AppCtx.Provider value={{ addOpen, setAddOpen, importOpen, setImportOpen }}>{children}</AppCtx.Provider>;
}

export function useApp() {
  const c = useContext(AppCtx);
  if (!c) throw new Error("useApp must be used within AppProvider");
  return c;
}
