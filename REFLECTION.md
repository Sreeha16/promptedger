

1. **The Hardest Bug:** I struggled with persistent state between page reloads. I hypothesized that `localStorage` was being cleared due to a re-render loop, so I moved the state synchronization logic into a `useEffect` with a stable dependency array.
2. **Reversed Decision:** I initially planned to use a complex backend SQL database for the audit results, but I pivoted to Supabase and simple JSON storage. This saved me 5+ hours of setup and let me focus on the user experience.
3. **AI Usage:** I used Claude to help structure my TypeScript interfaces. I caught a hallucination in its suggested `pricingRules.ts` logic where it miscalculated the yearly savings—I manually corrected the math to ensure accuracy.
4. **Week 2 Plans:** If I had more time, I would build a "Budget Tracker" dashboard that lets users input their API keys to see *actual* usage versus *predicted* usage.
5. **Self-Rating:** I rate my project an 8/10. It is a functional, useful MVP, but it could be improved with more granular pricing data sources.