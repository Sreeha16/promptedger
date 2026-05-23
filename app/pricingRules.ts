export interface ToolInput {
  toolId: string; // 'cursor' | 'github_copilot' | 'claude' | 'chatgpt' | 'openai_api' | 'anthropic_api' | 'gemini' | 'windsurf'
  planName: string;
  seats: number;
  monthlySpend: number;
}

export interface AuditRecommendation {
  toolId: string;
  currentSpend: number;
  recommendedPlan: string;
  recommendedSeats: number;
  newSpend: number;
  savings: number;
  reason: string;
}

export interface AuditSummary {
  perToolRecommendations: AuditRecommendation[];
  totalCurrentSpend: number;
  totalNewSpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  requiresCredexConsultation: boolean;
}

export function runAuditEngine(tools: ToolInput[], teamSize: number, useCase: string): AuditSummary {
  let totalCurrentSpend = 0;
  let totalNewSpend = 0;

  const perToolRecommendations = tools.map((input) => {
    totalCurrentSpend += input.monthlySpend;
    
    let recommendedPlan = input.planName;
    let recommendedSeats = input.seats;
    let newSpend = input.monthlySpend;
    let reason = "Your current setup is cost-optimized for this specific platform.";

    switch (input.toolId) {
      case 'claude':
        // Enforce Claude Team minimum limit tier ($30/seat, minimum 5 seats = $150/mo floor)
        if (input.planName === 'Team' && input.seats < 5) {
          recommendedPlan = 'Pro';
          recommendedSeats = input.seats;
          newSpend = input.seats * 20;
          reason = `Claude Team mandates a 5-seat minimum payment ($150). Downgrading to ${input.seats} standalone Pro seats ($20/ea) cuts overhead while keeping premium model access.`;
        } else if (input.planName === 'Enterprise' && input.seats < 15) {
          recommendedPlan = 'Team';
          recommendedSeats = input.seats;
          newSpend = input.seats * 30;
          reason = "Low team headcount detected on custom Enterprise billing. Consolidating into the standardized Team tier eliminates contract premium markups.";
        }
        break;

      case 'chatgpt':
        // Enforce ChatGPT Team tier requirements (Minimum 2 seats)
        if (input.planName === 'Team' && input.seats === 1) {
          recommendedPlan = 'Plus';
          recommendedSeats = 1;
          newSpend = 20;
          reason = "ChatGPT Team scales at a minimum of 2 users. For single standalone seats, switching to ChatGPT Plus ($20/mo) handles the identical core utility.";
        }
        break;

      case 'windsurf':
        // 2026 Quota overhaul rules: Teams plan is $40/seat. If seat allocation is excessive, adjust down.
        if (input.planName === 'Teams' && input.seats < 3) {
          recommendedPlan = 'Pro';
          recommendedSeats = input.seats;
          newSpend = input.seats * 20; // Pro is $20/mo
          reason = `Windsurf Teams tier costs $40/user. Transitioning small user groups to individual Pro seats ($20/mo) slices overhead cleanly.`;
        }
        break;

      case 'cursor':
        if (input.planName === 'Business' && input.seats >= 3) {
          reason = "Seat volume matches organization scale perfectly, but procurement is routed via full consumer retail. Sourcing this infrastructure via Credex credits unlocks systemic ledger discounts.";
        }
        break;

      case 'openai_api':
      case 'anthropic_api':
        // API overspending rule: Detect unoptimized high volume throughput or direct consumer overages
        if (input.monthlySpend > 400) {
          newSpend = input.monthlySpend * 0.82; // 18% structural savings via enterprise volume or prompt caching
          reason = "High raw API consumption detected. Implementation of foundational prompt caching techniques or provisioning API traffic via shared Credex enterprise pipelines drops runtime overhead.";
        }
        break;

      default:
        // Seat pruning for general unchecked SaaS sprawl
        if (input.seats > teamSize) {
          recommendedSeats = teamSize;
          const estimatedCostPerUnit = input.monthlySpend / input.seats;
          newSpend = teamSize * estimatedCostPerUnit;
          reason = `Detected unallocated seats (${input.seats} licenses held vs. ${teamSize} active personnel). Pruning inactive profiles drops overhead directly.`;
        }
        break;
    }

    const savings = Math.max(0, input.monthlySpend - newSpend);
    totalNewSpend += newSpend;

    return {
      toolId: input.toolId,
      currentSpend: input.monthlySpend,
      recommendedPlan,
      recommendedSeats,
      newSpend,
      savings,
      reason
    };
  });

  const totalMonthlySavings = Math.max(0, totalCurrentSpend - totalNewSpend);
  const totalAnnualSavings = totalMonthlySavings * 12;
  const requiresCredexConsultation = totalMonthlySavings > 500;

  return {
    perToolRecommendations,
    totalCurrentSpend,
    totalNewSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    requiresCredexConsultation
  };
}