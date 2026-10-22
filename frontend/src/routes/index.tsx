import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { alertsQuery, dashboardQuery, formatDate, subscriptionsQuery, usd } from "@/lib/api";
import { MetricCard } from "@/components/MetricCard";
import { CategoryDonutChart, SpendTrendChart } from "@/components/charts";
import { Card, CardHeader, LoadingSkeleton, PageHeader, StatusBadge, VendorAvatar } from "@/components/common";
import { AlertRow } from "@/components/AlertCard";
import { useApp } from "@/components/app-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Overview — Sublytic" },
      { name: "description", content: "Monthly SaaS spend, savings opportunities and risks at a glance." },
      { property: "og:title", content: "Overview — Sublytic" },
      { property: "og:description", content: "Monthly SaaS spend, savings opportunities and risks at a glance." },
    ],
  }),
  loader: ({ context }) =>
    Promise.all([
      context.queryClient.ensureQueryData(dashboardQuery),
      context.queryClient.ensureQueryData(subscriptionsQuery),
      context.queryClient.ensureQueryData(alertsQuery),
    ]),
  pendingComponent: () => (
    <div className="space-y-6">
      <LoadingSkeleton variant="cards" />
      <LoadingSkeleton variant="chart" />
      <LoadingSkeleton variant="table" />
    </div>
  ),
  component: Overview,
});

const TOP = ["aws", "github", "vercel", "slack", "figma"];

function Overview() {
  const { data } = useSuspenseQuery(dashboardQuery);
  const { data: subs } = useSuspenseQuery(subscriptionsQuery);
  const { data: alerts } = useSuspenseQuery(alertsQuery);
  const { setAddOpen, setImportOpen } = useApp();
  const top = TOP.map((id) => subs.find((s) => s.id === id)).filter(Boolean) as typeof subs;
  const attention = ["a1", "a2", "a4", "a3"].map((id) => alerts.find((a) => a.id === id)!).filter(Boolean);

  return (
    <>
      <PageHeader
        title="Good morning, Ayşe"
        description="Here's how your subscription spend is performing this month."
        actions={
          <>
            <Button variant="outline" onClick={() => setImportOpen(true)}><Upload /> Import CSV</Button>
            <Button onClick={() => setAddOpen(true)}><Plus /> Add subscription</Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((m) => <MetricCard key={m.id} metric={m} />)}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Monthly spend trend" description="Last 12 months" />
          <div className="px-3 pt-4">
            <SpendTrendChart data={data.trend} />
          </div>
          <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            Spend increased by <span className="font-medium text-warning">8.4%</span> compared with last month.
          </p>
        </Card>
        <Card>
          <CardHeader title="Spend by category" description="October 2026" />
          <div className="p-5"><CategoryDonutChart data={data.categories} /></div>
        </Card>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Top subscriptions" description="Highest monthly cost" />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-y border-border text-left text-xs text-muted-foreground">
                  <th className="h-9 pl-5 font-medium">Provider</th>
                  <th className="font-medium">Category</th>
                  <th className="font-medium">Monthly cost</th>
                  <th className="font-medium">Renewal</th>
                  <th className="pr-5 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {top.map((s) => (
                  <tr key={s.id} className="border-b border-border/70 transition-colors last:border-0 hover:bg-accent/40">
                    <td className="h-14 pl-5"><div className="flex items-center gap-3"><VendorAvatar name={s.vendor} size="sm" /><span className="font-medium">{s.vendor}</span></div></td>
                    <td className="text-muted-foreground">{s.category}</td>
                    <td className="font-medium tabular-nums">{usd(s.cost, 2)}</td>
                    <td className="tabular-nums text-muted-foreground">{formatDate(s.nextRenewal)}</td>
                    <td className="pr-5"><StatusBadge status={s.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/subscriptions" className="flex items-center gap-1 border-t border-border px-5 py-3 text-xs font-medium text-primary hover:underline">
            View all subscriptions <ArrowRight className="h-3 w-3" />
          </Link>
        </Card>
        <Card>
          <CardHeader title="Requires attention" description={`${attention.length} open items`} />
          <div className="p-2 pt-3">
            {attention.map((a) => (
              <Link key={a.id} to="/alerts" className="block rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <AlertRow alert={a} />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
