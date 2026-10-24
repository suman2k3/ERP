import { useState, type FormEvent } from "react";
import { Link } from "@tanstack/react-router";
import {
  Building2,
  Users,
  ShieldCheck,
  Layers,
  Plus,
  Pencil,
  CheckCircle2,
  History,
  Save,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDemo } from "@/lib/erp/store";
import { modules, type Client } from "@/lib/erp/data";
import { Shell, adminNav } from "./shell";
import {
  PageHeader,
  Kpi,
  Panel,
  SearchField,
  SelectField,
  Status,
  DataTable,
  FormDialog,
  TenantLogo,
  DemoNote,
} from "./common";
import { toast } from "sonner";
export function Admin({ section }: { section: string }) {
  const { clients, setClients, users, setUsers, logs, log } = useDemo();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All Statuses");
  const [clientEdit, setClientEdit] = useState<Client | null>(null);
  const [clientOpen, setClientOpen] = useState(false);
  const [selected, setSelected] = useState(clients[0]?.id ?? "");
  const [role, setRole] = useState("Company Admin");
  const [logo, setLogo] = useState("");
  const [assigned, setAssigned] = useState(modules);
  const [adminEntered, setAdminEntered] = useState(false);
  if (!adminNav.some((n) => n.id === section))
    return (
      <div className="empty-state">
        <h1>Admin page not found</h1>
      </div>
    );
  if (!adminEntered)
    return (
      <div className="login-body min-h-screen">
        <div className="login-panel">
          <div className="flex justify-center mb-5">
            <ShieldCheck size={34} className="text-primary" />
          </div>
          <h1>Super Admin demo</h1>
          <p>Platform administration is separate from company workspaces.</p>
          <div className="info-banner">
            Prototype only — this entry is not a secure administrator login.
          </div>
          <Button className="w-full" onClick={() => setAdminEntered(true)}>
            Enter administration demo
          </Button>
          <a href="/" className="text-link mt-5">
            Back to companies
          </a>
        </div>
      </div>
    );
  const filtered = clients.filter(
    (c) =>
      (c.name + c.domain).toLowerCase().includes(search.toLowerCase()) &&
      (filter === "All Statuses" || c.status === filter),
  );
  const active = clients.find((c) => c.id === selected);
  function openClient(c?: Client) {
    setClientEdit(c ?? null);
    setLogo(c?.logo ?? "");
    setAssigned(c?.modules ?? modules);
    setClientOpen(true);
  }
  function saveClient(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    if (clients.some((c) => c.domain === v.domain && c.id !== clientEdit?.id)) {
      toast.error("This domain is already assigned to another client.");
      return;
    }
    const c: Client = {
      id:
        clientEdit?.id ??
        v.name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now().toString().slice(-4),
      name: v.name,
      domain: v.domain,
      industry: v.industry,
      initials: v.name.slice(0, 2).toUpperCase(),
      style: clientEdit?.style ?? "aash",
      status: v.status,
      modules: assigned,
      logo: logo || v.logo || undefined,
    };
    setClients((s) => (clientEdit ? s.map((a) => (a.id === c.id ? c : a)) : [...s, c]));
    log(`Super Admin · Client ${clientEdit ? "updated" : "created"}: ${c.name}`);
    setClientOpen(false);
    toast.success("Client workspace configured");
  }
  return (
    <Shell admin>
      <PageHeader
        title={
          section === "dashboard"
            ? "Super Admin Dashboard"
            : (adminNav.find((n) => n.id === section)?.label ?? "Administration")
        }
        subtitle="Manage the platform. Keep every company workspace independent."
      >
        {(section === "clients" || section === "dashboard") && (
          <Button onClick={() => openClient()}>
            <Plus />
            Add client
          </Button>
        )}
        {section === "users" && (
          <FormDialog
            title="Add user login"
            description="Provisioning is simulated; no real account or password is created."
            fields={[
              { name: "name", label: "Full name" },
              { name: "email", label: "Email", type: "email" },
              { name: "tenant", label: "Assigned client", options: clients.map((c) => c.name) },
              { name: "role", label: "Role", options: ["Company Admin", "Manager", "Viewer"] },
              { name: "status", label: "Status", options: ["Active", "Inactive"] },
            ]}
            onSubmit={(v) => {
              const c = clients.find((c) => c.name === v.tenant);
              if (!c) return;
              setUsers((s) => [
                ...s,
                {
                  id: crypto.randomUUID(),
                  name: v.name,
                  email: v.email,
                  tenant: c.id,
                  role: v.role,
                  status: v.status,
                },
              ]);
              log(`Super Admin · User assigned to ${c.name}`);
            }}
            trigger={
              <Button>
                <Plus />
                Add user
              </Button>
            }
          />
        )}
      </PageHeader>
      <div className="info-banner">
        <ShieldCheck size={17} />
        <span>
          Company-data isolation: users are assigned to one client. Module access is configured
          independently for each workspace.
        </span>
        <DemoNote />
      </div>
      {section === "dashboard" && (
        <div className="kpi-grid">
          <Kpi
            title="Total Clients"
            value={String(clients.length)}
            change="6 provisioned"
            icon={<Building2 />}
          />
          <Kpi
            title="Active Clients"
            value={String(clients.filter((c) => c.status === "Active").length)}
            change="Healthy"
            icon={<CheckCircle2 />}
          />
          <Kpi
            title="User Logins"
            value={String(users.length)}
            change="Assigned"
            icon={<Users />}
          />
          <Kpi
            title="ERP Modules"
            value={String(modules.length)}
            change="Available"
            icon={<Layers />}
          />
        </div>
      )}
      {(section === "clients" || section === "dashboard") && (
        <Panel title="Client Workspaces" subtitle="Domains, status, and assigned modules">
          <div className="table-toolbar">
            <SearchField
              value={search}
              onChange={setSearch}
              placeholder="Search clients or domains…"
            />
            <SelectField
              label="Client status"
              value={filter}
              onChange={setFilter}
              options={["All Statuses", "Active", "Inactive", "Suspended"]}
            />
          </div>
          <DataTable
            headers={["Client", "Domain", "Modules", "Users", "Status", "Actions"]}
            rows={filtered.map((c) => [
              <TenantLogo client={c} />,
              c.domain,
              `${c.modules.length} modules`,
              users.filter((u) => u.tenant === c.id).length,
              <Status>{c.status}</Status>,
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Edit ${c.name}`}
                  onClick={() => openClient(c)}
                  title={`Edit ${c.name}`}
                >
                  <Pencil />
                </Button>
                <Button asChild variant="ghost" size="icon" title={`Open ${c.name} Login`}>
                  <Link to="/login/$tenant" params={{ tenant: c.id }}>
                    <ExternalLink size={14} />
                  </Link>
                </Button>
              </div>,
            ])}
          />
        </Panel>
      )}
      {section === "users" && (
        <Panel title="User Logins" subtitle="Demo users only — no real authentication accounts">
          <div className="table-toolbar">
            <SearchField value={search} onChange={setSearch} placeholder="Search users or email…" />
            <SelectField
              label="User status"
              value={filter}
              onChange={setFilter}
              options={["All Statuses", "Active", "Inactive"]}
            />
          </div>
          <DataTable
            headers={["Name", "Email", "Assigned Tenant", "Role", "Status", "Actions"]}
            rows={users
              .filter(
                (u) =>
                  (u.name + u.email).toLowerCase().includes(search.toLowerCase()) &&
                  (filter === "All Statuses" || u.status === filter),
              )
              .map((u) => [
                u.name,
                u.email,
                clients.find((c) => c.id === u.tenant)?.name,
                u.role,
                <Status>{u.status}</Status>,
                <FormDialog
                  title="Edit user assignment"
                  fields={[
                    {
                      name: "tenant",
                      label: "Assigned client",
                      options: clients.map((c) => c.name),
                      value: clients.find((c) => c.id === u.tenant)?.name,
                    },
                    {
                      name: "role",
                      label: "Role",
                      options: ["Company Admin", "Manager", "Viewer"],
                      value: u.role,
                    },
                    {
                      name: "status",
                      label: "Status",
                      options: ["Active", "Inactive"],
                      value: u.status,
                    },
                  ]}
                  onSubmit={(v) => {
                    const c = clients.find((c) => c.name === v.tenant);
                    if (!c) return;
                    setUsers((s) =>
                      s.map((a) =>
                        a.id === u.id ? { ...a, tenant: c.id, role: v.role, status: v.status } : a,
                      ),
                    );
                    log(`Super Admin · User assignment updated for ${c.name}`);
                  }}
                  trigger={
                    <Button variant="ghost" size="icon" aria-label={`Edit user ${u.name}`}>
                      <Pencil />
                    </Button>
                  }
                />,
              ])}
          />
        </Panel>
      )}
      {section === "roles" && (
        <Panel
          title="Roles & Module Permissions"
          subtitle="Configure company-wide visibility for each tenant"
        >
          <div className="permission-client-select">
            <SelectField
              label="Configure client permissions"
              value={active?.name ?? ""}
              options={clients.map((c) => c.name)}
              onChange={(v) => {
                const c = clients.find((c) => c.name === v);
                if (c) setSelected(c.id);
              }}
            />
          </div>
          <div className="permission-grid">
            {modules.map((m) => (
              <div className="permission-row" key={m}>
                <div>
                  <strong className="capitalize">{m}</strong>
                  <p>
                    {active?.name} users {active?.modules.includes(m) ? "can" : "cannot"} view this
                    module.
                  </p>
                </div>
                <Switch
                  aria-label={`Enable ${m} for ${active?.name}`}
                  checked={active?.modules.includes(m) ?? false}
                  onCheckedChange={(v) => {
                    setClients((s) =>
                      s.map((c) =>
                        c.id === selected
                          ? {
                              ...c,
                              modules: v ? [...c.modules, m] : c.modules.filter((a) => a !== m),
                            }
                          : c,
                      ),
                    );
                    log(`Super Admin · ${m} ${v ? "enabled" : "disabled"} for ${active?.name}`);
                    toast.success("Module access updated");
                  }}
                />
              </div>
            ))}
            <div className="settings-row">
              <div>
                <strong>User role capabilities</strong>
                <p>
                  Company Admin: full access · Manager: edit records · Viewer: read only
                  (illustrative role definitions).
                </p>
              </div>
            </div>
          </div>
        </Panel>
      )}
      {section === "modules" && (
        <div className="modules-grid">
          {modules.map((m) => (
            <div className="module-card" key={m}>
              <Layers size={25} />
              <h3>{m}</h3>
              <p>
                {clients.filter((c) => c.modules.includes(m)).length} of {clients.length} clients
                have this module assigned.
              </p>
              <Status>Available</Status>
              <Button
                variant="link"
                className="mt-3"
                onClick={() => {
                  setSelected(clients[0]?.id ?? "");
                  toast.info("Use Roles & Permissions to assign this module to a company.");
                }}
              >
                View availability
              </Button>
            </div>
          ))}
        </div>
      )}
      {section === "logs" && (
        <Panel title="Platform Activity Logs">
          <div className="table-toolbar">
            <SearchField value={search} onChange={setSearch} placeholder="Search activity…" />
          </div>
          <DataTable
            headers={["Activity", "Scope", "Environment"]}
            rows={logs
              .filter((l) => l.toLowerCase().includes(search.toLowerCase()))
              .map((l) => [
                <span className="flex items-center gap-2">
                  <History size={14} />
                  {l}
                </span>,
                l.startsWith("Super") ? "Platform" : "Company / system",
                <DemoNote />,
              ])}
          />
        </Panel>
      )}
      <Dialog open={clientOpen} onOpenChange={setClientOpen}>
        <DialogContent className="form-dialog">
          <DialogHeader>
            <DialogTitle>{clientEdit ? "Edit client" : "Add client"}</DialogTitle>
            <DialogDescription>
              Provision a separate company workspace and assign ERP modules. Demo only.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={saveClient}>
            <div className="form-fields">
              <label>
                Client name
                <Input name="name" defaultValue={clientEdit?.name} required />
              </label>
              <label>
                Domain
                <Input
                  name="domain"
                  placeholder="company.theclicker.in"
                  defaultValue={clientEdit?.domain}
                  required
                  pattern="[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
                />
              </label>
              <label>
                Industry
                <Input name="industry" defaultValue={clientEdit?.industry} required />
              </label>
              <label>
                Logo URL (optional)
                <Input
                  name="logo"
                  type="url"
                  defaultValue={clientEdit?.logo?.startsWith("http") ? clientEdit.logo : ""}
                />
              </label>
              <label>
                Or upload logo
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const r = new FileReader();
                      r.onload = () => setLogo(String(r.result));
                      r.readAsDataURL(file);
                    }
                  }}
                />
              </label>
              {logo && (
                <img
                  src={logo}
                  alt="Client logo preview"
                  className="max-h-14 max-w-40 object-contain"
                />
              )}
              <label>
                Status
                <select name="status" defaultValue={clientEdit?.status ?? "Active"}>
                  <option>Active</option>
                  <option>Inactive</option>
                  <option>Suspended</option>
                </select>
              </label>
            </div>
            <label className="field-label">Assigned modules</label>
            <div className="module-checkboxes">
              {modules.map((m) => (
                <label key={m}>
                  <input
                    type="checkbox"
                    checked={assigned.includes(m)}
                    onChange={(e) =>
                      setAssigned((s) => (e.target.checked ? [...s, m] : s.filter((a) => a !== m)))
                    }
                  />
                  {m}
                </label>
              ))}
            </div>
            <div className="dialog-actions">
              <Button type="button" variant="outline" onClick={() => setClientOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">
                <Save />
                Save client
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <div className="isolation">
        <ShieldCheck size={14} />
        Super Admin is separate from client accounts. All provisioning is simulated.
        <DemoNote />
      </div>
    </Shell>
  );
}
