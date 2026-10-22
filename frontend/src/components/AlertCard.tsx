import { ChevronRight, Copy, Gauge, PiggyBank, RefreshCw, TrendingUp, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDate, usd } from "@/lib/api";
import type { Alert } from "@/lib/types";
import { cn } from "@/lib/utils";
import { SeverityBadge } from "./common";

export const ALERT_ICONS: Record<Alert["type"], LucideIcon> = {
  price: TrendingUp,
  duplicate: Copy,
  usage: Gauge,
  renewal: RefreshCw,
  savings: PiggyBank,
};

const BORDER = { critical: "border-l-danger", warning: "border-l-warning", opportunity: "border-l-success", info: "border-l-primary" };
const ICON_TONE = { critical: "bg-danger/10 text-danger", warning: "bg-warning/10 text-warning", opportunity: "bg-success/10 text-success", info: "bg-primary/10 text-primary" };

export function AlertCard({ alert, onResolve, onReview }: { alert: Alert; onResolve: (a: Alert) => void; onReview: (a: Alert) => void }) {
  const Icon = ALERT_ICONS[alert.type];
  return (
    <article className={cn("card-surface border-l-[3px] p-5", BORDER[alert.severity])}>
      <div className="flex flex-col gap-4 md:flex-row md:items-start">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-md", ICON_TONE[alert.severity])}><Icon className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold">{alert.title}</h3>
            <SeverityBadge severity={alert.severity} />
          </div>
          <p className="mt-1 text-sm text-muted-foreground">{alert.description}</p>
          <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            <div><dt className="inline text-muted-foreground">Vendor: </dt><dd className="inline font-medium">{alert.vendor}</dd></div>
            <div><dt className="inline text-muted-foreground">Potential impact: </dt><dd className="inline font-medium tabular-nums">{usd(alert.impactMonthly)}/mo · {usd(alert.impactMonthly * 12)}/year</dd></div>
            <div><dt className="inline text-muted-foreground">Detected: </dt><dd className="inline tabular-nums">{formatDate(alert.detectedAt)}</dd></div>
          </dl>
        </div>
        {!alert.resolved && (
          <div className="flex shrink-0 gap-2">
            <Button variant="outline" size="sm" onClick={() => onReview(alert)}>Review</Button>
            <Button size="sm" onClick={() => onResolve(alert)}>Resolve</Button>
          </div>
        )}
      </div>
    </article>
  );
}

export function AlertRow({ alert }: { alert: Alert }) {
  const Icon = ALERT_ICONS[alert.type];
  return (
    <div className="flex items-center gap-3 rounded-md px-3 py-3 transition-colors hover:bg-accent/40">
      <span className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-md", ICON_TONE[alert.severity])}><Icon className="h-4 w-4" /></span>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-medium">{alert.title}</div>
        <div className="text-xs text-muted-foreground">{alert.vendor}</div>
      </div>
      <SeverityBadge severity={alert.severity} />
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
    </div>
  );
}
