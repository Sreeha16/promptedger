'use client';

import React, { useState } from 'react';

// Define strict technical interfaces for our optimization engine data structures
interface ToolMetricInput {
  seats: number;
  tier: string;
}

interface WorkspaceConfig {
  cursor: ToolMetricInput;
  linear: ToolMetricInput;
  copilot: ToolMetricInput;
  v0: ToolMetricInput;
  warp: ToolMetricInput;
}

interface RecommendationVector {
  toolId: string;
  savings: number;
  reason: string;
}

interface AuditAssessmentResult {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  perToolRecommendations: RecommendationVector[];
  requiresCredexConsultation: boolean;
}

export default function Home() {
  // Setup baseline infrastructural state matrix matching user profiles
  const [config, setConfig] = useState<WorkspaceConfig>({
    cursor: { seats: 0, tier: 'pro' },
    linear: { seats: 0, tier: 'standard' },
    copilot: { seats: 0, tier: 'business' },
    v0: { seats: 0, tier: 'premium' },
    warp: { seats: 0, tier: 'team' },
  });

  const [auditResult, setAuditResult] = useState<AuditAssessmentResult | null>(null);

  // Handle updates to seat allocations across individual product vectors
  const handleSeatChange = (tool: keyof WorkspaceConfig, seats: number) => {
    setConfig((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], seats: Math.max(0, seats) },
    }));
  };

  // Handle changes to pricing tiers
  const handleTierChange = (tool: keyof WorkspaceConfig, tier: string) => {
    setConfig((prev) => ({
      ...prev,
      [tool]: { ...prev[tool], tier },
    }));
  };

  // Execution engine to calculate tool optimization vectors
  const handleCalculateAudit = () => {
    let totalMonthlySavings = 0;
    const perToolRecommendations: RecommendationVector[] = [];

    // 1. Cursor Optimization Channel
    if (config.cursor.seats > 0) {
      if (config.cursor.seats > 15) {
        const structuralSavings = config.cursor.seats * 4;
        totalMonthlySavings += structuralSavings;
        perToolRecommendations.push({
          toolId: 'cursor',
          savings: structuralSavings,
          reason: 'High seat distribution on Cursor identified. Consolidating baseline seat counts into custom enterprise usage tracks can reclaim overlapping usage overhead.',
        });
      }
    }

    // 2. Linear Project Management Routing
    if (config.linear.seats > 10) {
      const linearSavings = config.linear.seats * 2;
      totalMonthlySavings += linearSavings;
      perToolRecommendations.push({
        toolId: 'linear',
        savings: linearSavings,
        reason: 'Detected open seats matching inactive team members. Deprecating stale guest integrations lowers tier allocation costs.',
      });
    }

    // 3. GitHub Copilot Overlap Vectors
    if (config.copilot.seats > 0 && config.cursor.seats > 0) {
      const overlapSeats = Math.min(config.copilot.seats, config.cursor.seats);
      const copilotSavings = overlapSeats * 19;
      totalMonthlySavings += copilotSavings;
      perToolRecommendations.push({
        toolId: 'bundling_alert',
        savings: copilotSavings,
        reason: `Cross-Tool Overlap Detected: ${overlapSeats} seats are running both Cursor and Copilot concurrently. Cursor features integrated LLM logic engines natively—offloading standalone Copilot licenses yields immediate optimization.`,
      });
    }

    // 4. v0 Team Seat Compaction
    if (config.v0.seats > 5) {
      const v0Savings = config.v0.seats * 5;
      totalMonthlySavings += v0Savings;
      perToolRecommendations.push({
        toolId: 'v0_generation',
        savings: v0Savings,
        reason: 'UI component generation tasks show high variance across seats. Floating concurrent team tokens bypasses dedicated multi-seat premium licensing constraints.',
      });
    }

    // Compute unified financial runway figures
    const totalAnnualSavings = totalMonthlySavings * 12;
    const requiresCredexConsultation = totalMonthlySavings > 450;

    setAuditResult({
      totalMonthlySavings,
      totalAnnualSavings,
      perToolRecommendations,
      requiresCredexConsultation,
    });
  };

  // Mock reporting downloader handler
  const handleDownloadReport = () => {
    alert('Generating structural optimization bundle report. Your secure download will initialize shortly.');
  };

  return (
    <main className="min-h-screen bg-black text-gray-100 flex flex-col items-center justify-center p-6 antialiased selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-900 rounded-2xl shadow-2xl p-6 space-y-6">
        
        {/* Dashboard Title Header */}
        <div className="space-y-1">
          <h1 className="text-xl font-black tracking-tight text-white uppercase bg-gradient-to-r from-white via-gray-200 to-zinc-500 bg-clip-text text-transparent">
            Workspace Spend Auditor
          </h1>
          <p className="text-xs text-gray-500">
            Audit configurations, cross-tool seat duplication matrices, and baseline SaaS expenditures.
          </p>
        </div>

        {/* Input Allocation Configuration Section */}
        <div className="space-y-4">
          {(Object.keys(config) as Array<keyof WorkspaceConfig>).map((tool) => (
            <div key={tool} className="flex items-center justify-between bg-zinc-900/50 border border-zinc-900 p-3 rounded-xl gap-4">
              <span className="text-xs font-black capitalize tracking-wider text-gray-300 w-20">{tool}</span>
              
              <div className="flex items-center gap-3 flex-1 justify-end">
                {/* Seat Metrics Allocation Input */}
                <div className="flex items-center space-x-1 bg-black rounded-lg p-1 border border-zinc-800">
                  <span className="text-[10px] text-zinc-600 font-bold px-1.5 uppercase">Seats</span>
                  <input
                    type="number"
                    value={config[tool].seats || ''}
                    onChange={(e) => handleSeatChange(tool, parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-12 bg-transparent text-center font-mono text-xs font-bold text-emerald-400 focus:outline-none"
                  />
                </div>

                {/* Service Tier Dropdown Configuration */}
                <select
                  value={config[tool].tier}
                  onChange={(e) => handleTierChange(tool, e.target.value)}
                  className="bg-black border border-zinc-800 text-gray-400 rounded-lg text-xs p-1.5 font-semibold focus:outline-none focus:border-emerald-500/50 transition-colors capitalize"
                >
                  {tool === 'cursor' && (
                    <>
                      <option value="hobby">Hobby</option>
                      <option value="pro">Pro</option>
                      <option value="business">Business</option>
                    </>
                  )}
                  {tool === 'linear' && (
                    <>
                      <option value="free">Free</option>
                      <option value="standard">Standard</option>
                      <option value="plus">Plus</option>
                    </>
                  )}
                  {tool !== 'cursor' && tool !== 'linear' && (
                    <>
                      <option value="standard">Standard</option>
                      <option value="team">Team</option>
                      <option value="enterprise">Enterprise</option>
                    </>
                  )}
                </select>
              </div>
            </div>
          ))}
        </div>

        {/* Audit Calculation Trigger */}
        <button
          onClick={handleCalculateAudit}
          className="w-full bg-white hover:bg-zinc-200 text-black font-black py-3.5 px-6 rounded-xl transition-all duration-200 text-xs uppercase tracking-widest shadow-lg shadow-white/5 flex items-center justify-center gap-2 group"
        >
          Execute Capital Efficiency Audit
          <svg className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Conditional Analysis Output Rendering Block */}
        {auditResult && (
          <div className="border-t border-zinc-900 pt-5 space-y-5 animate-in fade-in duration-300">
            
            {/* Structural High-Level Optimization Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Monthly Run-Rate Savings</div>
                <div className="text-lg font-black text-emerald-400 mt-1 font-mono">
                  ${auditResult.totalMonthlySavings}
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-900 p-4 rounded-xl text-center">
                <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Annualized Capital Recovery</div>
                <div className="text-lg font-black text-teal-400 mt-1 font-mono">
                  ${auditResult.totalAnnualSavings}
                </div>
              </div>
            </div>

            {/* Clean Text-Only Optimization Status Block */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 mt-4 space-y-2">
              <div className="flex justify-between items-center text-sm font-bold text-gray-200">
                <span>Budget Efficiency Status</span>
                <span className="text-emerald-400">
                  {auditResult.totalMonthlySavings > 0 ? Math.round((auditResult.totalMonthlySavings / (auditResult.totalMonthlySavings + 200)) * 100) : 0}% Optimized
                </span>
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Recovered Infrastructure Leakage</span>
                <span className="font-mono text-emerald-400 font-semibold">+${auditResult.totalMonthlySavings}/mo</span>
              </div>
            </div>

            {/* Granular Optimization Vector Logs */}
            <div className="space-y-4 mt-6">
              <h3 className="text-md font-bold text-gray-300">Granular Optimization Vector Logs</h3>
              
              {/* Cross-Tool Redundancy Alert Display */}
              {auditResult.perToolRecommendations.some(r => r.toolId === 'bundling_alert') && (
                <div className="bg-amber-950/30 border border-amber-500/30 rounded-xl p-4 text-amber-200 space-y-1">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-400">
                    <span className="animate-ping w-2 h-2 rounded-full bg-amber-400 block"></span>
                    Workspace Architecture Warning
                  </div>
                  <p className="text-xs leading-relaxed text-gray-300">
                    {auditResult.perToolRecommendations.find(r => r.toolId === 'bundling_alert')?.reason}
                  </p>
                </div>
              )}

              {auditResult.perToolRecommendations.map((rec) => {
                if (rec.toolId === 'bundling_alert') return null;
                return (
                  <div key={rec.toolId} className="bg-gray-950 p-4 border border-gray-800 rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-1">
                      <span className="font-bold capitalize text-gray-200">{rec.toolId.replace('_', ' ')}</span>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                        Reclaimed: ${rec.savings}/mo
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{rec.reason}</p>
                  </div>
                );
              })}
            </div>

            {/* Download Executive Audit Report Action */}
            <div className="mt-4 print:hidden">
              <button
                onClick={handleDownloadReport}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download Executive Audit Report
              </button>
            </div>

            {/* Enterprise Consultation Trigger */}
            {auditResult.requiresCredexConsultation && (
              <div className="bg-gradient-to-b from-blue-950/40 to-indigo-950/20 border border-blue-900/40 p-5 rounded-xl mt-4 text-center space-y-3">
                <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wide">💡 High Volume Spend Alert</h4>
                <p className="text-xs text-gray-300 max-w-xl mx-auto leading-relaxed">
                  Your organization configuration features deep baseline infrastructural spending. Sourcing this scale via enterprise channels unlocks specialized volume discounts.
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-gray-950 text-xs font-bold uppercase tracking-wider py-2 px-4 rounded transition-all">
                  Book Enterprise Credex Consultation
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  );
}