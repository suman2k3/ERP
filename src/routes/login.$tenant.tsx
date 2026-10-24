import { createFileRoute } from "@tanstack/react-router";
import { TenantLogin } from "@/components/erp/portal";

export const Route = createFileRoute("/login/$tenant")({
  head: () => ({
    meta: [
      { title: "Client Login — The Clicker India ERP" },
      {
        name: "description",
        content: "Sign in with your registered email and password to access your workspace.",
      },
      { property: "og:title", content: "Client Login — The Clicker India ERP" },
      {
        property: "og:description",
        content: "Sign in to access your business workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Login,
});

function Login() {
  return <TenantLogin />;
}
