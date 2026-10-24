import { createFileRoute } from "@tanstack/react-router";
import { Workspace } from "@/components/erp/workspace";
const titles: Record<string, string> = {
  dashboard: "Dashboard",
  stock: "Stock Management",
  inventory: "Inventory Management",
  accounts: "Account Management",
  reports: "Reports",
  settings: "Settings",
};
export const Route = createFileRoute("/workspace/$tenant/$page")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search.q === "string" ? search.q : undefined,
  }),
  head: ({ params }) => ({
    meta: [
      { title: `${titles[params.page] ?? "Workspace"} · ${params.tenant} — The Clicker India` },
      {
        name: "description",
        content: `${titles[params.page] ?? "Workspace"} for ${params.tenant} in The Clicker India interactive ERP prototype.`,
      },
      {
        property: "og:title",
        content: `${titles[params.page] ?? "Workspace"} — The Clicker India ERP`,
      },
      {
        property: "og:description",
        content: "Company-isolated ERP workspace with stock, inventory and accounting insights.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: WorkspaceRoute,
});
function WorkspaceRoute() {
  const { tenant, page } = Route.useParams();
  const { q } = Route.useSearch();
  return <Workspace tenant={tenant} page={page} query={q} />;
}
