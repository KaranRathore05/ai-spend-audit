import { describe, it, expect } from "vitest";
import { runAuditEngine } from "../lib/audit-engine";
import { AuditInput } from "../lib/types";

describe("Audit Engine", () => {
  it("1. Cursor Teams with 2 users recommends downgrade", () => {
    const input: AuditInput = {
      teamSize: 2,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Teams", monthlySpend: 80, seats: 2 }
      ]
    };
    const result = runAuditEngine(input);
    expect(result.recommendations.length).toBeGreaterThan(0);
    const rec = result.recommendations.find(r => r.tool === "Cursor");
    expect(rec).toBeDefined();
    expect(rec?.recommendedAction).toContain("Downgrade to Pro/Individual plan");
    // $40 teams vs $20 pro => $20 savings per seat => $40 total
    expect(rec?.estimatedSavings).toBe(40);
  });

  it("2. Duplicate Cursor + Copilot detects overlap savings", () => {
    const input: AuditInput = {
      teamSize: 5,
      primaryUseCase: "coding",
      tools: [
        { tool: "Cursor", plan: "Pro", monthlySpend: 100, seats: 5 },
        { tool: "GitHub Copilot", plan: "Business", monthlySpend: 95, seats: 5 }
      ]
    };
    const result = runAuditEngine(input);
    const rec = result.recommendations.find(r => r.tool === "GitHub Copilot");
    expect(rec).toBeDefined();
    expect(rec?.recommendedAction).toBe("Consolidate coding assistants");
    expect(rec?.estimatedSavings).toBe(95); // Save the cheaper of the two duplicate tools' spend
  });

  it("3. API spend over $300 recommends Credex/credits savings", () => {
    const input: AuditInput = {
      teamSize: 4,
      primaryUseCase: "mixed",
      tools: [
        { tool: "Anthropic API Direct", plan: "Usage", monthlySpend: 1000, seats: 1 }
      ]
    };
    const result = runAuditEngine(input);
    const rec = result.recommendations.find(r => r.tool === "Anthropic API Direct");
    expect(rec).toBeDefined();
    expect(rec?.recommendedAction).toBe("Source discounted credits");
    expect(rec?.estimatedSavings).toBe(200); // 20% of 1000
    expect(result.spendHealth).toBe("optimizable"); // Actually it might be optimizable or high depending on threshold
  });

  it("4. Low spend optimized stack returns honest 'excellent' health", () => {
    const input: AuditInput = {
      teamSize: 1,
      primaryUseCase: "writing",
      tools: [
        { tool: "Claude", plan: "Pro", monthlySpend: 20, seats: 1 }
      ]
    };
    const result = runAuditEngine(input);
    expect(result.spendHealth).toBe("excellent");
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.recommendations.length).toBe(0); // Assuming no high spend density
  });

  it("5. Seats greater than team size recommends seat reduction", () => {
    const input: AuditInput = {
      teamSize: 3,
      primaryUseCase: "design",
      tools: [
        { tool: "v0", plan: "Team", monthlySpend: 150, seats: 5 }
      ]
    };
    const result = runAuditEngine(input);
    const rec = result.recommendations.find(r => r.tool === "v0");
    expect(rec).toBeDefined();
    expect(rec?.recommendedAction).toBe("Reduce seats to 3");
    // $150/5 = $30 per seat. Overpaying for 2 seats = $60 savings
    expect(rec?.estimatedSavings).toBe(60);
  });

  it("6. High savings over $500 triggers high-opportunity", () => {
    const input: AuditInput = {
      teamSize: 10,
      primaryUseCase: "mixed",
      tools: [
        { tool: "OpenAI API Direct", plan: "Usage", monthlySpend: 3000, seats: 1 }
      ]
    };
    const result = runAuditEngine(input);
    expect(result.spendHealth).toBe("high-opportunity");
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(500);
  });
});
