export type ToolSpend = {
  tool: string;
  plan: string;
  monthlySpend: number;
  seats: number;
};

export type AuditInput = {
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "data" | "research" | "mixed";
  tools: ToolSpend[];
};

export type ToolRecommendation = {
  tool: string;
  currentSpend: number;
  recommendedAction: string;
  recommendedPlan?: string;
  estimatedSavings: number;
  reason: string;
  severity: "good" | "medium" | "high";
};

export type AuditResult = {
  id?: string;
  totalCurrentSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  spendHealth: "excellent" | "optimizable" | "high-opportunity";
  recommendations: ToolRecommendation[];
  summary: string;
};
