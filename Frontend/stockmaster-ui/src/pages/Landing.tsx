import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  Factory,
  LayoutDashboard,
  Package2,
  Search,
  ShieldCheck,
  Truck,
  UserCog,
  Warehouse,
} from "lucide-react";

import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";

const featureCards = [
  {
    title: "Real-Time Inventory",
    description:
      "Track stock movement instantly across products, warehouses, and categories.",
    icon: BarChart3,
  },
  {
    title: "Multi-Warehouse Control",
    description:
      "Manage inventory in multiple locations with one centralized workflow.",
    icon: Warehouse,
  },
  {
    title: "Smart Transfers",
    description:
      "Move stock between warehouses with complete visibility and validation.",
    icon: Truck,
  },
  {
    title: "Receipt & Delivery Logs",
    description:
      "Record incoming and outgoing goods with consistent audit trails.",
    icon: ClipboardCheck,
  },
  {
    title: "Role-Based Access",
    description:
      "Admin and staff permissions to keep your operations secure and focused.",
    icon: ShieldCheck,
  },
  {
    title: "Team & User Management",
    description:
      "Create users, assign responsibilities, and manage operations confidently.",
    icon: UserCog,
  },
];

const workflowSteps = [
  {
    title: "Create Your Workspace",
    text: "Sign up as admin and initialize your warehouse network with core details.",
  },
  {
    title: "Add Products & Warehouses",
    text: "Set up products, units, and locations to establish your inventory baseline.",
  },
  {
    title: "Run Daily Operations",
    text: "Handle receipts, deliveries, transfers, and adjustments from one dashboard.",
  },
  {
    title: "Monitor & Optimize",
    text: "Use analytics and movement history to improve stock accuracy and speed.",
  },
];

const appModules = [
  "Dashboard",
  "Warehouses",
  "Products",
  "Receipts",
  "Deliveries",
  "Transfers",
  "Adjustments",
  "Movements",
  "Analytics",
  "Users",
  "Settings",
];

const trustStats = [
  { label: "Warehouse Operations", value: "24/7" },
  { label: "Average Time Saved", value: "35%" },
  { label: "Stock Visibility", value: "Real-Time" },
  { label: "Workflow Coverage", value: "End-to-End" },
];

const faqs = [
  {
    question: "Who should use StockMaster?",
    answer:
      "StockMaster is ideal for distributors, retailers, and warehouse teams that need reliable control over stock, transfers, and daily operations.",
  },
  {
    question: "Can I manage multiple warehouses from one account?",
    answer:
      "Yes. You can configure multiple warehouses and track stock movement between all locations from one unified dashboard.",
  },
  {
    question: "Is this suitable for both admin and warehouse staff?",
    answer:
      "Yes. Role-based permissions let admins control access while warehouse staff focus on their assigned tasks securely.",
  },
];

export default function Landing() {
  const hasToken = Boolean(localStorage.getItem("token"));

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      <div className="landing-aurora" aria-hidden="true" />
      <div className="landing-grid-bg" aria-hidden="true" />

      <header className="relative z-10 border-b border-border/70 backdrop-blur-sm bg-background/70">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground grid place-items-center shadow-md">
              <Warehouse className="h-5 w-5" />
            </div>
            <div>
              <p className="text-base font-semibold leading-tight">StockMaster</p>
              <p className="text-xs text-muted-foreground leading-tight">Warehouse Intelligence Platform</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-sm text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">Workflow</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2 shrink-0">
            <Button variant="ghost" asChild>
              <Link to="/login">Login</Link>
            </Button>
            <Button className="gradient-primary" asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <section className="container pt-16 pb-10 md:pt-24 md:pb-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="animate-fade-in">
              <Badge className="mb-5 bg-accent text-accent-foreground border border-primary/20">
                Built for fast-moving warehouse teams
              </Badge>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]">
                A simple, reliable way to run your complete warehouse workflow.
              </h1>

              <p className="mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground">
                StockMaster helps your team handle receiving, delivering, transferring, and tracking
                inventory without confusion. Everything stays connected, visible, and easy to operate.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button size="lg" className="gradient-primary h-11" asChild>
                  <Link to="/signup">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-11" asChild>
                  <Link to="/login">I Already Have an Account</Link>
                </Button>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Multi-warehouse ready
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Role-based access
                </div>
                <div className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  Clear daily workflow
                </div>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {trustStats.map((item) => (
                  <div key={item.label} className="rounded-xl border bg-card/70 p-3">
                    <p className="text-lg font-semibold leading-none">{item.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="animate-scale-in">
              <Card className="landing-float-card border-primary/15 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <LayoutDashboard className="h-5 w-5 text-primary" />
                    Operations Snapshot
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">Active Warehouses</p>
                      <p className="text-2xl font-semibold">12</p>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">Products Tracked</p>
                      <p className="text-2xl font-semibold">2.4k</p>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">Today Transfers</p>
                      <p className="text-2xl font-semibold">86</p>
                    </div>
                    <div className="rounded-xl border bg-card p-3">
                      <p className="text-xs text-muted-foreground">Accuracy Rate</p>
                      <p className="text-2xl font-semibold">99.3%</p>
                    </div>
                  </div>

                  <div className="rounded-xl border border-primary/25 bg-accent/60 p-4">
                    <p className="text-sm text-muted-foreground">
                      Keep inbound, outbound, and internal stock movement synchronized in one flow.
                    </p>
                  </div>

                  <div className="rounded-xl border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Quick Start</p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" className="gradient-primary" asChild>
                        <Link to="/signup">
                          New Team
                          <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/login">Existing Team</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="container py-8 md:py-12 scroll-mt-20">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Features That Feel Practical</h2>
              <p className="mt-2 text-sm md:text-base text-muted-foreground">
                Designed for daily warehouse work, not just dashboards.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
              <Search className="h-4 w-4 text-primary" />
              Easy to learn, faster to use
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="border-border/80 bg-card/90 backdrop-blur-sm animate-fade-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <CardHeader className="pb-2">
                    <div className="mb-3 h-10 w-10 rounded-lg bg-accent text-accent-foreground grid place-items-center">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section id="workflow" className="container py-10 md:py-16 scroll-mt-20">
          <div className="rounded-2xl border bg-card/90 p-6 md:p-8 shadow-md">
            <div className="mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">How StockMaster Works</h2>
              <p className="mt-2 text-muted-foreground">
                A practical workflow designed for warehouse teams.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {workflowSteps.map((step, index) => (
                <div key={step.title} className="rounded-xl border bg-background/70 p-4 md:p-5">
                  <p className="text-xs font-semibold text-primary inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    Step {index + 1}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container pb-12 md:pb-20">
          <div className="rounded-2xl p-6 md:p-8 gradient-secondary border">
            <div className="mb-5 flex items-center gap-2">
              <Factory className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-semibold tracking-tight">Everything You Need in One Platform</h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {appModules.map((module) => (
                <Badge key={module} variant="secondary" className="bg-background border">
                  <Package2 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                  {module}
                </Badge>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button className="gradient-primary" asChild>
                <Link to="/signup">Create Admin Account</Link>
              </Button>
              {hasToken && (
                <Button variant="outline" asChild>
                  <Link to="/warehouses">Go to App</Link>
                </Button>
              )}
              {!hasToken && (
                <Button variant="outline" asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </div>
        </section>

        <section id="faq" className="container pb-16 md:pb-24 scroll-mt-20">
          <div className="rounded-2xl border bg-card/90 p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Frequently Asked Questions</h2>
            <p className="mt-2 text-muted-foreground">
              Quick answers for teams getting started.
            </p>

            <div className="mt-6 space-y-3">
              {faqs.map((item) => (
                <div key={item.question} className="rounded-xl border bg-background/70 p-4 md:p-5">
                  <h3 className="text-base font-semibold">{item.question}</h3>
                  <p className="mt-1.5 text-sm text-muted-foreground">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
