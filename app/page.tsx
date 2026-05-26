'use client';

import { useState, useEffect, useMemo } from 'react';
import { runAuditEngine, ToolInput, AuditSummary } from './pricingRules';

const DEFAULT_TOOLS: ToolInput[] = [
  { toolId: 'cursor', planName: 'Business', seats: 5, monthlySpend: 200 },
  { toolId: 'claude', planName: 'Team', seats: 3, monthlySpend: 150 },
  { toolId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 35 },
  { toolId: 'windsurf', planName: 'Teams', seats: 2, monthlySpend: 80 }
];

export default function Home() {
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<string>('mixed');

  const [tools, setTools] = useState<ToolInput[]>(DEFAULT_TOOLS);

  const [auditResult, setAuditResult] = useState<AuditSummary | null>(null);

  // Restore persisted form state
  useEffect(() => {
    const cachedState = localStorage.getItem('credex_audit_form_state');

    if (cachedState) {
      try {
        const parsed = JSON.parse(cachedState);

        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || 'mixed');

        setTools(
          Array.isArray(parsed.tools) && parsed.tools.length > 0
            ? parsed.tools
            : DEFAULT_TOOLS
        );
      } catch (error) {
        console.error('Failed to restore saved form state', error);
      }
    }
  }, []);

  // Persist form state
  useEffect(() => {
    const stateToCache = {
      teamSize,
      useCase,
      tools
    };

    localStorage.setItem(
      'credex_audit_form_state',
      JSON.stringify(stateToCache)
    );
  }, [teamSize, useCase, tools]);

  const handleCalculateAudit = () => {
    const summary = runAuditEngine(tools, teamSize, useCase);
    setAuditResult(summary);
  };

  const handleUpdateTool = (
    index: number,
    field: keyof ToolInput,
    value: string | number
  ) => {
    const updated = [...tools];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    setTools(updated);
  };

  const handleAddTool = () => {
    setTools([
      ...tools,
      {
        toolId: '',
        planName: '',
        seats: 1,
        monthlySpend: 0
      }
    ]);
  };

  const handleRemoveTool = (index: number) => {
    setTools(tools.filter((_, i) => i !== index));
  };

  const handleDownloadReport = () => {
    window.print();
  };

  const optimizedPercent = useMemo(() => {
    if (!auditResult || auditResult.totalMonthlySavings <= 0) {
      return 0;
    }

    return Math.min(
      100,
      Math.round(
        (auditResult.totalMonthlySavings /
          (auditResult.totalMonthlySavings + 200)) *
          100
      )
    );
  }, [auditResult]);

  const bundlingAlert = auditResult?.perToolRecommendations.find(
    (r) => r.toolId === 'bundling_alert'
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-gray-800 pb-6 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            StackWise // AI Spend Auditor
          </h1>

          <p className="text-gray-400 mt-2 text-sm">
            Surface over-provisioned licenses and find optimized allocation
            routes instantly. Powered by Credex.
          </p>
        </header>

        {/* Organization Inputs */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div>
            <label
              htmlFor="team-size"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
            >
              Stated Organization Team Size
            </label>

            <input
              id="team-size"
              type="number"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-100"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>

          <div>
            <label
              htmlFor="use-case"
              className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2"
            >
              Primary Machine Workload Use Case
            </label>

            <select
              id="use-case"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-100"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
            >
              <option value="coding">
                Coding / Core App Engineering
              </option>

              <option value="writing">
                Writing & Copy Production
              </option>

              <option value="data">
                Data Analysis & Modeling
              </option>

              <option value="research">
                Academic Research Profiles
              </option>

              <option value="mixed">
                Mixed Multitask Utility
              </option>
            </select>
          </div>
        </section>

        {/* Tools Section */}
        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-200">
              Current AI Tool Allocations
            </h2>

            <button
              onClick={handleAddTool}
              className="bg-emerald-500 hover:bg-emerald-400 text-gray-950 text-xs font-bold px-4 py-2 rounded-lg transition"
            >
              + Add Tool
            </button>
          </div>

          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div
                key={`${tool.toolId}-${index}`}
                className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center bg-gray-950 p-4 border border-gray-800 rounded-lg"
              >
                {/* Tool ID */}
                <input
                  type="text"
                  placeholder="Tool Name"
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 focus:outline-none"
                  value={tool.toolId}
                  onChange={(e) =>
                    handleUpdateTool(index, 'toolId', e.target.value)
                  }
                />

                {/* Plan Name */}
                <input
                  type="text"
                  placeholder="Plan Tier Name"
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-xs text-gray-200 focus:outline-none"
                  value={tool.planName}
                  onChange={(e) =>
                    handleUpdateTool(index, 'planName', e.target.value)
                  }
                />

                {/* Seats */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Seats:</span>

                  <input
                    type="number"
                    className="w-20 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-center text-gray-100"
                    value={tool.seats}
                    onChange={(e) =>
                      handleUpdateTool(
                        index,
                        'seats',
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Monthly Spend */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">Cost ($):</span>

                  <input
                    type="number"
                    className="w-24 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-center text-gray-100"
                    value={tool.monthlySpend}
                    onChange={(e) =>
                      handleUpdateTool(
                        index,
                        'monthlySpend',
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemoveTool(index)}
                  className="bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 text-xs font-bold py-2 px-3 rounded transition"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculateAudit}
            className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-bold py-3 rounded-xl hover:opacity-90 transition"
          >
            Execute Real-Time Audit Assessment
          </button>
        </section>

        {/* Audit Results */}
        {auditResult && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 border border-gray-800 rounded-lg text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Identified Monthly Savings
                </p>

                <p className="text-3xl font-black text-emerald-400 mt-1">
                  ${auditResult.totalMonthlySavings}
                </p>
              </div>

              <div className="bg-gray-950 p-4 border border-gray-800 rounded-lg text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                  Projected Annual Capital Reclaimed
                </p>

                <p className="text-3xl font-black text-blue-400 mt-1">
                  ${auditResult.totalAnnualSavings}
                </p>
              </div>
            </div>

            {/* Runway Visualizer */}
            <div className="bg-gray-950 border border-gray-800 rounded-xl p-5 space-y-3">
              <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
                <span>Budget Efficiency Runway</span>

                <span className="text-emerald-400">
                  {optimizedPercent}% Optimized
                </span>
              </div>

              <div className="w-full h-3 bg-red-950/40 rounded-full overflow-hidden flex border border-gray-800">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${optimizedPercent}%`
                  }}
                />

                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500 ease-out opacity-80"
                  style={{
                    width: `${100 - optimizedPercent}%`
                  }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-gray-500">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                  <span>Optimized Base</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 block"></span>

                  <span>
                    Recovered Leakage ($
                    {auditResult.totalMonthlySavings}/mo)
                  </span>
                </div>
              </div>
            </div>

            {/* Bundling Alert */}
            {bundlingAlert && (
              <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-amber-200 space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-amber-400 block"></span>

                  Workspace Architecture Warning
                </div>

                <p className="text-xs leading-relaxed text-gray-300">
                  {bundlingAlert.reason}
                </p>
              </div>
            )}

            {/* Optimization Logs */}
            <div className="space-y-4 mt-6">
              <h3 className="text-md font-bold text-gray-300">
                Granular Optimization Vector Logs
              </h3>

              {auditResult.perToolRecommendations.map((rec) => {
                if (rec.toolId === 'bundling_alert') {
                  return null;
                }

                return (
                  <div
                    key={rec.toolId}
                    className="bg-gray-950 p-4 border border-gray-800 rounded-lg"
                  >
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-bold capitalize text-gray-200">
                        {rec.toolId.replace('_', ' ')}
                      </span>

                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        Reclaimed: ${rec.savings}/mo
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 leading-relaxed">
                      {rec.reason}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Download Report */}
            <div className="mt-4 print:hidden">
              <button
                onClick={handleDownloadReport}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>

                Download Executive Audit Report
              </button>
            </div>

            {/* Consultation CTA */}
            {auditResult.requiresCredexConsultation && (
              <div className="bg-gradient-to-b from-blue-950/40 to-indigo-950/20 border border-blue-900/40 p-5 rounded-xl mt-4 text-center space-y-3">
                <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wide">
                  💡 High Volume Spend Alert
                </h4>

                <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
                  Your organization configuration features deep baseline
                  infrastructural spending. Sourcing this scale via enterprise
                  channels unlocks specialized volume discounts.
                </p>

                <button className="bg-blue-500 hover:bg-blue-600 text-gray-950 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded transition-all">
                  Book Enterprise Credex Consultation
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}