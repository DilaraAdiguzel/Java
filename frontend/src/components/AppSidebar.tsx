import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity,
  BarChart3,
  ChevronsUpDown,
  FileText,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldAlert,
  Users,
  CreditCard,
  User,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const items = [
  { title: "Overview", url: "/", icon: LayoutDashboard },
  { title: "Subscriptions", url: "/subscriptions", icon: CreditCard },
  { title: "Spend Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Risk & Alerts", url: "/alerts", icon: ShieldAlert },
  { title: "Reports", url: "/reports", icon: FileText },
  { title: "Team", url: "/team", icon: Users },
  { title: "Settings", url: "/settings", icon: Settings },
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="offcanvas" className="border-r border-sidebar-border">
      <SidebarHeader className="px-5 py-5">
        <Link to="/" className="flex items-center gap-2.5" aria-label="Sublytic home">
          <span className="logo-gradient grid h-7 w-7 place-items-center rounded-md text-primary-foreground">
            <Activity className="h-4 w-4" strokeWidth={2.5} />
          </span>
          <span className="text-[15px] font-semibold tracking-tight text-foreground">Sublytic</span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-3">
        <SidebarGroup className="p-0">
          <SidebarGroupContent>
            <SidebarMenu className="gap-0.5">
              {items.map((item) => {
                const active = item.url === "/" ? path === "/" : path.startsWith(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <Link
                      to={item.url}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "relative flex h-9 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                        active
                          ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground before:absolute before:inset-y-1.5 before:left-0 before:w-[3px] before:rounded-full before:bg-primary"
                          : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", active && "text-primary")} />
                      {item.title}
                    </Link>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-3 p-3">
        <div className="rounded-lg border border-sidebar-border bg-card p-3.5">
          <p className="text-xs text-muted-foreground">
            <span className="font-semibold text-foreground">42</span> of 50 subscriptions tracked
          </p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted" role="progressbar" aria-valuenow={84} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full w-[84%] rounded-full bg-primary" />
          </div>
          <Link to="/settings" className="mt-2.5 inline-block text-xs font-medium text-primary hover:underline">
            Upgrade plan
          </Link>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-sidebar-accent/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring">
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">AD</span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-foreground">Ayşe Demir</span>
              <span className="block truncate text-xs text-muted-foreground">Northwind Labs</span>
            </span>
            <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top" align="start" className="w-56">
            <DropdownMenuLabel>ayse@northwind.io</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild><Link to="/settings"><User /> Profile</Link></DropdownMenuItem>
            <DropdownMenuItem asChild><Link to="/settings"><Settings /> Settings</Link></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><LogOut /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
