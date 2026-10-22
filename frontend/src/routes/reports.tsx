import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { dashboardQuery, usd } from "@/lib/api";
import { CATEGORY_COLORS, recentReports, reports } from "@/lib/mock-data";
import { Card, CardHeader, LoadingSkeleton, PageHeader, Pill } from "@/components/common";
import { ReportCard } from "@/components/ReportCard";
import { SpendTrendChart } from "@/components/charts";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports — Sublytic" },
      { name: "description", content: "Generate board-ready financial summaries of your SaaS spend." },
      { property: "og:title", content: "Reports — Sublytic" },
      { property: "og:description", content: "Generate board-ready financial summaries of your SaaS spend." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(dashboardQuery),
  pendingComponent: () => <LoadingSkeleton variant="cards" />,
  component: ReportsPage,
});

function ReportsPage() {
  const { data } = useSuspenseQuery(dashboardQuery);
  const total = data.categories.reduce((a, c) => a + c.amount, 0);

  return (
    <>
      <PageHeader title="Generate a board-ready financial summary" description="Export polished reports for your CFO, board and finance team." />

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {reports.map((r) => <ReportCard key={r.id} report={r} />)}
          </div>

          <Card className="hover:shadow-none">
            <CardHeader title="Report preview" description="Monthly executive summary · October 2026" action={<Pill tone="danger">PDF</Pill>} />
            <div className="m-5 rounded-lg border border-border bg-background p-6">
              <div className="flex items-start justify-between border-b border-border pb-4">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">Northwind Labs · SaaS spend</div>
                  <div className="mt-1 text-3xl font-semibold tabular-nums">{usd(8420.5, 2)}</div>
                  <div className="mt-1 text-xs text-muted-foreground">Total spend in October · <span className="text-warning">+8.4% MoM</span></div>
                </div>
                <div className="text-right text-xs text-muted-foreground">Prepared for<br /><span className="text-foreground">Board of Directors</span></div>
              </div>
              <div className="mt-4"><SpendTrendChart data={data.trend} height={150} /></div>
              <div className="mt-4 grid gap-6 border-t border-border pt-4 sm:grid-cols-2">
                <div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Category distribution</div>
                  <div className="flex h-2 overflow-hidden rounded-full">
                    {data.categories.map((c) => <div key={c.category} style={{ width: `${(c.amount / total) * 100}%`, background: CATEGORY_COLORS[c.category] }} />)}
                  </div>
                  <ul className="mt-3 space-y-1 text-xs">
                    {data.categories.slice(0, 4).map((c) => (
                      <li key={c.category} className="flex justify-between"><span className="text-muted-foreground">{c.category}</span><span className="tabular-nums">{((c.amount / total) * 100).toFixed(0)}%</span></li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">Risk summary</div>
                  <ul className="space-y-1.5 text-xs">
                    <li className="flex justify-between"><span>Critical issues</span><span className="font-medium text-danger">2</span></li>
                    <li className="flex justify-between"><span>Warnings</span><span className="font-medium text-warning">6</span></li>
                    <li className="flex justify-between"><span>Savings identified</span><span className="font-medium text-success">{usd(1240)}/mo</span></li>
                    <li className="flex justify-between"><span>Renewals next 30 days</span><span className="font-medium">9</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </Card>
        </div>

        <Card className="h-fit">
          <CardHeader title="Recent reports" description="Last 30 days" />
          <ul className="mt-3 divide-y divide-border">
            {recentReports.map((r) => {
              const Icon = r.format === "PDF" ? FileText : FileSpreadsheet;
              return (
                <li key={r.name} className="flex items-center gap-3 px-5 py-3.5">
                  <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm">{r.name}</div>
                    <div className="text-xs text-muted-foreground">{r.date} · {r.size}</div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" aria-label={`Download ${r.name}`} onClick={() => toast("Download started", { description: r.name })}>
                    <Download />
                  </Button>
                </li>
              );
            })}
          </ul>
        </Card>
      </div>
    </>
  );
}
