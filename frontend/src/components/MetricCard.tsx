import { ArrowDownRight, ArrowUpRight, CreditCard, DollarSign, PiggyBank, TrendingUp, type LucideIcon } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import type { SpendMetric } from "@/lib/types";
import { Card, Pill } from "./common";

const ICONS: Record<string, LucideIcon> = { monthly: DollarSign, arr: TrendingUp, savings: PiggyBank, active: CreditCard };
const TONE_COLOR = { good: "var(--success)", bad: "var(--warning)", neutral: "var(--primary)" };

export function MetricCard({ metric }: { metric: SpendMetric }) {
  const Icon = ICONS[metric.id] ?? DollarSign;
  const data = metric.sparkline.map((v, i) => ({ i, v }));
  const color = TONE_COLOR[metric.changeTone];
  const isCount = metric.id === "active";
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">{metric.label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-md bg-muted text-muted-foreground"><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight tabular-nums">{metric.value}</div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Pill tone={metric.changeTone === "good" ? "success" : metric.changeTone === "bad" ? "warning" : "primary"}>
            {metric.change >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {isCount ? `+${metric.change}` : `${metric.change > 0 ? "+" : ""}${metric.change}%`}
          </Pill>
          {metric.hint}
        </div>
        <div className="h-9 w-24" aria-hidden>
          <ResponsiveContainer>
            <AreaChart data={data}>
              <defs>
                <linearGradient id={`sp-${metric.id}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                  <stop offset="100%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="v" stroke={color} strokeWidth={1.75} fill={`url(#sp-${metric.id})`} isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Card>
  );
}
