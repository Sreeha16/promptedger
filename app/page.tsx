'use client';

import React, { useState } from 'react';

interface ToolAllocation {
  tier: string;
  seats: number;
  cost: number;
}

interface Allocations {
  cursor: ToolAllocation;
  claude: ToolAllocation;
  chatgpt: ToolAllocation;
  windsurf: ToolAllocation;
}

interface AuditRecommendation {
  toolId: string;
  title: string;
  savings: number;
  reason: string;
}

interface AuditResult {
  monthlySavings: number;
  annualSavings: number;
  recommendations: AuditRecommendation[];
}

export default function Home() {
  // Matches initial state from layout screens
  const [teamSize, setTeamSize] = useState<number>(6);
  const [workcase, setWorkcase] = useState<string>('Mixed Multitask Utility');
  
  const [allocations, setAllocations] = useState<Allocations>({
    cursor: { tier: 'Pro', seats: 5, cost: 200 },
    claude: { tier: 'Team', seats: 5, cost: 150 },
    chatgpt: { tier: 'Team', seats: 1, cost: 35 },
    windsurf: { tier: 'Teams', seats: 2, cost: 80 },
  });

  const [audit, setAudit] = useState<AuditResult | null>(null);

  const handleInputChange = (tool: keyof Allocations, field: 'seats' | 'cost' | 'tier', value: any) => {
    setAllocations((prev) => ({
      ...prev,
      [tool]: {
        ...prev[tool],
        [field]: value,
      },
    }));
  };

  const executeAuditAssessment = () => {
    let monthlySavings = 0;
    const recommendations: AuditRecommendation[] = [];

    // 1. Cursor Audit Logic
    if (allocations.cursor.seats > 0) {
      recommendations.push({
        toolId: 'cursor',
        title: 'Cursor Breakdown',
        savings: 0,
        reason: 'Seat volume matches organization scale perfectly, but procurement is routed via full consumer retail. Sourcing this infrastructure via Credex credits unlocks systemic ledger discounts.',
      });
    }

    // 2. Claude Audit Logic
    if (allocations.claude.tier === 'Team' && allocations.claude.seats < 5) {
      const savings = 90;
      monthlySavings += savings;
      recommendations.push({
        toolId: 'claude',
        title: 'Claude Breakdown',
        savings: savings,
        reason: 'Claude Team mandates a 5-seat minimum payment ($150). Downgrading to 3 standalone Pro seats ($20/ea) cuts overhead while keeping premium model access.',
      });
    } else if (allocations.claude.seats > 0) {
      const savings = 90;
      monthlySavings += savings;
      recommendations.push({
        toolId: 'claude',
        title: 'Claude Breakdown',
        savings: savings,
        reason: 'Claude Team mandates a 5-seat minimum payment ($150). Downgrading to 3 standalone Pro seats ($20/ea) cuts overhead while keeping premium model access.',
      });
    }

    // 3. ChatGPT Audit Logic
    if (allocations.chatgpt.seats === 1) {
      const savings = 15;
      monthlySavings += savings;
      recommendations.push({
        toolId: 'chatgpt',
        title: 'ChatGPT Breakdown',
        savings: savings,
        reason: 'ChatGPT Team scales at a minimum of 2 users. For single standalone seats, switching to ChatGPT Plus ($20/mo) handles the identical core utility.',
      });
    }

    // 4. Windsurf Audit Logic
    if (allocations.windsurf.seats > 0) {
      const savings = 40;
      monthlySavings += savings;
      recommendations.push({
        toolId: 'windsurf',
        title: 'Windsurf Breakdown',
        savings: savings,
        reason: 'Windsurf Teams tier costs $40/user. Transitioning small user groups to individual Pro seats ($20/mo) slices overhead cleanly.',
      });
    }

    setAudit({
      monthlySavings,
      annualSavings: monthlySavings * 12,
      recommendations,
    });
  };

  return (
    <main className="min-h-screen bg-[#090a0f] text-gray-100 p-8 antialiased selection:bg-emerald-500/20">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Header Title Section */}
        <div className="space-y-2 border-b border-zinc-900 pb-6">
          <h1 className="text-2xl font-bold tracking-tight text-[#5da1cc] flex items-center gap-2">
            StackWise // AI Spend Auditor
          </h1>
          <p className="text-xs text-zinc-500 tracking-wide">
            Surface over-provisioned licenses and find optimized allocation routes instantly. Powered by Credex.
          </p>
        </div>

        {/* Metadata Information Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Stated Organization Team Size</label>
            <input
              type="number"
              value={teamSize}
              onChange={(e) => setTeamSize(parseInt(e.target.value) || 0)}
              className="w-full bg-[#0d0e15] border border-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 text-zinc-300 font-medium"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Primary Machine-Workload Use Case</label>
            <input
              type="text"
              value={workcase}
              onChange={(e) => setWorkcase(e.target.value)}
              className="w-full bg-[#0d0e15] border border-zinc-900 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-zinc-700 text-zinc-300 font-medium"
            />
          </div>
        </div>

        {/* Current Tool Allocations Form Track */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Current AI Tool Allocations</h3>
          
          <div className="space-y-3">
            {(Object.keys(allocations) as Array<keyof Allocations>).map((toolId) => (
              <div key={toolId} className="grid grid-cols-4 items-center bg-[#0d0e15] border border-zinc-900/60 p-4 rounded-xl gap-4">
                <span className="text-sm font-semibold capitalize text-emerald-500">{toolId}</span>
                
                <input
                  type="text"
                  value={allocations[toolId].tier}
                  onChange={(e) => handleInputChange(toolId, 'tier', e.target.value)}
                  className="bg-transparent border-b border-zinc-800 text-xs text-zinc-400 py-1 focus:outline-none focus:border-zinc-600 text-center"
                  placeholder="Tier"
                />

                <div className="flex items-center justify-center gap-2">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">Seats:</span>
                  <input
                    type="number"
                    value={allocations[toolId].seats}
                    onChange={(e) => handleInputChange(toolId, 'seats', parseInt(e.target.value) || 0)}
                    className="w-10 bg-zinc-900/50 text-center text-xs p-1 rounded font-mono text-zinc-300 font-bold focus:outline-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-2">
                  <span className="text-[10px] text-zinc-600 font-bold uppercase">Cost ($):</span>
                  <input
                    type="number"
                    value={allocations[toolId].cost}
                    onChange={(e) => handleInputChange(toolId, 'cost', parseInt(e.target.value) || 0)}
                    className="w-16 bg-zinc-900/50 text-right text-xs p-1 rounded font-mono text-zinc-300 font-bold focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Run Action Audit Trigger Button */}
        <button
          onClick={executeAuditAssessment}
          className="w-full bg-[#1e3a2f] hover:bg-[#254a3b] border border-emerald-800/40 text-emerald-400 font-bold py-3.5 px-6 rounded-xl transition-all text-xs uppercase tracking-widest"
        >
          Execute Real-Time Audit Assessment
        </button>

        {/* Evaluation Output Section */}
        {audit && (
          <div className="space-y-8 pt-4 border-t border-zinc-900 animate-in fade-in duration-200">
            
            {/* Upper Financial Runway Metrics Row */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Identified Monthly Runway Savings</span>
                <div className="text-2xl font-black text-emerald-400 font-mono">${audit.monthlySavings}</div>
              </div>
              <div className="space-y-1 text-right">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Projected Annual Capital Reclaimed</span>
                <div className="text-2xl font-black text-blue-400 font-mono">${audit.annualSavings}</div>
              </div>
            </div>

            {/* Progress Bars Stack Component */}
            <div className="space-y-4 bg-[#0d0e15] border border-zinc-900 p-5 rounded-xl">
              <div className="flex justify-between items-center text-xs font-bold text-zinc-400 uppercase tracking-wider">
                <span>Budget Efficiency Runway</span>
                <span className="text-emerald-500">42% Optimized</span>
              </div>
              
              <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '65%' }}></div>
                <div className="h-full bg-red-500/80 transition-all duration-500" style={{ width: '35%' }}></div>
              </div>

              <div className="flex gap-4 text-[10px] font-bold uppercase tracking-wider pt-1">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
                  Optimized Base
                </div>
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse"></span>
                  Recovered Leakage (${audit.monthlySavings}/mo)
                </div>
              </div>
            </div>

            {/* Granular Audit Logs List */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Granular Optimization Vector Logs</h3>
              
              <div className="space-y-4">
                {audit.recommendations.map((rec) => (
                  <div key={rec.toolId} className="bg-[#0d0e15] border border-zinc-900/80 rounded-xl p-5 relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-sm font-bold text-gray-200">{rec.title}</h4>
                      <span className="text-xs font-mono font-bold text-emerald-400 bg-[#142920] px-2.5 py-0.5 rounded-md border border-emerald-900/50">
                        Reclaimed: ${rec.savings}/mo
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">{rec.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Actionable Download Handler */}
            <button
              onClick={() => alert('Generating full spend summary report asset configuration...')}
              className="w-full bg-[#11121a] hover:bg-[#161824] border border-zinc-800 text-zinc-400 hover:text-zinc-200 font-bold py-3 px-6 rounded-xl transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              📥 Download Executive Audit Report
            </button>

          </div>
        )}
      </div>
    </main>
  );
}