import { useState } from "react";
import { IndianRupee, Wallet, ArrowDownLeft, ArrowUpRight, Plus, Eye } from "lucide-react";
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
import { SalesChart } from "./charts";
import { toast } from "sonner";
export function Accounts({ client }: { client: Client }) {
  const { entries, setEntries, log } = useDemo();
  const [tab, setTab] = useState("Overview");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All Statuses");
  const [period, setPeriod] = useState("Last 6 months");
  const [vendors, setVendors] = useState([
    { name: "Little Cotton Co.", email: "billing@littlecotton.example", balance: 28400 },
    { name: "Prime Supply India", email: "accounts@primesupply.example", balance: 16800 },
  ]);
  const [kind, setKind] = useState("");
  const all = entries.filter((e) => e.tenant === client.id);
  const filtered = all.filter(
    (e) =>
      (e.name + " " + e.id).toLowerCase().includes(search.toLowerCase()) &&
      (status === "All Statuses" || e.status === status) &&
      (tab === "Overview" ||
        tab === "Reports" ||
        (tab === "Income" && e.type === "Income") ||
        (tab === "Expenses" && e.type === "Expense") ||
        (tab === "Invoices" && e.type === "Invoice") ||
        (tab === "Payments" && e.type === "Payment")),
  );
  const income =
    318500 +
    all.filter((e) => e.type === "Income" && !e.id.includes("-")).reduce((s, e) => s + e.amount, 0);
  const expenses =
    162400 +
    all
      .filter((e) => e.type === "Expense" && !e.id.includes("-"))
      .reduce((s, e) => s + e.amount, 0);
  const invoiceTotal = all
    .filter((e) => e.type === "Invoice" && e.status === "Pending")
    .reduce((s, e) => s + e.amount, 0);
  function create(v: Record<string, string>) {
    if (kind === "Vendor") {
      setVendors((s) => [...s, { name: v.name, email: v.email, balance: Number(v.amount) }]);
      return;
    }
    const type = kind === "Transaction" ? v.type : kind;
    setEntries((s) => [
      {
        id: crypto.randomUUID(),
        name: `${type} · ${v.name}`,
        type,
        amount: Number(v.amount),
        tenant: client.id,
        status: type === "Invoice" ? "Pending" : "Completed",
        date: v.date || "10 Oct 2026",
      },
      ...s,
    ]);
    log(`${client.name} · ${type} created: ${v.name}`);
  }
  return (
    <>
      <PageHeader
        title="Account Management"
        subtitle="Keep your finances organized, from your first sale to your next payment."
      >
        <ExportButton
          onClick={() =>
            exportCsv(
              `${client.id}-accounts`,
              ["Transaction", "Type", "Amount", "Date", "Status"],
              filtered.map((e) => [e.name, e.type, e.amount, e.date, e.status]),
            )
          }
        />
        <Button
          onClick={() =>
            setKind(
              tab === "Invoices"
                ? "Invoice"
                : tab === "Payments"
                  ? "Payment"
                  : tab === "Vendors"
                    ? "Vendor"
                    : "Transaction",
            )
          }
        >
          <Plus />
          {tab === "Invoices"
            ? "Create invoice"
            : tab === "Payments"
              ? "Record payment"
              : tab === "Vendors"
                ? "Add vendor"
                : "Add transaction"}
        </Button>
      </PageHeader>
      <div className="kpi-grid">
        <Kpi title="Total Income" value={money(income)} change="18.4%" icon={<IndianRupee />} />
        <Kpi
          title="Total Expenses"
          value={money(expenses)}
          change="4.1%"
          icon={<Wallet />}
          negative
        />
        <Kpi
          title="Receivables"
          value={money(invoiceTotal)}
          change="2 invoices"
          icon={<ArrowDownLeft />}
        />
        <Kpi
          title="Payables"
          value={money(vendors.reduce((s, v) => s + v.balance, 0))}
          change="2 vendors"
          icon={<ArrowUpRight />}
        />
      </div>
      <Panel title="Financial Workspace">
        <div className="tabs">
          {["Overview", "Income", "Expenses", "Invoices", "Payments", "Vendors", "Reports"].map(
            (t) => (
              <Button
                key={t}
                variant="ghost"
                className={tab === t ? "active" : ""}
                onClick={() => {
                  setTab(t);
                  setSearch("");
                }}
              >
                {t}
              </Button>
            ),
          )}
        </div>
        {(tab === "Overview" || tab === "Reports") && (
          <>
            <div className="panel-heading">
              <div>
                <h2>Income vs Expenses</h2>
                <p>Monthly financial performance · {client.name}</p>
              </div>
              <SelectField
                label="Financial chart period"
                value={period}
                onChange={setPeriod}
                options={["Last 6 months", "This month", "Last month"]}
              />
            </div>
            <div className="chart-legend px-5">
              <span>
                <i className="legend-dot" />
                Income
              </span>
              <span>
                <i className="legend-dot green" />
                Expenses
              </span>
            </div>
            <SalesChart accounts period={period} />
          </>
        )}
        {tab === "Reports" && (
          <div className="inline-summary">
            <div>
              Gross income<strong>{money(income)}</strong>
            </div>
            <div>
              Total expenses<strong>{money(expenses)}</strong>
            </div>
            <div>
              Net earnings<strong className="text-primary">{money(income - expenses)}</strong>
            </div>
          </div>
        )}
        <div className="table-toolbar">
          <SearchField
            value={search}
            onChange={setSearch}
            placeholder={tab === "Vendors" ? "Search vendors…" : "Search transactions…"}
          />
          {tab !== "Vendors" && (
            <SelectField
              label="Transaction status"
              value={status}
              onChange={setStatus}
              options={["All Statuses", "Completed", "Pending"]}
            />
          )}
        </div>
        {tab === "Vendors" ? (
          <DataTable
            headers={["Vendor", "Email", "Outstanding Balance", "Status", "Action"]}
            rows={vendors
              .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()))
              .map((v) => [
                v.name,
                v.email,
                money(v.balance),
                <Status>Active</Status>,
                <Button variant="outline" size="sm" onClick={() => setKind("Payment")}>
                  Pay vendor
                </Button>,
              ])}
          />
        ) : (
          <DataTable
            headers={["Transaction", "Type", "Date", "Amount", "Status", "Actions"]}
            rows={filtered.map((e) => [
              <strong className="font-medium">{e.name}</strong>,
              e.type,
              e.date,
              <span className={e.type === "Expense" ? "text-destructive" : "text-primary"}>
                {e.type === "Expense" ? "-" : "+"}
                {money(e.amount)}
              </span>,
              <Status>{e.status}</Status>,
              <div className="table-actions">
                <FormDialog
                  title="Transaction details"
                  fields={[
                    { name: "name", label: "Description", value: e.name },
                    {
                      name: "amount",
                      label: "Amount (₹)",
                      type: "number",
                      value: String(e.amount),
                    },
                    {
                      name: "status",
                      label: "Status",
                      options: ["Completed", "Pending"],
                      value: e.status,
                    },
                  ]}
                  onSubmit={(v) =>
                    setEntries((s) =>
                      s.map((a) =>
                        a.id === e.id
                          ? { ...a, name: v.name, amount: Number(v.amount), status: v.status }
                          : a,
                      ),
                    )
                  }
                  trigger={
                    <Button variant="ghost" size="icon" aria-label={`View ${e.name}`}>
                      <Eye />
                    </Button>
                  }
                />
                {e.type === "Invoice" && e.status === "Pending" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEntries((s) =>
                        s.map((a) => (a.id === e.id ? { ...a, status: "Completed" } : a)),
                      );
                      toast.success("Invoice marked paid");
                    }}
                  >
                    Mark paid
                  </Button>
                )}
              </div>,
            ])}
          />
        )}
        <div className="table-foot">
          <span>
            {tab === "Vendors" ? vendors.length : filtered.length} records · Demo financial data
          </span>
          <span>Currency: INR</span>
        </div>
      </Panel>
      <FormDialog
        title={
          kind === "Invoice"
            ? "Create invoice"
            : kind === "Payment"
              ? "Record payment"
              : kind === "Vendor"
                ? "Add vendor"
                : "Add transaction"
        }
        open={!!kind}
        onOpenChange={(v) => {
          if (!v) setKind("");
        }}
        fields={
          kind === "Vendor"
            ? [
                { name: "name", label: "Vendor name" },
                { name: "email", label: "Email", type: "email" },
                { name: "amount", label: "Opening balance (₹)", type: "number" },
              ]
            : [
                {
                  name: "name",
                  label:
                    kind === "Invoice"
                      ? "Customer / invoice reference"
                      : kind === "Payment"
                        ? "Payee / payment reference"
                        : "Description",
                },
                ...(kind === "Transaction"
                  ? [{ name: "type", label: "Transaction type", options: ["Income", "Expense"] }]
                  : []),
                { name: "amount", label: "Amount (₹)", type: "number" },
                { name: "date", label: kind === "Invoice" ? "Due date" : "Date", type: "date" },
                ...(kind === "Payment"
                  ? [
                      {
                        name: "method",
                        label: "Payment method",
                        options: ["Bank transfer", "UPI", "Cash"],
                      },
                    ]
                  : []),
              ]
        }
        onSubmit={create}
      />
      <Isolation name={client.name} />
    </>
  );
}
