'use client';

import { useState, useEffect } from 'react';
import { runAuditEngine, ToolInput, AuditSummary } from './pricingRules';

export default function Home() {
  const [teamSize, setTeamSize] = useState<number>(5);
  const [useCase, setUseCase] = useState<string>('mixed');
  const [tools, setTools] = useState<ToolInput[]>([
    { toolId: 'cursor', planName: 'Business', seats: 5, monthlySpend: 200 },
    { toolId: 'claude', planName: 'Team', seats: 3, monthlySpend: 150 },
    { toolId: 'chatgpt', planName: 'Team', seats: 1, monthlySpend: 35 },
    { toolId: 'windsurf', planName: 'Teams', seats: 2, monthlySpend: 80 }
  ]);

  const [auditResult, setAuditResult] = useState<AuditSummary | null>(null);

  // Form persistence across window reloads
  useEffect(() => {
    const cachedState = localStorage.getItem('credex_audit_form_state');
    if (cachedState) {
      try {
        const parsed = JSON.parse(cachedState);
        setTeamSize(parsed.teamSize || 5);
        setUseCase(parsed.useCase || 'mixed');
        setTools(parsed.tools || []);
      } catch (e) {
        console.error("Failed to restore saved form states", e);
      }
    }
  }, []);

  useEffect(() => {
    const stateToCache = { teamSize, useCase, tools };
    localStorage.setItem('credex_audit_form_state', JSON.stringify(stateToCache));
  }, [teamSize, useCase, tools]);

  const handleCalculateAudit = () => {
    const summary = runAuditEngine(tools, teamSize, useCase);
    setAuditResult(summary);
  };

  const handleUpdateTool = (index: number, field: keyof ToolInput, value: any) => {
    const updated = [...tools];
    updated[index] = { ...updated[index], [field]: value };
    setTools(updated);
  };

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 p-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <header className="border-b border-gray-800 pb-6 text-center md:text-left">
          <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
            StackWise // AI Spend Auditor
          </h1>
          <p className="text-gray-400 mt-2 text-sm">
            Surface over-provisioned licenses and find optimized allocation routes instantly. Powered by Credex.
          </p>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 border border-gray-800 p-6 rounded-xl">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Stated Organization Team Size
            </label>
            <input 
              type="number" 
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-100"
              value={teamSize}
              onChange={(e) => setTeamSize(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
              Primary Machine Workload Use Case
            </label>
            <select
              className="w-full bg-gray-950 border border-gray-700 rounded-lg p-3 text-sm focus:outline-none focus:border-emerald-500 transition text-gray-100"
              value={useCase}
              onChange={(e) => setUseCase(e.target.value)}
            >
              <option value="coding">Coding / Core App Engineering</option>
              <option value="writing">Writing & Copy Production</option>
              <option value="data">Data Analysis & Modeling</option>
              <option value="research">Academic Research Profiles</option>
              <option value="mixed">Mixed Multitask Utility</option>
            </select>
          </div>
        </section>

        <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-bold text-gray-200">Current AI Tool Allocations</h2>
          
          <div className="space-y-4">
            {tools.map((tool, index) => (
              <div key={tool.toolId} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center bg-gray-950 p-4 border border-gray-800 rounded-lg">
                <span className="font-semibold text-sm capitalize text-emerald-400">{tool.toolId.replace('_', ' ')}</span>
                
                <input 
                  type="text" 
                  placeholder="Plan Tier Name"
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-xs focus:outline-none text-gray-200"
                  value={tool.planName}
                  onChange={(e) => handleUpdateTool(index, 'planName', e.target.value)}
                />
                
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Seats:</span>
                  <input 
                    type="number" 
                    className="w-16 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-center text-gray-100"
                    value={tool.seats}
                    onChange={(e) => handleUpdateTool(index, 'seats', Number(e.target.value))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-gray-400">Cost ($):</span>
                  <input 
                    type="number" 
                    className="w-24 bg-gray-900 border border-gray-700 rounded p-2 text-xs text-center text-gray-100"
                    value={tool.monthlySpend}
                    onChange={(e) => handleUpdateTool(index, 'monthlySpend', Number(e.target.value))}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={handleCalculateAudit}
              <button 
  onClick={handleCalculateAudit}
  className="w-full mt-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-gray-950 font-bold py-3 px-6 rounded transition-all text-center uppercase tracking-wider text-sm hover:opacity-90"
>
  Execute Real-Time Audit Assessment
</button>
        </section>

        {auditResult && (
          <section className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-950 p-4 border border-gray-800 rounded-lg text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Identified Monthly Savings</p>
                <p className="text-3xl font-black text-emerald-400 mt-1">${auditResult.totalMonthlySavings}</p>
              </div>
              <div className="bg-gray-950 p-4 border border-gray-800 rounded-lg text-center">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Projected Annual Capital Reclaimed</p>
                <p className="text-3xl font-black text-blue-400 mt-1">${auditResult.totalAnnualSavings}</p>
              </div>
            </div>
              
             {/* Interactive Budget Optimization Runway Visualizer */}
<div className="p-5 bg-zinc-950 border border-zinc-850 rounded-lg space-y-3">
  <div className="flex justify-between items-center text-xs text-gray-400 font-semibold uppercase tracking-wider">
    <span>Budget Efficiency Runway</span>
    <span className="text-emerald-400">
      {Math.round(((auditResult.totalMonthSpend - auditResult.totalMonthlySavings) / auditResult.totalMonthSpend) * 100) || 0}% Optimized
    </span>
  </div>
  
  {/* The Visual Progress Bar Container */}
  <div className="w-full h-3 bg-red-950/40 rounded-full overflow-hidden flex border border-zinc-800">
    {/* Optimized Spend Portion */}
    <div 
      className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 ease-out"
      style={{ 
        width: `${((auditResult.totalMonthSpend - auditResult.totalMonthlySavings) / auditResult.totalMonthSpend) * 100}%` 
      }}
    />
    {/* Wasted/Saved Spend Portion */}
    <div 
      className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-500 ease-out opacity-80 animate-pulse"
      style={{ 
        width: `${(auditResult.totalMonthlySavings / auditResult.totalMonthSpend) * 100}%` 
      }}
    />
  </div>

  <div className="flex justify-between items-center text-xs text-zinc-500">
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-emerald-500 block"></span>
      <span>Optimized Target (${auditResult.totalMonthSpend - auditResult.totalMonthlySavings}/mo)</span>
    </div>
    <div className="flex items-center gap-1.5">
      <span className="w-2 h-2 rounded-full bg-red-500 block animate-pulse"></span>
      <span>Recoverable Leakage (${auditResult.totalMonthlySavings}/mo)</span>
    </div>
  </div>
</div>
            <div className="space-y-4">
              <h3 className="text-md font-bold text-gray-300">Granular Optimization Vector Logs</h3>
              {auditResult.perToolRecommendations.map((rec) => (
                <div key={rec.toolId} className="bg-gray-950 p-4 border border-l-4 border-gray-800 border-l-emerald-500 rounded-r-lg space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-bold capitalize text-gray-200">{rec.toolId.replace('_', ' ')} Breakdown</span>
                    <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-900">
                      Reclaimed: ${rec.savings}/mo
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 leading-relaxed">{rec.reason}</p>
                </div>
              ))}
            </div>

            {auditResult.requiresCredexConsultation && (
              <div className="bg-gradient-to-b from-blue-950/40 to-indigo-950/20 border border-blue-800 p-4 rounded-xl text-center space-y-3">
                <h4 className="text-sm font-bold text-blue-300 uppercase tracking-wide">💡 High Volume Optimization Corridor Spotted</h4>
                <p className="text-xs text-gray-300 max-w-2xl mx-auto leading-relaxed">
                  Your organization configuration features deep baseline infrastructural spending profiles. Sourcing directly through verified institutional secondary bulk options reduces these exact ledger outlays instantly.
                </p>
                <button className="bg-blue-500 text-gray-950 text-xs font-bold uppercase tracking-wider px-6 py-2 rounded-md hover:bg-blue-400 transition">
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