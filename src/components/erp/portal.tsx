import { useState, type FormEvent, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Eye, EyeOff, Home, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Brand, FormDialog } from "./common";
import { useDemo } from "@/lib/erp/store";
import { toast } from "sonner";

/**
 * ClientLogin: The unified, minimal login card for The Clicker India ERP.
 * Contains only:
 * 1. The Clicker India logo
 * 2. Heading: Client Login
 * 3. Subtitle: "Enter your registered email and password to access your workspace."
 * 4. Email Address field
 * 5. Password field with show/hide control
 * 6. Remember Me checkbox
 * 7. Forgot Password link
 * 8. Blue "Sign In to Workspace" button
 * 9. Optional "Back to Homepage" link
 *
 * All client company information (names, logos, domains, demo cards, autofills)
 * is completely removed from the login screen.
 * Authentication determines the client workspace and redirects the user after login.
 */
export function ClientLogin() {
  const { clients, users, setSession, setCurrentUser } = useDemo();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Load remembered email if present
  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem("clicker_saved_email");
      if (savedEmail) {
        setEmail(savedEmail);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    if (!cleanEmail) {
      setError("Please enter your registered email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    // 1. Validate credentials against user accounts
    const user = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

    if (!user) {
      setError(
        "Invalid email or password. Please verify your credentials or contact your administrator.",
      );
      setLoading(false);
      return;
    }

    // 2. Validate password
    if (user.password && password !== user.password) {
      setError(
        "Invalid email or password. Please verify your credentials or contact your administrator.",
      );
      setLoading(false);
      return;
    }

    // 3. Retrieve the assigned client / tenant
    const client = clients.find((c) => c.id === user.tenant);

    if (!client) {
      setError(
        "No active company workspace is associated with this account. Please contact Super Admin.",
      );
      setLoading(false);
      return;
    }

    // 4. Verify user account is active
    if (user.status !== "Active") {
      setError(
        "Your user account has been deactivated. Please contact your company administrator.",
      );
      setLoading(false);
      return;
    }

    // 5. Verify assigned client workspace is active
    if (client.status !== "Active") {
      setError("Your company workspace is currently inactive. Please contact your administrator.");
      setLoading(false);
      return;
    }

    // 6. Create authenticated session
    setSession(client.id);
    setCurrentUser(user);

    if (rememberMe) {
      try {
        localStorage.setItem("clicker_saved_email", cleanEmail);
      } catch {
        // Ignored
      }
    } else {
      try {
        localStorage.removeItem("clicker_saved_email");
      } catch {
        // Ignored
      }
    }

    toast.success(`Welcome back, ${user.name}`, {
      description: `Accessing your ${client.name} workspace.`,
    });

    // 7. Redirect user directly into their assigned company's ERP dashboard
    navigate({
      to: "/workspace/$tenant/$page",
      params: { tenant: client.id, page: "dashboard" },
    });
  }

  return (
    <div className="portal min-h-screen flex flex-col bg-background text-foreground">
      {/* Header */}
      <header className="portal-header sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border shadow-xs">
        <Brand />
        <Link
          to="/"
          className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1.5 font-medium transition-colors"
        >
          <Home size={14} /> Back to Homepage
        </Link>
      </header>

      {/* Centered Login Card */}
      <main className="login-body flex-1 flex items-center justify-center px-4 py-12 sm:py-20">
        <div className="w-full max-w-[420px]">
          <section className="login-panel bg-card border border-border rounded-2xl shadow-raised p-7 sm:p-9 text-foreground">
            {/* 1. The Clicker India Logo */}
            <div className="flex justify-center pb-5">
              <Brand />
            </div>

            {/* 2. Heading */}
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-foreground tracking-tight">Client Login</h1>
              {/* 3. Subtitle */}
              <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                Enter your registered email and password to access your workspace.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* 4. Email Address field */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  autoComplete="username"
                  value={email}
                  placeholder="Enter your company email"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  required
                  className="h-10 bg-background text-xs"
                />
              </div>

              {/* 5. Password field with show/hide control */}
              <div>
                <label className="block text-xs font-semibold text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    required
                    className="h-10 pr-10 bg-background text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </Button>
                </div>
              </div>

              {/* 6. Remember Me & 7. Forgot Password link */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-border accent-primary cursor-pointer"
                  />
                  <span>Remember Me</span>
                </label>

                <FormDialog
                  title="Forgot Password"
                  description="Enter your registered work email address. If an account is associated with this email, password reset instructions will be sent."
                  fields={[{ name: "email", label: "Registered Email", type: "email" }]}
                  onSubmit={() =>
                    toast.info(
                      "If this account exists, password recovery instructions have been dispatched.",
                    )
                  }
                  trigger={
                    <button
                      type="button"
                      className="text-[11px] text-primary hover:underline font-medium cursor-pointer"
                    >
                      Forgot Password?
                    </button>
                  }
                />
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-xs text-destructive bg-destructive/10 p-3 rounded-lg border border-destructive/20 leading-relaxed"
                >
                  {error}
                </div>
              )}

              {/* 8. Blue Sign In to Workspace button */}
              <Button
                className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-colors cursor-pointer text-xs"
                type="submit"
                disabled={loading}
              >
                Sign In to Workspace <ArrowRight size={15} className="ml-1" />
              </Button>
            </form>

            {/* Small Footer Text */}
            <div className="mt-6 text-center text-[11px] text-muted-foreground flex items-center justify-center gap-1.5">
              <Lock size={12} className="text-primary/70" />
              <span>Secure access to your business workspace</span>
            </div>

            {/* 9. Optional Back to Homepage link */}
            <div className="mt-5 pt-4 border-t border-border text-center">
              <Link
                to="/"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                Back to Homepage
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Page Footer */}
      <footer className="portal-footer py-5 px-6 border-t border-border bg-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© 2026 The Clicker India. All rights reserved.</span>
        <div className="flex items-center gap-5">
          <Link to="/" className="hover:text-primary">
            Homepage
          </Link>
          <Link
            to="/admin/$section"
            params={{ section: "dashboard" }}
            className="hover:text-primary font-mono text-[11px]"
          >
            Super Admin Demo
          </Link>
        </div>
      </footer>
    </div>
  );
}

// Exports for all login routes
export const TenantLogin = ClientLogin;
export const ClientWorkspaceLookup = ClientLogin;
export const UnifiedClientLogin = ClientLogin;
export const CompanySelection = ClientLogin;
export const CompanyPortal = ClientLogin;
