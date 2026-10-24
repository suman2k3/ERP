import { createFileRoute } from "@tanstack/react-router";
import { ClientLogin } from "@/components/erp/portal";

export const Route = createFileRoute("/login/")({
  head: () => ({
    meta: [
      { title: "Client Login — The Clicker India ERP" },
      {
        name: "description",
        content: "Enter your registered email and password to access your workspace.",
      },
      { property: "og:title", content: "Client Login — The Clicker India ERP" },
      {
        property: "og:description",
        content: "Enter your registered email and password to access your workspace.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ClientLogin,
});
