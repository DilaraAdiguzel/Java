import { createFileRoute } from "@tanstack/react-router";
import { UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { usd } from "@/lib/api";
import { team } from "@/lib/mock-data";
import { Card, PageHeader } from "@/components/common";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — Sublytic" },
      { name: "description", content: "See who owns which subscriptions and how much each owner manages." },
      { property: "og:title", content: "Team — Sublytic" },
      { property: "og:description", content: "See who owns which subscriptions and how much each owner manages." },
    ],
  }),
  component: TeamPage,
});

function TeamPage() {
  return (
    <>
      <PageHeader title="Team" description="Owners responsible for each subscription." actions={<Button onClick={() => toast.success("Invitation sent")}><UserPlus /> Invite member</Button>} />
      <Card className="hover:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="h-10 pl-5 font-medium">Member</th>
                <th className="font-medium">Role</th>
                <th className="text-right font-medium">Subscriptions</th>
                <th className="pr-5 text-right font-medium">Monthly spend owned</th>
              </tr>
            </thead>
            <tbody>
              {team.map((m) => (
                <tr key={m.email} className="border-b border-border/70 last:border-0 hover:bg-accent/40">
                  <td className="h-14 pl-5">
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{m.name.split(" ").map((p) => p[0]).join("")}</span>
                      <div><div className="font-medium">{m.name}</div><div className="text-xs text-muted-foreground">{m.email}</div></div>
                    </div>
                  </td>
                  <td className="text-muted-foreground">{m.role}</td>
                  <td className="text-right tabular-nums">{m.subs}</td>
                  <td className="pr-5 text-right font-medium tabular-nums">{usd(m.spend)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
