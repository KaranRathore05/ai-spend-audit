import { AuditInput, AuditResult, ToolRecommendation } from "./types";

export function runAuditEngine(input: AuditInput): AuditResult {
  let totalCurrentSpend = 0;
  let totalMonthlySavings = 0;
  let recommendations: ToolRecommendation[] = [];

  const tools = input.tools;

  const hasCursor = tools.some((t) => t.tool.toLowerCase() === "cursor");
  const hasCopilot = tools.some((t) => t.tool.toLowerCase() === "github copilot");
  const hasClaudeSub = tools.some((t) => t.tool.toLowerCase() === "claude");
  const hasAnthropicApi = tools.some((t) => t.tool.toLowerCase() === "anthropic api direct");

  for (const t of tools) {
    const spend = t.monthlySpend;
    totalCurrentSpend += spend;

    if (spend === 0) {
      continue;
    }

    let estSavings = 0;
    let action = "Keep as is";
    let reason = "This tool appears correctly sized for your team and use case.";
    let severity: "good" | "medium" | "high" = "good";

    // Seats > teamSize
    if (t.seats > input.teamSize) {
      estSavings = (t.seats - input.teamSize) * (spend / t.seats);
      action = `Reduce seats to ${input.teamSize}`;
      reason = "You are paying for more seats than you have team members.";
      severity = "medium";
    }

    // Small team on team/business plans
    if (input.teamSize <= 2) {
      const planStr = t.plan.toLowerCase();
      if (planStr.includes("team") || planStr.includes("business") || planStr.includes("enterprise") || planStr.includes("max")) {
        action = "Downgrade to Pro/Individual plan";
        reason = "Your team has 2 people but is paying for a team/business plan. Unless you need SSO, RBAC, or centralized billing, individual plans are likely enough.";
        severity = "medium";
        
        if (t.tool.toLowerCase() === "cursor" && t.seats <= 2) {
           estSavings = (40 - 20) * t.seats; 
        } else if (t.tool.toLowerCase() === "github copilot") {
           estSavings = (19 - 10) * t.seats; 
        } else if (t.tool.toLowerCase() === "chatgpt") {
           estSavings = Math.max((spend / t.seats - 20) * t.seats, 0);
        } else if (t.tool.toLowerCase() === "claude" && planStr.includes("max")) {
           estSavings = Math.max((spend / t.seats - 20) * t.seats, 0);
        }
      }
    }

    // Duplicate coding assistants
    if (input.primaryUseCase === "coding" && hasCursor && hasCopilot) {
       if (t.tool.toLowerCase() === "github copilot") {
          action = "Consolidate coding assistants";
          reason = "You're paying for both Cursor and Copilot for the same coding workflow. Most small teams should pick one primary coding assistant and remove duplicate seats.";
          severity = "high";
          const cursorTool = tools.find((x) => x.tool.toLowerCase() === "cursor");
          if (cursorTool) {
             estSavings = Math.max(estSavings, Math.min(t.monthlySpend, cursorTool.monthlySpend));
          }
       }
    }

    // Claude API vs Sub overlap
    if (hasClaudeSub && hasAnthropicApi && t.tool.toLowerCase() === "claude") {
        if (action === "Keep as is") {
            action = "Review API vs Sub usage";
            reason = "You are paying for both Claude subscriptions and Anthropic API. Ensure you are utilizing the appropriate interface for your workload without redundant subscriptions.";
            severity = "good";
        }
    }

    // API spend threshold
    if ((t.tool.toLowerCase().includes("api")) && spend > 300) {
       action = "Source discounted credits";
       reason = "Your API spend is high enough that discounted credits may materially reduce cost without changing vendors.";
       estSavings = Math.max(estSavings, spend * 0.20); 
       severity = "high";
    }

    if (estSavings > 0 || action !== "Keep as is") {
      recommendations.push({
        tool: t.tool,
        currentSpend: spend,
        recommendedAction: action,
        estimatedSavings: estSavings > 0 ? estSavings : 0,
        reason: reason,
        severity: severity
      });
      totalMonthlySavings += estSavings;
    }
  }

  // High density spend
  if (input.teamSize > 0 && input.teamSize <= 5 && totalCurrentSpend / input.teamSize > 150) {
     recommendations.push({
        tool: "Overall Stack",
        currentSpend: totalCurrentSpend,
        recommendedAction: "Audit individual usage",
        estimatedSavings: 0,
        reason: `Your per-seat AI spend is very high ($${(totalCurrentSpend / input.teamSize).toFixed(0)}/user). Consider standardizing tooling across the team.`,
        severity: "medium"
     });
  }

  let spendHealth: "excellent" | "optimizable" | "high-opportunity" = "excellent";
  if (totalMonthlySavings >= 500) {
     spendHealth = "high-opportunity";
  } else if (totalMonthlySavings >= 100) {
     spendHealth = "optimizable";
  }

  return {
    totalCurrentSpend,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    spendHealth,
    recommendations,
    summary: "" 
  };
}
