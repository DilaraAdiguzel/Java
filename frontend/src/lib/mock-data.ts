import type {
  Alert,
  Category,
  CategoryBreakdown,
  MonthlySpend,
  Report,
  SpendMetric,
  Subscription,
} from "./types";

export const CATEGORIES: Category[] = [
  "Infrastructure",
  "Engineering",
  "Productivity",
  "Marketing",
  "Finance",
  "Other",
];

export const CATEGORY_COLORS: Record<Category, string> = {
  Infrastructure: "var(--chart-1)",
  Engineering: "var(--chart-2)",
  Productivity: "var(--chart-3)",
  Marketing: "var(--chart-4)",
  Finance: "var(--chart-5)",
  Other: "var(--chart-6)",
};

const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const TOTALS = [6120, 6340, 6510, 6480, 6790, 6920, 7105, 7240, 7380, 7610, 7768, 8420.5];
const SHARES: Record<Category, number> = {
  Infrastructure: 0.42,
  Engineering: 0.21,
  Productivity: 0.15,
  Marketing: 0.1,
  Finance: 0.07,
  Other: 0.05,
};

export const monthlyTrend: MonthlySpend[] = MONTHS.map((month, i) => ({
  month,
  total: TOTALS[i]!,
  byCategory: Object.fromEntries(
    CATEGORIES.map((c, ci) => [c, Math.round(TOTALS[i]! * SHARES[c] * (1 + ((i + ci) % 3) * 0.02))]),
  ),
}));

export const forecast: MonthlySpend[] = [
  ...monthlyTrend.slice(-6).map((m) => ({ month: m.month, total: m.total })),
  { month: "Nov", total: 8690, projected: true },
  { month: "Dec", total: 8920, projected: true },
  { month: "Jan", total: 9180, projected: true },
];

export const categoryBreakdown: CategoryBreakdown[] = [
  { category: "Infrastructure", amount: 3536.6, previous: 3120 },
  { category: "Engineering", amount: 1768.3, previous: 1702 },
  { category: "Productivity", amount: 1263.1, previous: 1290 },
  { category: "Marketing", amount: 842, previous: 760 },
  { category: "Finance", amount: 589.4, previous: 560 },
  { category: "Other", amount: 421.1, previous: 336 },
];

export const metrics: SpendMetric[] = [
  {
    id: "monthly",
    label: "Monthly spend",
    value: "$8,420.50",
    change: 8.4,
    changeTone: "bad",
    hint: "vs last month",
    sparkline: TOTALS.slice(-8),
  },
  {
    id: "arr",
    label: "Annual run rate",
    value: "$101,046",
    change: 6.1,
    changeTone: "bad",
    hint: "vs last quarter",
    sparkline: [88, 89, 91, 92, 94, 96, 98, 101],
  },
  {
    id: "savings",
    label: "Potential savings",
    value: "$1,240 / mo",
    change: 12.5,
    changeTone: "good",
    hint: "new opportunities",
    sparkline: [620, 700, 760, 820, 900, 1010, 1100, 1240],
  },
  {
    id: "active",
    label: "Active subscriptions",
    value: "42",
    change: 2,
    changeTone: "neutral",
    hint: "added this month",
    sparkline: [34, 35, 36, 38, 38, 39, 40, 42],
  },
];

function history(base: number, bumps: number[]): { month: string; price: number }[] {
  return MONTHS.slice(-6).map((month, i) => ({ month, price: Math.round(base * (1 + bumps[i]!) * 100) / 100 }));
}

export const subscriptions: Subscription[] = [
  { id: "aws", vendor: "AWS", website: "aws.amazon.com", category: "Infrastructure", cost: 2840.2, currency: "USD", billingCycle: "Monthly", firstPayment: "2021-03-01", nextRenewal: "2026-11-01", owner: "Mert Kaya", team: "Platform", riskScore: 78, status: "Active", risks: ["Cost increased 22% month over month", "Unattached EBS volumes detected"], priceHistory: history(2328, [0, 0.02, 0.04, 0.09, 0.15, 0.22]) },
  { id: "github", vendor: "GitHub", website: "github.com", category: "Engineering", cost: 1120, currency: "USD", billingCycle: "Monthly", firstPayment: "2020-06-12", nextRenewal: "2026-11-12", owner: "Deniz Arslan", team: "Engineering", riskScore: 32, status: "Active", risks: ["6 inactive seats in the last 60 days"], priceHistory: history(1080, [0, 0, 0.01, 0.02, 0.03, 0.037]) },
  { id: "vercel", vendor: "Vercel", website: "vercel.com", category: "Infrastructure", cost: 640, currency: "USD", billingCycle: "Monthly", firstPayment: "2022-01-22", nextRenewal: "2026-10-22", owner: "Mert Kaya", team: "Platform", riskScore: 54, status: "Active", risks: ["Renews in 3 days", "Bandwidth overage trending up"], priceHistory: history(520, [0, 0.05, 0.08, 0.12, 0.18, 0.23]) },
  { id: "slack", vendor: "Slack", website: "slack.com", category: "Productivity", cost: 612.5, currency: "USD", billingCycle: "Monthly", firstPayment: "2019-09-03", nextRenewal: "2026-11-03", owner: "Ayşe Demir", team: "Operations", riskScore: 41, status: "Active", risks: ["11 guest accounts billed as full members"], priceHistory: history(612.5, [0, 0, 0, 0, 0, 0]) },
  { id: "figma", vendor: "Figma", website: "figma.com", category: "Engineering", cost: 540, currency: "USD", billingCycle: "Monthly", firstPayment: "2021-11-12", nextRenewal: "2026-11-12", owner: "Elif Şahin", team: "Design", riskScore: 84, status: "Active", risks: ["Duplicate charge on October 12", "2 editor seats unused"], priceHistory: history(450, [0, 0, 0, 0.2, 0.2, 0.2]) },
  { id: "notion", vendor: "Notion", website: "notion.so", category: "Productivity", cost: 384, currency: "USD", billingCycle: "Monthly", firstPayment: "2021-02-18", nextRenewal: "2026-11-18", owner: "Ayşe Demir", team: "Operations", riskScore: 22, status: "Active", risks: [], priceHistory: history(384, [0, 0, 0, 0, 0, 0]) },
  { id: "datadog", vendor: "Datadog", website: "datadoghq.com", category: "Infrastructure", cost: 910, currency: "USD", billingCycle: "Monthly", firstPayment: "2022-05-07", nextRenewal: "2026-11-07", owner: "Mert Kaya", team: "Platform", riskScore: 69, status: "Active", risks: ["Log ingestion 40% above committed volume"], priceHistory: history(760, [0, 0.03, 0.07, 0.11, 0.15, 0.2]) },
  { id: "hubspot", vendor: "HubSpot", website: "hubspot.com", category: "Marketing", cost: 7200, currency: "USD", billingCycle: "Yearly", firstPayment: "2023-02-01", nextRenewal: "2027-02-01", owner: "Can Yıldız", team: "Marketing", riskScore: 47, status: "Active", risks: ["Contacts tier nearing upgrade threshold"], priceHistory: history(600, [0, 0, 0, 0, 0, 0]) },
  { id: "linear", vendor: "Linear", website: "linear.app", category: "Engineering", cost: 192, currency: "USD", billingCycle: "Monthly", firstPayment: "2023-08-14", nextRenewal: "2026-11-14", owner: "Deniz Arslan", team: "Engineering", riskScore: 12, status: "Active", risks: [], priceHistory: history(192, [0, 0, 0, 0, 0, 0]) },
  { id: "quickbooks", vendor: "QuickBooks", website: "quickbooks.intuit.com", category: "Finance", cost: 275, currency: "USD", billingCycle: "Monthly", firstPayment: "2020-01-10", nextRenewal: "2026-11-10", owner: "Ayşe Demir", team: "Finance", riskScore: 18, status: "Active", risks: [], priceHistory: history(250, [0, 0, 0.1, 0.1, 0.1, 0.1]) },
  { id: "zoom", vendor: "Zoom", website: "zoom.us", category: "Productivity", cost: 199.9, currency: "USD", billingCycle: "Monthly", firstPayment: "2020-03-20", nextRenewal: "2026-11-20", owner: "Can Yıldız", team: "Operations", riskScore: 71, status: "Active", risks: ["Low usage: 3 meetings in 30 days", "Overlaps with Google Meet"], priceHistory: history(199.9, [0, 0, 0, 0, 0, 0]) },
  { id: "loom", vendor: "Loom", website: "loom.com", category: "Productivity", cost: 150, currency: "USD", billingCycle: "Monthly", firstPayment: "2022-07-01", nextRenewal: "2026-11-01", owner: "Elif Şahin", team: "Design", riskScore: 63, status: "Active", risks: ["Low usage across 8 of 12 seats"], priceHistory: history(150, [0, 0, 0, 0, 0, 0]) },
  { id: "semrush", vendor: "Semrush", website: "semrush.com", category: "Marketing", cost: 249.95, currency: "USD", billingCycle: "Monthly", firstPayment: "2024-04-02", nextRenewal: "2026-11-02", owner: "Can Yıldız", team: "Marketing", riskScore: 38, status: "Trial", risks: ["Trial converts to paid on Nov 2"], priceHistory: history(249.95, [0, 0, 0, 0, 0, 0]) },
  { id: "netflix", vendor: "Netflix", website: "netflix.com", category: "Other", cost: 22.99, currency: "USD", billingCycle: "Monthly", firstPayment: "2023-01-15", nextRenewal: "2026-11-15", owner: "Unassigned", team: "—", riskScore: 88, status: "Active", risks: ["Personal-use service on company card"], priceHistory: history(19.99, [0, 0, 0.15, 0.15, 0.15, 0.15]) },
  { id: "mailchimp", vendor: "Mailchimp", website: "mailchimp.com", category: "Marketing", cost: 0, currency: "USD", billingCycle: "Monthly", firstPayment: "2021-05-05", nextRenewal: "—", owner: "Can Yıldız", team: "Marketing", riskScore: 5, status: "Cancelled", risks: [], priceHistory: history(110, [0, 0, 0, 0, -1, -1]) },
  { id: "stripe-atlas", vendor: "Brex", website: "brex.com", category: "Finance", cost: 120, currency: "USD", billingCycle: "Monthly", firstPayment: "2022-09-09", nextRenewal: "2026-11-09", owner: "Ayşe Demir", team: "Finance", riskScore: 26, status: "Active", risks: [], priceHistory: history(120, [0, 0, 0, 0, 0, 0]) },
];

export const alerts: Alert[] = [
  { id: "a1", severity: "critical", type: "price", title: "AWS cost increased 22%", description: "EC2 and data transfer charges rose sharply compared with September. Check for idle instances and unattached volumes.", vendor: "AWS", impactMonthly: 512, detectedAt: "2026-10-18", resolved: false },
  { id: "a2", severity: "critical", type: "duplicate", title: "Potential duplicate charge detected", description: "Figma was charged twice on October 12. Review both transactions before the next billing cycle.", vendor: "Figma", impactMonthly: 20, detectedAt: "2026-10-13", resolved: false },
  { id: "a3", severity: "warning", type: "renewal", title: "Vercel renews in 3 days", description: "Pro plan auto-renews on October 22. Confirm seat count and bandwidth commitments.", vendor: "Vercel", impactMonthly: 640, detectedAt: "2026-10-19", resolved: false },
  { id: "a4", severity: "warning", type: "usage", title: "3 subscriptions have low usage", description: "Zoom, Loom and Netflix had minimal activity over the last 30 days.", vendor: "Multiple", impactMonthly: 373, detectedAt: "2026-10-16", resolved: false },
  { id: "a5", severity: "warning", type: "price", title: "Datadog over committed volume", description: "Log ingestion is 40% above your committed plan, triggering on-demand pricing.", vendor: "Datadog", impactMonthly: 150, detectedAt: "2026-10-15", resolved: false },
  { id: "a6", severity: "warning", type: "renewal", title: "Semrush trial converts soon", description: "Trial converts to a paid plan on November 2 unless cancelled.", vendor: "Semrush", impactMonthly: 250, detectedAt: "2026-10-14", resolved: false },
  { id: "a7", severity: "warning", type: "usage", title: "Inactive GitHub seats", description: "6 seats have had no activity in 60 days.", vendor: "GitHub", impactMonthly: 126, detectedAt: "2026-10-11", resolved: false },
  { id: "a8", severity: "warning", type: "price", title: "Netflix price change", description: "Monthly price increased from $19.99 to $22.99. Service appears personal-use.", vendor: "Netflix", impactMonthly: 23, detectedAt: "2026-10-09", resolved: false },
  { id: "a9", severity: "opportunity", type: "savings", title: "Switch GitHub to annual billing", description: "Annual billing saves roughly 16% on your current seat count.", vendor: "GitHub", impactMonthly: 180, detectedAt: "2026-10-12", resolved: false },
  { id: "a10", severity: "opportunity", type: "savings", title: "Consolidate video tools", description: "Zoom overlaps with Google Meet included in Workspace.", vendor: "Zoom", impactMonthly: 200, detectedAt: "2026-10-10", resolved: false },
  { id: "a11", severity: "opportunity", type: "savings", title: "Downgrade Slack guest seats", description: "11 guests are billed as full members; convert to single-channel guests.", vendor: "Slack", impactMonthly: 96, detectedAt: "2026-10-08", resolved: false },
  { id: "a12", severity: "opportunity", type: "savings", title: "AWS Savings Plan", description: "A 1-year compute savings plan would cover 70% of steady-state EC2 usage.", vendor: "AWS", impactMonthly: 420, detectedAt: "2026-10-07", resolved: false },
  { id: "a13", severity: "opportunity", type: "savings", title: "Remove unused Figma editors", description: "2 editor seats have not opened a file in 45 days.", vendor: "Figma", impactMonthly: 90, detectedAt: "2026-10-06", resolved: false },
  { id: "a14", severity: "opportunity", type: "savings", title: "Reduce Loom seats", description: "8 of 12 seats inactive; downsize to 4.", vendor: "Loom", impactMonthly: 100, detectedAt: "2026-10-05", resolved: false },
  { id: "a15", severity: "opportunity", type: "savings", title: "Vercel spend controls", description: "Enable spend caps to avoid bandwidth overages.", vendor: "Vercel", impactMonthly: 60, detectedAt: "2026-10-04", resolved: false },
  { id: "a16", severity: "opportunity", type: "savings", title: "Datadog log retention", description: "Shorten retention for debug logs from 30 to 7 days.", vendor: "Datadog", impactMonthly: 94, detectedAt: "2026-10-03", resolved: false },
  { id: "r1", severity: "warning", type: "duplicate", title: "Duplicate Notion workspace", description: "Merged marketing workspace into main.", vendor: "Notion", impactMonthly: 48, detectedAt: "2026-10-02", resolved: true },
  { id: "r2", severity: "opportunity", type: "savings", title: "Cancelled Mailchimp", description: "Migrated campaigns to HubSpot.", vendor: "Mailchimp", impactMonthly: 110, detectedAt: "2026-10-01", resolved: true },
];

export const reports: Report[] = [
  { id: "exec", title: "Monthly executive summary", description: "Total spend, trends, top movers and risk summary on a single board-ready page.", format: "PDF", lastGenerated: "Oct 1, 2026" },
  { id: "breakdown", title: "Subscription cost breakdown", description: "Line-by-line breakdown by vendor, category, owner and cost center.", format: "Excel", lastGenerated: "Oct 1, 2026" },
  { id: "renewals", title: "Renewal calendar", description: "Upcoming renewals for the next 90 days with contract terms and owners.", format: "PDF", lastGenerated: "Sep 28, 2026" },
  { id: "savings", title: "Savings opportunities", description: "Every detected saving with estimated monthly and annual impact.", format: "Excel", lastGenerated: "Sep 24, 2026" },
];

export const recentReports = [
  { name: "Executive summary — September 2026", format: "PDF", date: "Oct 1, 2026", size: "412 KB" },
  { name: "Cost breakdown — Q3 2026", format: "Excel", date: "Oct 1, 2026", size: "88 KB" },
  { name: "Renewal calendar — Q4", format: "PDF", date: "Sep 28, 2026", size: "236 KB" },
  { name: "Savings opportunities — September", format: "Excel", date: "Sep 24, 2026", size: "54 KB" },
  { name: "Executive summary — August 2026", format: "PDF", date: "Sep 1, 2026", size: "398 KB" },
];

export const team = [
  { name: "Ayşe Demir", role: "Finance Lead", email: "ayse@northwind.io", subs: 6, spend: 1846 },
  { name: "Mert Kaya", role: "Platform Engineer", email: "mert@northwind.io", subs: 3, spend: 4390 },
  { name: "Deniz Arslan", role: "Engineering Manager", email: "deniz@northwind.io", subs: 2, spend: 1312 },
  { name: "Elif Şahin", role: "Design Lead", email: "elif@northwind.io", subs: 2, spend: 690 },
  { name: "Can Yıldız", role: "Marketing Manager", email: "can@northwind.io", subs: 4, spend: 1050 },
];
