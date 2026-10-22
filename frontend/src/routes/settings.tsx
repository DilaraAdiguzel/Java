import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardHeader, PageHeader, Pill } from "@/components/common";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Sublytic" },
      { name: "description", content: "Workspace, plan and notification settings." },
      { property: "og:title", content: "Settings — Sublytic" },
      { property: "og:description", content: "Workspace, plan and notification settings." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <>
      <PageHeader title="Settings" description="Manage your workspace, plan and notifications." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="hover:shadow-none">
          <CardHeader title="Workspace" />
          <div className="space-y-4 p-5">
            <div className="space-y-1.5"><Label htmlFor="company">Company name</Label><Input id="company" defaultValue="Northwind Labs" /></div>
            <div className="space-y-1.5"><Label htmlFor="currency">Reporting currency</Label><Input id="currency" defaultValue="USD" /></div>
            <Button onClick={() => toast.success("Settings saved")}>Save changes</Button>
          </div>
        </Card>
        <Card className="hover:shadow-none">
          <CardHeader title="Plan" action={<Pill tone="primary">Growth</Pill>} />
          <div className="p-5">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">42 of 50</span> subscriptions tracked.</p>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full w-[84%] rounded-full bg-primary" /></div>
            <Button className="mt-5" onClick={() => toast("Our team will reach out about Scale.")}>Upgrade to Scale</Button>
          </div>
        </Card>
        <Card className="hover:shadow-none lg:col-span-2">
          <CardHeader title="Notifications" />
          <div className="divide-y divide-border">
            {[["Critical alerts", "Price spikes and duplicate charges", true], ["Renewal reminders", "7 and 3 days before renewal", true], ["Weekly digest", "Spend summary every Monday", false]].map(([t, d, on]) => (
              <div key={t as string} className="flex items-center justify-between px-5 py-4">
                <div><div className="text-sm font-medium">{t}</div><div className="text-xs text-muted-foreground">{d}</div></div>
                <Switch defaultChecked={on as boolean} aria-label={t as string} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
