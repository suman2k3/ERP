import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";
import { clients, initialUsers } from "@/lib/erp/data";

describe("App routing and client authentication isolation", () => {
  it("matches a page for / instead of falling back to not found", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
    expect(matches.at(-1)?.routeId).toBe("/");
  });

  it("matches client login routes", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    const loginMatches = router.matchRoutes("/login");
    expect(loginMatches.at(-1)?.routeId).toBe("/login/");
  });

  it("determines assigned client from company-domain and super-admin assigned emails", () => {
    // 1. Company-domain email test
    const domainUser = initialUsers.find((u) => u.email === "admin@bugyboo.in");
    expect(domainUser).toBeDefined();
    expect(domainUser?.tenant).toBe("bugyboo");

    const domainClient = clients.find((c) => c.id === domainUser?.tenant);
    expect(domainClient?.name).toBe("BugyBoo");

    // 2. Super Admin-assigned personal email test (Option B)
    const assignedUser = initialUsers.find((u) => u.email === "aarav.sharma@gmail.com");
    expect(assignedUser).toBeDefined();
    expect(assignedUser?.tenant).toBe("bugyboo");

    const assignedClient = clients.find((c) => c.id === assignedUser?.tenant);
    expect(assignedClient?.name).toBe("BugyBoo");

    // 3. Different client assignment
    const aashUser = initialUsers.find((u) => u.email === "priya.logistics@outlook.com");
    expect(aashUser).toBeDefined();
    expect(aashUser?.tenant).toBe("aash");

    // 4. Ensure no cross-client assignment leakage
    expect(domainUser?.tenant).not.toBe(aashUser?.tenant);
  });
});
