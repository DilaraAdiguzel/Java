import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { Download, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import type { ColumnFiltersState } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { api, subscriptionsQuery } from "@/lib/api";
import { CATEGORIES } from "@/lib/mock-data";
import type { Subscription } from "@/lib/types";
import { Card, EmptyState, LoadingSkeleton, PageHeader } from "@/components/common";
import { SubscriptionTable } from "@/components/SubscriptionTable";
import { SubscriptionDrawer } from "@/components/SubscriptionDrawer";
import { useApp } from "@/components/app-context";

export const Route = createFileRoute("/subscriptions")({
  head: () => ({
    meta: [
      { title: "Subscriptions — Sublytic" },
      { name: "description", content: "Manage and optimize every recurring business expense." },
      { property: "og:title", content: "Subscriptions — Sublytic" },
      { property: "og:description", content: "Manage and optimize every recurring business expense." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(subscriptionsQuery),
  pendingComponent: () => <LoadingSkeleton variant="table" />,
  component: SubscriptionsPage,
});

function SubscriptionsPage() {
  const { data } = useSuspenseQuery(subscriptionsQuery);
  const { setAddOpen } = useApp();
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [cycle, setCycle] = useState("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<Subscription | null>(null);
  const selected = data.find((s) => s.id === selectedId) ?? null;

  const filters = useMemo<ColumnFiltersState>(
    () => [
      ...(category !== "all" ? [{ id: "category", value: category }] : []),
      ...(status !== "all" ? [{ id: "status", value: status }] : []),
      ...(cycle !== "all" ? [{ id: "billingCycle", value: cycle }] : []),
    ],
    [category, status, cycle],
  );

  const update = useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<Subscription> }) => api.updateSubscription(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["subscriptions"] }),
  });

  const onRowClick = useCallback((s: Subscription) => setSelectedId(s.id), []);
  const onCancel = useCallback((s: Subscription) => setConfirm(s), []);

  function exportCsv() {
    const header = "Vendor,Category,Cost,Billing cycle,Next renewal,Owner,Risk score,Status";
    const rows = data.map((s) => [s.vendor, s.category, s.cost, s.billingCycle, s.nextRenewal, s.owner, s.riskScore, s.status].join(","));
    const url = URL.createObjectURL(new Blob([[header, ...rows].join("\n")], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "subscriptions.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Export ready", { description: `${data.length} subscriptions exported.` });
  }

  const resetFilters = () => { setSearch(""); setCategory("all"); setStatus("all"); setCycle("all"); };

  return (
    <>
      <PageHeader
        title="Subscriptions"
        description="Manage and optimize every recurring business expense."
        actions={<Button onClick={() => setAddOpen(true)}><Plus /> Add subscription</Button>}
      />

      <Card className="hover:shadow-none">
        <div className="flex flex-wrap items-center gap-2 border-b border-border p-4">
          <div className="relative min-w-[200px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input aria-label="Search subscriptions" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search vendor or owner…" className="h-9 pl-9" />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-9 w-[150px]" aria-label="Category"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-9 w-[130px]" aria-label="Status"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Trial">Trial</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select value={cycle} onValueChange={setCycle}>
            <SelectTrigger className="h-9 w-[130px]" aria-label="Billing cycle"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All cycles</SelectItem>
              <SelectItem value="Monthly">Monthly</SelectItem>
              <SelectItem value="Yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-9" onClick={resetFilters}><SlidersHorizontal /> Filters</Button>
          <Button variant="outline" size="sm" className="h-9" onClick={exportCsv}><Download /> Export CSV</Button>
        </div>
        <SubscriptionTable
          data={data}
          globalFilter={search}
          columnFilters={filters}
          onRowClick={onRowClick}
          onCancel={onCancel}
          empty={<EmptyState onAdd={() => setAddOpen(true)} />}
        />
      </Card>

      <SubscriptionDrawer
        sub={selected}
        onClose={() => setSelectedId(null)}
        onCancel={(s) => setConfirm(s)}
        onEdit={(s) => toast(`Editing ${s.vendor}`, { description: "Inline editing is coming soon." })}
        onReview={(s) => update.mutate({ id: s.id, patch: { reviewed: true } }, { onSuccess: () => toast.success(`${s.vendor} marked as reviewed`) })}
      />

      <AlertDialog open={!!confirm} onOpenChange={(o) => !o && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel {confirm?.vendor}?</AlertDialogTitle>
            <AlertDialogDescription>
              This marks the subscription as cancelled and stops renewal tracking. Make sure you've also cancelled it with the vendor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep subscription</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                const s = confirm!;
                update.mutate({ id: s.id, patch: { status: "Cancelled", nextRenewal: "—" } }, { onSuccess: () => toast.success(`${s.vendor} cancelled`) });
                setConfirm(null);
              }}
            >
              Cancel subscription
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
