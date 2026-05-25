# Architecture

## System Diagram


## Data Flow
1. **User Input:** The user interacts with the React/Next.js frontend to input their current AI stack (tool, plan, spend, seats).
2. **State Management:** Inputs are captured via `useState` and persisted locally to `localStorage` to ensure the form state survives page reloads.
3. **Audit Engine:** On form submission, the input is passed to a deterministic calculation engine (`pricingRules.ts`) that compares the user's data against verified market pricing.
4. **Summary Generation:** The audit results (total savings, specific recommendations) are sent to the Anthropic/OpenAI API to generate a personalized 100-word executive summary.
5. **Lead Capture:** The final audit report is saved to the database (Supabase), and the user is prompted to capture their report via email, which triggers a transactional email.

## Tech Stack Justification
* **Next.js & TypeScript:** Chosen for type-safety and superior performance, critical for an audit tool that needs to feel instantaneous.
* **Tailwind & Shadcn/ui:** Used for a clean, professional B2B aesthetic that builds trust with startup founders.
* **Supabase:** Chosen as the backend-as-a-service to handle database storage and lead capture with minimal boilerplate.

## Scaling to 10k Audits/Day
If this tool had to handle high traffic:
1. **Caching:** Implement Redis to cache pricing results for common stack profiles.
2. **Serverless Optimization:** Offload the LLM summary generation to an asynchronous background job (using queues) to prevent UI blocking.
3. **Database:** Switch from standard queries to indexed database views for faster analytical retrieval of audit trends.