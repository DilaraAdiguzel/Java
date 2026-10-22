import { AlertTriangle, Inbox, Plus, RotateCcw } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { riskTone } from "@/lib/api";
import type { Severity, SubscriptionStatus } from "@/lib/types";

const AVATAR_TONES = [
  "bg-chart-1/15 text-chart-1",
  "bg-chart-2/15 text-chart-2",
  "bg-chart-3/15 text-chart-3",
  "bg-chart-4/15 text-chart-4",
  "bg-chart-5/15 text-chart-5",
];

export function VendorAvatar({ name, size = "md" }: { name: string; size?: "sm" | "md" | "lg" }) {
  const idx = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % AVATAR_TONES.length;
  const initials = name.replace(/[^A-Za-z ]/g, "").split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div
      aria-hidden
      className={cn(
        "grid shrink-0 place-items-center rounded-md font-semibold ring-1 ring-inset ring-border",
        AVATAR_TONES[idx],
        size === "sm" && "h-7 w-7 text-[11px]",
        size === "md" && "h-8 w-8 text-xs",
        size === "lg" && "h-11 w-11 text-sm",
      )}
    >
      {initials}
    </div>
  );
}

export function Pill({ tone, children, className }: { tone: "success" | "warning" | "danger" | "primary" | "muted"; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset",
        tone === "success" && "bg-success/10 text-success ring-success/25",
        tone === "warning" && "bg-warning/10 text-warning ring-warning/25",
        tone === "danger" && "bg-danger/10 text-danger ring-danger/25",
        tone === "primary" && "bg-primary/10 text-primary ring-primary/25",
        tone === "muted" && "bg-muted text-muted-foreground ring-border",
        className,
      )}
    >
      {children}
    </span>
  );
}

export const severityTone: Record<Severity, "danger" | "warning" | "success" | "primary"> = {
  critical: "danger",
  warning: "warning",
  opportunity: "success",
  info: "primary",
};
const severityLabel: Record<Severity, string> = { critical: "Critical", warning: "Warning", opportunity: "Savings", info: "Info" };

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Pill tone={severityTone[severity]}>{severityLabel[severity]}</Pill>;
}

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  const tone = status === "Active" ? "success" : status === "Trial" ? "primary" : "muted";
  return (
    <Pill tone={tone}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </Pill>
  );
}

export function RiskScore({ score }: { score: number }) {
  const tone = riskTone(score);
  return (
    <div className="flex items-center gap-2" aria-label={`Risk score ${score} of 100`}>
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full", tone === "success" && "bg-success", tone === "warning" && "bg-warning", tone === "danger" && "bg-danger")}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className={cn("w-6 text-xs font-medium tabular-nums", `text-${tone}`)}>{score}</span>
    </div>
  );
}

export function PageHeader({ title, description, actions }: { title: string; description?: string; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Card({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("card-surface", className)}>{children}</div>;
}

export function CardHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 pt-5">
      <div className="min-w-0">
        <h2 className="text-sm font-semibold">{title}</h2>
        {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({ onAdd }: { onAdd?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-muted text-muted-foreground">
        <Inbox className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">No subscriptions found</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Add your first subscription or import a CSV to start tracking spend.
      </p>
      {onAdd && (
        <Button className="mt-5" onClick={onAdd}>
          <Plus /> Add subscription
        </Button>
      )}
    </div>
  );
}

export function ErrorState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-danger/10 text-danger">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold">We couldn't load this data.</h3>
      {onRetry && (
        <Button variant="outline" className="mt-5" onClick={onRetry}>
          <RotateCcw /> Try again
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ variant }: { variant: "cards" | "chart" | "table" }) {
  if (variant === "cards")
    return (
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="space-y-3 p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-7 w-32" />
            <Skeleton className="h-8 w-full" />
          </Card>
        ))}
      </div>
    );
  if (variant === "chart")
    return (
      <Card className="p-5">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="mt-6 h-64 w-full" />
      </Card>
    );
  return (
    <Card className="space-y-3 p-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <Skeleton key={i} className="h-9 w-full" />
      ))}
    </Card>
  );
}

export function ChartTooltip({ active, payload, label, projectedKey }: { active?: boolean; payload?: Array<{ name?: string; value?: number; color?: string; payload?: Record<string, unknown> }>; label?: string; projectedKey?: string }) {
  if (!active || !payload?.length) return null;
  const projected = projectedKey ? Boolean(payload[0]?.payload?.[projectedKey]) : false;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-lg">
      <div className="mb-1 flex items-center gap-2 font-medium">
        {label}
        {projected && <Pill tone="primary" className="py-0 text-[10px]">Projected</Pill>}
      </div>
      {payload.filter((p) => p.value != null).map((p, i) => (
        <div key={i} className="flex items-center justify-between gap-4 text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
            {p.name}
          </span>
          <span className="font-medium tabular-nums text-foreground">
            ${Number(p.value).toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </span>
        </div>
      ))}
    </div>
  );
}
