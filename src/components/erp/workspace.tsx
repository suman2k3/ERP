import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useDemo } from "@/lib/erp/store";
import { Shell, tenantNav } from "./shell";
import { Dashboard } from "./dashboard";
import { Stock } from "./stock";
import { Inventory } from "./inventory";
import { Accounts } from "./accounts";
import { SettingsPage, ReportsPage } from "./settings-reports";
export function Workspace({
  tenant,
  page,
  query,
}: {
  tenant: string;
  page: string;
  query?: string;
}) {
  const { clients, session } = useDemo();
  const client = clients.find((c) => c.id === tenant);
  if (!client || !tenantNav.some((n) => n.id === page))
    return (
      <div className="empty-state">
        <h1>Workspace not found</h1>
        <Button asChild variant="link">
          <Link to="/">Back to Homepage</Link>
        </Button>
      </div>
    );
  if (session !== client.id || client.status !== "Active")
    return (
      <div className="portal min-h-screen flex items-center justify-center p-6 bg-background">
        <div className="login-panel max-w-md w-full text-center p-8 bg-card rounded-2xl border border-border shadow-raised">
          <h1 className="text-xl font-bold text-foreground">
            {client.status !== "Active"
              ? "Workspace Unavailable"
              : session
                ? "Access Denied"
                : "Authentication Required"}
          </h1>
          <p className="my-4 text-xs text-muted-foreground leading-relaxed">
            {client.status !== "Active"
              ? `The ${client.name} workspace is currently inactive.`
              : session
                ? `You are not authorized to access ${client.name} records with your current session. Please sign in with an authorized account.`
                : `Please sign in with your ${client.name} credentials to access this workspace.`}
          </p>
          <div className="flex flex-col gap-2 mt-6">
            <Button asChild className="w-full">
              <Link to="/login/$tenant" params={{ tenant: client.id }}>
                Sign in to {client.name}
              </Link>
            </Button>
            <Button asChild variant="ghost" className="w-full text-xs">
              <Link to="/">Back to Homepage</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  return (
    <Shell client={client}>
      {!client.modules.includes(page) ? (
        <div className="empty-state">
          <h1>Module not assigned</h1>
          <p>
            Your company does not have access to this module. Ask your administrator to configure
            access.
          </p>
        </div>
      ) : page === "dashboard" ? (
        <Dashboard client={client} />
      ) : page === "stock" ? (
        <Stock key={tenant} client={client} query={query} />
      ) : page === "inventory" ? (
        <Inventory key={tenant} client={client} />
      ) : page === "accounts" ? (
        <Accounts key={tenant} client={client} />
      ) : page === "reports" ? (
        <ReportsPage client={client} />
      ) : (
        <SettingsPage key={tenant} client={client} />
      )}
    </Shell>
  );
}
