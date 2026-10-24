import { useState } from "react";
import { Boxes, Building2, Truck, Package, Plus, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/erp/store";
import { money, type Client } from "@/lib/erp/data";
import {
  PageHeader,
  Kpi,
  Panel,
  SearchField,
  SelectField,
  Status,
  DataTable,
  Isolation,
  FormDialog,
  ExportButton,
  exportCsv,
} from "./common";
import { ProductCell } from "./stock";
import { toast } from "sonner";
type Row = { id: string; name: string; detail: string; status: string; value: string };
export function Inventory({ client }: { client: Client }) {
  const { products } = useDemo();
  const items = products[client.id] ?? [];
  const [tab, setTab] = useState("Inventory Overview");
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("All Locations");
  const [orders, setOrders] = useState<Row[]>([
    {
      id: "PO-018",
      name: "Little Cotton Co.",
      detail: "08 Oct 2026",
      status: "Received",
      value: "₹38,400",
    },
    {
      id: "PO-019",
      name: "Prime Supply India",
      detail: "12 Oct 2026",
      status: "Pending",
      value: "₹24,000",
    },
    {
      id: "PO-020",
      name: "EcoPack Solutions",
      detail: "15 Oct 2026",
      status: "Draft",
      value: "₹16,800",
    },
  ]);
  const [suppliers, setSuppliers] = useState<Row[]>([
    {
      id: "SUP-001",
      name: "Little Cotton Co.",
      detail: "hello@littlecotton.example",
      status: "Active",
      value: "Mumbai",
    },
    {
      id: "SUP-002",
      name: "Prime Supply India",
      detail: "sales@primesupply.example",
      status: "Active",
      value: "Delhi",
    },
    {
      id: "SUP-003",
      name: "EcoPack Solutions",
      detail: "orders@ecopack.example",
      status: "Active",
      value: "Bengaluru",
    },
  ]);
  const [categories, setCategories] = useState([...new Set(items.map((p) => p.category))]);
  const [warehouses, setWarehouses] = useState<Row[]>([
    {
      id: "WH-001",
      name: "Mumbai Central",
      detail: "Andheri East, Mumbai",
      status: "Active",
      value: "Aarav Sharma",
    },
    {
      id: "WH-002",
      name: "Delhi Distribution",
      detail: "Okhla, New Delhi",
      status: "Active",
      value: "Priya Patel",
    },
  ]);
  const [open, setOpen] = useState(false);
  const filtered = items.filter(
    (p) =>
      (p.name + " " + p.sku).toLowerCase().includes(search.toLowerCase()) &&
      (location === "All Locations" || p.location.startsWith(location)),
  );
  const activeRows = (
    tab === "Purchase Orders" ? orders : tab === "Suppliers" ? suppliers : warehouses
  ).filter((r) => (r.name + r.id + r.detail).toLowerCase().includes(search.toLowerCase()));
  function changeTab(t: string) {
    setTab(t);
    setSearch("");
  }
  const fields =
    tab === "Suppliers"
      ? [
          { name: "name", label: "Supplier name" },
          { name: "detail", label: "Email", type: "email" },
          { name: "value", label: "City" },
        ]
      : tab === "Categories"
        ? [{ name: "name", label: "Category name" }]
        : tab === "Warehouses"
          ? [
              { name: "name", label: "Warehouse name" },
              { name: "detail", label: "Address" },
              { name: "value", label: "Manager" },
            ]
          : [
              { name: "name", label: "Supplier", options: suppliers.map((s) => s.name) },
              { name: "detail", label: "Expected date", type: "date" },
              { name: "value", label: "Order amount (₹)", type: "number" },
            ];
  const actionTitle =
    tab === "Suppliers"
      ? "Add supplier"
      : tab === "Categories"
        ? "Add category"
        : tab === "Warehouses"
          ? "Add warehouse"
          : "Create purchase order";
  return (
    <>
      <PageHeader
        title="Inventory Management"
        subtitle="A clear view of your inventory, purchasing, and supply network."
      >
        <ExportButton
          onClick={() =>
            exportCsv(
              `${client.id}-inventory`,
              ["Product", "SKU", "Quantity", "Location", "Updated"],
              filtered.map((p) => [p.name, p.sku, p.stock, p.location, p.updated]),
            )
          }
        />
        <Button onClick={() => setOpen(true)}>
          <Plus />
          {actionTitle}
        </Button>
      </PageHeader>
      <div className="kpi-grid">
        <Kpi
          title="Inventory Value"
          value={money(items.reduce((s, p) => s + p.price * p.stock, 0))}
          change="8.2%"
          icon={<Boxes />}
        />
        <Kpi
          title="Total Stock Units"
          value={String(items.reduce((s, p) => s + p.stock, 0))}
          change="6.4%"
          icon={<Package />}
        />
        <Kpi
          title="Active Suppliers"
          value={String(suppliers.length)}
          change="1 new"
          icon={<Truck />}
        />
        <Kpi
          title="Warehouses"
          value={String(warehouses.length)}
          change="All active"
          icon={<Building2 />}
        />
      </div>
      <Panel title={tab} subtitle="Company-specific inventory records">
        <div className="tabs">
          {["Inventory Overview", "Purchase Orders", "Suppliers", "Categories", "Warehouses"].map(
            (t) => (
              <Button
                key={t}
                variant="ghost"
                className={tab === t ? "active" : ""}
                onClick={() => changeTab(t)}
              >
                {t}
              </Button>
            ),
          )}
        </div>
        <div className="table-toolbar">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder={`Search ${tab.toLowerCase()}…`}
          />
          <div className="table-filters">
            {tab === "Inventory Overview" && (
              <SelectField
                label="Warehouse location"
                value={location}
                onChange={setLocation}
                options={["All Locations", ...new Set(items.map((p) => p.location.split(" · ")[0]))]}
              />
            )}
            <Button
              onClick={() => setOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold cursor-pointer gap-1.5"
            >
              <Plus size={16} />
              {actionTitle}
            </Button>
          </div>
        </div>
        {tab === "Inventory Overview" ? (
          <DataTable
            headers={["Product", "Category", "Available Units", "Location", "Last Updated"]}
            rows={filtered.map((p) => [
              <ProductCell product={p} />,
              p.category,
              p.stock,
              p.location,
              p.updated,
            ])}
          />
        ) : tab === "Categories" ? (
          <DataTable
            headers={["Category", "Products", "Status", "Actions"]}
            rows={categories
              .filter((c) => c.toLowerCase().includes(search.toLowerCase()))
              .map((c) => [
                c,
                items.filter((p) => p.category === c).length,
                <Status>Active</Status>,
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setCategories((s) => s.filter((a) => a !== c));
                    toast.success("Category removed from demo list");
                  }}
                >
                  Remove
                </Button>,
              ])}
          />
        ) : (
          <DataTable
            headers={
              tab === "Purchase Orders"
                ? ["Order #", "Supplier", "Expected Date", "Amount", "Status", "Actions"]
                : tab === "Suppliers"
                  ? ["Supplier ID", "Supplier", "Email", "City", "Status", "Actions"]
                  : ["Warehouse ID", "Warehouse", "Address", "Manager", "Status", "Actions"]
            }
            rows={activeRows.map((r) => [
              r.id,
              r.name,
              r.detail,
              r.value,
              <Status>{r.status}</Status>,
              <div className="table-actions">
                <FormDialog
                  title={
                    tab === "Purchase Orders"
                      ? "Update purchase order"
                      : tab === "Suppliers"
                        ? "Edit supplier"
                        : "Edit warehouse"
                  }
                  fields={[
                    { name: "name", label: "Name", value: r.name },
                    {
                      name: "detail",
                      label:
                        tab === "Suppliers"
                          ? "Email"
                          : tab === "Warehouses"
                            ? "Address"
                            : "Expected date",
                      value: r.detail,
                    },
                    {
                      name: "value",
                      label:
                        tab === "Warehouses" ? "Manager" : tab === "Suppliers" ? "City" : "Amount",
                      value: r.value,
                    },
                    {
                      name: "status",
                      label: "Status",
                      options:
                        tab === "Purchase Orders"
                          ? ["Draft", "Pending", "Received"]
                          : ["Active", "Inactive"],
                      value: r.status,
                    },
                  ]}
                  onSubmit={(v) => {
                    const setter =
                      tab === "Purchase Orders"
                        ? setOrders
                        : tab === "Suppliers"
                          ? setSuppliers
                          : setWarehouses;
                    setter((s) => s.map((a) => (a.id === r.id ? { ...a, ...v } : a)));
                  }}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label={`View or edit ${r.name}`}>
                      <Eye />
                    </Button>
                  }
                />
                {tab === "Purchase Orders" && r.status !== "Received" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setOrders((s) =>
                        s.map((a) => (a.id === r.id ? { ...a, status: "Received" } : a)),
                      );
                      toast.success("Order marked as received", {
                        description: "Demo order status updated; record quantities using Stock In.",
                      });
                    }}
                  >
                    Receive
                  </Button>
                )}
              </div>,
            ])}
          />
        )}
        <div className="table-foot">
          <span>
            {tab === "Inventory Overview"
              ? filtered.length
              : tab === "Categories"
                ? categories.length
                : activeRows.length}{" "}
            records · {client.name}
          </span>
          <span>Updated 10 Oct 2026</span>
        </div>
      </Panel>
      <FormDialog
        title={actionTitle}
        open={open}
        onOpenChange={setOpen}
        fields={fields}
        onSubmit={(v) => {
          if (tab === "Categories") {
            setCategories((s) => [...s, v.name]);
            toast.success(`Category "${v.name}" added successfully`);
            return;
          }
          const row: Row = {
            id:
              (tab === "Suppliers" ? "SUP-" : tab === "Warehouses" ? "WH-" : "PO-") +
              String(Date.now()).slice(-4),
            name: v.name,
            detail: v.detail,
            status: tab === "Suppliers" || tab === "Warehouses" ? "Active" : "Pending",
            value: tab === "Suppliers" || tab === "Warehouses" ? v.value : money(Number(v.value)),
          };
          const setter =
            tab === "Suppliers" ? setSuppliers : tab === "Warehouses" ? setWarehouses : setOrders;
          setter((s) => [row, ...s]);
          toast.success(
            `${tab === "Suppliers" ? "Supplier" : tab === "Warehouses" ? "Warehouse" : "Purchase order"} "${v.name}" created successfully`,
          );
          if (tab === "Inventory Overview") setTab("Purchase Orders");
        }}
      />
      <Isolation name={client.name} />
    </>
  );
}
