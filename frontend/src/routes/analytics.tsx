import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ChevronDown, Crown, Download, FileSpreadsheet, FileText, Layers, PiggyBank, TrendingUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { dashboardQuery, monthlyReportQuery, usd } from "@/lib/api";
import { CATEGORIES, CATEGORY_COLORS } from "@/lib/mock-data";
import { Card, CardHeader, ChartTooltip, LoadingSkeleton, PageHeader, Pill } from "@/components/common";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Spend Analytics — Sublytic" },
      { name: "description", content: "Category performance, cost drivers and a three-month spend forecast." },
      { property: "og:title", content: "Spend Analytics — Sublytic" },
      { property: "og:description", content: "Category performance, cost drivers and a three-month spend forecast." },
    ],
  }),
  loader: ({ context }) => Promise.all([context.queryClient.ensureQueryData(monthlyReportQuery), context.queryClient.ensureQueryData(dashboardQuery)]),
  pendingComponent: () => <div className="space-y-6"><LoadingSkeleton variant="chart" /><LoadingSkeleton variant="table" /></div>,
  component: Analytics,
});

const axis = { stroke: "var(--muted-foreground)", fontSize: 12, tickLine: false, axisLine: false } as const;
const RANGE_MONTHS: Record<string, number> = { "30d": 2, "3m": 3, "12m": 12, custom: 6 };

function Analytics() {
  const { data } = useSuspenseQuery(monthlyReportQuery);
  const { data: dash } = useSuspenseQuery(dashboardQuery);
  const [range, setRange] = useState("12m");
  const trend = data.trend.slice(-(RANGE_MONTHS[range] ?? 12)).map((m) => ({ month: m.month, ...m.byCategory }));
  const total = dash.categories.reduce((a, c) => a + c.amount, 0);

  const forecast = data.forecast.map((m, i, arr) => {
    const lastActual = arr.filter((x) => !x.projected).length - 1;
    return {
      month: m.month,
      projected: m.projected,
      actual: m.projected ? null : m.total,
      forecast: m.projected || i === lastActual ? m.total : null,
    };
  });

  const drivers = [
    { icon: TrendingUp, label: "Fastest rising cost", value: "AWS", detail: "+22% month over month", tone: "warning" as const },
    { icon: PiggyBank, label: "Largest savings opportunity", value: "AWS Savings Plan", detail: `${usd(420)}/mo potential`, tone: "success" as const },
    { icon: Crown, label: "Most expensive tool", value: "AWS", detail: `${usd(2840.2, 2)} this month`, tone: "primary" as const },
    { icon: Layers, label: "Top category", value: "Infrastructure", detail: `${((3536.6 / total) * 100).toFixed(0)}% of total spend`, tone: "primary" as const },
  ];

  return (
    <>
      <PageHeader
        title="Spend Analytics"
        description="Understand where money goes and where it's heading."
        actions={
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button><Download /> Download report <ChevronDown /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => toast.success("PDF summary is being prepared")}><FileText /> PDF Summary</DropdownMenuItem>
              <DropdownMenuItem onClick={() => toast.success("Excel breakdown is being prepared")}><FileSpreadsheet /> Excel Breakdown</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        }
      />

      <ToggleGroup type="single" value={range} onValueChange={(v) => v && setRange(v)} className="mb-6 inline-flex rounded-md border border-border bg-card p-1" aria-label="Date range">
        {[["30d", "Last 30 days"], ["3m", "Last 3 months"], ["12m", "Last 12 months"], ["custom", "Custom range"]].map(([v, l]) => v && (
          <ToggleGroupItem key={v} value={v} className="h-8 rounded px-3 text-xs data-[state=on]:bg-accent data-[state=on]:text-foreground">{l}</ToggleGroupItem>
        ))}
      </ToggleGroup>

      <Card>
        <CardHeader title="Spend overview" description="Stacked by category" />
        <div className="h-80 px-3 pt-4">
          <ResponsiveContainer>
            <AreaChart data={trend} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
              <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" {...axis} />
              <YAxis {...axis} width={56} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
              <Tooltip content={<ChartTooltip />} />
              {CATEGORIES.map((c) => (
                <Area key={c} type="monotone" dataKey={c} name={c} stackId="1" stroke={CATEGORY_COLORS[c]} fill={CATEGORY_COLORS[c]} fillOpacity={0.35} strokeWidth={1.5} />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-4 px-5 pb-5 pt-2 text-xs text-muted-foreground">
          {CATEGORIES.map((c) => <span key={c} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: CATEGORY_COLORS[c] }} />{c}</span>)}
        </div>
      </Card>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {drivers.map((d) => (
          <Card key={d.label} className="p-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><d.icon className="h-4 w-4" /> {d.label}</div>
            <div className="mt-3 text-lg font-semibold">{d.value}</div>
            <Pill tone={d.tone} className="mt-2">{d.detail}</Pill>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader title="Category performance" description="This month vs previous period" />
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-y border-border text-left text-xs text-muted-foreground">
                  <th className="h-9 pl-5 font-medium">Category</th>
                  <th className="text-right font-medium">Current spend</th>
                  <th className="text-right font-medium">Previous period</th>
                  <th className="text-right font-medium">Change</th>
                  <th className="pr-5 text-right font-medium">Share of total</th>
                </tr>
              </thead>
              <tbody>
                {dash.categories.map((c) => {
                  const ch = ((c.amount - c.previous) / c.previous) * 100;
                  return (
                    <tr key={c.category} className="border-b border-border/70 last:border-0 hover:bg-accent/40">
                      <td className="h-12 pl-5"><span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: CATEGORY_COLORS[c.category] }} />{c.category}</span></td>
                      <td className="text-right font-medium tabular-nums">{usd(c.amount, 2)}</td>
                      <td className="text-right tabular-nums text-muted-foreground">{usd(c.previous, 2)}</td>
                      <td className="text-right"><Pill tone={ch > 0 ? "warning" : "success"}>{ch > 0 ? "+" : ""}{ch.toFixed(1)}%</Pill></td>
                      <td className="pr-5 text-right tabular-nums text-muted-foreground">{((c.amount / total) * 100).toFixed(1)}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader title="Forecast" description="Projected spend for the next 3 months" />
          <div className="h-64 px-3 pt-4">
            <ResponsiveContainer>
              <AreaChart data={forecast} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" {...axis} />
                <YAxis {...axis} width={56} domain={["dataMin - 500", "dataMax + 300"]} tickFormatter={(v) => `$${(v / 1000).toFixed(1)}k`} />
                <Tooltip content={<ChartTooltip projectedKey="projected" />} />
                <Area type="monotone" dataKey="actual" name="Actual" stroke="var(--primary)" strokeWidth={2} fill="var(--primary)" fillOpacity={0.15} connectNulls={false} />
                <Area type="monotone" dataKey="forecast" name="Projected" stroke="var(--primary)" strokeWidth={2} strokeDasharray="5 4" fill="var(--primary)" fillOpacity={0.06} connectNulls={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">Expected January spend: <span className="font-medium text-foreground">{usd(9180)}</span></p>
        </Card>
      </div>
    </>
  );
}
