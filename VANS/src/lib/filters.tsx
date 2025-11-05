import { createContext, useContext, useState } from "react";
export type Filters = { from: string; to: string; countries: string[] };
const Ctx = createContext<{ f: Filters; setF: (x: Filters) => void }>({
  f: { from: "", to: "", countries: [] },
  setF: () => {},
});
export const useFilters = () => useContext(Ctx);
export function FiltersProvider({ children }: { children: React.ReactNode }) {
  const [f, setF] = useState<Filters>({ from: "", to: "", countries: [] });
  return <Ctx.Provider value={{ f, setF }}>{children}</Ctx.Provider>;
}
