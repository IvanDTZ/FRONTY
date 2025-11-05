import { createContext, useContext, useEffect, useState } from "react";
import { todayISO } from "./api";

export type Filters = {
  from: string;
  to: string;
  countries: string[];
  compare?: boolean;
  cfrom?: string;
  cto?: string;
};
const def: Filters = {
  from: "2025-01-01",
  to: todayISO(),
  countries: [],
  compare: false,
  cfrom: "2024-01-01",
  cto: todayISO(),
};

const Ctx = createContext<{ f: Filters; setF: (x: Filters) => void }>({
  f: def,
  setF: () => {},
});
export const useFilters = () => useContext(Ctx);

export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = useState<Filters>(def);
  useEffect(() => {
    /* asegura defaults al cargar */
  }, []);
  return <Ctx.Provider value={{ f, setF }}>{children}</Ctx.Provider>;
}
