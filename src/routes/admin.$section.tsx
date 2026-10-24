import { createFileRoute } from "@tanstack/react-router";
import { Admin } from "@/components/erp/admin";
export const Route = createFileRoute("/admin/$section")({
  head: ({ params }) => ({
    meta: [
      { title: `Super Admin · ${params.section} — The Clicker India` },
      {
        name: "description",
        content: `Platform ${params.section} administration in The Clicker India ERP prototype.`,
      },
      { property: "og:title", content: `Super Admin ${params.section} — The Clicker India` },
      {
        property: "og:description",
        content:
          "Client provisioning, tenant assignments and module permissions in an isolated administration demo.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AdminRoute,
});
function AdminRoute() {
  const { section } = Route.useParams();
  return <Admin section={section} />;
}
