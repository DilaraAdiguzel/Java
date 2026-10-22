import { AlertTriangle, CalendarClock, CheckCircle2, Pencil, User, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { formatDate, monthlyCost, usd } from "@/lib/api";
import type { Subscription } from "@/lib/types";
import { PriceHistoryChart } from "./charts";
import { Pill, RiskScore, StatusBadge, VendorAvatar } from "./common";

interface Props {
  sub: Subscription | null;
  onClose: () => void;
  onCancel: (s: Subscription) => void;
  onReview: (s: Subscription) => void;
  onEdit: (s: Subscription) => void;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="border-b border-border px-6 py-5 last:border-0">
      <h3 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</h3>
      {children}
    </section>
  );
}

export function SubscriptionDrawer({ sub, onClose, onCancel, onReview, onEdit }: Props) {
  return (
    <Sheet open={!!sub} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-md">
        {sub && (
          <>
            <SheetHeader className="border-b border-border p-6">
              <div className="flex items-center gap-3">
                <VendorAvatar name={sub.vendor} size="lg" />
                <div className="min-w-0">
                  <SheetTitle className="truncate">{sub.vendor}</SheetTitle>
                  <SheetDescription>{sub.category} · {sub.website}</SheetDescription>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge status={sub.status} />
                {sub.reviewed && <Pill tone="success"><CheckCircle2 className="h-3 w-3" /> Reviewed</Pill>}
              </div>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto">
              <Section title="Overview">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border border-border p-3">
                    <div className="text-xs text-muted-foreground">Monthly</div>
                    <div className="mt-1 text-lg font-semibold tabular-nums">{usd(monthlyCost(sub), 2)}</div>
                  </div>
                  <div className="rounded-md border border-border p-3">
                    <div className="text-xs text-muted-foreground">Yearly</div>
                    <div className="mt-1 text-lg font-semibold tabular-nums">{usd(monthlyCost(sub) * 12)}</div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Risk score</span>
                  <RiskScore score={sub.riskScore} />
                </div>
              </Section>
              <Section title="Price history">
                <PriceHistoryChart data={sub.priceHistory} />
              </Section>
              <Section title="Renewal & ownership">
                <dl className="space-y-3 text-sm">
                  <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted-foreground"><CalendarClock className="h-4 w-4" /> Next renewal</dt><dd className="tabular-nums">{formatDate(sub.nextRenewal)}</dd></div>
                  <div className="flex items-center justify-between"><dt className="text-muted-foreground pl-6">Billing cycle</dt><dd>{sub.billingCycle}</dd></div>
                  <div className="flex items-center justify-between"><dt className="text-muted-foreground pl-6">Customer since</dt><dd className="tabular-nums">{formatDate(sub.firstPayment)}</dd></div>
                  <div className="flex items-center justify-between"><dt className="flex items-center gap-2 text-muted-foreground"><User className="h-4 w-4" /> Owner</dt><dd>{sub.owner} <span className="text-muted-foreground">· {sub.team}</span></dd></div>
                </dl>
              </Section>
              <Section title="Detected risks">
                {sub.risks.length === 0 ? (
                  <p className="flex items-center gap-2 text-sm text-muted-foreground"><CheckCircle2 className="h-4 w-4 text-success" /> No risks detected.</p>
                ) : (
                  <ul className="space-y-2">
                    {sub.risks.map((r) => (
                      <li key={r} className="flex items-start gap-2 rounded-md border border-border bg-warning/5 p-3 text-sm">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" /> {r}
                      </li>
                    ))}
                  </ul>
                )}
              </Section>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-border p-4">
              <Button variant="outline" onClick={() => onEdit(sub)}><Pencil /> Edit</Button>
              <Button variant="outline" disabled={sub.reviewed} onClick={() => onReview(sub)}><CheckCircle2 /> Mark as reviewed</Button>
              <Button variant="destructive" className="ml-auto" disabled={sub.status === "Cancelled"} onClick={() => onCancel(sub)}><XCircle /> Cancel</Button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
