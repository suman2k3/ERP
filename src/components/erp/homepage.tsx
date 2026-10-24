import { Link } from "@tanstack/react-router";
import {
  Boxes,
  PackageCheck,
  CreditCard,
  Building2,
  ShieldCheck,
  LockKeyhole,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Receipt,
  Warehouse,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Brand, FormDialog, DemoNote } from "./common";
import { toast } from "sonner";

export function Homepage() {
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="portal min-h-screen flex flex-col bg-background text-foreground">
      {/* 1. Header */}
      <header className="portal-header sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <Brand />

        <div className="portal-help flex items-center gap-4 sm:gap-6">
          <nav className="hidden md:flex items-center gap-5 text-xs font-semibold text-muted-foreground">
            <button
              onClick={() => scrollToSection("about")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              About
            </button>
            <button
              onClick={() => scrollToSection("capabilities")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Capabilities
            </button>
            <button
              onClick={() => scrollToSection("benefits")}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Benefits
            </button>
          </nav>

          <FormDialog
            title="Need Help?"
            description="Our team is available to assist you with enterprise onboarding, module setup, or system queries."
            fields={[
              { name: "name", label: "Full Name" },
              { name: "email", label: "Work Email", type: "email" },
              { name: "message", label: "How can we help your business?" },
            ]}
            onSubmit={() =>
              toast.info("Your inquiry has been submitted to The Clicker India support.")
            }
            trigger={
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground"
              >
                Need Help?
              </Button>
            }
          />

          <Link to="/login">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 sm:px-5 shadow-sm cursor-pointer">
              Client Login
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 px-6 border-b border-border text-white">
        {/* Banner Background Image with Gradient Overlay: clear on left for person, darkened on right for text */}
        <div
          className="absolute inset-0 bg-cover bg-left sm:bg-[left_center] bg-no-repeat"
          style={{ backgroundImage: `url('/banner-bg.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-950/90 via-slate-950/75 lg:from-slate-950/20 lg:via-slate-950/60 lg:to-slate-950/95 backdrop-blur-[0.5px]" />

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* 2-Column Grid: Left side keeps person visible, Right side holds aligned text */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Spacer on desktop to showcase the background person */}
            <div className="hidden lg:block lg:col-span-5 min-h-[320px]" />

            {/* Right-aligned text content container */}
            <div className="lg:col-span-7 flex flex-col items-start text-left lg:pl-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-bold tracking-wider uppercase mb-5 shadow-2xs border border-blue-400/30 backdrop-blur-md">
                <Sparkles size={14} className="text-blue-300 animate-pulse" />
                <span>YOUR BUSINESS, CONNECTED</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12] drop-shadow-md">
                One Platform. Every Part of Your Business.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-slate-200 leading-relaxed drop-shadow-xs max-w-xl">
                The Clicker India brings your business operations together in one unified platform.
                Manage stock, inventory, accounts, and business activities efficiently through a
                centralized ERP solution designed to simplify your workflow.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link to="/login">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-md text-sm cursor-pointer"
                  >
                    Client Login <ArrowRight size={16} className="ml-1" />
                  </Button>
                </Link>

                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("about")}
                  className="border-white/30 text-white hover:bg-white/10 hover:text-white font-semibold px-6 text-sm cursor-pointer backdrop-blur-xs"
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>

          {/* Interactive SaaS Mockup Card */}
          <div className="mt-14 max-w-5xl mx-auto bg-card/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden text-left text-foreground">
            <div className="bg-secondary/60 px-5 py-3 border-b border-border flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="ml-2 text-xs font-mono text-muted-foreground">
                  The Clicker India ERP · Live Ecosystem
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  Cloud Synchronized
                </span>
                <span className="text-xs text-muted-foreground hidden sm:inline">v2.4 LTS</span>
              </div>
            </div>

            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Stock Operations
                  </span>
                  <Boxes size={16} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">14,820</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> +12% movements this week
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-2 flex justify-between">
                  <span>Tracked SKUs</span>
                  <span className="font-semibold text-foreground">99.8% in stock</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Inventory & Warehouses
                  </span>
                  <Warehouse size={16} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">6 Locations</div>
                <div className="text-xs text-primary mt-1 flex items-center gap-1">
                  <CheckCircle2 size={12} /> Multi-depot balancing
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-2 flex justify-between">
                  <span>Pending Orders</span>
                  <span className="font-semibold text-foreground">0 Bottlenecks</span>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-background border border-border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Accounts & Ledger
                  </span>
                  <Receipt size={16} className="text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">₹ 42.6 Lakhs</div>
                <div className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp size={12} /> Real-time GST compliant
                </div>
                <div className="mt-3 text-[11px] text-muted-foreground border-t border-border pt-2 flex justify-between">
                  <span>Invoices Reconciled</span>
                  <span className="font-semibold text-foreground">100% verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. About Section */}
      <section id="about" className="py-20 px-6 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            About The Clicker India
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
            Integrated Business Management Built for Tomorrow
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            The Clicker India is a premier digital solutions provider delivering integrated business
            management solutions. Our platform bridges departmental silos, providing organizations
            with accurate control over physical assets, streamlined logistics, and synchronized
            accounting ledgers.
          </p>
        </div>

        {/* Core Capabilities */}
        <div id="capabilities" className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Capability 1: Stock Management */}
          <div className="p-8 rounded-xl bg-card border border-border shadow-soft hover:shadow-raised transition-all hover:border-primary/50 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-6">
                <Boxes size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Stock Management</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Monitor stock levels, movements, and adjustments with instantaneous tracking across
                all warehouses and fulfillment points.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Real-time SKU quantities and threshold alerts</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Automated stock adjustments and write-offs</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Historical movement auditing and logs</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center text-xs font-bold text-primary">
              Learn module details <ChevronRight size={14} />
            </div>
          </div>

          {/* Capability 2: Inventory Management */}
          <div className="p-8 rounded-xl bg-card border border-border shadow-soft hover:shadow-raised transition-all hover:border-primary/50 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-6">
                <PackageCheck size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Inventory Management</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Organize products, warehouses, suppliers, and purchases within a structured,
                automated cataloging system.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Multi-warehouse categorization and location tags</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Supplier directories and purchase order lifecycles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Batch numbering and incoming shipment validation</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center text-xs font-bold text-primary">
              Learn module details <ChevronRight size={14} />
            </div>
          </div>

          {/* Capability 3: Account Management */}
          <div className="p-8 rounded-xl bg-card border border-border shadow-soft hover:shadow-raised transition-all hover:border-primary/50 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-lg bg-accent text-primary flex items-center justify-center mb-6">
                <CreditCard size={24} />
              </div>
              <h3 className="text-xl font-bold text-foreground">Account Management</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Manage invoices, payments, income, expenses, and financial reports with end-to-end
                ledger reconciliation.
              </p>
              <ul className="mt-6 space-y-2.5 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>GST-ready client invoicing and receipt generation</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>Accounts payable, receivable, and automated dues</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-primary shrink-0" />
                  <span>P&L statements, cash-flow reports, and exports</span>
                </li>
              </ul>
            </div>
            <div className="mt-8 pt-4 border-t border-border flex items-center text-xs font-bold text-primary">
              Learn module details <ChevronRight size={14} />
            </div>
          </div>
        </div>
      </section>

      {/* 4. Benefits Section */}
      <section id="benefits" className="py-20 px-6 bg-secondary/40 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Key Advantages
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground mt-2">
              Engineered for Precision, Scale, and Reliability
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Designed to support growing enterprises with high-fidelity visibility, ironclad data
              protection, and clean user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-8 rounded-xl border border-border shadow-soft">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Building2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Centralized Business Operations</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Unify disparate departments and operational workflows into one synchronized
                platform. Real-time dashboards eliminate fragmented spreadsheets and deliver
                single-source-of-truth accuracy.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-soft">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <LockKeyhole size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Secure, Role-Based Access</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Empower your organization with granular access controls. Assign designated
                permissions to admins, warehouse operators, and financial officers to protect
                sensitive business data.
              </p>
            </div>

            <div className="bg-card p-8 rounded-xl border border-border shadow-soft">
              <div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-5">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-lg font-bold text-foreground">Dedicated Client Workspaces</h3>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                Every client company benefits from an isolated, dedicated workspace configured to
                their exact operational workflow, domain parameters, and distinct branding identity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Call To Action Banner */}
      <section className="py-16 px-6 bg-card border-b border-border">
        <div className="max-w-4xl mx-auto text-center p-10 rounded-2xl bg-gradient-to-r from-accent/50 via-card to-accent/30 border border-primary/20 shadow-raised">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
            Ready to access your enterprise workspace?
          </h2>
          <p className="mt-3 text-sm text-muted-foreground max-w-xl mx-auto">
            Authorized team members can enter their dedicated company workspace or reach out to our
            administration team for onboarding support.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            <Link to="/login">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-8 shadow-sm cursor-pointer"
              >
                Client Login <ArrowRight size={16} className="ml-1" />
              </Button>
            </Link>
            <FormDialog
              title="Enterprise Inquiries"
              description="Connect with The Clicker India solution architects to explore enterprise deployment."
              fields={[
                { name: "company", label: "Company Name" },
                { name: "email", label: "Corporate Email", type: "email" },
                { name: "requirements", label: "Primary ERP Requirements" },
              ]}
              onSubmit={() =>
                toast.success("Inquiry received. A representative will reach out shortly.")
              }
              trigger={
                <Button size="lg" variant="outline" className="font-semibold cursor-pointer">
                  Contact Support
                </Button>
              }
            />
          </div>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className="portal-footer bg-card py-8 px-6 sm:px-12 border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto w-full flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Brand />
            <span className="text-xs text-muted-foreground hidden md:inline border-l border-border pl-4">
              © 2026 The Clicker India. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <span className="md:hidden">© 2026 The Clicker India</span>
            <FormDialog
              title="Support & Assistance"
              description="Contact The Clicker India support desk for assistance with your account or workspace."
              fields={[
                { name: "email", label: "Account Email", type: "email" },
                { name: "issue", label: "Description of Issue" },
              ]}
              onSubmit={() => toast.info("Support ticket captured.")}
              trigger={
                <button className="hover:text-primary transition-colors cursor-pointer">
                  Support
                </button>
              }
            />
            <Link to="/login" className="hover:text-primary transition-colors font-medium">
              Client Login
            </Link>
            <Link
              to="/admin/$section"
              params={{ section: "dashboard" }}
              className="hover:text-primary transition-colors text-muted-foreground/80 font-mono text-[11px]"
            >
              Super Admin Demo
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
