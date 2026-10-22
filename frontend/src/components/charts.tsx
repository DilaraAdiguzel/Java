import { Area, AreaChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ReferenceDot, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CATEGORY_COLORS } from "@/lib/mock-data";
import type { CategoryBreakdown, MonthlySpend, PricePoint } from "@/lib/types";
import { usd } from "@/lib/api";
import { ChartTooltip } from "./common";

const axis = { stroke: "var(--muted-foreground)", fontSize: 12, tickLine: false, axisLine: false } as const;
const kfmt = (v: number) => `$${(v / 1000).toFixed(1)}k`;

export function SpendTrendChart({ data, height = 280 }: { data: MonthlySpend[]; height?: number }) {
  const last = data[data.length - 1]!;
  return (
    <div style={{ height }} role="img" aria-label="Monthly spend over the last 12 months">
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 10, right: 12, left: -8, bottom: 0 }}>
          <defs>
            <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.28} />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" {...axis} />
          <YAxis {...axis} tickFormatter={kfmt} width={56} />
          <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border-strong)" }} />
          <Area type="monotone" dataKey="total" name="Spend" stroke="var(--primary)" strokeWidth={2} fill="url(#trendFill)" activeDot={{ r: 4 }} />
          <ReferenceDot x={last.month} y={last.total} r={5} fill="var(--primary)" stroke="var(--background)" strokeWidth={2} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CategoryDonutChart({ data }: { data: CategoryBreakdown[] }) {
  const total = data.reduce((a, c) => a + c.amount, 0);
  return (
    <div className="flex flex-col items-center gap-6 sm:flex-row lg:flex-col 2xl:flex-row">
      <div className="relative h-44 w-44 shrink-0" role="img" aria-label="Spend by category">
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="amount" nameKey="category" innerRadius={58} outerRadius={82} paddingAngle={2} stroke="none">
              {data.map((d) => <Cell key={d.category} fill={CATEGORY_COLORS[d.category]} />)}
            </Pie>
            <Tooltip content={<ChartTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 grid place-items-center text-center">
          <div>
            <div className="text-xs text-muted-foreground">Total</div>
            <div className="text-lg font-semibold tabular-nums">{usd(total)}</div>
          </div>
        </div>
      </div>
      <ul className="w-full space-y-2.5">
        {data.map((d) => (
          <li key={d.category} className="flex items-center gap-3 text-sm">
            <span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: CATEGORY_COLORS[d.category] }} />
            <span className="min-w-0 flex-1 truncate text-muted-foreground">{d.category}</span>
            <span className="tabular-nums">{usd(d.amount)}</span>
            <span className="w-10 text-right text-xs tabular-nums text-muted-foreground">{((d.amount / total) * 100).toFixed(0)}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function PriceHistoryChart({ data }: { data: PricePoint[] }) {
  return (
    <div className="h-32">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" {...axis} fontSize={11} />
          <YAxis {...axis} fontSize={11} width={48} tickFormatter={(v) => `$${v}`} />
          <Tooltip content={<ChartTooltip />} />
          <Line type="monotone" dataKey="price" name="Price" stroke="var(--primary)" strokeWidth={2} dot={{ r: 2.5 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
