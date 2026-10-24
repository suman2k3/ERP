import { createFileRoute } from "@tanstack/react-router";
import { Homepage } from "@/components/erp/homepage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Clicker India — Unified Enterprise ERP Platform" },
      {
        name: "description",
        content:
          "The Clicker India brings your business operations together in one unified platform. Manage stock, inventory, accounts, and business activities efficiently.",
      },
      { property: "og:title", content: "The Clicker India — Enterprise ERP Platform" },
      {
        property: "og:description",
        content:
          "One platform for every part of your business. Integrated stock, inventory, and accounts management.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Homepage,
});
