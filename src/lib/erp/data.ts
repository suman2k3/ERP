export type Client = {
  id: string;
  name: string;
  domain: string;
  initials: string;
  style: string;
  industry: string;
  modules: string[];
  status: string;
  logo?: string;
};
export const modules = ["dashboard", "stock", "inventory", "accounts", "reports", "settings"];
export const clients: Client[] = [
  {
    id: "bugyboo",
    name: "BugyBoo",
    domain: "bugyboo.theclicker.in",
    initials: "bb",
    style: "bugyboo",
    industry: "Baby & lifestyle",
    modules: [...modules],
    status: "Active",
  },
  {
    id: "aash",
    name: "Aash Logistics",
    domain: "aash.theclicker.in",
    initials: "AL",
    style: "aash",
    industry: "Logistics & supply chain",
    modules: [...modules],
    status: "Active",
  },
  {
    id: "sumiraj",
    name: "Sumiraj",
    domain: "sumiraj.theclicker.in",
    initials: "S",
    style: "sumiraj",
    industry: "Manufacturing & trading",
    modules: [...modules],
    status: "Active",
  },
  {
    id: "mieux",
    name: "Mieux Display",
    domain: "mieux.theclicker.in",
    initials: "m",
    style: "mieux",
    industry: "Retail & display solutions",
    modules: [...modules],
    status: "Active",
  },
  {
    id: "electra",
    name: "Electra Cutting",
    domain: "electra.theclicker.in",
    initials: "E",
    style: "electra",
    industry: "Precision engineering",
    modules: [...modules],
    status: "Active",
  },
  {
    id: "maitra",
    name: "Maitra Consultancy",
    domain: "maitra.theclicker.in",
    initials: "MC",
    style: "maitra",
    industry: "Business & consultancy",
    modules: ["dashboard", "accounts", "reports", "settings"],
    status: "Active",
  },
];
export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  price: number;
  location: string;
  updated: string;
  image: number;
};
export type StockMovement = {
  id: string;
  tenantId: string;
  productId: string;
  productName: string;
  sku: string;
  type: "Stock In" | "Stock Out" | "Stock Adjustment";
  quantity: number;
  previousStock: number;
  newStock: number;
  reference: string;
  notes: string;
  date: string;
};
export const seedProducts: Product[] = [
  {
    id: "1",
    name: "Everyday Baby Romper",
    sku: "BB-001",
    category: "Apparel",
    stock: 248,
    price: 799,
    location: "Mumbai · A-01",
    updated: "10 Oct 2026",
    image: 0,
  },
  {
    id: "2",
    name: "Silicone Feeding Set",
    sku: "BB-002",
    category: "Feeding",
    stock: 18,
    price: 1299,
    location: "Mumbai · B-03",
    updated: "10 Oct 2026",
    image: 1,
  },
  {
    id: "3",
    name: "Organic Muslin Blanket",
    sku: "BB-003",
    category: "Essentials",
    stock: 156,
    price: 999,
    location: "Delhi · A-02",
    updated: "09 Oct 2026",
    image: 2,
  },
  {
    id: "4",
    name: "Wooden Stacking Rings",
    sku: "BB-004",
    category: "Toys",
    stock: 12,
    price: 899,
    location: "Mumbai · C-04",
    updated: "09 Oct 2026",
    image: 3,
  },
  {
    id: "5",
    name: "Cotton Baby Bibs (Set of 3)",
    sku: "BB-005",
    category: "Feeding",
    stock: 0,
    price: 499,
    location: "Delhi · B-01",
    updated: "08 Oct 2026",
    image: 4,
  },
  {
    id: "6",
    name: "Little Steps Booties",
    sku: "BB-006",
    category: "Apparel",
    stock: 84,
    price: 649,
    location: "Mumbai · A-05",
    updated: "08 Oct 2026",
    image: 5,
  },
];
export function tenantProducts(client: Client): Product[] {
  if (client.id === "bugyboo") return seedProducts.map((p) => ({ ...p }));
  const names =
    client.id === "aash"
      ? [
          "Shipping Carton · Large",
          "Packaging Tape · 48 mm",
          "Pallet Wrap Roll",
          "Safety Vest",
          "Barcode Labels",
          "Warehouse Gloves",
        ]
      : client.id === "electra"
        ? [
            "Precision Cutting Blade",
            "Steel Sheet · 2 mm",
            "Diamond Grinding Wheel",
            "Cutting Fluid · 5 L",
            "Safety Goggles",
            "Carbide Drill Set",
          ]
        : client.id === "mieux"
          ? [
              "Acrylic Display Stand",
              "LED Signage Panel",
              "Counter Display Rack",
              "Retail Shelf Divider",
              "Brochure Holder",
              "Exhibition Frame",
            ]
          : client.id === "maitra"
            ? [
                "Consulting Retainer",
                "Strategy Workshop",
                "Compliance Review",
                "Annual Audit",
                "Training Session",
                "Business Assessment",
              ]
            : [
                "Industrial Pump",
                "Valve Assembly",
                "Steel Fastener Set",
                "Pressure Gauge",
                "Motor Coupling",
                "Bearing Kit",
              ];
  return seedProducts.map((p, i) => ({
    ...p,
    name: names[i],
    sku: `${client.initials.toUpperCase()}-00${i + 1}`,
    category: ["Materials", "Supplies", "Equipment"][i % 3],
  }));
}
export function tenantMovements(client: Client, prods: Product[]): StockMovement[] {
  const p0 = prods[0];
  const p1 = prods[1];
  const p2 = prods[2];
  return [
    {
      id: `mov-${client.id}-1`,
      tenantId: client.id,
      productId: p0?.id ?? "1",
      productName: p0?.name ?? "Primary Item",
      sku: p0?.sku ?? "SKU-001",
      type: "Stock In",
      quantity: 50,
      previousStock: Math.max(0, (p0?.stock ?? 100) - 50),
      newStock: p0?.stock ?? 100,
      reference: "PO-2026-018",
      notes: "Received primary supplier replenishment shipment",
      date: "10 Oct 2026",
    },
    {
      id: `mov-${client.id}-2`,
      tenantId: client.id,
      productId: p1?.id ?? "2",
      productName: p1?.name ?? "Secondary Item",
      sku: p1?.sku ?? "SKU-002",
      type: "Stock Out",
      quantity: 15,
      previousStock: (p1?.stock ?? 30) + 15,
      newStock: p1?.stock ?? 30,
      reference: "SO-8841",
      notes: "Dispatched client delivery order",
      date: "09 Oct 2026",
    },
    {
      id: `mov-${client.id}-3`,
      tenantId: client.id,
      productId: p2?.id ?? "3",
      productName: p2?.name ?? "Third Item",
      sku: p2?.sku ?? "SKU-003",
      type: "Stock Adjustment",
      quantity: p2?.stock ?? 40,
      previousStock: (p2?.stock ?? 40) + 5,
      newStock: p2?.stock ?? 40,
      reference: "ADJ-OCT-01",
      notes: "Cycle count reconciliation and physical audit adjustment",
      date: "08 Oct 2026",
    },
  ];
}
export type Entry = {
  id: string;
  name: string;
  type: string;
  amount: number;
  status: string;
  date: string;
  tenant: string;
};
export type DemoUser = {
  id: string;
  name: string;
  email: string;
  tenant: string;
  role: string;
  status: string;
  password?: string;
};
export const initialUsers: DemoUser[] = [
  ...clients.map((c, i) => ({
    id: `admin-${c.id}`,
    name:
      ["Aarav Sharma", "Priya Patel", "Rohan Mehta", "Ananya Shah", "Vikram Singh", "Neha Rao"][
        i
      ] ?? "Administrator",
    email: `admin@${c.domain.split(".")[0]}.in`,
    tenant: c.id,
    role: "Company Admin",
    status: "Active",
    password: "password123",
  })),
  // Option B: Super Admin assigned emails (e.g. gmail, outlook)
  {
    id: "user-bugyboo-assigned",
    name: "Aarav Sharma (Personal)",
    email: "aarav.sharma@gmail.com",
    tenant: "bugyboo",
    role: "Company Admin",
    status: "Active",
    password: "password123",
  },
  {
    id: "user-aash-assigned",
    name: "Priya Patel (Personal)",
    email: "priya.logistics@outlook.com",
    tenant: "aash",
    role: "Manager",
    status: "Active",
    password: "password123",
  },
  {
    id: "user-sumiraj-assigned",
    name: "Rohan Mehta (Personal)",
    email: "rohan.manufacturing@gmail.com",
    tenant: "sumiraj",
    role: "Manager",
    status: "Active",
    password: "password123",
  },
  {
    id: "user-mieux-assigned",
    name: "Ananya Shah (Personal)",
    email: "ananya.display@yahoo.com",
    tenant: "mieux",
    role: "Viewer",
    status: "Active",
    password: "password123",
  },
  {
    id: "user-electra-assigned",
    name: "Vikram Singh (Personal)",
    email: "vikram.cutting@gmail.com",
    tenant: "electra",
    role: "Manager",
    status: "Active",
    password: "password123",
  },
  {
    id: "user-maitra-assigned",
    name: "Neha Rao (Personal)",
    email: "neha.consult@gmail.com",
    tenant: "maitra",
    role: "Company Admin",
    status: "Active",
    password: "password123",
  },
];
export const money = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);
export const stockStatus = (n: number) =>
  n === 0 ? "Out of Stock" : n < 25 ? "Low Stock" : "In Stock";
export const chartData = [
  { month: "May", income: 142000, expenses: 92000 },
  { month: "Jun", income: 198000, expenses: 114000 },
  { month: "Jul", income: 174000, expenses: 103000 },
  { month: "Aug", income: 263000, expenses: 148000 },
  { month: "Sep", income: 226000, expenses: 127000 },
  { month: "Oct", income: 318500, expenses: 162400 },
];
