"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToolSpend, AuditInput } from "@/lib/types";

const AVAILABLE_TOOLS = [
  "Cursor", "GitHub Copilot", "Claude", "ChatGPT", "Anthropic API Direct", "OpenAI API Direct", "Gemini", "v0"
];

export function SpendForm() {
  const router = useRouter();
  const [teamSize, setTeamSize] = useState<number>(1);
  const [primaryUseCase, setPrimaryUseCase] = useState<AuditInput["primaryUseCase"]>("mixed");
  const [tools, setTools] = useState<ToolSpend[]>([]);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem("spend_audit_data");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.primaryUseCase) setPrimaryUseCase(parsed.primaryUseCase);
        if (parsed.tools) setTools(parsed.tools);
      } catch (e) {}
    } else {
      setTools([{ tool: "Cursor", plan: "Pro", monthlySpend: 20, seats: 1 }]);
    }
  }, []);

  useEffect(() => {
    if (isClient) {
      localStorage.setItem("spend_audit_data", JSON.stringify({ teamSize, primaryUseCase, tools }));
    }
  }, [teamSize, primaryUseCase, tools, isClient]);

  const addTool = () => {
    setTools([...tools, { tool: "ChatGPT", plan: "Plus", monthlySpend: 20, seats: 1 }]);
  };

  const updateTool = (index: number, field: keyof ToolSpend, value: any) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    setTools(updated);
  };

  const removeTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: AuditInput = { teamSize, primaryUseCase, tools };
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem("audit_result", JSON.stringify(data.result));
        localStorage.setItem("public_slug", data.publicSlug);
        router.push("/audit");
      } else {
        alert("Error running audit");
      }
    } catch (error) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!isClient) return null;

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto bg-gray-900 p-8 rounded-2xl shadow-xl text-white">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Team Size</label>
          <Input type="number" min={1} value={teamSize} onChange={(e) => setTeamSize(parseInt(e.target.value) || 1)} className="bg-gray-800 border-gray-700 text-white" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Primary Use Case</label>
          <Select value={primaryUseCase} onValueChange={(val: any) => setPrimaryUseCase(val)}>
            <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Select use case" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="coding">Coding / Engineering</SelectItem>
              <SelectItem value="writing">Writing / Content</SelectItem>
              <SelectItem value="data">Data / Analysis</SelectItem>
              <SelectItem value="research">Research</SelectItem>
              <SelectItem value="mixed">Mixed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b border-gray-800 pb-2">AI Tools & Services</h3>
        {tools.map((t, i) => (
          <div key={i} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-gray-800/50 p-3 rounded-xl border border-gray-800">
            <Select value={t.tool} onValueChange={(val) => updateTool(i, "tool", val)}>
              <SelectTrigger className="w-full md:w-1/4 bg-gray-800 border-gray-700 text-white">
                <SelectValue placeholder="Select Tool" />
              </SelectTrigger>
              <SelectContent>
                {AVAILABLE_TOOLS.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input type="text" placeholder="Plan (e.g. Pro, Plus)" value={t.plan} onChange={(e) => updateTool(i, "plan", e.target.value)} className="w-full md:w-1/4 bg-gray-800 border-gray-700 text-white" />
            
            <div className="flex items-center w-full md:w-1/4">
              <span className="text-gray-400 mr-2">$</span>
              <Input type="number" min={0} placeholder="Monthly Spend" value={t.monthlySpend || ""} onChange={(e) => updateTool(i, "monthlySpend", parseFloat(e.target.value) || 0)} className="bg-gray-800 border-gray-700 text-white" />
            </div>

            <div className="flex items-center w-full md:w-1/4 gap-2">
              <Input type="number" min={1} placeholder="Seats" value={t.seats || ""} onChange={(e) => updateTool(i, "seats", parseInt(e.target.value) || 1)} className="bg-gray-800 border-gray-700 text-white w-20" />
              <span className="text-sm text-gray-400">seats</span>
            </div>

            <Button type="button" variant="ghost" onClick={() => removeTool(i)} className="text-red-400 hover:text-red-300 ml-auto">X</Button>
          </div>
        ))}
        <Button type="button" variant="outline" onClick={addTool} className="w-full border-dashed border-gray-600 bg-transparent hover:bg-gray-800 text-gray-300">
          + Add another tool
        </Button>
      </div>

      <Button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-6 text-lg shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-all" disabled={loading}>
        {loading ? "Analyzing Spend..." : "Run Free Audit"}
      </Button>
    </form>
  );
}
