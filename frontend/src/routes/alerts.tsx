import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertOctagon, AlertTriangle, CheckCircle2, Info, PiggyBank } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { alertsQuery } from "@/lib/api";
import type { Alert } from "@/lib/types";
import { AlertCard } from "@/components/AlertCard";
import { Card, LoadingSkeleton, PageHeader } from "@/components/common";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Risk & Alerts — Sublytic" },
      { name: "description", content: "Review anomalies, unnecessary spend, and upcoming renewals." },
      { property: "og:title", content: "Risk & Alerts — Sublytic" },
      { property: "og:description", content: "Review anomalies, unnecessary spend, and upcoming renewals." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(alertsQuery),
  pendingComponent: () => <LoadingSkeleton variant="table" />,
  component: AlertsPage,
});

type TabKey = "all" | "critical" | "warning" | "opportunity" | "resolved";

function AlertsPage() {
  const { data } = useSuspenseQuery(alertsQuery);
  const [items, setItems] = useState<Alert[]>(data);
  const [tab, setTab] = useState<TabKey>("all");
  const reduce = useReducedMotion();
  const open = items.filter((a) => !a.resolved);
  const resolvedBase = 12; // resolved earlier this month, before current data window

  const summary = [
    { label: "Critical", value: open.filter((a) => a.severity === "critical").length, icon: AlertOctagon, tone: "text-danger bg-danger/10" },
    { label: "Warning", value: open.filter((a) => a.severity === "warning").length, icon: AlertTriangle, tone: "text-warning bg-warning/10" },
    { label: "Opportunities", value: open.filter((a) => a.severity === "opportunity").length, icon: PiggyBank, tone: "text-success bg-success/10" },
    { label: "Resolved this month", value: resolvedBase + items.filter((a) => a.resolved).length, icon: CheckCircle2, tone: "text-primary bg-primary/10" },
  ];

  const visible = items.filter((a) => {
    if (tab === "resolved") return a.resolved;
    if (a.resolved) return false;
    return tab === "all" || a.severity === tab;
  });

  function resolve(a: Alert) {
    setItems((prev) => prev.map((x) => (x.id === a.id ? { ...x, resolved: true } : x)));
    toast.success("Alert resolved", { description: a.title });
  }

  return (
    <>
      <PageHeader
        title="Risk & Alerts"
        description="Review anomalies, unnecessary spend, and upcoming renewals."
        actions={
          <Tooltip>
            <TooltipTrigger className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
              <Info className="h-4 w-4" /> How we detect risk
            </TooltipTrigger>
            <TooltipContent side="bottom" align="end" className="max-w-xs text-xs leading-relaxed">
              Sublytic combines <b>recurring payment matching</b> (finding repeated and duplicate charges), <b>price deviation</b> (comparing each charge with its history) and <b>usage signals</b> (seat activity from connected tools) to score every subscription.
            </TooltipContent>
          </Tooltip>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="flex items-center gap-4 p-5">
            <span className={cn("grid h-10 w-10 place-items-center rounded-md", s.tone)}><s.icon className="h-5 w-5" /></span>
            <div>
              <div className="text-2xl font-semibold tabular-nums">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          </Card>
        ))}
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabKey)} className="mt-8">
        <TabsList className="h-auto flex-wrap justify-start">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="critical">Critical</TabsTrigger>
          <TabsTrigger value="warning">Warnings</TabsTrigger>
          <TabsTrigger value="opportunity">Savings opportunities</TabsTrigger>
          <TabsTrigger value="resolved">Resolved</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="mt-4 space-y-3">
        <AnimatePresence initial={false}>
          {visible.map((a) => (
            <motion.div
              key={a.id}
              layout={!reduce}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: reduce ? 0 : 0.22, ease: "easeOut" }}
            >
              <AlertCard alert={a} onResolve={resolve} onReview={(x) => toast(`Reviewing ${x.vendor}`, { description: "Transaction details opened." })} />
            </motion.div>
          ))}
        </AnimatePresence>
        {visible.length === 0 && (
          <Card className="py-14 text-center text-sm text-muted-foreground">
            <CheckCircle2 className="mx-auto mb-2 h-5 w-5 text-success" /> Nothing here — you're all caught up.
          </Card>
        )}
      </div>
    </>
  );
}
