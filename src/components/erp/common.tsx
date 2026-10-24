import { useState, type ReactNode, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Boxes,
  Check,
  ChevronDown,
  Download,
  Search,
  ShieldCheck,
  Sparkles,
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
import { toast } from "sonner";
import type { Client } from "@/lib/erp/data";
export function Brand({
  inverse = false,
  size = "md",
}: {
  inverse?: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div className={`clicker-brand ${inverse ? "inverse" : ""} brand-${size}`}>
      <span className="brand-mark">
        <img src="/logo.png" alt="The Clicker India" />
      </span>
      <div>
        the clicker<span>INDIA</span>
      </div>
    </div>
  );
}
export function TenantLogo({ client, large = false }: { client: Client; large?: boolean }) {
  return (
    <div className={`tenant-logo ${client.style} ${large ? "large" : ""}`}>
      {client.logo ? (
        <img src={client.logo} alt={client.name} />
      ) : (
        <>
          <span className="tenant-symbol">{client.initials}</span>
          <span>{client.name}</span>
        </>
      )}
    </div>
  );
}
export function Status({ children }: { children: ReactNode }) {
  return (
    <span
      className={`status ${String(children).match(/Out|Inactive|Suspended/) ? "bad" : String(children).match(/Low|Pending|Draft/) ? "warn" : "good"}`}
    >
      <span />
      {children}
    </span>
  );
}
export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="heading-actions">{children}</div>
    </div>
  );
}
export function Kpi({
  title,
  value,
  change,
  icon,
  negative = false,
}: {
  title: string;
  value: string;
  change: string;
  icon: ReactNode;
  negative?: boolean;
}) {
  return (
    <div className="kpi">
      <div className="kpi-top">
        <span>{title}</span>
        <span className="kpi-icon">{icon}</span>
      </div>
      <strong>{value}</strong>
      <div className="kpi-bottom">
        <span className={negative ? "negative" : "positive"}>
          {negative ? <ArrowDownRight size={14} /> : <ArrowUpRight size={14} />} {change}
        </span>
        <span>vs. last month</span>
      </div>
    </div>
  );
}
export function Panel({
  title,
  subtitle,
  action,
  children,
  className = "",
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`panel ${className}`}>
      <div className="panel-heading">
        <div>
          <h2>{title}</h2>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
export function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
  options: string[];
}) {
  return (
    <label className="select-wrap">
      <span className="sr-only">{label}</span>
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>
      <ChevronDown size={14} />
    </label>
  );
}
export function SearchField({
  value,
  onChange,
  placeholder = "Search…",
}: {
  value: string;
  onChange: (s: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="search-field">
      <Search size={17} />
      <Input
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
export function DataTable({
  headers,
  rows,
  empty = "No results found. Try a different search or filter.",
}: {
  headers: string[];
  rows: ReactNode[][];
  empty?: string;
}) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && (
        <div className="empty-state">
          <Search />
          <h3>No results</h3>
          <p>{empty}</p>
        </div>
      )}
    </div>
  );
}
export type Field = {
  name: string;
  label: string;
  type?: string;
  options?: string[];
  value?: string;
  required?: boolean;
};
export function FormDialog({
  title,
  description = "Changes are saved in this demo only.",
  fields,
  onSubmit,
  trigger,
  open: externalOpen,
  onOpenChange,
}: {
  title: string;
  description?: string;
  fields: Field[];
  onSubmit: (v: Record<string, string>) => void;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (v: boolean) => void;
}) {
  const [local, setLocal] = useState(false);
  const open = externalOpen ?? local;
  const setOpen = onOpenChange ?? setLocal;
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const values = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<
      string,
      string
    >;
    onSubmit(values);
    setOpen(false);
    toast.success(`${title} completed`, { description: "Updated for this demo session." });
  }
  return (
    <>
      <span onClick={() => setOpen(true)}>{trigger}</span>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="form-dialog">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <form onSubmit={submit}>
            <div className="form-fields">
              {fields.map((f) => (
                <label key={f.name}>
                  {f.label}
                  {f.options ? (
                    <select name={f.name} defaultValue={f.value} required={f.required !== false}>
                      {f.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  ) : (
                    <Input
                      name={f.name}
                      type={f.type ?? "text"}
                      defaultValue={f.value}
                      min={f.type === "number" ? 0 : undefined}
                      required={f.required !== false}
                    />
                  )}
                </label>
              ))}
            </div>
            <div className="dialog-actions">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Check />
                Save changes
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
export function exportCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const content = [headers, ...rows]
    .map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(","))
    .join("\n");
  const url = URL.createObjectURL(new Blob([content], { type: "text/csv" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = filename + ".csv";
  a.click();
  URL.revokeObjectURL(url);
  toast.success("Report exported");
}
export function ExportButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outline" onClick={onClick}>
      <Download />
      Export
    </Button>
  );
}
export function DemoNote() {
  return (
    <span className="demo-label">
      <Sparkles size={12} />
      Demo prototype
    </span>
  );
}
export function Isolation({ name }: { name: string }) {
  return (
    <div className="isolation">
      <ShieldCheck size={14} />
      <span>{name} workspace · Company data is isolated</span>
      <DemoNote />
    </div>
  );
}
export function PortalLink() {
  return (
    <Link to="/" className="text-link">
      Back to companies <ArrowRight size={15} />
    </Link>
  );
}
