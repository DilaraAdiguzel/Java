import { Bell, CalendarDays, Moon, Search, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { alerts } from "@/lib/mock-data";
import { SeverityBadge } from "./common";

export function AppHeader() {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "light") setDark(false);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const open = alerts.filter((a) => !a.resolved && a.severity !== "opportunity").slice(0, 4);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur md:px-8">
      <SidebarTrigger className="md:hidden" aria-label="Open navigation" />
      <div className="relative min-w-0 max-w-md flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input aria-label="Search" placeholder="Search vendors, owners, alerts…" className="h-9 bg-card pl-9" />
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-border px-1.5 text-[10px] text-muted-foreground sm:block">⌘K</kbd>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-2">
        <Select defaultValue="30d">
          <SelectTrigger className="hidden h-9 w-[160px] bg-card lg:flex" aria-label="Date range">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="3m">Last 3 months</SelectItem>
            <SelectItem value="12m">Last 12 months</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="icon" aria-label="Toggle theme" onClick={() => setDark((d) => !d)}>
          {dark ? <Sun /> : <Moon />}
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Notifications" className="relative">
              <Bell />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-danger ring-2 ring-background" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80 p-0">
            <div className="border-b border-border px-4 py-3 text-sm font-semibold">Notifications</div>
            <ul className="divide-y divide-border">
              {open.map((a) => (
                <li key={a.id} className="px-4 py-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="truncate text-sm">{a.title}</span>
                    <SeverityBadge severity={a.severity} />
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/alerts" className="block border-t border-border px-4 py-2.5 text-center text-xs font-medium text-primary hover:underline">
              View all alerts
            </Link>
          </PopoverContent>
        </Popover>
        <span className="hidden h-8 w-8 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary sm:grid" aria-label="Ayşe Demir">AD</span>
      </div>
    </header>
  );
}
