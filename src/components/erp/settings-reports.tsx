import { useState } from "react";
import { FileText, BarChart3, Package, Wallet, Download, Save, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { useDemo } from "@/lib/erp/store";
import { money, type Client } from "@/lib/erp/data";
import { PageHeader, Panel, Isolation, exportCsv } from "./common";
import { toast } from "sonner";
export function SettingsPage({ client }: { client: Client }) {
  const { setClients } = useDemo();
  const [tab, setTab] = useState("Company Profile");
  const [notifications, setNotifications] = useState(true);
  const [alerts, setAlerts] = useState(true);
  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Your company preferences, workspace details, and access overview."
      />
      <Panel title="Workspace Settings">
        <div className="tabs">
          {["Company Profile", "Notifications", "Access & Security"].map((t) => (
            <Button
              key={t}
              variant="ghost"
              className={tab === t ? "active" : ""}
              onClick={() => setTab(t)}
            >
              {t}
            </Button>
          ))}
        </div>
        <div className="settings-form">
          {tab === "Company Profile" ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<
                  string,
                  string
                >;
                setClients((s) =>
                  s.map((c) =>
                    c.id === client.id ? { ...c, name: v.name, industry: v.industry } : c,
                  ),
                );
                toast.success("Company preferences saved for this demo");
              }}
            >
              <div className="form-fields">
                <label>
                  Company name
                  <Input name="name" defaultValue={client.name} required />
                </label>
                <label>
                  Company domain
                  <Input value={client.domain} readOnly />
                </label>
                <label>
                  Industry
                  <Input name="industry" defaultValue={client.industry} required />
                </label>
                <label>
                  Contact email
                  <Input
                    name="email"
                    type="email"
                    defaultValue={`contact@${client.id}.example`}
                    required
                  />
                </label>
                <label>
                  Currency
                  <select>
                    <option>INR — Indian Rupee</option>
                  </select>
                </label>
                <label>
                  Timezone
                  <select>
                    <option>Asia/Kolkata (UTC +05:30)</option>
                  </select>
                </label>
              </div>
              <p className="text-[10px] mt-4">
                Contact details are fictional sample data. Domain and module access are managed by
                Super Admin.
              </p>
              <Button type="submit" className="mt-6">
                <Save />
                Save preferences
              </Button>
            </form>
          ) : tab === "Notifications" ? (
            <>
              <div className="settings-row">
                <div>
                  <strong>Workspace notifications</strong>
                  <p>Sales and accounting activity alerts</p>
                </div>
                <Switch
                  checked={notifications}
                  onCheckedChange={(v) => {
                    setNotifications(v);
                    toast.success("Notification preference updated");
                  }}
                  aria-label="Workspace notifications"
                />
              </div>
              <div className="settings-row">
                <div>
                  <strong>Low stock alerts</strong>
                  <p>Notify when products have fewer than 25 units</p>
                </div>
                <Switch
                  checked={alerts}
                  onCheckedChange={(v) => {
                    setAlerts(v);
                    toast.success("Stock alert preference updated");
                  }}
                  aria-label="Low stock alerts"
                />
              </div>
            </>
          ) : (
            <>
              <div className="info-banner">
                <ShieldCheck />
                Company data is scoped to {client.name}.
              </div>
              <div className="settings-row">
                <div>
                  <strong>Assigned role</strong>
                  <p>Company Admin · Demo session</p>
                </div>
              </div>
              <div className="settings-row">
                <div>
                  <strong>Assigned modules</strong>
                  <p>{client.modules.join(", ")}</p>
                </div>
              </div>
              <p className="mt-5 text-xs">
                Super Admin provisions user logins and assigns module permissions. This prototype
                does not enforce secure authentication or backend access policies.
              </p>
            </>
          )}
        </div>
      </Panel>
      <Isolation name={client.name} />
    </>
  );
}
export function ReportsPage({ client }: { client: Client }) {
  const { products, entries } = useDemo();
  const items = products[client.id] ?? [];
  const tx = entries.filter((e) => e.tenant === client.id);
  const reports = [
    {
      title: "Stock Valuation",
      description: "Product quantities, unit costs, and current stock value.",
      icon: Package,
      run: () =>
        exportCsv(
          `${client.id}-valuation`,
          ["Product", "Stock", "Unit Price", "Value"],
          items.map((p) => [p.name, p.stock, p.price, p.stock * p.price]),
        ),
    },
    {
      title: "Sales & Income",
      description: "Income transactions and customer payment records.",
      icon: BarChart3,
      run: () =>
        exportCsv(
          `${client.id}-income`,
          ["Description", "Amount", "Date"],
          tx.filter((e) => e.type === "Income").map((e) => [e.name, e.amount, e.date]),
        ),
    },
    {
      title: "Expense Statement",
      description: "Company expenses and outgoing payments.",
      icon: Wallet,
      run: () =>
        exportCsv(
          `${client.id}-expenses`,
          ["Description", "Amount", "Date"],
          tx.filter((e) => e.type === "Expense").map((e) => [e.name, e.amount, e.date]),
        ),
    },
    {
      title: "Inventory Ledger",
      description: "Stock locations, current quantities, and updated dates.",
      icon: FileText,
      run: () =>
        exportCsv(
          `${client.id}-ledger`,
          ["Product", "SKU", "Location", "Quantity", "Updated"],
          items.map((p) => [p.name, p.sku, p.location, p.stock, p.updated]),
        ),
    },
    {
      title: "Outstanding Invoices",
      description: "Pending invoices and customer receivables.",
      icon: FileText,
      run: () =>
        exportCsv(
          `${client.id}-invoices`,
          ["Invoice", "Amount", "Status"],
          tx.filter((e) => e.type === "Invoice").map((e) => [e.name, e.amount, e.status]),
        ),
    },
    {
      title: "Financial Summary",
      description: "A consolidated snapshot of demo financial records.",
      icon: Wallet,
      run: () =>
        exportCsv(
          `${client.id}-summary`,
          ["Type", "Amount"],
          tx.map((e) => [e.type, e.amount]),
        ),
    },
  ];
  return (
    <>
      <PageHeader
        title="Reports"
        subtitle="Turn your company data into clear, actionable insights."
      />
      <div className="info-banner">
        <ShieldCheck size={17} />
        Exports contain {client.name} records only. All figures are demo data.
      </div>
      <div className="report-grid">
        {reports.map((r) => (
          <div className="report-card" key={r.title}>
            <r.icon size={27} />
            <h3>{r.title}</h3>
            <p>{r.description}</p>
            <Button variant="outline" onClick={r.run}>
              <Download />
              Download CSV
            </Button>
          </div>
        ))}
      </div>
      <Isolation name={client.name} />
    </>
  );
}
