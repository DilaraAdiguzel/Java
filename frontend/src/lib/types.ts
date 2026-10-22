export type Category =
  | "Infrastructure"
  | "Engineering"
  | "Productivity"
  | "Marketing"
  | "Finance"
  | "Other";

export type SubscriptionStatus = "Active" | "Trial" | "Cancelled";
export type BillingCycle = "Monthly" | "Yearly";
export type Severity = "critical" | "warning" | "opportunity" | "info";

export interface PricePoint {
  month: string;
  price: number;
}

export interface Subscription {
  id: string;
  vendor: string;
  website: string;
  category: Category;
  cost: number; // per billing cycle, USD
  currency: string;
  billingCycle: BillingCycle;
  firstPayment: string;
  nextRenewal: string;
  owner: string;
  team: string;
  riskScore: number;
  status: SubscriptionStatus;
  notes?: string | undefined;
  risks: string[];
  priceHistory: PricePoint[];
  reviewed?: boolean | undefined;
}

export interface Alert {
  id: string;
  severity: Severity;
  type: "price" | "duplicate" | "usage" | "renewal" | "savings";
  title: string;
  description: string;
  vendor: string;
  impactMonthly: number;
  detectedAt: string;
  resolved: boolean;
}

export interface SpendMetric {
  id: string;
  label: string;
  value: string;
  change: number;
  changeTone: "good" | "bad" | "neutral";
  hint: string;
  sparkline: number[];
}

export interface CategoryBreakdown {
  category: Category;
  amount: number;
  previous: number;
}

export interface MonthlySpend {
  month: string;
  total: number;
  projected?: boolean | undefined;
  byCategory?: Partial<Record<Category, number>>;
}

export interface Report {
  id: string;
  title: string;
  description: string;
  format: "PDF" | "Excel";
  lastGenerated: string;
}

export interface DashboardData {
  metrics: SpendMetric[];
  trend: MonthlySpend[];
  categories: CategoryBreakdown[];
}
