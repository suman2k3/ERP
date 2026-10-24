import { useState, type FormEvent } from "react";
import {
  Package,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowDownToLine,
  ArrowUpFromLine,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  History,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDemo } from "@/lib/erp/store";
import { money, stockStatus, type Client, type Product, type StockMovement } from "@/lib/erp/data";
import {
  PageHeader,
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
import { toast } from "sonner";
import productImage from "@/assets/products.svg";
export function ProductCell({ product }: { product: Product }) {
  return (
    <div className="product-cell">
      <img src={productImage} className="product-thumb" alt="Sample product illustration" />
      <div>
        <strong>{product.name}</strong>
        <small>{product.sku}</small>
      </div>
    </div>
  );
}
const productFields = (p?: Product) => [
  { name: "name", label: "Product name", value: p?.name },
  { name: "sku", label: "SKU", value: p?.sku },
  { name: "category", label: "Category", value: p?.category },
  { name: "stock", label: "Current stock", type: "number", value: String(p?.stock ?? 0) },
  { name: "price", label: "Unit price (₹)", type: "number", value: String(p?.price ?? 0) },
  { name: "location", label: "Warehouse location", value: p?.location },
];
export function Stock({ client, query }: { client: Client; query?: string }) {
  const { products, setProducts, movements, setMovements, log } = useDemo();
  const all = products[client.id] ?? [];
  const allMovements = movements[client.id] ?? [];
  const [tab, setTab] = useState("All Products");
  const [search, setSearch] = useState(query ?? "");
  const [category, setCategory] = useState("All Categories");
  const [status, setStatus] = useState("All Statuses");
  const [movementSearch, setMovementSearch] = useState("");
  const [movementType, setMovementType] = useState("All Types");
  const [movementPage, setMovementPage] = useState(1);
  const [view, setView] = useState<Product | null>(null);
  const [edit, setEdit] = useState<Product | null>(null);
  const [remove, setRemove] = useState<Product | null>(null);
  const [page, setPage] = useState(1);

  const filtered = all.filter(
    (p) =>
      (p.name + " " + p.sku).toLowerCase().includes(search.toLowerCase()) &&
      (category === "All Categories" || p.category === category) &&
      (status === "All Statuses" || stockStatus(p.stock) === status),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / 5));
  const currentPage = Math.min(page, pages);
  const items = filtered.slice((currentPage - 1) * 5, currentPage * 5);

  const filteredMovements = allMovements.filter((m) => {
    const q = movementSearch.toLowerCase();
    const matchesQ =
      m.productName.toLowerCase().includes(q) ||
      m.sku.toLowerCase().includes(q) ||
      m.reference.toLowerCase().includes(q) ||
      m.notes.toLowerCase().includes(q);
    const matchesType = movementType === "All Types" || m.type === movementType;
    return matchesQ && matchesType;
  });
  const movementPages = Math.max(1, Math.ceil(filteredMovements.length / 8));
  const currentMovementPage = Math.min(movementPage, movementPages);
  const paginatedMovements = filteredMovements.slice(
    (currentMovementPage - 1) * 8,
    currentMovementPage * 8,
  );

  function save(v: Record<string, string>, existing?: Product) {
    if (all.some((p) => p.sku === v.sku && p.id !== existing?.id)) {
      toast.error("This SKU already exists. Use a unique SKU.");
      return;
    }
    const p: Product = {
      id: existing?.id ?? crypto.randomUUID(),
      name: v.name,
      sku: v.sku,
      category: v.category,
      stock: Number(v.stock),
      price: Number(v.price),
      location: v.location,
      updated: "10 Oct 2026",
      image: 0,
    };
    setProducts((s) => ({
      ...s,
      [client.id]: existing ? all.map((a) => (a.id === existing.id ? p : a)) : [p, ...all],
    }));
    log(`${client.name} · Product ${existing ? "updated" : "created"}: ${p.name}`);
  }

  function movement(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const id = String(d.get("product"));
    const amount = Number(d.get("quantity"));
    const reference =
      String(d.get("reference") || "").trim() || `REF-${String(Date.now()).slice(-4)}`;
    const notes = String(d.get("notes") || "").trim() || "Regular stock movement";
    const p = all.find((a) => a.id === id);
    if (!p) return;
    const prev = p.stock;
    const next =
      tab === "Stock In" ? p.stock + amount : tab === "Stock Out" ? p.stock - amount : amount;
    if (next < 0) {
      toast.error("Not enough stock available.");
      return;
    }
    const movementTypeVal = tab as "Stock In" | "Stock Out" | "Stock Adjustment";
    const newMovement: StockMovement = {
      id: `mov-${Date.now()}`,
      tenantId: client.id,
      productId: p.id,
      productName: p.name,
      sku: p.sku,
      type: movementTypeVal,
      quantity: tab === "Stock Adjustment" ? Math.abs(next - prev) : amount,
      previousStock: prev,
      newStock: next,
      reference,
      notes,
      date: "Today, 10 Oct 2026",
    };
    setMovements((s) => ({
      ...s,
      [client.id]: [newMovement, ...(s[client.id] ?? [])],
    }));
    setProducts((s) => ({
      ...s,
      [client.id]: all.map((a) =>
        a.id === id ? { ...a, stock: next, updated: "10 Oct 2026" } : a,
      ),
    }));
    log(`${client.name} · ${tab}: ${p.name} (Ref: ${reference})`);
    toast.success(`${tab} recorded successfully`, {
      description: `${p.name}: ${next} units available (Ref: ${reference}). Logged with notes.`,
    });
    e.currentTarget.reset();
  }

  return (
    <>
      <PageHeader
        title="Stock Management"
        subtitle="Manage your products, monitor stock levels, and audit all inventory movements."
      >
        <ExportButton
          onClick={() =>
            tab === "Movement History"
              ? exportCsv(
                  `${client.id}-stock-movements`,
                  [
                    "Date",
                    "Type",
                    "Product",
                    "SKU",
                    "Quantity",
                    "Reference",
                    "Notes",
                    "Balance Stock",
                  ],
                  filteredMovements.map((m) => [
                    m.date,
                    m.type,
                    m.productName,
                    m.sku,
                    m.quantity,
                    m.reference,
                    m.notes,
                    m.newStock,
                  ]),
                )
              : exportCsv(
                  `${client.id}-stock`,
                  ["Product", "SKU", "Stock", "Price", "Location"],
                  filtered.map((p) => [p.name, p.sku, p.stock, p.price, p.location]),
                )
          }
        />
        <FormDialog
          title="Add product"
          fields={productFields()}
          onSubmit={(v) => save(v)}
          trigger={
            <Button>
              <Plus />
              Add product
            </Button>
          }
        />
      </PageHeader>
      <Panel
        title={tab === "Movement History" ? "Stock Movement History" : "Product Stock"}
        subtitle={
          tab === "Movement History"
            ? `${filteredMovements.length} audited transactions with stored reference codes & notes`
            : `${all.length} products in your workspace`
        }
      >
        <div className="tabs">
          {[
            { id: "All Products", label: "All Products", icon: Package },
            { id: "Movement History", label: "Movement History", icon: History },
            { id: "Stock In", label: "Stock In", icon: ArrowDownToLine },
            { id: "Stock Out", label: "Stock Out", icon: ArrowUpFromLine },
            { id: "Stock Adjustment", label: "Stock Adjustment", icon: SlidersHorizontal },
            { id: "Add Products", label: "Add Products", icon: Plus },
          ].map((t) => (
            <Button
              variant="ghost"
              key={t.id}
              onClick={() => setTab(t.id)}
              className={tab === t.id ? "active" : ""}
            >
              <t.icon size={16} />
              {t.label}
            </Button>
          ))}
        </div>
        {tab === "All Products" ? (
          <>
            <div className="table-toolbar">
              <SearchField
                value={search}
                onChange={(s) => {
                  setSearch(s);
                  setPage(1);
                }}
                placeholder="Search products or SKU…"
              />
              <div className="table-filters">
                <SelectField
                  label="Product category"
                  value={category}
                  onChange={(v) => {
                    setCategory(v);
                    setPage(1);
                  }}
                  options={["All Categories", ...new Set(all.map((p) => p.category))]}
                />
                <SelectField
                  label="Stock status"
                  value={status}
                  onChange={(v) => {
                    setStatus(v);
                    setPage(1);
                  }}
                  options={["All Statuses", "In Stock", "Low Stock", "Out of Stock"]}
                />
              </div>
            </div>
            <DataTable
              headers={["Product", "Category", "Current Stock", "Unit Price", "Status", "Actions"]}
              rows={items.map((p) => [
                <ProductCell product={p} />,
                p.category,
                `${p.stock} units`,
                money(p.price),
                <Status>{stockStatus(p.stock)}</Status>,
                <div className="table-actions">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`View ${p.name}`}
                    title="View product details & movements"
                    onClick={() => setView(p)}
                  >
                    <Eye />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Edit ${p.name}`}
                    title="Edit product"
                    onClick={() => setEdit(p)}
                  >
                    <Pencil />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label={`Delete ${p.name}`}
                    title="Delete product"
                    onClick={() => setRemove(p)}
                  >
                    <Trash2 />
                  </Button>
                </div>,
              ])}
            />
            <div className="table-foot">
              <span>
                Showing {filtered.length === 0 ? 0 : (currentPage - 1) * 5 + 1}–
                {Math.min(currentPage * 5, filtered.length)} of {filtered.length} products
              </span>
              <div className="pagination-buttons">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous page"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button variant="secondary" size="icon">
                  {currentPage}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next page"
                  disabled={currentPage === pages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        ) : tab === "Movement History" ? (
          <>
            <div className="table-toolbar">
              <SearchField
                value={movementSearch}
                onChange={(s) => {
                  setMovementSearch(s);
                  setMovementPage(1);
                }}
                placeholder="Search by product, SKU, reference or reason notes…"
              />
              <div className="table-filters">
                <SelectField
                  label="Movement type"
                  value={movementType}
                  onChange={(v) => {
                    setMovementType(v);
                    setMovementPage(1);
                  }}
                  options={["All Types", "Stock In", "Stock Out", "Stock Adjustment"]}
                />
              </div>
            </div>
            <DataTable
              headers={[
                "Date",
                "Movement Type",
                "Product",
                "Qty Changed",
                "Reference #",
                "Reason & Notes",
                "Stock Balance",
              ]}
              rows={paginatedMovements.map((m) => [
                m.date,
                <Status
                  children={
                    m.type === "Stock In" ? "Active" : m.type === "Stock Out" ? "Pending" : "Draft"
                  }
                />,
                <div>
                  <strong>{m.productName}</strong>
                  <small className="block text-xs text-muted-foreground">{m.sku}</small>
                </div>,
                <strong
                  className={`tabular-nums ${
                    m.type === "Stock In"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : m.type === "Stock Out"
                        ? "text-rose-600 dark:text-rose-400"
                        : "text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {m.type === "Stock In"
                    ? `+${m.quantity}`
                    : m.type === "Stock Out"
                      ? `-${m.quantity}`
                      : `±${m.quantity}`}
                </strong>,
                <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-secondary text-foreground border border-border">
                  {m.reference}
                </span>,
                <div className="max-w-md text-xs text-foreground/90 whitespace-normal leading-relaxed">
                  {m.notes}
                </div>,
                <span className="tabular-nums font-semibold text-foreground">
                  {m.newStock} units
                </span>,
              ])}
            />
            <div className="table-foot">
              <span>
                Showing {filteredMovements.length === 0 ? 0 : (currentMovementPage - 1) * 8 + 1}–
                {Math.min(currentMovementPage * 8, filteredMovements.length)} of{" "}
                {filteredMovements.length} audited movement records
              </span>
              <div className="pagination-buttons">
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Previous page"
                  disabled={currentMovementPage === 1}
                  onClick={() => setMovementPage(currentMovementPage - 1)}
                >
                  <ChevronLeft />
                </Button>
                <Button variant="secondary" size="icon">
                  {currentMovementPage}
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Next page"
                  disabled={currentMovementPage >= movementPages}
                  onClick={() => setMovementPage(currentMovementPage + 1)}
                >
                  <ChevronRight />
                </Button>
              </div>
            </div>
          </>
        ) : tab === "Add Products" ? (
          <div className="stock-form">
            <h3>Add a new product</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save(Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>);
                e.currentTarget.reset();
                setTab("All Products");
              }}
            >
              <div className="form-fields">
                {productFields().map((f) => (
                  <label key={f.name}>
                    {f.label}
                    <Input
                      name={f.name}
                      type={f.type ?? "text"}
                      min={0}
                      required
                      defaultValue={f.value}
                    />
                  </label>
                ))}
              </div>
              <Button type="submit" className="mt-6">
                <Plus />
                Create product
              </Button>
            </form>
          </div>
        ) : (
          <div className="p-6 md:p-8 max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Form Card */}
              <div className="lg:col-span-6 bg-card border border-border rounded-lg p-6 shadow-xs">
                <h3 className="text-lg font-semibold text-foreground mb-1">{tab}</h3>
                <p className="mb-5 text-xs text-muted-foreground">
                  {tab === "Stock Adjustment"
                    ? "Set the actual counted quantity for a product. Reference & notes are permanently logged."
                    : `Record a ${tab.toLowerCase()} movement. Reference code and notes are saved to your ledger.`}
                </p>
                <form onSubmit={movement}>
                  <div className="form-fields">
                    <label>
                      Product
                      <select name="product" required className="w-full">
                        {all.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name} ({p.stock} units)
                          </option>
                        ))}
                      </select>
                    </label>
                    <label>
                      {tab === "Stock Adjustment" ? "Actual quantity" : "Quantity"}
                      <Input
                        name="quantity"
                        type="number"
                        min={tab === "Stock Adjustment" ? 0 : 1}
                        required
                        placeholder="e.g. 25"
                      />
                    </label>
                    <label>
                      Reference
                      <Input name="reference" placeholder="e.g. PO-2026-019, INV-8821" required />
                    </label>
                    <label>
                      Notes
                      <Input name="notes" placeholder="Reason for this movement" required />
                    </label>
                  </div>
                  <Button type="submit" className="mt-6 w-full sm:w-auto">
                    <Package className="mr-1.5 size-4" />
                    Record {tab.toLowerCase()}
                  </Button>
                </form>
              </div>

              {/* Stored Recent Records with Reference and Notes */}
              <div className="lg:col-span-6 bg-secondary/30 border border-border rounded-lg p-5">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <div>
                    <h4 className="text-sm font-semibold text-foreground">Recent {tab} Logs</h4>
                    <p className="text-xs text-muted-foreground">
                      Stored reference codes and audited reason notes
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTab("Movement History")}
                    className="text-xs h-8 cursor-pointer"
                  >
                    <History className="size-3.5 mr-1" />
                    All History
                  </Button>
                </div>

                {allMovements.filter((m) => m.type === tab).length === 0 ? (
                  <div className="p-8 text-center text-xs text-muted-foreground">
                    No {tab} records yet. Submit the form on the left to record one.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allMovements
                      .filter((m) => m.type === tab)
                      .slice(0, 4)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="p-3.5 rounded-md bg-card border border-border shadow-2xs text-xs"
                        >
                          <div className="flex justify-between items-start gap-2">
                            <div>
                              <strong className="text-foreground text-sm font-medium">
                                {m.productName}
                              </strong>
                              <span className="block text-muted-foreground text-[11px] mt-0.5">
                                SKU: {m.sku} · {m.date}
                              </span>
                            </div>
                            <span className="font-mono text-xs font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border">
                              {m.reference}
                            </span>
                          </div>

                          <div className="mt-2.5 p-2 rounded bg-muted/40 border border-border/60 text-xs">
                            <span className="font-semibold text-muted-foreground mr-1">
                              Note / Reason:
                            </span>
                            <span className="text-foreground">{m.notes}</span>
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[11px] text-muted-foreground pt-1.5 border-t border-border/40">
                            <span>
                              Quantity:{" "}
                              <strong className="text-foreground font-semibold tabular-nums">
                                {tab === "Stock Out" ? `-${m.quantity}` : `+${m.quantity}`} units
                              </strong>
                            </span>
                            <span>
                              Balance:{" "}
                              <strong className="text-foreground font-semibold tabular-nums">
                                {m.newStock} units
                              </strong>
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Panel>
      <Dialog
        open={!!view}
        onOpenChange={(o) => {
          if (!o) setView(null);
        }}
      >
        <DialogContent className="form-dialog">
          <DialogHeader>
            <DialogTitle>Product details</DialogTitle>
            <DialogDescription>{client.name} · Company-only product record</DialogDescription>
          </DialogHeader>
          {view && (
            <>
              <ProductCell product={view} />
              <div className="view-grid">
                {[
                  ["SKU", view.sku],
                  ["Category", view.category],
                  ["Current stock", `${view.stock} units`],
                  ["Price", money(view.price)],
                  ["Location", view.location],
                  ["Updated", view.updated],
                ].map(([k, v]) => (
                  <div key={k}>
                    <small>{k}</small>
                    <strong>{v}</strong>
                  </div>
                ))}
              </div>
              <Status>{stockStatus(view.stock)}</Status>

              {/* Movement History with References & Notes for this Product */}
              <div className="mt-5 border-t border-border pt-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">Stock Movement History</h4>
                  <small className="text-xs text-muted-foreground">References & Reason Notes</small>
                </div>
                {allMovements.filter((m) => m.productId === view.id).length === 0 ? (
                  <p className="text-xs text-muted-foreground py-2">
                    No movements recorded yet for this product.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {allMovements
                      .filter((m) => m.productId === view.id)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="p-2.5 rounded bg-muted/40 border border-border text-xs"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span
                                className={`status ${
                                  m.type === "Stock In"
                                    ? "good"
                                    : m.type === "Stock Out"
                                      ? "bad"
                                      : "warn"
                                }`}
                              >
                                <span />
                                {m.type}
                              </span>
                              <span className="font-mono text-[11px] font-semibold px-1.5 py-0.5 rounded bg-card border border-border">
                                {m.reference}
                              </span>
                            </div>
                            <span className="tabular-nums font-semibold text-foreground">
                              {m.type === "Stock In"
                                ? `+${m.quantity}`
                                : m.type === "Stock Out"
                                  ? `-${m.quantity}`
                                  : `±${m.quantity}`}{" "}
                              units
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-foreground/90">
                            <span className="font-medium text-muted-foreground mr-1">Note:</span>
                            {m.notes}
                          </p>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      {edit && (
        <FormDialog
          title="Edit product"
          open={!!edit}
          onOpenChange={(o) => {
            if (!o) setEdit(null);
          }}
          fields={productFields(edit)}
          onSubmit={(v) => save(v, edit)}
        />
      )}
      <Dialog
        open={!!remove}
        onOpenChange={(o) => {
          if (!o) setRemove(null);
        }}
      >
        <DialogContent className="form-dialog">
          <DialogHeader>
            <DialogTitle>Delete product?</DialogTitle>
            <DialogDescription>
              {remove?.name} will be removed from this company’s demo stock.
            </DialogDescription>
          </DialogHeader>
          <div className="dialog-actions">
            <Button variant="outline" onClick={() => setRemove(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setProducts((s) => ({ ...s, [client.id]: all.filter((p) => p.id !== remove?.id) }));
                setRemove(null);
                toast.success("Product removed");
              }}
            >
              Delete product
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Isolation name={client.name} />
    </>
  );
}
