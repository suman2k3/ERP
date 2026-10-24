import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Package,
  IndianRupee,
  ShoppingBag,
  Wallet,
  ArrowRight,
  Plus,
  ShoppingCart,
  CheckCircle2,
  AlertTriangle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/erp/store";
import { money, stockStatus, type Client } from "@/lib/erp/data";
import {
  PageHeader,
  Kpi,
  Panel,
  SelectField,
  Status,
  DataTable,
  Isolation,
  FormDialog,
} from "./common";
import { SalesChart, StockChart } from "./charts";
import productImage from "@/assets/products.svg";
export function Dashboard({ client }: { client: Client }) {
  const { products, entries, setEntries, log } = useDemo();
  const items = products[client.id] ?? [];
  const [period, setPeriod] = useState("Last 6 months");
  const stockValue = items.reduce((s, p) => s + p.stock * p.price, 0);
  const low = items.filter((p) => p.stock < 25);
  const factor = client.id === "bugyboo" ? 1 : client.id === "aash" ? 2.3 : 1.4;
  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={`Welcome back, Aarav! Here’s what’s happening at ${client.name} today.`}
      >
        <SelectField
          label="Dashboard period"
          value={period}
          onChange={setPeriod}
          options={["Last 6 months", "This month", "Last month"]}
        />
        {client.modules.includes("accounts") && (
          <FormDialog
            title="Create invoice"
            fields={[
              { name: "customer", label: "Customer name" },
              { name: "amount", label: "Amount (₹)", type: "number" },
              { name: "due", label: "Due date", type: "date" },
            ]}
            onSubmit={(v) => {
              setEntries((s) => [
                {
                  id: crypto.randomUUID(),
                  tenant: client.id,
                  name: `Invoice · ${v.customer}`,
                  type: "Invoice",
                  amount: Number(v.amount),
                  date: "10 Oct 2026",
                  status: "Pending",
                },
                ...s,
              ]);
              log(`${client.name} · New invoice created`);
            }}
            trigger={
              <Button>
                <Plus />
                Create invoice
              </Button>
            }
          />
        )}
      </PageHeader>
      <div className="kpi-grid">
        <Kpi
          title="Total Products"
          value={String(items.length)}
          change="12.5%"
          icon={<Package />}
        />
        <Kpi
          title="Total Stock Value"
          value={money(stockValue)}
          change="8.2%"
          icon={<IndianRupee />}
        />
        <Kpi
          title="Sales This Month"
          value={money(318500 * factor)}
          change="18.4%"
          icon={<ShoppingBag />}
        />
        <Kpi
          title="Total Expenses"
          value={money(162400 * factor)}
          change="4.1%"
          icon={<Wallet />}
          negative
        />
      </div>
      <div className="chart-grid">
        <Panel
          title="Sales Overview"
          subtitle="Your business performance over time"
          action={
            <div className="chart-legend">
              <span>
                <i className="legend-dot" />
                Sales revenue
              </span>
            </div>
          }
        >
          <SalesChart period={period} />
          <div className="chart-note">
            Sample sales · {client.name} · {period}
          </div>
        </Panel>
        <Panel title="Stock Status" subtitle="A snapshot of your inventory">
          <StockChart products={items} />
        </Panel>
      </div>
      <div className="bottom-grid">
        <Panel
          title="Low Stock Items"
          subtitle={`${low.length} products need your attention`}
          action={
            client.modules.includes("stock") ? (
              <Link
                to="/workspace/$tenant/$page"
                params={{ tenant: client.id, page: "stock" }}
                className="text-link"
              >
                View all <ArrowRight size={13} />
              </Link>
            ) : undefined
          }
        >
          <DataTable
            headers={["Product", "Available", "Status"]}
            rows={low.map((p) => [
              <div className="product-cell">
                <img src={productImage} alt="Product illustration" className="product-thumb" />
                <div>
                  <strong>{p.name}</strong>
                  <small>{p.sku}</small>
                </div>
              </div>,
              <strong>
                {p.stock} <span className="text-muted-foreground font-normal">units</span>
              </strong>,
              <Status>{stockStatus(p.stock)}</Status>,
            ])}
          />
        </Panel>
        <Panel
          title="Recent Activity"
          action={<span className="text-muted-foreground text-[9px]">Today</span>}
        >
          <div className="activity-list">
            {[
              {
                icon: ShoppingCart,
                title: "New sales order received",
                detail: `Order #SO-1048 · ${money(24500 * factor)}`,
                time: "10 minutes ago",
              },
              {
                icon: CheckCircle2,
                title: "Stock received at Mumbai warehouse",
                detail: "Purchase order #PO-018 · 48 units",
                time: "45 minutes ago",
              },
              {
                icon: AlertTriangle,
                title: "Low stock alert",
                detail: `${low[0]?.name ?? "All products in stock"}`,
                time: "1 hour ago",
              },
              {
                icon: FileText,
                title: entries.filter((e) => e.tenant === client.id)[0]?.name ?? "Workspace ready",
                detail: "Accounts updated",
                time: "2 hours ago",
              },
            ].map((a, i) => (
              <div className="activity" key={i}>
                <span className="activity-icon">
                  <a.icon size={14} />
                </span>
                <div>
                  <strong>{a.title}</strong>
                  <p>{a.detail}</p>
                  <small>{a.time}</small>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
      <Isolation name={client.name} />
    </>
  );
}
