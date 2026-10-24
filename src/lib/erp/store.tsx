import { createContext, useContext, useState, type ReactNode } from "react";
import {
  clients as seeds,
  initialUsers,
  tenantProducts,
  tenantMovements,
  type Client,
  type Product,
  type Entry,
  type DemoUser,
  type StockMovement,
} from "./data";
type Store = {
  clients: Client[];
  setClients: React.Dispatch<React.SetStateAction<Client[]>>;
  users: DemoUser[];
  setUsers: React.Dispatch<React.SetStateAction<DemoUser[]>>;
  products: Record<string, Product[]>;
  setProducts: React.Dispatch<React.SetStateAction<Record<string, Product[]>>>;
  movements: Record<string, StockMovement[]>;
  setMovements: React.Dispatch<React.SetStateAction<Record<string, StockMovement[]>>>;
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
  session: string | null;
  setSession: (v: string | null) => void;
  currentUser: DemoUser | null;
  setCurrentUser: (u: DemoUser | null) => void;
  logs: string[];
  log: (v: string) => void;
};
const Context = createContext<Store | null>(null);
export function DemoProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useState(seeds);
  const [users, setUsers] = useState(initialUsers);
  const [products, setProducts] = useState<Record<string, Product[]>>(() =>
    Object.fromEntries(seeds.map((c) => [c.id, tenantProducts(c)])),
  );
  const [movements, setMovements] = useState<Record<string, StockMovement[]>>(() =>
    Object.fromEntries(seeds.map((c) => [c.id, tenantMovements(c, tenantProducts(c))])),
  );
  const [entries, setEntries] = useState<Entry[]>(() =>
    seeds.flatMap((c) => [
      {
        id: c.id + "-1",
        name: "Invoice payment · INV-2026-042",
        type: "Income",
        amount: 24500,
        status: "Completed",
        date: "10 Oct 2026",
        tenant: c.id,
      },
      {
        id: c.id + "-2",
        name: "Supplier payment · PO-018",
        type: "Expense",
        amount: 12800,
        status: "Completed",
        date: "09 Oct 2026",
        tenant: c.id,
      },
      {
        id: c.id + "-3",
        name: "Invoice · INV-2026-043",
        type: "Invoice",
        amount: 18900,
        status: "Pending",
        date: "09 Oct 2026",
        tenant: c.id,
      },
      {
        id: c.id + "-4",
        name: "Warehouse rent",
        type: "Expense",
        amount: 18000,
        status: "Completed",
        date: "08 Oct 2026",
        tenant: c.id,
      },
    ]),
  );
  const [session, setSession] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<DemoUser | null>(null);
  const [logs, setLogs] = useState([
    "System · Demo environment initialized",
    "Super Admin · Six client workspaces provisioned",
  ]);
  return (
    <Context.Provider
      value={{
        clients,
        setClients,
        users,
        setUsers,
        products,
        setProducts,
        movements,
        setMovements,
        entries,
        setEntries,
        session,
        setSession,
        currentUser,
        setCurrentUser,
        logs,
        log: (v) => setLogs((s) => [v, ...s]),
      }}
    >
      {children}
    </Context.Provider>
  );
}
export function useDemo() {
  const value = useContext(Context);
  if (!value) throw new Error("DemoProvider required");
  return value;
}
