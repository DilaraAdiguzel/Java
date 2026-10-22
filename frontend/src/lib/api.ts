/**
 * Service layer. Every function maps 1:1 to a REST endpoint.
 * Set VITE_API_BASE_URL (e.g. your Spring Boot backend) to switch from mock data to real HTTP.
 */
import { queryOptions } from "@tanstack/react-query";
import * as mock from "./mock-data";
import type { Alert, DashboardData, MonthlySpend, Subscription } from "./types";

const BASE = import.meta.env['VITE_API_BASE_URL'] as string | undefined;
const delay = (ms = 350) => new Promise((r) => setTimeout(r, ms));

async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json() as Promise<T>;
}

// In-memory store for mock mode
let subs: Subscription[] = [...mock.subscriptions];

export const api = {
  // GET /api/dashboard
  async getDashboard(): Promise<DashboardData> {
    if (BASE) return http("/api/dashboard");
    await delay();
    return { metrics: mock.metrics, trend: mock.monthlyTrend, categories: mock.categoryBreakdown };
  },
  // GET /api/subscriptions
  async getSubscriptions(): Promise<Subscription[]> {
    if (BASE) return http("/api/subscriptions");
    await delay();
    return [...subs];
  },
  // POST /api/subscriptions
  async createSubscription(input: Omit<Subscription, "id" | "riskScore" | "risks" | "priceHistory" | "status">): Promise<Subscription> {
    if (BASE) return http("/api/subscriptions", { method: "POST", body: JSON.stringify(input) });
    await delay(500);
    const created: Subscription = {
      ...input,
      id: `${input.vendor.toLowerCase().replace(/\W+/g, "-")}-${subs.length}`,
      status: "Active",
      riskScore: 10,
      risks: [],
      priceHistory: [{ month: "Oct", price: input.cost }],
    };
    subs = [created, ...subs];
    return created;
  },
  // PATCH /api/subscriptions/:id
  async updateSubscription(id: string, patch: Partial<Subscription>): Promise<Subscription> {
    if (BASE) return http(`/api/subscriptions/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
    await delay(300);
    subs = subs.map((s) => (s.id === id ? { ...s, ...patch } : s));
    return subs.find((s) => s.id === id)!;
  },
  // GET /api/alerts
  async getAlerts(): Promise<Alert[]> {
    if (BASE) return http("/api/alerts");
    await delay();
    return [...mock.alerts];
  },
  // GET /api/reports/monthly
  async getMonthlyReport(): Promise<{ trend: MonthlySpend[]; forecast: MonthlySpend[] }> {
    if (BASE) return http("/api/reports/monthly");
    await delay();
    return { trend: mock.monthlyTrend, forecast: mock.forecast };
  },
  // POST /api/import/csv
  async importCsv(file: File): Promise<{ imported: number }> {
    if (BASE) {
      const body = new FormData();
      body.append("file", file);
      const res = await fetch(`${BASE}/api/import/csv`, { method: "POST", body });
      return res.json();
    }
    await delay(800);
    return { imported: 0 };
  },
};

export const dashboardQuery = queryOptions({ queryKey: ["dashboard"], queryFn: api.getDashboard });
export const subscriptionsQuery = queryOptions({ queryKey: ["subscriptions"], queryFn: api.getSubscriptions });
export const alertsQuery = queryOptions({ queryKey: ["alerts"], queryFn: api.getAlerts });
export const monthlyReportQuery = queryOptions({ queryKey: ["reports", "monthly"], queryFn: api.getMonthlyReport });

export const usd = (n: number, digits = 0) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);

export const monthlyCost = (s: Subscription) => (s.billingCycle === "Yearly" ? s.cost / 12 : s.cost);

export const riskTone = (score: number) => (score <= 35 ? "success" : score <= 65 ? "warning" : "danger");

export const formatDate = (iso: string) => {
  if (!iso || iso === "—") return "—";
  const d = new Date(iso + "T00:00:00Z");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
};
