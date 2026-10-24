import { useState, type ReactNode } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Wallet,
  BarChart3,
  Settings,
  Building2,
  Users,
  ShieldCheck,
  Layers,
  History,
  Search,
  Bell,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  LogOut,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Brand, SelectField, SearchField, DemoNote, FormDialog } from "./common";
import { useDemo } from "@/lib/erp/store";
import type { Client } from "@/lib/erp/data";
import { toast } from "sonner";
export const tenantNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "stock", label: "Stock Management", icon: Package },
  { id: "inventory", label: "Inventory Management", icon: Boxes },
  { id: "accounts", label: "Account Management", icon: Wallet },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];
export const adminNav = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "clients", label: "Manage Clients", icon: Building2 },
  { id: "users", label: "User Logins", icon: Users },
  { id: "roles", label: "Roles & Permissions", icon: ShieldCheck },
  { id: "modules", label: "ERP Modules", icon: Layers },
  { id: "logs", label: "Activity Logs", icon: History },
];
export function Shell({
  client,
  admin = false,
  children,
}: {
  client?: Client;
  admin?: boolean;
  children: ReactNode;
}) {
  const { setSession, products, logs } = useDemo();
  const [collapsed, setCollapsed] = useState(false);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("This month");
  const navigate = useNavigate();
  const nav = admin ? adminNav : tenantNav.filter((n) => client?.modules.includes(n.id));
  const matches = nav.filter((n) => n.label.toLowerCase().includes(search.toLowerCase()));
  const productMatches = client
    ? (products[client.id] ?? [])
        .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        .slice(0, 3)
    : [];
  return (
    <div className={`app-shell ${collapsed ? "collapsed" : ""} ${mobile ? "mobile-open" : ""}`}>
      {mobile && <div className="mobile-overlay" onClick={() => setMobile(false)} />}
      <aside className="sidebar">
        <Brand inverse />
        <div className="sidebar-tenant">
          <span className={`tenant-logo ${client?.style ?? ""}`}>
            <span className="tenant-symbol">
              {admin ? <ShieldCheck size={19} /> : client?.initials}
            </span>
          </span>
          <div>
            <strong>{admin ? "Super Admin" : client?.name}</strong>
            <small>{admin ? "Platform administration" : "Company workspace"}</small>
          </div>
        </div>
        <span className="nav-caption">{admin ? "ADMINISTRATION" : "WORKSPACE"}</span>
        <nav>
          {nav.map((n) =>
            admin ? (
              <Link
                key={n.id}
                to="/admin/$section"
                params={{ section: n.id }}
                activeOptions={{ exact: true }}
                title={n.label}
                onClick={() => setMobile(false)}
              >
                <n.icon />
                <span>{n.label}</span>
              </Link>
            ) : (
              <Link
                key={n.id}
                to="/workspace/$tenant/$page"
                params={{ tenant: client?.id ?? "", page: n.id }}
                activeOptions={{ exact: true }}
                title={n.label}
                onClick={() => setMobile(false)}
              >
                <n.icon />
                <span>{n.label}</span>
              </Link>
            ),
          )}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-tip">
            <ShieldCheck size={19} />
            <strong>
              {admin ? "One platform. Clear boundaries." : "Your data. Your workspace."}
            </strong>
            {admin
              ? "Provision client access and manage permissions independently."
              : "Only your company’s records and assigned modules are shown."}
          </div>
          <FormDialog
            title="Workspace support"
            fields={[
              { name: "subject", label: "Subject" },
              { name: "message", label: "Your message" },
            ]}
            onSubmit={() => toast.info("Support request recorded locally")}
            trigger={
              <Button variant="ghost" className="mt-3 w-full text-sidebar-foreground">
                <HelpCircle />
                Help & support
              </Button>
            }
          />
          <Link to="/" onClick={() => setSession(null)}>
            <LogOut size={16} />
            <span>Leave demo workspace</span>
          </Link>
        </div>
      </aside>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-start">
            <Button
              size="icon"
              variant="ghost"
              className="menu-desktop"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed(!collapsed)}
            >
              {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="menu-mobile"
              aria-label="Open navigation"
              onClick={() => setMobile(!mobile)}
            >
              <Menu />
            </Button>
            <div className="topbar-search">
              <SearchField
                value={search}
                onChange={setSearch}
                placeholder={admin ? "Search administration…" : "Search your workspace…"}
              />
              {search && (
                <div className="quick-results">
                  {matches.map((n) =>
                    admin ? (
                      <Link
                        key={n.id}
                        to="/admin/$section"
                        params={{ section: n.id }}
                        onClick={() => setSearch("")}
                      >
                        <n.icon size={17} />
                        {n.label}
                        <ArrowRight size={13} />
                      </Link>
                    ) : (
                      <Link
                        key={n.id}
                        to="/workspace/$tenant/$page"
                        params={{ tenant: client?.id ?? "", page: n.id }}
                        onClick={() => setSearch("")}
                      >
                        <n.icon size={17} />
                        {n.label}
                        <ArrowRight size={13} />
                      </Link>
                    ),
                  )}
                  {client?.modules.includes("stock") &&
                    productMatches.map((p) => (
                      <Link
                        key={p.id}
                        to="/workspace/$tenant/$page"
                        params={{ tenant: client.id, page: "stock" }}
                        search={{ q: p.name }}
                        onClick={() => setSearch("")}
                      >
                        <Package size={16} />
                        {p.name}
                      </Link>
                    ))}
                  {matches.length === 0 && productMatches.length === 0 && (
                    <p>No matches in this workspace.</p>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="topbar-actions">
            <SelectField
              label="Workspace date range"
              value={date}
              onChange={(v) => {
                setDate(v);
                toast.info(`Date range: ${v}`, {
                  description: "Use page filters for sample chart and transaction periods.",
                });
              }}
              options={["This month", "Last month", "Last 6 months"]}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="notification-icon"
                  aria-label="Notifications"
                >
                  <Bell size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="end" className="menu-panel">
                <h3>Notifications</h3>
                <div className="notification-list">
                  {admin ? (
                    logs.slice(0, 3).map((l, i) => (
                      <div key={i}>
                        {l}
                        <small>Demo activity</small>
                      </div>
                    ))
                  ) : (
                    <>
                      <div>
                        3 products need your attention<small>Low stock · Today, 09:30 AM</small>
                      </div>
                      <div>
                        Invoice INV-2026-043 is pending<small>Accounts · Today, 10:15 AM</small>
                      </div>
                    </>
                  )}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => toast.success("All notifications marked as read")}
                >
                  Mark all as read
                </Button>
              </PopoverContent>
            </Popover>
            <div className="topbar-divider" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="profile-trigger">
                  <span className="avatar">{admin ? "SA" : "AS"}</span>
                  <span className="profile-name">
                    <strong>{admin ? "Super Admin" : "Aarav Sharma"}</strong>
                    <small>{admin ? "Platform owner" : "Company Admin"}</small>
                  </span>
                  <ChevronDown size={13} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  {admin ? "Platform administrator" : client?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {!admin && client?.modules.includes("settings") && (
                  <DropdownMenuItem
                    onClick={() =>
                      navigate({
                        to: "/workspace/$tenant/$page",
                        params: { tenant: client.id, page: "settings" },
                      })
                    }
                  >
                    <Settings size={14} />
                    Workspace settings
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={() =>
                    toast.info("Frontend demo — no secure authentication or persistent data")
                  }
                >
                  Demo session information
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    setSession(null);
                    navigate({ to: "/" });
                  }}
                >
                  <LogOut size={14} />
                  Leave demo
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>
        <main className="workspace-body">{children}</main>
      </div>
    </div>
  );
}
